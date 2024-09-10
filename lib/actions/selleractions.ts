"use server";


import { auth } from "@/auth";
import {
  createSellerSchema,
  updateSellerSchema,
  
} from "../validator";
import { formatError } from "../utils";
import db from "@/db/drizzle";
import { sellers } from "@/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm/sql";
import { revalidatePath } from "next/cache";
import { sendCongratulatoryEmail } from "@/emailcongrats";

// SELLER
export async function createSeller(prevState: unknown, formData: FormData) {
  try {
    const data = {
      shopName: formData.get("shopName"),
      email: formData.get("email"),
      phoneNumber: formData.get("phoneNumber"),
    };

    const seller = createSellerSchema.parse(data);
    const session = await auth();
    if (!session) throw new Error("Sign in to add your shop");
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

// UPDATE
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

// DELETE

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


