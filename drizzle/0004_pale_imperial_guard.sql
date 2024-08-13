ALTER TABLE "feesorder" ADD COLUMN "isPaid" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "feesorder" ADD COLUMN "paidAt" timestamp;