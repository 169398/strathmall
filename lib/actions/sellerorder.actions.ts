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
  
} from "@/db/schema";
import { count, desc, eq, sql, sum,and } from "drizzle-orm";
import { isRedirectError } from "next/dist/client/components/redirect";
import { formatError } from "../utils";
import { paypal } from "../paypal";
import { revalidatePath } from "next/cache";
import { PaymentResult } from "@/types";
import { PAGE_SIZE } from "../constants";
import { sendPurchaseReceipt } from "@/emails";

// GET
export async function getSellerOrderById(orderId: string, sellerId: string) {
  try {
    const order = await db.query.sellerOrders.findFirst({
      where: and(
        eq(sellerOrders.id, orderId),
      ),
      with: {
        sellerOrderItems: true,
        user: { columns: { name: true, email: true } },
      },
    });

    if (!order) {
      console.log(` ${sellerId} not found.`);
      return null;
    }

    console.log( order);
    return order;
  } catch (error) {
    console.error(`Error fetching order:`, error);
    throw error;
  }
}

export async function getMySellerOrders({
  limit = PAGE_SIZE,
  page,
  sellerId,
}: {
  limit?: number;
  page: number;
  sellerId: string;
}) {
  const data = await db.query.sellerOrders.findMany({
    where: eq(sellerOrders.sellerId, sellerId),
    orderBy: [desc(sellerOrders.createdAt)],
    limit,
    offset: (page - 1) * limit,
  });
  const dataCount = await db
    .select({ count: count() })
    .from(sellerOrders)
    .where(eq(sellerOrders.sellerId, sellerId));

  return {
    data,
    totalPages: Math.ceil(dataCount[0].count / limit),
  };
}

export async function getSellerOrderSummary(sellerId: string) {
  const ordersCount = await db
    .select({ count: count() })
    .from(sellerOrders)
    .where(eq(sellerOrders.sellerId, sellerId));
  const productsCount = await db
    .select({ count: count() })
    .from(sellerProducts)
    .where(eq(sellerProducts.sellerId, sellerId));
  const ordersPrice = await db
    .select({ sum: sum(sellerOrders.totalPrice) })
    .from(sellerOrders)
    .where(eq(sellerOrders.sellerId, sellerId));

  const salesData = await db
    .select({
      months: sql<string>`to_char(${sellerOrders.createdAt},'MM/YY')`,
      totalSales: sql<number>`sum(${sellerOrders.totalPrice})`.mapWith(Number),
    })
    .from(sellerOrders)
    .where(eq(sellerOrders.sellerId, sellerId))
    .groupBy(sql`1`);

  const latestOrders = await db.query.sellerOrders.findMany({
    where: eq(sellerOrders.sellerId, sellerId),
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
  const data = await db.query.sellerOrders.findMany({
    where: eq(sellerOrders.sellerId, sellerId),
    orderBy: [desc(sellerOrders.createdAt)],
    limit,
    offset: (page - 1) * limit,
    with: { user: { columns: { name: true } } },
  });
  const dataCount = await db
    .select({ count: count() })
    .from(sellerOrders)
    .where(eq(sellerOrders.sellerId, sellerId));

  return {
    data,
    totalPages: Math.ceil(dataCount[0].count / limit),
  };
}





// CREATE
export const createSellerOrder = async (sellerId: string) => {
  try {
    const session = await auth();
    if (!session) throw new Error("User is not authenticated");
    const cart = await getMyCart();
    const user = await getUserById(session?.user.id!);
    if (!cart || cart.items.length === 0) redirect("/cart");
    if (!user.address) redirect("/shipping-address");
    if (!user.paymentMethod) redirect("/payment-method");

    const order = insertSellerOrderSchema.parse({
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
                    .values({ ...order, sellerId })
                    .returning();
      for (const item of cart.items) {
        await tx.insert(sellerOrderItems).values({
          ...item,
          price: item.price.toFixed(2),
          orderId: insertedOrder[0].id,
        });
      }
      await db
        .update(sellerCarts)
        .set({
          items: [],
          totalPrice: "0",
          shippingPrice: "0",
          itemsPrice: "0",
        })
        .where(eq(sellerCarts.id, sellerCarts.id));
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
export async function deleteSellerOrder(id: string, sellerId: string) {
  try {
    const orderExists = await db.query.sellerOrders.findFirst({
      where: and(eq(sellerOrders.id, id), eq(sellerOrders.sellerId, sellerId)),
    });
    if (!orderExists) throw new Error("Order not found");
    await db.delete(sellerOrders).where(eq(sellerOrders.id, id));
    revalidatePath("/seller/orders");
    return {
      success: true,
      message: "Order deleted successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// UPDATE
export async function createPayPalSellerOrder(
  orderId: string,
  sellerId: string
) {
  try {
    const order = await db.query.sellerOrders.findFirst({
      where: and(
        eq(sellerOrders.id, orderId),
        eq(sellerOrders.sellerId, sellerId)
      ),
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
        .where(eq(sellerOrders.id, orderId));
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

export async function approvePayPalSellerOrder(
  orderId: string,
  sellerId: string,
  data: { orderID: string }
) {
  try {
    const order = await db.query.sellerOrders.findFirst({
      where: and(
        eq(sellerOrders.id, orderId),
        eq(sellerOrders.sellerId, sellerId)
      ),
    });
    if (!order) throw new Error("Order not found");

    const captureData = await paypal.capturePayment(data.orderID);
    if (
      !captureData ||
      captureData.id !== order.paymentResult?.id ||
      captureData.status !== "COMPLETED"
    )
      throw new Error("Error in PayPal payment");
    await updateSellerOrderToPaid({
      orderId,
      sellerId,
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
    return { success: false, message: formatError(err) };
  }
}

export const updateSellerOrderToPaid = async ({
  orderId,
  sellerId,
  paymentResult,
}: {
  orderId: string;
  sellerId: string;
  paymentResult?: PaymentResult;
}) => {
  const order = await db.query.sellerOrders.findFirst({
    columns: { isPaid: true },
    where: and(
      eq(sellerOrders.id, orderId),
      eq(sellerOrders.sellerId, sellerId)
    ),
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
        .where(eq(sellerProducts.id, item.productId));
    }
    await tx
      .update(sellerOrders)
      .set({
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      })
      .where(eq(sellerOrders.id, orderId));
  });
  const updatedOrder = await db.query.sellerOrders.findFirst({
    where: and(
      eq(sellerOrders.id, orderId),
      eq(sellerOrders.sellerId, sellerId)
    ),
    with: { sellerOrderItems: true, user: { columns: { name: true, email: true } } },
  });
  if (!updatedOrder) {
    throw new Error("Order not found");
  }
  await sendPurchaseReceipt({ sellerOrder: { ...updatedOrder, sellerOrderItems: [] } });
};

export async function updateSellerOrderToPaidByCOD(
  orderId: string,
  sellerId: string
) {
  try {
    await updateSellerOrderToPaid({ orderId, sellerId });
    revalidatePath(`/order/${orderId}`);
    return { success: true, message: "Order paid successfully" };
  } catch (err) {
    return { success: false, message: formatError(err) };
  }
}

export async function deliverSellerOrder(orderId: string, sellerId: string) {
  try {
    const order = await db.query.sellerOrders.findFirst({
      where: and(
        eq(sellerOrders.id, orderId),
        eq(sellerOrders.sellerId, sellerId)
      ),
    });
    if (!order) throw new Error("Order not found");
    if (!order.isPaid) throw new Error("Order is not paid");

    await db
      .update(sellerOrders)
      .set({
        isDelivered: true,
        deliveredAt: new Date(),
      })
      .where(eq(sellerOrders.id, orderId));
    revalidatePath(`/order/${orderId}`);
    return { success: true, message: "Order delivered successfully" };
  } catch (err) {
    return { success: false, message: formatError(err) };
  }
}
