"use server";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { insertFeeSchema } from "../validator";

import db from "@/db/drizzle";
import { eq, and } from "drizzle-orm";
import { formatError } from "../utils";
import { revalidatePath } from "next/cache";
import { sendPaymentReceipt } from "@/emails";
import { fees, feesorder } from "@/db/schema";
import { PaymentResult } from "@/types";
import { isRedirectError } from "next/dist/client/components/redirect";
import { paypal } from "../onboardpaypal";

// CREATE
export const createFee = async () => {
  try {
    const session = await auth();
    if (!session) throw new Error("User is not authenticated");

    const userId = session.user.id!;
    const amount = 300; // Static price

    const fee = insertFeeSchema.parse({
      userId,
      amount,
      sellerId: userId,
      paymentMethod: "paypal",
    });

    const insertedFeeId = await db.transaction(async (tx) => {
      const insertedFee = await tx.insert(fees).values(fee).returning();

      // Generate a unique orderId
      const orderId = generateUniqueOrderId();

      await tx.insert(feesorder).values({
        feeId: insertedFee[0].id,
        orderId,
      });

      return insertedFee[0].id;
    });

    if (!insertedFeeId) throw new Error("Fee not created");
    redirect(`/payment`);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
};

// GET
export async function getFeeById(feeId: string) {
  return await db.query.fees.findFirst({
    where: eq(fees.id, feeId),
    with: {
      user: { columns: { name: true, email: true } },
    },
  });
}

// DELETE
export async function deleteFee(id: string, userId: string) {
  try {
    const feeExists = await db.query.fees.findFirst({
      where: and(eq(fees.id, id), eq(fees.sellerId, userId)),
    });
    if (!feeExists) throw new Error("Fee not found");
    await db.delete(fees).where(eq(fees.id, id));
    revalidatePath("/user/fees");
    return {
      success: true,
      message: "Fee deleted successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// UPDATE
export async function createPayPalFee(feeId: string) {
  try {
    const fee = await db.query.fees.findFirst({
      where: eq(fees.id, feeId),
    });
    if (fee) {
      const paypalOrder = await paypal.createOrder(fee.amount);
      await db
        .update(fees)
        .set({
          paymentResult: {
            id: paypalOrder.id,
            email_address: "",
            status: "",
            pricePaid: "0",
          },
        })
        .where(eq(fees.id, feeId));
      return {
        success: true,
        message: "PayPal order created successfully",
        data: paypalOrder.id,
      };
    } else {
      throw new Error("Fee not found");
    }
  } catch (err) {
    return { success: false, message: formatError(err) };
  }
}

export async function approvePayPalFee(
  feeId: string,
  data: { orderID: string }
) {
  try {
    const fee = await db.query.fees.findFirst({
      where: eq(fees.id, feeId),
    });
    if (!fee) throw new Error("Fee not found");

    const captureData = await paypal.capturePayment(data.orderID);
    if (
      !captureData ||
      captureData.id !== fee.paymentResult?.id ||
      captureData.status !== "COMPLETED"
    )
      throw new Error("Error in PayPal payment");

    await updateFeeToPaid({
      feeId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    });
    revalidatePath(`/user/fee/${feeId}`);
    return {
      success: true,
      message: "Your fee has been successfully paid via PayPal",
    };
  } catch (err) {
    return { success: false, message: formatError(err) };
  }
}

export const handleDeleteFee = async (id: string) => {
  const session = await auth();
  const userId = session?.user.id || "";
  return deleteFee(id, userId);
};

export const updateFeeToPaid = async ({
  feeId,
  paymentResult,
}: {
  feeId: string;
  paymentResult?: PaymentResult;
}) => {
  const fee = await db.query.fees.findFirst({
    where: and(eq(fees.id, feeId)),
  });
  if (!fee) throw new Error("Fee not found");

  await db
    .update(fees)
    .set({
      paymentResult,
    })
    .where(eq(fees.id, feeId));

  const updatedFee = await db.query.fees.findFirst({
    where: eq(fees.id, feeId),
    with: {
      user: { columns: { name: true, email: true } },
    },
  });
  if (!updatedFee) {
    throw new Error("Fee not found");
  }
  await sendPaymentReceipt({
    fee: updatedFee,
  });
};

export async function updateFeeToPaidByCOD(feeId: string) {
  try {
    await updateFeeToPaid({ feeId });
    revalidatePath(`/user/fee/${feeId}`);
    return { success: true, message: "Fee paid successfully" };
  } catch (err) {
    return { success: false, message: formatError(err) };
  }
}



// Utility function to generate a unique order ID
function generateUniqueOrderId(): string {
  return `order_${Math.random().toString(36).substr(2, 9)}`;
}
