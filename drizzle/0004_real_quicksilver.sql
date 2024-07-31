ALTER TABLE "sellerCart" DROP CONSTRAINT "sellerCart_sellerId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "sellerCart" ADD COLUMN "userId" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sellerCart" ADD CONSTRAINT "sellerCart_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "sellerCart" DROP COLUMN IF EXISTS "sellerId";