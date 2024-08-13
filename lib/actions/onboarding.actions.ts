"use server";
import { auth } from "@/auth";
import { getUserById } from "./user.actions";
import { redirect } from "next/navigation";
import { insertFeeOrderSchema } from "../validator";

import db from "@/db/drizzle";

import { count, desc, eq, sql, sum, and } from "drizzle-orm";
import { isRedirectError } from "next/dist/client/components/redirect";
import { formatError } from "../utils";
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from "../constants";
import {  feeorderItems, feeorders,    } from "@/db/schema";
import { feeResult } from "@/types";
import { sendPurchaseReceipt } from "@/emailonboard";
import { paypal } from "../onboardpaypal";

export async function getPaidOrderSummary(sellerId: string) {
  const ordersCount = await db
    .select({ count: count() })
    .from(feeorders)
    .where(eq(feeorders.sellerId, sellerId));

  

  const ordersPrice = await db
    .select({ sum: sum(feeorders.totalAmount) })
    .from(feeorders)
    .where(eq(feeorders.sellerId, sellerId));

  const salesData = await db
    .select({
      months: sql<string>`to_char(${feeorders.createdAt}, 'MM/YY')`,
      totalSales: sql<number>`sum(${feeorders.totalAmount})`.mapWith(Number),
    })
    .from(feeorders)
    .where(eq(feeorders.sellerId, sellerId))
    .groupBy(sql`to_char(${feeorders.createdAt}, 'MM/YY')`);

  const latestOrders = await db.query.feeorders.findMany({
    where: eq(feeorders.sellerId, sellerId),
    orderBy: [desc(feeorders.createdAt)],
    with: {
      user: { columns: { name: true } },
    },
    limit: 6,
  });

  return {
    ordersCount: ordersCount[0]?.count || 0,
    ordersPrice: ordersPrice[0]?.sum || 0,
    salesData,
    latestOrders,
  };
}

export async function getOrderSummary(sellerId: string) {
  const ordersCount = await db
    .select({ count: count() })
    .from(feeorders)
    .where(eq(feeorders.sellerId, sellerId));


  const ordersPrice = await db
    .select({ sum: sum(feeorders.totalAmount) })
    .from(feeorders);

  const salesData = await db
    .select({
      months: sql<string>`to_char(${feeorders.createdAt},'MM/YY')`,
      totalSales: sql<number>`sum(${feeorders.totalAmount})`.mapWith(Number),
    })
    .from(feeorders)
    .groupBy(sql`1`);

  const latestOrders = await db.query.feeorders.findMany({
    orderBy: [desc(feeorders.createdAt)],
    with: {
      user: { columns: { name: true } },
    },
    limit: 6,
  });
  return {
    ordersCount,
    ordersPrice,
    salesData,
    latestOrders,
  };
}

export async function getAllSellerOrders({
  limit = PAGE_SIZE,
  page,
  sellerId,
}: {
  limit?: number;
  page: number;
  sellerId: string;
}) {
  const data = await db.query.feeorders.findMany({
    where: eq(feeorders.sellerId, sellerId),
    orderBy: [desc(feeorders.createdAt)],
    limit,
    offset: (page - 1) * limit,
    with: { user: { columns: { name: true } } },
  });

  const dataCount = await db
    .select({ count: count() })
    .from(feeorders)
    .where(eq(feeorders.sellerId, sellerId));

  return {
    data,
    totalPages: Math.ceil(dataCount[0].count / limit),
  };
}

// CREATE
export const createOrder = async () => {
  try {
    const totalAmount= 300;
    const session = await auth();
    const user = await getUserById(session?.user.id!);

    const order = insertFeeOrderSchema.parse({
      userId: user.id,
      paymentMethod:'PayPal',
      totalAmount:totalAmount.toString(),
      sellerId: user.id,
    

    });
    const insertedOrderId = await db.transaction(async (tx) => {
      const insertedOrder = await tx.insert(feeorders).values(order).returning();
      
        await tx.insert(feeorderItems).values({
          orderId: insertedOrder[0].id,
          description: "Payment for order",
          totalAmount: totalAmount.toFixed(2),
        });
      
      await db
        .update(feeorders)
        .set({
          totalAmount: "0",
          sellerId: user.id,
          userId: user.id,
        })
        .where(eq(feeorders.id, feeorders.id));
      return insertedOrder[0].id;
    });
    if (!insertedOrderId) throw new Error("Order not created");
    redirect(`/payment`);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
};
export async function getOrderById(orderId: string) {
  return await db.query.feeorders.findFirst({
    where: eq(feeorders.id, orderId),
    with: {
      feeorderItems: true,
      user: { columns: { name: true, email: true } },
    },
  });
}
// DELETE
export async function deleteFeeOrder(id: string, sellerId: string) {
  try {
    const orderExists = await db.query.feeorders.findFirst({
      where: and(eq(feeorders.id, id), eq(feeorders.sellerId, sellerId)),
    });
    if (!orderExists) throw new Error("Order not found");
    await db.delete(feeorders).where(eq(feeorders.id, id));
    revalidatePath("/seller/feeorders");
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
      const paypalOrder = await paypal.createOrder(Number(order.totalAmount));
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
        data: paypalOrder.id,
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
    )
      throw new Error("Error in paypal payment");
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
    revalidatePath(`/order/${orderId}`);
    return {
      success: true,
      message: "Your order has been successfully paid by PayPal",
    };
  } catch (err) {
    return { success: false, message: formatError(err) };
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
  const order = await db.query.feeorders.findFirst({
    columns: { isPaid: true },
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
  where: (sellers, { eq }) => eq(sellers.id, sellers.id),
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
    revalidatePath(`/sellerOrder/${orderId}`);
    return { success: true, message: "Order paid successfully" };
  } catch (err) {
    return { success: false, message: formatError(err) };
  }
}


