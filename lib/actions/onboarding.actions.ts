import db from "@/db/drizzle";
import { paypal } from "../paypal";
import { fees } from "@/db/schema";
import { formatError } from "../utils";
import { eq } from "drizzle-orm";

export async function createOnboardingFeePayPalOrder(sellerId: string) {
  try {
    const price = 300; // 300 Ksh
    const paypalOrder = await paypal.createOrder(price);

    await db.insert(fees).values({
      sellerId,
      amount: price,
      paymentMethod: "PayPal",
      paymentResult: {
        id: paypalOrder.id,
        status: "CREATED",
      },
    });

    return {
      success: true,
      message: "PayPal order for onboarding fee created successfully",
      data: paypalOrder.id,
    };
  } catch (err) {
    return { success: false, message: formatError(err) };
  }
}

export async function approveOnboardingFeePayPalOrder(
  sellerId: string,
  data: { orderID: string }
) {
  try {
    const feeRecord = await db.query.fees.findFirst({
      where: (fee) =>
        eq(fee.sellerId, sellerId) && eq(fee.paymentResult as any, data.orderID),
    });
    if (!feeRecord) throw new Error("Fee record not found");

    const captureData = await paypal.capturePayment(data.orderID);
    if (
      !captureData ||
      captureData.id !== feeRecord.paymentResult as any ||
      captureData.status !== "COMPLETED"
    ) {
      throw new Error("Error in PayPal payment");
    }

    await db
      .update(fees)
      .set({
        status: "completed",
        paymentResult: {
          id: captureData.id,
          status: captureData.status,
          email_address: captureData.payer.email_address,
          pricePaid:
            captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
        },
      })
      .where(eq(fees.id, feeRecord.id));

    return {
      success: true,
      message: "Onboarding fee payment successful",
    };
  } catch (err) {
    return { success: false, message: formatError(err) };
  }
}
