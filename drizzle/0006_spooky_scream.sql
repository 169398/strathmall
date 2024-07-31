ALTER TABLE "sellerOrderItems" DROP CONSTRAINT "sellerOrderItems_productId_product_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sellerOrderItems" ADD CONSTRAINT "sellerOrderItems_productId_sellerProduct_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."sellerProduct"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
