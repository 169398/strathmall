"use server";

import db from "@/db/drizzle";
import { carts, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { cartItemSchema } from "../validator";
import { formatError, round2 } from "../utils";
import { cartItem } from "@/types/sellerindex";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { towns } from "@/lib/address";

const calcPrice = (items: cartItem[], townName: string) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + item.price * item.qty, 0)
    ),
    town = towns.find((t) => t.name === townName),
    shippingPrice = round2(town ? town.shippingPrice : 0),
    totalPrice = round2(itemsPrice + shippingPrice);
  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export const addItemToCart = async (data: cartItem, townName: string) => {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart Session not found");

    const session = await auth();
    const userId = session?.user.id as string | undefined;
    const cart = await getMyCart();
    const item = cartItemSchema.parse(data);
    const product = await db.query.products.findFirst({
      where: eq(products.id, item.productId),
    });
    if (!product) throw new Error("Product not found");

    if (!cart) {
      if (product.stock < 1) throw new Error("Not enough stock");

      await db.insert(carts).values({
        userId: userId,
        items: [{ ...item, productId: item.productId }],
        sessionCartId: sessionCartId,
        ...calcPrice([item], townName),
      });

      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: "Item added to cart successfully",
      };
    } else {
      const existItem = cart.items.find((x) => x.productId === item.productId);
      if (existItem) {
        if (product.stock < existItem.qty + 1)
          throw new Error("Not enough stock");

        cart.items.find((x) => x.productId === item.productId)!.qty =
          existItem.qty + 1;
      } else {
        if (product.stock < 1) throw new Error("Not enough stock");

        cart.items.push({ ...item, productId: item.productId });
      }

      await db
        .update(carts)
        .set({
          items: cart.items,
          ...calcPrice(cart.items, townName),
        })
        .where(eq(carts.id, cart.id));

      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name} ${
          existItem ? "updated in" : "added to"
        } cart successfully`,
      };
    }
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export async function getMyCart() {
  const sessionCartId =  (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) return undefined;

  const session = await auth();
  const userId = session?.user.id;

  const cart = await db.query.carts.findFirst({
    where: userId
      ? eq(carts.userId, userId)
      : eq(carts.sessionCartId, sessionCartId),
  });

  return cart;
}

export const removeItemFromCart = async (
  productId: string,
  townName: string
) => {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart Session not found");

    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    });
    if (!product) throw new Error("Product not found");

    const sellerCart = await getMyCart();
    if (!sellerCart) throw new Error("Cart not found");

    const exist = sellerCart.items.find((x) => x.productId === productId);
    if (!exist) throw new Error("Item not found");

    if (exist.qty === 1) {
      sellerCart.items = sellerCart.items.filter(
        (x) => x.productId !== exist.productId
      );
    } else {
      sellerCart.items.find((x) => x.productId === productId)!.qty =
        exist.qty - 1;
    }

    await db
      .update(carts)
      .set({
        items: sellerCart.items,
        ...calcPrice(sellerCart.items, townName),
      })
      .where(eq(carts.id, sellerCart.id));

    revalidatePath(`/product/${product.slug}`);
    return {
      success: true,
      message: `${product.name}  ${
        sellerCart.items.find((x) => x.productId === productId)
          ? "updated in"
          : "removed from"
      } cart successfully`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};
