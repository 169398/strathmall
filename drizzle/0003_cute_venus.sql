CREATE TABLE IF NOT EXISTS "feesorder" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"feeId" uuid NOT NULL,
	"orderId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feesorder" ADD CONSTRAINT "feesorder_feeId_fees_id_fk" FOREIGN KEY ("feeId") REFERENCES "public"."fees"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
