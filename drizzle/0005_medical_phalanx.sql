ALTER TABLE "fees" DROP CONSTRAINT "fees_sellerId_sellerShop_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fees" ADD CONSTRAINT "fees_sellerId_user_id_fk" FOREIGN KEY ("sellerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
