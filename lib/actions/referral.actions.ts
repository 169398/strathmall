"use server";

import db from "@/db/drizzle";
import { referralRewards, referrals } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { formatError } from "../utils";
import crypto from "crypto";
import { isStrathmoreEmail } from "../utils";
import { phoneNumberSchema } from "../validator";
import { z } from "zod";

export async function getReferralStats(userId: string) {
  try {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
    });

    if (!user) {
      throw new Error("User not found");
    }

    // if (!isStrathmoreEmail(user.email)) {
    //   throw new Error(
    //     'Referral program is only available for Strathmore University students'
    //   );
    // }

    // Get or create rewards record
    let rewards = await db.query.referralRewards.findFirst({
      where: (rewards, { eq }) => eq(rewards.userId, userId),
      with: {
        user: true,
      },
    });

    // Get all referrals for this user
    const referrals = await db.query.referrals.findMany({
      where: (referrals, { eq }) => eq(referrals.referrerId, userId),
    });

    // Calculate actual totals from referrals
    const totalReferrals = referrals.length;
    const pendingReferrals = referrals.filter(
      (ref) => ref.status === "pending"
    ).length;

    if (!rewards) {
      // Create new rewards record with correct totals
      const referralCode = crypto.randomBytes(4).toString("hex");
      const newRewards = {
        id: crypto.randomUUID(),
        userId,
        mpesaNumber: null,
        totalEarnings: "0",
        pendingPayment: "0",
        totalReferrals,
        lastPaidAt: null,
        createdAt: new Date(),
        referralCode,
      };

      await db.insert(referralRewards).values(newRewards);
      rewards = { ...newRewards, user };
    } else {
      // Update rewards with correct totals if they don't match
      if (rewards.totalReferrals !== totalReferrals) {
        await db
          .update(referralRewards)
          .set({ totalReferrals })
          .where(eq(referralRewards.userId, userId));
        rewards.totalReferrals = totalReferrals;
      }
    }

    return {
      ...rewards,
      pendingReferrals,
      totalReferrals,
    };
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

    // Get the referrer's rewards record
    const referrer = await db.query.referralRewards.findFirst({
      where: (rewards, { eq }) => eq(rewards.referralCode, referralCode),
      with: {
        user: true,
      },
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

    // Get the new user's email
    const newUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, newUserId),
    });

    if (!newUser || !isStrathmoreEmail(newUser.email)) {
      return {
        success: false,
        message:
          "Referral program is only available for Strathmore University students",
      };
    }

    // Create referral record with pending status using transaction
    await db.transaction(async (tx) => {
      await tx.insert(referrals).values({
        id: crypto.randomUUID(),
        referrerId: referrer.userId,
        referredId: newUserId,
        referralCode,
        status: "pending",
        createdAt: new Date(),
      });

      // Remove the stats update from here as it will be handled by completeReferral
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
      with: {
        referrer: true,
      },
    });

    if (!pendingReferral) {
      return { success: false, message: "No pending referral found" };
    }

    const referrerRewards = await db.query.referralRewards.findFirst({
      where: (rewards, { eq }) => eq(rewards.userId, pendingReferral.referrerId),
    });

    if (!referrerRewards) {
      return { success: false, message: "Referrer rewards record not found" };
    }

    const REFERRAL_AMOUNT = 10; // KES per referral

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
          pendingPayment: (Number(referrerRewards.pendingPayment) + REFERRAL_AMOUNT).toString(),
          totalReferrals: referrerRewards.totalReferrals ? referrerRewards.totalReferrals + 1 : 1,
        })
        .where(eq(referralRewards.userId, pendingReferral.referrerId));
    });

    return { success: true };
  } catch (error) {
    console.error("Error completing referral:", error);
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

  return payments.map((payment) => ({
    userId: payment.userId,
    userName: payment.user?.name,
    mpesaNumber: payment.mpesaNumber,
    totalReferrals: payment.totalReferrals,
    pendingPayment: Number(payment.pendingPayment),
    totalEarnings: Number(payment.totalEarnings),
    lastPaidAt: payment.lastPaidAt,
    status: Number(payment.pendingPayment) > 0 ? "pending" : "paid",
  }));
}

export async function markReferralAsPaid(userId: string) {
  try {
    return await db.transaction(async (tx) => {
      const reward = await tx.query.referralRewards.findFirst({
        where: (rewards, { eq }) => eq(rewards.userId, userId),
      });

      if (!reward) {
        return { success: false, message: "Reward record not found" };
      }

      if (Number(reward.pendingPayment) <= 0) {
        return { success: false, message: "No pending payment to process" };
      }

      // Add pending payment to total earnings and reset pending payment
      const newTotalEarnings = (Number(reward.totalEarnings) + Number(reward.pendingPayment)).toString();

      await tx
        .update(referralRewards)
        .set({
          totalEarnings: newTotalEarnings,
          pendingPayment: "0",
          lastPaidAt: new Date(),
        })
        .where(eq(referralRewards.userId, userId));

      // Update all completed referrals to paid status
      await tx
        .update(referrals)
        .set({ status: "paid" })
        .where(
          and(
            eq(referrals.referrerId, userId),
            eq(referrals.status, "completed")
          )
        );

      return { success: true };
    });
  } catch (error) {
    console.error("Error marking referral as paid:", error);
    return { success: false, message: formatError(error) };
  }
}