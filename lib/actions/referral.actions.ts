"use server";

import db from "@/db/drizzle";
import { referralRewards, referrals } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
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
        redirectUrl: "/referral-restricted",
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
      (ref) => ref.status === "pending" || ref.status === "completed"
    ).length;
    const totalPaid = referrals
      .filter((ref) => ref.status === "paid")
      .reduce((sum, ref) => sum + Number(ref.amount), 0);

    if (!rewards) {
      const referralCode = crypto.randomBytes(4).toString("hex");
      rewards = {
        id: crypto.randomUUID(),
        userId,
        mpesaNumber: null,
        totalEarnings: totalPaid.toFixed(2),
        pendingPayment: (pendingReferrals * 10).toFixed(2),
        totalReferrals,
        lastPaidAt: null,
        createdAt: new Date(),
        referralCode,
        user,
      };

      await db.insert(referralRewards).values(rewards);
    }

    return {
      ...rewards,
      pendingReferrals,
      totalReferrals,
      totalEarned: totalPaid.toFixed(2),
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
    console.error("Error updating M-Pesa number:", error);
    // If validation fails, return a specific error message
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message };
    }
    return { success: false, message: formatError(error) };
  }
}

export async function processReferral(referralCode: string, newUserId: string) {
  console.log("🚀 Starting processReferral:", { referralCode, newUserId });

  try {
    // Validate inputs
    if (!referralCode || !newUserId) {
      console.error("❌ Invalid inputs:", { referralCode, newUserId });
      return {
        success: false,
        message: "Missing required parameters",
      };
    }

    // Get the referrer's rewards record first
    const referrer = await db.query.referralRewards.findFirst({
      where: (rewards, { eq }) => eq(rewards.referralCode, referralCode),
      with: {
        user: true,
      },
    });

    if (!referrer) {
      console.error("❌ Invalid referral code:", referralCode);
      return { success: false, message: "Invalid referral code" };
    }

    // Prevent self-referral
    if (referrer.userId === newUserId) {
      console.warn("⚠️ Self-referral attempt detected");
      return {
        success: false,
        message: "You cannot use your own referral code",
      };
    }

    // Check if user was already referred
    const existingReferral = await db.query.referrals.findFirst({
      where: (referrals, { eq }) => eq(referrals.referredId, newUserId),
    });

    if (existingReferral) {
      console.log("⚠️ User already referred:", existingReferral);
      return {
        success: false,
        message: "You have already used a referral link before",
      };
    }

    // Create referral and update rewards in a transaction
    await db.transaction(async (tx) => {
      // Create the referral record
      const newReferral = {
        id: crypto.randomUUID(),
        referrerId: referrer.userId,
        referredId: newUserId,
        referralCode,
        status: "pending",
        amount: "10.00",
        createdAt: new Date(),
      };

      await tx.insert(referrals).values(newReferral);
      console.log("✅ Created referral record:", newReferral);

      // Update referrer's rewards
      await tx
        .update(referralRewards)
        .set({
          totalReferrals: sql`${referralRewards.totalReferrals} + 1`,
          pendingPayment: sql`COALESCE(${referralRewards.pendingPayment}, 0) + 10.00`,
        })
        .where(eq(referralRewards.userId, referrer.userId));
    });

    return { success: true };
  } catch (error) {
    console.error("🔥 Error in processReferral:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to process referral",
    };
  }
}

export async function completeReferral(userId: string) {
  console.log("🚀 Starting completeReferral for user:", userId);

  try {
    const pendingReferral = await db.query.referrals.findFirst({
      where: (referrals, { and, eq }) =>
        and(eq(referrals.referredId, userId), eq(referrals.status, "pending")),
      with: {
        referrer: true,
      },
    });

    console.log("📝 Found pending referral:", pendingReferral);

    if (!pendingReferral) {
      console.log("⚠️ No pending referral found for user:", userId);
      return { success: false, message: "No pending referral found" };
    }

    const referrerRewards = await db.query.referralRewards.findFirst({
      where: (rewards, { eq }) =>
        eq(rewards.userId, pendingReferral.referrerId),
    });

    console.log("👤 Referrer rewards:", referrerRewards);

    if (!referrerRewards) {
      console.error(
        "❌ Referrer rewards not found for:",
        pendingReferral.referrerId
      );
      return { success: false, message: "Referrer rewards record not found" };
    }

    await db.transaction(async (tx) => {
      console.log("🔄 Starting transaction");

      // Update referral status
      await tx
        .update(referrals)
        .set({
          status: "completed",
          amount: "10.00",
        })
        .where(eq(referrals.id, pendingReferral.id));

      console.log("✅ Updated referral status to completed");

      // Update referrer's rewards
      const updatedRewards = {
        totalReferrals: (referrerRewards.totalReferrals || 0) + 1,
        pendingPayment: (
          (Number(referrerRewards.pendingPayment) || 0) + 10
        ).toFixed(2),
      };

      await tx
        .update(referralRewards)
        .set(updatedRewards)
        .where(eq(referralRewards.userId, pendingReferral.referrerId));

      console.log("✅ Updated referrer rewards:", updatedRewards);
    });

    console.log("✨ Successfully completed referral");
    return { success: true };
  } catch (error) {
    console.error("🔥 Error in completeReferral:", error);
    return { success: false, message: formatError(error) };
  }
}

export async function getReferralPayments() {
  try {
    // First, get all referral records with their referrers
    const allReferrals = await db.query.referrals.findMany({
      with: {
        referrer: true,
      },
    });

    // Get unique referrer IDs
    const referrerIds = [...new Set(allReferrals.map((ref) => ref.referrerId))];

    // Get all rewards records for these referrers
    const rewardsPromises = referrerIds.map(async (referrerId) => {
      const referrerRewards = await db.query.referralRewards.findFirst({
        where: (rewards, { eq }) => eq(rewards.userId, referrerId),
        with: {
          user: true,
        },
      });

      if (!referrerRewards) return null;

      // Count unpaid referrals for this referrer
      const unpaidReferrals = allReferrals.filter(
        (ref) =>
          ref.referrerId === referrerId &&
          (ref.status === "pending" || ref.status === "completed")
      );

      const pendingPaymentAmount = unpaidReferrals.length * 10;

      return {
        userId: referrerRewards.userId,
        userName: referrerRewards.user?.name,
        mpesaNumber: referrerRewards.mpesaNumber,
        totalReferrals: referrerRewards.totalReferrals || 0,
        pendingPayment: pendingPaymentAmount,
        totalEarnings: Number(referrerRewards.totalEarnings || 0),
        lastPaidAt: referrerRewards.lastPaidAt,
        status: pendingPaymentAmount > 0 ? "pending" : "paid",
      };
    });

    const resolvedPayments = (await Promise.all(rewardsPromises)).filter(
      (payment): payment is NonNullable<typeof payment> => payment !== null
    );

    return resolvedPayments;
  } catch (error) {
    console.error("Error getting referral payments:", error);
    throw error;
  }
}

export async function markReferralAsPaid(userId: string) {
  if (!userId) {
    return { success: false, message: "User ID is required" };
  }

  try {
    return await db.transaction(async (tx) => {
      // Get all pending referrals
      const pendingReferrals = await tx.query.referrals.findMany({
        where: (referrals, { and, eq }) =>
          and(
            eq(referrals.referrerId, userId),
            eq(referrals.status, "pending")
          ),
      });

      if (!pendingReferrals.length) {
        return {
          success: false,
          message: "No pending referrals found to process",
        };
      }

      const pendingAmount = (pendingReferrals.length * 10).toFixed(2);

      // Update referral statuses to paid
      await tx
        .update(referrals)
        .set({ status: "paid" })
        .where(
          and(eq(referrals.referrerId, userId), eq(referrals.status, "pending"))
        );

      // Update referrer's rewards
      await tx
        .update(referralRewards)
        .set({
          totalEarnings: sql`COALESCE(${referralRewards.totalEarnings}, 0) + ${pendingAmount}::numeric`,
          pendingPayment: "0.00",
          lastPaidAt: new Date(),
        })
        .where(eq(referralRewards.userId, userId));

      return {
        success: true,
        message: `Successfully processed payment of KES ${pendingAmount} for ${pendingReferrals.length} referrals`,
        data: {
          amount: pendingAmount,
          referralsCount: pendingReferrals.length,
        },
      };
    });
  } catch (error) {
    console.error("Error in markReferralAsPaid:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to process payment",
    };
  }
}
