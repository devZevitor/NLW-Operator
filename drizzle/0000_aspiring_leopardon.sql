CREATE TYPE "public"."cruel_phrase" AS ENUM('CRITICAL', 'BAD', 'MEDIOCRE', 'DECENT');--> statement-breakpoint
CREATE TABLE "code_analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"roast_id" uuid NOT NULL,
	"improved_code" text NOT NULL,
	"sarcastic_phrase" text NOT NULL,
	"loc" integer NOT NULL,
	"shame_score" integer NOT NULL,
	"cruel_phrase" "cruel_phrase" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roasts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"original_code" text NOT NULL,
	"language" text NOT NULL,
	"sarcasm_mode" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "code_analyses" ADD CONSTRAINT "code_analyses_roast_id_roasts_id_fk" FOREIGN KEY ("roast_id") REFERENCES "public"."roasts"("id") ON DELETE cascade ON UPDATE no action;