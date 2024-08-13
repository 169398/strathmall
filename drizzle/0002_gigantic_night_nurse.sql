ALTER TABLE "fees" DROP CONSTRAINT "fees_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "fees" ALTER COLUMN "amount" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "fees" ADD COLUMN "sellerId" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fees" ADD CONSTRAINT "fees_sellerId_sellerShop_id_fk" FOREIGN KEY ("sellerId") REFERENCES "public"."sellerShop"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "fees" DROP COLUMN IF EXISTS "userId";--> statement-breakpoint
ALTER TABLE "fees" DROP COLUMN IF EXISTS "currency";