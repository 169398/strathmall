ALTER TABLE "sellerCart" DROP CONSTRAINT "sellerCart_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "sellerCart" ADD COLUMN "sellerId" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sellerCart" ADD CONSTRAINT "sellerCart_sellerId_user_id_fk" FOREIGN KEY ("sellerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "sellerCart" DROP COLUMN IF EXISTS "userId";