import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertStory, InsertUser, stories, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
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

    await db.insert(users).values(values).onDuplicateKeyUpdate({
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
    // Insert the story
    const insertResult = await db.insert(stories).values(story);
    
    // Drizzle MySQL2 insert result structure varies
    // Try multiple ways to extract the insertId
    let insertedId: number | undefined;
    
    if ((insertResult as any).insertId) {
      insertedId = (insertResult as any).insertId;
    } else if ((insertResult as any)[0]?.insertId) {
      insertedId = (insertResult as any)[0].insertId;
    } else if ((insertResult as any).lastInsertRowid) {
      insertedId = (insertResult as any).lastInsertRowid;
    }
    
    // If we still don't have a valid ID, query the database for the latest story
    if (!insertedId || insertedId === 0) {
      console.warn("[Database] Could not extract insertId from result, querying database");
      const latestStory = await db
        .select({ id: stories.id })
        .from(stories)
        .where(eq(stories.userId, story.userId))
        .orderBy(desc(stories.createdAt))
        .limit(1);
      
      if (latestStory.length > 0) {
        insertedId = latestStory[0].id;
      }
    }
    
    if (!insertedId || insertedId === 0) {
      throw new Error("Failed to retrieve inserted story ID from database");
    }
    
    return insertedId;
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
    return (result as any).affectedRows > 0;
  } catch (error) {
    console.error("[Database] Failed to delete story:", error);
    throw error;
  }
}
