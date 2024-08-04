ALTER TABLE "sellerOrderItems" ADD COLUMN "qty" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "sellerOrderItems" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "sellerOrderItems" DROP COLUMN IF EXISTS "quantity";