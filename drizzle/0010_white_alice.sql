CREATE TABLE IF NOT EXISTS "cake_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"sellerId" uuid NOT NULL,
	"location" text NOT NULL,
	"phoneNumber" text NOT NULL,
	"cakeSize" text NOT NULL,
	"cakeType" text NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"customizations" text,
	"totalPrice" numeric(12, 2) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cake_orders" ADD CONSTRAINT "cake_orders_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cake_orders" ADD CONSTRAINT "cake_orders_sellerId_user_id_fk" FOREIGN KEY ("sellerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
