"use server";

import db from "@/db/drizzle";
import { referralRewards, referrals } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { formatError } from "../utils";
import crypto from "crypto";
import { isStrathmoreEmail } from "../utils";
import { phoneNumberSchema } from "../validator";
import { z } from "zod";

export async function getReferralStats(userId: string) {
  try {
     // First check if user exists
     const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
     });
    //TODO: Remove this after testing

     if (!user || !isStrathmoreEmail(user.email)) {
      throw new Error(
        "Referral program is only available for Strathmore University students"
      );
    }

    let rewards = await db.query.referralRewards.findFirst({
      where: (rewards, { eq }) => eq(rewards.userId, userId),
    });

    if (!rewards) {
      const referralCode = crypto.randomBytes(4).toString("hex");
      // Create new rewards record
      const newRewards = {
        id: crypto.randomUUID(),
        userId,
        mpesaNumber: null,
        totalEarnings: "0",
        pendingPayment: "0",
        totalReferrals: 0,
        lastPaidAt: null,
        createdAt: new Date(),
        referralCode: referralCode,
      };

      try {
        await db.insert(referralRewards).values(newRewards);
        rewards = newRewards;
      } catch (insertError) {
        console.error("Error inserting referral rewards:", insertError);
        throw new Error("Failed to create referral rewards");
      }
    }

    return rewards;
  } catch (error) {
    console.error("Error getting referral stats:", error);
    throw error;
  }
}
export async function updateMpesaNumber(userId: string, mpesaNumber: string) {
    try {
        // Validate the M-Pesa number
        phoneNumberSchema.parse(mpesaNumber);
    await db
      .update(referralRewards)
      .set({ mpesaNumber })
      .where(eq(referralRewards.userId, userId));

    return { success: true };
  } catch (error) {
    // If validation fails, return a specific error message
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message };
    }
    return { success: false, message: formatError(error) };
  }
  
}

export async function processReferral(referralCode: string, newUserId: string) {
  try {
    // Check if user was already referred
    const existingReferral = await db.query.referrals.findFirst({
      where: (referrals, { eq }) => eq(referrals.referredId, newUserId),
    });

    if (existingReferral) {
      return {
        success: false,
        message: "You have already used a referral link before",
      };
    }

    // Get the new user's email
    const newUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, newUserId),
    });

    if (!newUser || !isStrathmoreEmail(newUser.email)) {
      return {
        success: false,
        message: "Referral program is only available for Strathmore University students",
      };
    }

    const referrer = await db.query.referralRewards.findFirst({
      where: (rewards, { eq }) => eq(rewards.referralCode, referralCode),
    });

    if (!referrer) {
      return { success: false, message: "Invalid referral code" };
    }

    // Prevent self-referral
    if (referrer.userId === newUserId) {
      return {
        success: false,
        message: "You cannot use your own referral code",
      };
    }

    // Create referral record with pending status
    await db.insert(referrals).values({
      id: crypto.randomUUID(),
      referrerId: referrer.userId,
      referredId: newUserId,
      referralCode,
      status: "pending",
    });

    return { success: true };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
export async function completeReferral(userId: string) {
  try {
    const pendingReferral = await db.query.referrals.findFirst({
      where: (referrals, { and, eq }) =>
        and(eq(referrals.referredId, userId), eq(referrals.status, "pending")),
    });

    if (!pendingReferral) {
      return { success: false, message: "No pending referral found" };
    }

    await db.transaction(async (tx) => {
      // Update referral status
      await tx
        .update(referrals)
        .set({ status: "completed" })
        .where(eq(referrals.id, pendingReferral.id));

      // Update referrer's rewards
      await tx
        .update(referralRewards)
        .set({
          totalEarnings: sql`${referralRewards.totalEarnings} + 10`,
          pendingPayment: sql`${referralRewards.pendingPayment} + 10`,
          totalReferrals: sql`${referralRewards.totalReferrals} + 1`,
        })
        .where(eq(referralRewards.userId, pendingReferral.referrerId));
    });

    return { success: true };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
export async function getReferralPayments() {
  const payments = await db.query.referralRewards.findMany({
    with: {
      user: true,
    },
    orderBy: (rewards, { desc }) => [desc(rewards.pendingPayment)],
  });

  return payments.map(payment => ({
    userId: payment.userId,
    userName: payment.user.name,
    mpesaNumber: payment.mpesaNumber,
    totalReferrals: payment.totalReferrals,
    pendingPayment: Number(payment.pendingPayment),
  }));
}

export async function markReferralAsPaid(userId: string) {
  try {
    await db.transaction(async (tx) => {
      const reward = await tx.query.referralRewards.findFirst({
        where: (rewards, { eq }) => eq(rewards.userId, userId),
      });

      if (!reward) throw new Error("Reward record not found");

      await tx.update(referralRewards)
        .set({
          totalEarnings: sql`${referralRewards.totalEarnings} + ${referralRewards.pendingPayment}`,
          pendingPayment: "0",
          lastPaidAt: new Date(),
        })
        .where(eq(referralRewards.userId, userId));
    });

    return { success: true };
  } catch (error) {
    console.error("Error marking referral as paid:", error);
    return { success: false, message: formatError(error) };
  }
}
