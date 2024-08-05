"use server";

import { auth } from "@/auth";
import { getMyCart } from "./sellercart.actions";
import { getUserById } from "./user.actions";
import { redirect } from "next/navigation";
import { insertSellerOrderSchema } from "../validator";

import db from "@/db/drizzle";
import {
  sellerCarts,
  sellerOrderItems,
  sellerOrders,
  sellerProducts,
  users,
} from "@/db/schema";
import { count, desc, eq, sql, sum, } from "drizzle-orm";
import { isRedirectError } from "next/dist/client/components/redirect";
import { formatError } from "../utils";
import { paypal } from "../paypal";
import { revalidatePath } from "next/cache";
import { PaymentResult } from "@/types/sellerindex";
import { PAGE_SIZE } from "../constants";
import { sendPurchaseReceipt } from "@/emails";

// GET
export async function getOrderById(sellerOrderId: string) {
  try {
    const order = await db.query.sellerOrders.findFirst({
      where: eq(sellerOrders.id, sellerOrderId),
      with: {
        sellerOrderItems: true,
        user: { columns: { name: true, email: true } },
      },
    });

    if (!order) {
      console.log(`Order ${sellerOrderId} not found.`);
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
  const data = await db.query.sellerOrders.findMany({
    orderBy: [desc(sellerOrders.createdAt)],
    limit,
    offset: (page - 1) * limit,
  });
  const dataCount = await db.select({ count: count() }).from(sellerOrders);

  return {
    data,
    totalPages: Math.ceil(dataCount[0].count / limit),
  };
}

export async function getOrderSummary() {
  const ordersCount = await db.select({ count: count() }).from(sellerOrders);
    const usersCount = await db.select({ count: count() }).from(users);

  const productsCount = await db
    .select({ count: count() })
    .from(sellerProducts);
  const ordersPrice = await db
    .select({ sum: sum(sellerOrders.totalPrice) })
    .from(sellerOrders);

  const salesData = await db
    .select({
      months: sql<string>`to_char(${sellerOrders.createdAt},'MM/YY')`,
      totalSales: sql<number>`sum(${sellerOrders.totalPrice})`.mapWith(Number),
    })
    .from(sellerOrders)
    .groupBy(sql`1`);

  const latestOrders = await db.query.sellerOrders.findMany({
    orderBy: [desc(sellerOrders.createdAt)],
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
  const data = await db.query.sellerOrders.findMany({
    orderBy: [desc(sellerOrders.createdAt)],
    limit,
    offset: (page - 1) * limit,
    with: { user: { columns: { name: true } } },
  });

  const dataCount = await db.select({ count: count() }).from(sellerOrders);

  return {
    data,
    totalPages: Math.ceil(dataCount[0].count / limit),
  };
}

// CREATE
export const createSellerOrder = async () => {
  try {
    const session = await auth();
    if (!session) throw new Error("User is not authenticated");
    const cart = await getMyCart();
    const user = await getUserById(session?.user.id!);
    if (!cart || cart.items.length === 0) redirect("/cart");
    if (!user.address) redirect("/shipping-address");
    if (!user.paymentMethod) redirect("/payment-method");

    const sellerOrder = insertSellerOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      totalPrice: cart.totalPrice,
      sellerId: user.id,
    });
    const insertedOrderId = await db.transaction(async (tx) => {
      const insertedOrder = await tx
        .insert(sellerOrders)
        .values({ ...sellerOrder })
        .returning();
      for (const item of cart.items) {
        await tx.insert(sellerOrderItems).values({
          ...item,
          price: item.price.toFixed(2),
          sellerOrderId: insertedOrder[0].id,
          sellerId: user.id,
        });
      }
      await tx
        .update(sellerCarts)
        .set({
          items: [],
          totalPrice: "0",
          shippingPrice: "0",
          itemsPrice: "0",
        })
        .where(eq(sellerCarts.id, cart.id));
      return insertedOrder[0].id;
    });
    if (!insertedOrderId) throw new Error("Order not created");
    redirect(`/order/${insertedOrderId}`);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
};

// DELETE
export async function deleteOrder(id: string) {
  try {
    const orderExists = await db.query.sellerOrders.findFirst({
      where: eq(sellerOrders.id, id),
    });
    if (!orderExists) throw new Error("Order not found");
    await db.delete(sellerOrders).where(eq(sellerOrders.id, id));
    revalidatePath("/admin/orders");
    return {
      success: true,
      message: "Order deleted successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// UPDATE
export async function createPayPalOrder(sellerOrderId: string) {
  try {
    const order = await db.query.sellerOrders.findFirst({
      where: eq(sellerOrders.id, sellerOrderId),
    });
    if (order) {
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice));
      await db
        .update(sellerOrders)
        .set({
          paymentResult: {
            id: paypalOrder.id,
            email_address: "",
            status: "",
            pricePaid: "0",
          },
        })
        .where(eq(sellerOrders.id, sellerOrderId));
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

export async function approvePayPalOrder(
  sellerOrderId: string,
  data: { sellerOrderId: string }
) {
  try {
    const order = await db.query.sellerOrders.findFirst({
      where: eq(sellerOrders.id, sellerOrderId),
    });
    if (!order) throw new Error("Order not found");

    const captureData = await paypal.capturePayment(data.sellerOrderId);
    if (
      !captureData ||
      captureData.id !== order.paymentResult?.id ||
      captureData.status !== "COMPLETED"
    )
      throw new Error("Error in PayPal payment");
    await updateOrderToPaid({
      sellerOrderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    });
    revalidatePath(`/order/${sellerOrderId}`);
    return {
      success: true,
      message: "Your order has been successfully paid by PayPal",
    };
  } catch (err) {
    return { success: false, message: formatError(err) };
  }
}

export const updateOrderToPaid = async ({
  sellerOrderId,
  paymentResult,
}: {
  sellerOrderId: string;
  paymentResult?: PaymentResult;
}) => {
  const order = await db.query.sellerOrders.findFirst({
    columns: { isPaid: true },
    where: eq(sellerOrders.id, sellerOrderId),
    with: { sellerOrderItems: true },
  });
  if (!order) throw new Error("Order not found");
  if (order.isPaid) throw new Error("Order is already paid");
  await db.transaction(async (tx) => {
    for (const item of order.sellerOrderItems) {
      await tx
        .update(sellerProducts)
        .set({
          stock: sql`${sellerProducts.stock} - ${item.qty}`,
        })
        .where(eq(sellerProducts.id, item.sellerProductId));
    }
    await tx
      .update(sellerOrders)
      .set({
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      })
      .where(eq(sellerOrders.id, sellerOrderId));
  });
  const updatedOrder = await db.query.sellerOrders.findFirst({
    where: eq(sellerOrders.id, sellerOrderId),
    with: {
      sellerOrderItems: true,
      user: { columns: { name: true, email: true } },
    },
  });
  if (!updatedOrder) {
    throw new Error("Order not found");
  }
  await sendPurchaseReceipt({
    sellerOrder: { ...updatedOrder, sellerOrderItems: [] },
  });
};

export async function updateOrderToPaidByCOD(sellerOrderId: string) {
  try {
    await updateOrderToPaid({ sellerOrderId });
    revalidatePath(`/order/${sellerOrderId}`);
    return { success: true, message: "Order paid successfully" };
  } catch (err) {
    return { success: false, message: formatError(err) };
  }
}

export async function deliverOrder(sellerOrderId: string) {
  try {
    const order = await db.query.sellerOrders.findFirst({
      where: eq(sellerOrders.id, sellerOrderId),
    });
    if (!order) throw new Error("Order not found");
    if (!order.isPaid) throw new Error("Order is not paid");

    await db
      .update(sellerOrders)
      .set({
        isDelivered: true,
        deliveredAt: new Date(),
      })
      .where(eq(sellerOrders.id, sellerOrderId));
    revalidatePath(`/order/${sellerOrderId}`);
    return { success: true, message: "Order delivered successfully" };
  } catch (err) {
    return { success: false, message: formatError(err) };
  }
}
