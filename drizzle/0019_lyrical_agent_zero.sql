-- First drop existing tables if they exist
DROP TABLE IF EXISTS "referrals" CASCADE;
DROP TABLE IF EXISTS "referral_rewards" CASCADE;

-- Create referrals table
CREATE TABLE IF NOT EXISTS "referrals" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "referrer_id" uuid NOT NULL,
    "referred_id" uuid NOT NULL,
    "referral_code" text NOT NULL,
    "status" text NOT NULL DEFAULT 'pending',
    "amount" numeric(10,2) NOT NULL DEFAULT 10.00,
    "created_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "referrals_referrer_id_fkey" FOREIGN KEY ("referrer_id") REFERENCES "user"("id") ON DELETE CASCADE,
    CONSTRAINT "referrals_referred_id_fkey" FOREIGN KEY ("referred_id") REFERENCES "user"("id") ON DELETE CASCADE
);

-- Create referral_rewards table
CREATE TABLE IF NOT EXISTS "referral_rewards" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" uuid NOT NULL,
    "referral_code" text NOT NULL UNIQUE,
    "mpesa_number" text,
    "total_referrals" integer NOT NULL DEFAULT 0,
    "pending_payment" numeric(10,2) NOT NULL DEFAULT 0.00,
    "total_earnings" numeric(10,2) NOT NULL DEFAULT 0.00,
    "last_paid_at" timestamp,
    "created_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "referral_rewards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "referrals_referrer_id_idx" ON "referrals"("referrer_id");
CREATE INDEX IF NOT EXISTS "referrals_referred_id_idx" ON "referrals"("referred_id");
CREATE INDEX IF NOT EXISTS "referral_rewards_user_id_idx" ON "referral_rewards"("user_id");