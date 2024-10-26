"use server";


import { auth } from "@/auth";
import {
  createSellerSchema,
  insertCakeOrderSchema,
  updateSellerSchema,
  
} from "../validator";
import { formatError } from "../utils";
import db from "@/db/drizzle";
import { cakeOrders, sellers,  } from "@/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm/sql";
import { revalidatePath } from "next/cache";
import { sendCongratulatoryEmail } from "@/emailcongrats";
import { sendPurchaseReceipt } from "@/emailcake-buyer/page";
import { sendSellerNotification } from "@/emailcake-seller/page";

// CREATE  SELLER
export async function createSeller(prevState: unknown, formData: FormData) {
  try {
    const data = {
      shopName: formData.get("shopName"),
      email: formData.get("email"),
      phoneNumber: formData.get("phoneNumber"),
      university: formData.get("university"),
      shopCategory: formData.getAll("shopCategory"),
    };

    const seller = createSellerSchema.parse(data);
    const session = await auth();
    if (!session) throw new Error("Please sign in to place an order");
    const existingSeller = await db.query.sellers.findFirst({
      where: (sellers, { eq }) => eq(sellers.email, seller.email),
    });

    if (existingSeller) {
      return {
        success: false,
        message: "You can only have one shop",
      };
    }

    const values = {
      id: crypto.randomUUID(),
      userId: session.user.id || "",
      ...seller,
    };
    await db.insert(sellers).values(values);

//send email to seller
const queriedSeller = await db.query.sellers.findFirst({
  where: (sellers, { eq }) => eq(sellers.id, values.id),
});
if (!queriedSeller){
  throw new Error("Seller not found");
}
await sendCongratulatoryEmail({
  seller: queriedSeller,
});

    return { success: true, message: "Shop created successfully" };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// UPDATE THE SELLER DETAILS
export async function updateSeller(seller: z.infer<typeof updateSellerSchema>) {
  try {
    await db
      .update(sellers)
      .set({
        shopName: seller.shopName,
        email: seller.email,
        phoneNumber: seller.phoneNumber,
      })
      .where(eq(sellers.id, seller.id));
    revalidatePath("/seller/products");
    return {
      success: true,
      message: "Shop updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getSellerById(sellerId: string) {
  const seller = await db.query.sellers.findFirst({
    where: (sellers, { eq }) => eq(sellers.id, sellerId),
  });
  if (!seller) throw new Error("Seller not found");
  return seller;
}

// DELETE THE SELLER

export async function deleteSeller(id: string) {
  try {
    await db.delete(sellers).where(eq(sellers.id, id));
    revalidatePath("/admin/sellers");
    return {
      success: true,
      message: "Seller deleted successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// CREATE CAKE ORDER
export async function createCakeOrder(prevState: unknown, formData: FormData) {
  const session = await auth();
  if (!session) {
    throw new Error("Please sign in to place an order.");
  }

  try {
    // Retrieve and validate sellerId
    const sellerId = formData.get("sellerId");
    if (typeof sellerId !== "string" || !sellerId.trim()) {
      throw new Error("Seller ID is required to place an order.");
    }

    // Retrieve and validate other form fields
    const userId = session.user.id;
    const cakeName = formData.get("cakeName");
    const cakeImage = formData.get("cakeImage");
    const location = formData.get("location");
    const phoneNumber = formData.get("phoneNumber");
    const cakeSize = formData.get("cakeSize");
    const cakeType = formData.get("cakeType");
    const quantityStr = formData.get("quantity");
    const customizations = formData.get("customizations");
    const productId = formData.get("productId"); // Ensure productId is captured
    const deliveryTime = formData.get("deliveryTime");
    const deliveryDate = formData.get("deliveryDate");

    if (
      typeof cakeName !== "string" ||
      typeof location !== "string" ||
      typeof phoneNumber !== "string" ||
      typeof cakeSize !== "string" ||
      typeof cakeType !== "string" ||
      typeof customizations !== "string" ||
      typeof productId !== "string" ||
      typeof deliveryTime !== "string" ||
      typeof deliveryDate !== "string"
    ) {
      throw new Error("All fields must be filled out correctly.");
    }

    const quantity = quantityStr ? parseInt(quantityStr as string, 10) : NaN;
    if (isNaN(quantity) || quantity <= 0) {
      throw new Error("Quantity must be a positive number.");
    }

    const data = {
      userId,
      sellerId,
      productId,
      cakeName: cakeName.trim(), 
      location: location.trim(),
      cakeImage: cakeImage instanceof File ? cakeImage.name : (cakeImage as string).trim(),
      phoneNumber: phoneNumber.trim(),
      cakeSize: cakeSize.trim(),
      cakeType: cakeType.trim(),
      quantity,
      customizations: customizations.trim(),
      deliveryTime: deliveryTime.trim(),
      deliveryDate: deliveryDate.trim(),
    };

    const validatedOrder = insertCakeOrderSchema.parse(data);
    const values = {
      ...validatedOrder,
      userId: userId || "",
    };

    // Use a transaction to ensure atomicity
    const response = await db.transaction(async (tx) => {
      // Insert the cake order into the database
      const insertedOrder = await tx
        .insert(cakeOrders) // Ensure `cakeOrders` includes `cakeName`
        .values(values)
        .returning();

      if (!insertedOrder || insertedOrder.length === 0) {
        throw new Error("Failed to create the order.");
      }

      const order = insertedOrder[0];

      // Fetch buyer and seller details using userId for seller
      const [buyer, seller] = await Promise.all([
        tx.query.users.findFirst({
          where: (users, { eq }) => eq(users.id, order.userId),
          columns: { name: true, email: true },
        }),
        tx.query.sellers.findFirst({
          where: (sellers, { eq }) => eq(sellers.userId, sellerId),
          columns: { email: true, shopName: true },
        }),
      ]);

      if (!buyer || !seller) {
        throw new Error("Buyer or Seller information is missing.");
      }

      // Enrich the order with user details
      const enrichedOrder = {
        ...order,
        user: {
          name: buyer.name,
          email: buyer.email,
        },
      };

      // Send purchase receipt with the enriched order
      await sendPurchaseReceipt({
        order: enrichedOrder,
      });

      // Send notification to the seller
      await sendSellerNotification({
        order: enrichedOrder,
        sellerEmail: seller.email,
      });

      // Revalidate the order page (if using Next.js ISR)
      revalidatePath(`/bakery`);

      return { success: true, message: "Order placed successfully" };
    });

    return response;
  } catch (error) {
    // Log the error internally
    console.error("Error creating cake order:", error);

    // Return a generic error message to the user
    return {
      success: false,
      message: error instanceof Error ? error.message : "Order creation failed",
    };
  }
}
