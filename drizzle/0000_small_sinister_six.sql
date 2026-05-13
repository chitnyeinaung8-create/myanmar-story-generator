CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "stories" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "stories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"hook" text,
	"story" text,
	"twistEnding" text,
	"cta" text,
	"hashtags" text,
	"storyType" varchar(64) NOT NULL,
	"tone" varchar(64) NOT NULL,
	"platform" varchar(64) NOT NULL,
	"length" varchar(32) NOT NULL,
	"topic" text,
	"location" varchar(256),
	"characters" text,
	"endingType" varchar(64),
	"coverImageUrl" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
--> statement-breakpoint
ALTER TABLE "stories" ADD CONSTRAINT "stories_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;