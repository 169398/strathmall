"use server";

import db from "@/db/drizzle";
import { sellerCarts, sellerProducts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { sellerCartItemSchema } from "../validator";
import { formatError, round2 } from "../utils";
import { sellerCartItem } from "@/types/sellerindex";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

const calcPrice = (items: sellerCartItem[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + item.price * item.qty, 0)
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    totalPrice = round2(itemsPrice + shippingPrice);
  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export const addItemToSellerCart = async (data: sellerCartItem) => {
  try {
    const sessionCartId = cookies().get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart Session not found");
    const session = await auth();
    const userId = session?.user.id as string | undefined;
    const cart = await getMyCart();
    const item = sellerCartItemSchema.parse(data);
    const product = await db.query.sellerProducts.findFirst({
      where: eq(sellerProducts.id, item.sellerProductId),
    });
    if (!product) throw new Error("Product not found");
    if (!cart) {
      if (product.stock < 1) throw new Error("Not enough stock");
      await db.insert(sellerCarts).values({
        userId: userId,
        items: [{...item,sellerProductId:item.sellerProductId,}],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: "Item added to cart successfully",
      };
    } else {
      const existItem = cart.items.find((x) => x.sellerProductId === item.sellerProductId);
      if (existItem) {
        if (product.stock < existItem.qty + 1)
          throw new Error("Not enough stock");
        cart.items.find((x) => x.sellerProductId === item.sellerProductId)!.qty =
          existItem.qty + 1;
      } else {
        if (product.stock < 1) throw new Error("Not enough stock");
        cart.items.push({...item,sellerProductId:item.sellerProductId,});
      }
      await db
        .update(sellerCarts)
        .set({
          items: cart.items,
          ...calcPrice([{...item,sellerProductId:item.sellerProductId}]),
        })
        .where(eq(sellerCarts.id, cart.id));

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
  const sessionCartId = cookies().get("sessionCartId")?.value;
  if (!sessionCartId) return undefined;
  const session = await auth();
  const userId = session?.user.id;

  const cart = await db.query.sellerCarts.findFirst({
    where:userId? eq(sellerCarts.userId, userId):eq(sellerCarts.sessionCartId, sessionCartId),
  });
  return cart;
}





export const removeItemFromSellerCart = async (productId: string) => {
  try {
    const sessionCartId = cookies().get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart Session not found");

    const product = await db.query.sellerProducts.findFirst({
      where: eq(sellerProducts.id, productId),
    });
    if (!product) throw new Error("Product not found");

    const sellerCart = await getMyCart();
    if (!sellerCart) throw new Error("Cart not found");

    const exist = sellerCart.items.find((x) => x.sellerProductId === productId);
    if (!exist) throw new Error("Item not found");

    if (exist.qty === 1) {
      sellerCart.items = sellerCart.items.filter((x) => x.sellerProductId !== exist.sellerProductId);
    } else {
      sellerCart.items.find((x) => x.sellerProductId === productId)!.qty = exist.qty - 1;
    }
    await db
      .update(sellerCarts)
      .set({
        items: sellerCart.items,
        ...calcPrice(sellerCart.items.map(i=>({...i,sellerProductId:i.sellerProductId}))),
      })
      .where(eq(sellerCarts.id, sellerCart.id));
    revalidatePath(`/product/${product.slug}`);
    return {
      success: true,
      message: `${product.name}  ${
        sellerCart.items.find((x) => x.sellerProductId === productId)
          ? "updated in"
          : "removed from"
      } cart successfully`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};
