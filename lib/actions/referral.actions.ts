"use server";

import db from "@/db/drizzle";
import { referralRewards, referrals } from "@/db/schema";
import { eq, and, or } from "drizzle-orm";
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

    if (!isStrathmoreEmail(user.email)) {
      return {
        restricted: true,
        redirectUrl: "/referral-restricted"
      };
    }

    let rewards = await db.query.referralRewards.findFirst({
      where: (rewards, { eq }) => eq(rewards.userId, userId),
      with: {
        user: true,
      },
    });

    const referrals = await db.query.referrals.findMany({
      where: (referrals, { eq }) => eq(referrals.referrerId, userId),
    });

    const totalReferrals = referrals.length;
    const pendingReferrals = referrals.filter(
      (ref) => ref.status === "pending"
    ).length;

    if (!rewards) {
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
      if (rewards.totalReferrals !== totalReferrals) {
        await db
          .update(referralRewards)
          .set({ totalReferrals })
          .where(eq(referralRewards.userId, userId));
        rewards.totalReferrals = totalReferrals;
      }
    }

    const result = {
      ...rewards,
      pendingReferrals,
      totalReferrals,
      totalEarned: rewards.totalEarnings,
    };
    return result;
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
    console.error("Error updating M-Pesa number:", error);
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
    });

    return { success: true };
  } catch (error) {
    console.error("Error processing referral:", error);
    return { success: false, message: formatError(error) };
  }
}

export async function completeReferral(userId: string) {
  try {
    const pendingReferral = await db.query.referrals.findFirst({
      where: (referrals, { and, eq }) =>
        and(
          eq(referrals.referredId, userId),
          eq(referrals.status, "pending")
        ),
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

    await db.transaction(async (tx) => {
      // Update referral status to completed
      await tx
        .update(referrals)
        .set({ status: "completed" })
        .where(eq(referrals.id, pendingReferral.id));

      // Update total referrals count only
      await tx
        .update(referralRewards)
        .set({
          totalReferrals: (referrerRewards.totalReferrals || 0) + 1,
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
    orderBy: (rewards, { desc }) => [desc(rewards.totalReferrals)],
  });

  const mappedPayments = payments
    .filter(payment => payment.totalReferrals && payment.totalReferrals > 0)
    .map(async (payment) => {
      const unpaidReferrals = await db.query.referrals.findMany({
        where: (referrals, { and, eq, or }) => 
          and(
            eq(referrals.referrerId, payment.userId),
            or(
              eq(referrals.status, "pending"),
              eq(referrals.status, "completed")
            )
          ),
      });

      const pendingPaymentAmount = unpaidReferrals.length * 10; 

      return {
        userId: payment.userId,
        userName: payment.user?.name,
        mpesaNumber: payment.mpesaNumber,
        totalReferrals: payment.totalReferrals,
        pendingPayment: pendingPaymentAmount,
        totalEarnings: Number(payment.totalEarnings),
        lastPaidAt: payment.lastPaidAt,
        status: pendingPaymentAmount > 0 ? "pending" : "paid",
      };
    });

  const resolvedPayments = await Promise.all(mappedPayments);
  return resolvedPayments;
}

export async function markReferralAsPaid(userId: string) {
  if (!userId) {
    return { success: false, message: "User ID is required" };
  }

  try {
    const unpaidReferrals = await db.query.referrals.findMany({
      where: (referrals, { and, eq, or }) => 
        and(
          eq(referrals.referrerId, userId),
          or(
            eq(referrals.status, "pending"),
            eq(referrals.status, "completed")
          )
        ),
    });


    if (!unpaidReferrals.length) {
      return { 
        success: false, 
        message: "No unpaid referrals found to process" 
      };
    }

    return await db.transaction(async (tx) => {
      const reward = await tx.query.referralRewards.findFirst({
        where: (rewards, { eq }) => eq(rewards.userId, userId),
      });


      if (!reward) {
        throw new Error("Reward record not found");
      }

      const pendingAmount = (unpaidReferrals.length * 10).toFixed(2);
      const currentEarnings = Number(reward.totalEarnings || 0);
      const newTotalEarnings = (currentEarnings + Number(pendingAmount)).toFixed(2);

      

      await tx
        .update(referralRewards)
        .set({
          totalEarnings: newTotalEarnings,
          lastPaidAt: new Date(),
        })
        .where(eq(referralRewards.userId, userId));

      const updateResult = await tx
        .update(referrals)
        .set({ status: "paid" })
        .where(
          and(
            eq(referrals.referrerId, userId),
            or(
              eq(referrals.status, "pending"),
              eq(referrals.status, "completed")
            )
          )
        );

      if (!updateResult.rowCount) {
        throw new Error("Failed to update referral statuses");
      }

      return { 
        success: true,
        message: `Successfully processed payment of KES ${pendingAmount} for ${unpaidReferrals.length} referrals`,
        data: {
          amount: pendingAmount,
          referralsCount: unpaidReferrals.length,
          newTotalEarnings
        }
      };
    });
  } catch (error) {
    console.error("Error in markReferralAsPaid:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to process payment"
    };
  }
}