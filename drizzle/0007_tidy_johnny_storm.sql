CREATE TABLE IF NOT EXISTS "feedbacks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"feedbackText" text NOT NULL,
	"emoji" varchar(50),
	"createdAt" timestamp DEFAULT now() NOT NULL
);
