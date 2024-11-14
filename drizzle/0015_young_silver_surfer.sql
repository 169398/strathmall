ALTER TABLE "sellerShop" ADD COLUMN "offersServices" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "sellerShop" ADD COLUMN "services" json DEFAULT '[]'::json;