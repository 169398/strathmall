"use server";
import { auth } from "@/auth";


import db from "@/db/drizzle";

import { count, desc, eq, sql, sum, and } from "drizzle-orm";
import { paypal } from "../paypal";
import { revalidatePath } from "next/cache";
import { PaymentResult } from "@/types/sellerindex";
import { PAGE_SIZE } from "../constants";
import { sendPurchaseReceipt } from "@/emails";
import {
  orderItems,
  orders,
  products,
  sellers,
  users,
} from "@/db/schema";
import { sendSellerNotification } from "@/emailseller/page";

export async function getSellerOrderSummary(sellerId: string) {
  const ordersCount = await db
    .select({ count: count() })
    .from(orders)
    .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(
      and(eq(products.sellerId, sellerId), sql`${orders.userId} != ${sellerId}`)
    );

  const ordersPrice = await db
    .select({ sum: sum(orderItems.price) })
    .from(orders)
    .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(
      and(eq(products.sellerId, sellerId), sql`${orders.userId} != ${sellerId}`)
    );

  const productsCount = await db
    .select({ count: count() })
    .from(products)
    .where(eq(products.sellerId, sellerId));

  const salesData = await db
    .select({
      months: sql<string>`to_char(${orders.createdAt}, 'MM/YY')`,
      totalSales: sql<number>`sum(${orderItems.price})`.mapWith(Number),
    })
    .from(orders)
    .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(eq(products.sellerId, sellerId))
    .groupBy(sql`1`);

  // Get the latest orders for the seller's products
  const latestOrders = await db
    .select({
      orderId: orders.id,
      userName: users.name,
      createdAt: orders.createdAt,
      totalPrice: orders.totalPrice,
    })
    .from(orders)
    .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
    .innerJoin(products, eq(orderItems.productId, products.id))
    .innerJoin(users, eq(orders.userId, users.id))
    .where(eq(products.sellerId, sellerId))
    .orderBy(desc(orders.createdAt))
    .limit(6);

  return {
    ordersCount,
    productsCount,
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
  const data = await db
    .select({
      orderId: orders.id,
      userName: users.name,
      createdAt: orders.createdAt,
      totalPrice: orders.totalPrice,
      isDelivered: orders.isDelivered,
      deliveredAt: orders.deliveredAt,
      paidAt: orders.paidAt,
    })
    .from(orders)
    .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
    .innerJoin(products, eq(orderItems.productId, products.id))
    .innerJoin(users, eq(orders.userId, users.id))
    .where(eq(products.sellerId, sellerId))
    .orderBy(desc(orders.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  const dataCount = await db
    .select({ count: count() })
    .from(orders)
    .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(eq(products.sellerId, sellerId));

  return {
    data,
    totalPages: Math.ceil(dataCount[0].count / limit),
  };
}
export async function getUserOrders({
  limit = PAGE_SIZE,
  page,
  sellerId,
}: {
  limit?: number;
  page: number;
  sellerId: string;
}) {
  const data = await db.query.orders.findMany({
    where: eq(orders.sellerId, sellerId),
    orderBy: [desc(orders.createdAt)],
    limit,
    offset: (page - 1) * limit,
    with: { user: { columns: { name: true } } },
  });

  const dataCount = await db
    .select({ count: count() })
    .from(orders)
    .where(eq(orders.sellerId, sellerId));

  return {
    data,
    totalPages: Math.ceil(dataCount[0].count / limit),
  };
}

// CREATE
export const createOrder = async () => {
  return { success: false, message: "Ordering is temporarily disabled. Please contact the seller directly via WhatsApp." }
}

// GET
export async function getOrderById(orderId: string) {
  return await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: {
      orderItems: true,
      user: { columns: { name: true, email: true } },
    },
  });
}
// DELETE
export async function deleteSellerOrder(id: string, sellerId: string) {
  try {
    const orderExists = await db.query.orders.findFirst({
      where: and(eq(orders.id, id), eq(orders.sellerId, sellerId)),
    });
    if (!orderExists) throw new Error("Order not found");
    await db.delete(orders).where(eq(orders.id, id));
    revalidatePath("/seller/orders");
    return {
      success: true,
      message: "Order deleted successfully",
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      return;
    }
    throw error;
  }
}

// UPDATE
export async function createPayPalOrder(orderId: string) {
  try {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });
    if (order) {
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice));
      await db
        .update(orders)
        .set({
          paymentResult: {
            id: paypalOrder.id,
            email_address: "",
            status: "",
            pricePaid: "0",
          },
        })
        .where(eq(orders.id, orderId));
      return {
        success: true,
        message: "PayPal order created successfully",
        data: paypalOrder.id,
      };
    } else {
      throw new Error("Order not found");
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
      return;
    }
    throw err;
  }
}

export async function approvePayPalOrder(
  orderId: string,
  data: { orderID: string }
) {
  try {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
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
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    });
    revalidatePath(`/order/${orderId}`);
    return {
      success: true,
      message: "Your order has been successfully paid by PayPal",
    };
  } catch (err) {
    if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
      return;
    }
    throw err;
  }
}

export const handleDeleteOrder = async (id: string) => {
  const session = await auth();
  const sellerId = session?.user.id || "";
  return deleteSellerOrder(id, sellerId);
};

export const updateOrderToPaid = async ({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) => {
  const order = await db.query.orders.findFirst({
    columns: { isPaid: true },
    where: and(eq(orders.id, orderId)),
    with: { orderItems: true },
  });

  if (!order) throw new Error("Order not found");
  if (order.isPaid) throw new Error("Order is already paid");

  await db.transaction(async (tx) => {
    for (const item of order.orderItems) {
      await tx
        .update(products)
        .set({
          stock: sql`${products.stock} - ${item.qty}`,
        })
        .where(eq(products.id, item.productId));
    }

    await tx
      .update(orders)
      .set({
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      })
      .where(eq(orders.id, orderId));
  });

  const updatedOrder = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: {
      orderItems: true,
      user: { columns: { name: true, email: true } }, // Fetch buyer details
    },
  });

  if (!updatedOrder) {
    throw new Error("Order not found");
  }

  // Notify each seller based on the seller info in the sellers table
  for (const item of updatedOrder.orderItems) {
    const seller = await db.query.sellers.findFirst({
      where: eq(sellers.userId, item.sellerId), // Fetch seller from sellers table using userId
      columns: { email: true, shopName: true },
    });
    if (seller) {
      await sendSellerNotification({
        order: updatedOrder,
        sellerEmail: seller.email,
      });
    } else {
      console.error(`Seller not found for productId: ${item.productId}`);
    }
  }

  // Send purchase receipt to the buyer
  await sendPurchaseReceipt({
    order: updatedOrder,
  });
};

export async function updateOrderToPaidByCOD(orderId: string) {
  try {
    await updateOrderToPaid({ orderId });
    revalidatePath(`/sellerOrder/${orderId}`);
    return { success: true, message: "Order paid successfully" };
  } catch (err) {
    if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
      return;
    }
    throw err;
  }
}

export async function deliverOrder(orderId: string) {
  try {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });
    if (!order) throw new Error("Order not found");
    if (!order.isPaid) throw new Error("Order is not paid");

    await db
      .update(orders)
      .set({
        isDelivered: true,
        deliveredAt: new Date(),
      })
      .where(eq(orders.id, orderId));
    revalidatePath(`/order/${orderId}`);
    return { success: true, message: "Order delivered successfully" };
  } catch (err) {
    if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
      return;
    }
    throw err;
  }
}
