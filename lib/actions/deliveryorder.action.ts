"use server";

import db from "@/db/drizzle";
import { orders,  users } from "@/db/schema";
import { count, desc, eq, sql, sum } from "drizzle-orm";
import { formatError } from "../utils";
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from "../constants";

// GET
export async function getOrderById(orderId: string) {
  try {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        orderItems: true,
        user: { columns: { name: true, email: true } },
      },
    });

    if (!order) {
      console.log(`Order ${orderId} not found.`);
      return null;
    }

    console.log(order);
    return order;
  } catch (error) {
    console.error(`Error fetching order:`, error);
    throw error;
  }
}

export async function getMyOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const data = await db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
    limit,
    offset: (page - 1) * limit,
  });
  const dataCount = await db.select({ count: count() }).from(orders);

  return {
    data,
    totalPages: Math.ceil(dataCount[0].count / limit),
  };
}

export async function getOrderSummary() {
  // Count of total orders
  const ordersCount = await db.select({ count: count() }).from(orders);

  // Count of total users
  const usersCount = await db.select({ count: count() }).from(users);

  // Sum of total prices
  const ordersPrice = await db
    .select({ sum: sum(orders.totalPrice) })
    .from(orders);

  // Fetch completed orders count
  const completedOrdersCount = await db
    .select({ count: count() })
    .from(orders)
    .where(eq(orders.isDelivered, true));

  // Fetch pending orders count
  const pendingOrdersCount = await db
    .select({ count: count() })
    .from(orders)
    .where(eq(orders.isDelivered, false));

  // Sales data for orders over time (monthly)
  const salesData = await db
    .select({
      weeks: sql<string>`to_char(${orders.createdAt},'IW/YYYY')`, // ISO week number and year
      totalCompletedOrders: sql<number>`count(${orders.id})`.mapWith(Number),
    })
    .from(orders)
    .where(eq(orders.isDelivered, true)) // Only consider completed orders
    .groupBy(sql`1`);
  // Fetch latest orders
  const latestOrders = await db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
    with: {
      user: { columns: { name: true } },
    },
    limit: 6,
  });

  return {
    ordersCount,
    ordersPrice,
    usersCount,
    completedOrdersCount,
    pendingOrdersCount,
    salesData,
    latestOrders,
  };
}

export async function getAllOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const data = await db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
    limit,
    offset: (page - 1) * limit,
    with: { user: { columns: { name: true } } },
  });

  const dataCount = await db.select({ count: count() }).from(orders);

  return {
    data,
    totalPages: Math.ceil(dataCount[0].count / limit),
  };
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
    return { success: false, message: formatError(err) };
  }
}
