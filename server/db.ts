import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { InsertStory, InsertUser, stories, users } from "../drizzle/schema";
import { ENV } from './_core/env';
import { Pool } from "pg";

let _db: ReturnType<typeof drizzle> | null = null;
let _pool: Pool | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      // Create a PostgreSQL connection pool for Neon
      _pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 1, // Single connection for serverless
      });
      _db = drizzle(_pool);
      console.log("[Database] Connected to PostgreSQL via Neon");
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
      _pool = null;
    }
  }
  return _db;
}

// Cleanup function for graceful shutdown
export async function closeDb() {
  if (_pool) {
    try {
      await _pool.end();
      _db = null;
      _pool = null;
      console.log("[Database] Connection closed");
    } catch (error) {
      console.error("[Database] Error closing connection:", error);
    }
  }
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    // PostgreSQL upsert using ON CONFLICT
    await db
      .insert(users)
      .values(values)
      .onConflictDoUpdate({
        target: users.openId,
        set: updateSet,
      });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get all stories for a user, ordered by creation date (newest first)
 */
export async function getUserStories(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get stories: database not available");
    return [];
  }

  try {
    const result = await db
      .select()
      .from(stories)
      .where(eq(stories.userId, userId))
      .orderBy(desc(stories.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get user stories:", error);
    throw error;
  }
}

/**
 * Get a single story by ID
 */
export async function getStoryById(storyId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get story: database not available");
    return undefined;
  }

  try {
    const result = await db
      .select()
      .from(stories)
      .where(eq(stories.id, storyId))
      .limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get story:", error);
    throw error;
  }
}

/**
 * Save a new story and return its ID
 */
export async function saveStory(story: InsertStory): Promise<number> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    // Insert the story and return the ID
    const insertResult = await db
      .insert(stories)
      .values(story)
      .returning({ id: stories.id });
    
    // PostgreSQL with returning clause returns an array of objects
    if (insertResult && insertResult.length > 0 && insertResult[0].id) {
      return insertResult[0].id;
    }
    
    // Fallback: query the database for the latest story
    console.warn("[Database] Could not extract insertId from result, querying database");
    const latestStory = await db
      .select({ id: stories.id })
      .from(stories)
      .where(eq(stories.userId, story.userId))
      .orderBy(desc(stories.createdAt))
      .limit(1);
    
    if (latestStory.length > 0) {
      return latestStory[0].id;
    }
    
    throw new Error("Failed to retrieve inserted story ID from database");
  } catch (error) {
    console.error("[Database] Failed to save story:", error);
    throw error;
  }
}

/**
 * Delete a story by ID
 */
export async function deleteStory(storyId: number, userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const result = await db
      .delete(stories)
      .where(and(eq(stories.id, storyId), eq(stories.userId, userId)));
    
    // PostgreSQL delete returns the number of affected rows
    return (result as any) > 0;
  } catch (error) {
    console.error("[Database] Failed to delete story:", error);
    throw error;
  }
}
