"use server";

import db from "@/db/drizzle";
import {
  orders,
  products,
  users,
} from "@/db/schema";
import { count, desc, eq, sql, sum } from "drizzle-orm";
import { PAGE_SIZE } from "../constants";

// Keep only read operations for admin dashboard
export async function getOrderById(orderId: string) {
  try {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        orderItems: true,
        user: { columns: { name: true, email: true } },
      },
    });

    return order || null;
  } catch (error) {
    console.error(`Error fetching order:`, error);
    throw error;
  }
}

export async function getOrderSummary() {
  const ordersCount = await db.select({ count: count() }).from(orders);
  const usersCount = await db.select({ count: count() }).from(users);
  const productsCount = await db.select({ count: count() }).from(products);
  const ordersPrice = await db.select({ sum: sum(orders.totalPrice) }).from(orders);

  const salesData = await db
    .select({
      months: sql<string>`to_char(${orders.createdAt},'MM/YY')`,
      totalSales: sql<number>`sum(${orders.totalPrice})`.mapWith(Number),
    })
    .from(orders)
    .groupBy(sql`1`);

  const latestOrders = await db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
    with: {
      user: { columns: { name: true } },
    },
    limit: 6,
  });

  return {
    ordersCount,
    productsCount,
    ordersPrice,
    usersCount,
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

// Comment out cart/order creation functionality
/*
export const createSellerOrder = async () => {
  // ... commented out code ...
}

export const deliverOrder = async (orderId: string) => {
  // ... commented out code ...
}

// ... other cart/order related functions ...
*/
