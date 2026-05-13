import { integer, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */

// PostgreSQL enum for user roles
export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn", { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Stories table for persisting generated stories.
 * Stores all story metadata, content, and cover image reference.
 */
export const stories = pgTable("stories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("userId").notNull().references(() => users.id),
  title: text("title").notNull(), // Viral Title in Myanmar Unicode
  content: text("content").notNull(), // Full story content (Hook + Story + Twist + CTA)
  hook: text("hook"), // Hook section
  story: text("story"), // Main story section
  twistEnding: text("twistEnding"), // Twist ending section
  cta: text("cta"), // Call-to-action section
  hashtags: text("hashtags"), // Comma-separated hashtags
  storyType: varchar("storyType", { length: 64 }).notNull(), // Horror, Romance, etc.
  tone: varchar("tone", { length: 64 }).notNull(), // Creepy, Emotional, etc.
  platform: varchar("platform", { length: 64 }).notNull(), // TikTok, Facebook, etc.
  length: varchar("length", { length: 32 }).notNull(), // SHORT, MEDIUM, LONG
  topic: text("topic"), // User-provided topic
  location: varchar("location", { length: 256 }), // Story location
  characters: text("characters"), // Story characters
  endingType: varchar("endingType", { length: 64 }), // Ending type
  coverImageUrl: text("coverImageUrl"), // URL to generated cover image
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
});

export type Story = typeof stories.$inferSelect;
export type InsertStory = typeof stories.$inferInsert;
