-- Drop existing foreign key constraints
ALTER TABLE "referral_rewards" 
DROP CONSTRAINT IF EXISTS "referral_rewards_userId_user_id_fk";

-- Add correct foreign key constraint
ALTER TABLE "referral_rewards" 
ADD CONSTRAINT "referral_rewards_userId_users_id_fk" 
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;

-- Also fix the referrals table constraints
ALTER TABLE "referrals"
DROP CONSTRAINT IF EXISTS "referrals_referrerId_user_id_fk",
DROP CONSTRAINT IF EXISTS "referrals_referredId_user_id_fk";

ALTER TABLE "referrals"
ADD CONSTRAINT "referrals_referrerId_users_id_fk" 
FOREIGN KEY ("referrerId") REFERENCES "users"("id") ON DELETE CASCADE,
ADD CONSTRAINT "referrals_referredId_users_id_fk" 
FOREIGN KEY ("referredId") REFERENCES "users"("id") ON DELETE CASCADE;