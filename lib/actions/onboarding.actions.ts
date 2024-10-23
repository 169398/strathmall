"use server";
import { auth } from "@/auth";
import { getUserById } from "./user.actions";
import { insertFeeOrderSchema } from "../validator";

import db from "@/db/drizzle";

import { eq,  and } from "drizzle-orm";
import { isRedirectError, redirect } from "next/dist/client/components/redirect";
import { formatError } from "../utils";
import { revalidatePath } from "next/cache";
import {  feeorderItems, feeorders, users,  } from "@/db/schema";
import { feeResult } from "@/types";
import { sendPurchaseReceipt } from "@/emailonboard";
import { paypal } from "../onboardpaypal";
import { toast } from "@/components/ui/use-toast";





// CREATE
export const createOrder = async () => {
  try {
    const totalAmount = 1000;
    const session = await auth();
    const user = await getUserById(session?.user.id!);

    const order = insertFeeOrderSchema.parse({
      userId: user.id,
      paymentMethod: "PayPal",
      totalAmount: totalAmount.toString(),
      sellerId: user.id,
    });

    const insertedOrderId = await db.transaction(async (tx) => {
      const insertedOrder = await tx
        .insert(feeorders)
        .values(order)
        .returning();

      await tx.insert(feeorderItems).values({
        orderId: insertedOrder[0].id,
        description: "Payment for order",
        totalAmount: totalAmount.toFixed(2),
      });

      return insertedOrder[0].id;
    });
    if (!insertedOrderId) throw new Error("Order not created");

    return { success: true, orderId: insertedOrderId };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
};
export async function getOrderById(id: string) {
 
  try {
    console.log("Fetching order with ID:", id);

    const order = await db.query.feeorders.findFirst({
      where:  eq(feeorders.id,feeorders.id), 
      with: { feeorderItems: true },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error; // Ensure errors are propagated correctly
  }
}
// DELETE
export async function deleteFeeOrder(id: string, sellerId: string) {
  try {
    const orderExists = await db.query.feeorders.findFirst({
      where: and(eq(feeorders.id, id), eq(feeorders.sellerId, sellerId)),
    });
    if (!orderExists) throw new Error("Order not found");
    await db.delete(feeorders).where(eq(feeorders.id, id));
    revalidatePath("/");
    return {
      success: true,
      message: "Payment deleted successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}


//CREATE PAYPAL ORDER
export async function createPayPalOrder(orderId: string) {
  try {
    const order = await db.query.feeorders.findFirst({
      where: eq(feeorders.id, orderId),
    });
    if (order) {
      const paypalOrder = await paypal.createOrder();
      await db
        .update(feeorders)
        .set({
          paymentResult: {
            id: paypalOrder.id,
            email_address: "",
            status: "",
            totalAmount: "0",
          },
        })
        .where(eq(feeorders.id, orderId));

      return {
        success: true,
        message: "PayPal order created successfully",
        data:{
          paypalOrderId: paypalOrder.id,
        } 
      };
    } else {
      throw new Error("Order not found");
    }
  } catch (err) {
    return { success: false, message: formatError(err) };
  }
}
//APPROVE PAYPAL ORDER


export async function approvePayPalOrder(
  orderId: string,
  data: { orderID: string }
) {
  console.log('Approved PayPal order id:', orderId);

  try {
    const order = await db.query.feeorders.findFirst({
      where: eq(feeorders.id, orderId),
    });
    if (!order) throw new Error("Order not found");

    const captureData = await paypal.capturePayment(data.orderID);
    if (
      !captureData ||
      captureData.id !== order.paymentResult?.id ||
      captureData.status !== "COMPLETED"
    ) {
      // Payment unsuccessful, delete the order
      await deleteFeeOrder(orderId, order.sellerId);

      // Show a user-friendly error toast
      toast({
        title: "Error",
        description: "Payment unsuccessful",
      });

      // Redirect to /onboard after a short delay
      setTimeout(() => {
        redirect("/onboard");
      }, 1000);

      return { success: false, message: "Payment unsuccessful, order deleted." }; // Stop further execution
    }

    await updateOrderToPaid({
      orderId,
      feeResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        totalAmount:
          captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    });

    revalidatePath("/");

    toast({
      title: "Payment successful",
      description: "Your order has been successfully paid by PayPal",
    });
    setTimeout(() => {
      redirect("/");
    }, 1000);

    return {
      success: true,
      message: "Your order has been successfully paid by PayPal",
    };
  } catch (err) {
    console.error("Payment approval error:", err);

    toast({
      title: "Error",
      description: "An unexpected error occurred. Please try again.",
    });

    return { success: false, message: "An unexpected error occurred." };
  }
}

export const handleDeleteOrder = async (id: string) => {
  const session = await auth();
  const sellerId = session?.user.id || "";
  return deleteFeeOrder(id, sellerId);
};

export const updateOrderToPaid = async ({
  orderId,
  feeResult,
}: {
  orderId: string;
  feeResult?: feeResult;
}) => {
  console.log("order id", orderId);

  const order = await db.query.feeorders.findFirst({
    columns: { isPaid: true, userId: true },
    where: and(eq(feeorders.id, orderId)),
    with: { feeorderItems: true },
  });

  if (!order) throw new Error("Order not found");
  if (order.isPaid) throw new Error("Order is already paid");

  await db.transaction(async (tx) => {
    await tx
      .update(feeorders)
      .set({
        isPaid: true,
        paidAt: new Date(),
        paymentResult: feeResult,
      })
      .where(eq(feeorders.id, orderId));

    // Update the user's role to seller
    await tx
      .update(users)
      .set({ role: "seller" })
      .where(eq(users.id, order.userId));
  });

  const updatedOrder = await db.query.feeorders.findFirst({
    where: eq(feeorders.id, orderId),
    with: {
      feeorderItems: true,
      user: { columns: { name: true, email: true } },
    },
  });

  if (!updatedOrder) {
    throw new Error("Order not found");
  }

  const queriedSeller = await db.query.sellers.findFirst({
    where: (sellers, { eq }) => eq(sellers.id, updatedOrder.sellerId),
  });

  if (!queriedSeller) {
    throw new Error("Seller not found");
  }

  await sendPurchaseReceipt({
    order: updatedOrder,
    seller: queriedSeller,
  });
};
export async function updateOrderToPaidByCOD(orderId: string) {
  try {
    await updateOrderToPaid({ orderId });
    revalidatePath("/");
    return { success: true, message: "Order paid successfully" };
  } catch (err) {
    return { success: false, message: formatError(err) };
  }
}


