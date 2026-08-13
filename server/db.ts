import { and, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, tools, wishlistEntries, type InsertTool } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb(); if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  const values: InsertUser = { openId: user.openId }; const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  textFields.forEach((field) => { if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; } });
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; } else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) { const db = await getDb(); if (!db) return undefined; const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1); return result[0]; }

export async function listToolsForCommunity(communityId: string) { const db = await getDb(); if (!db) return []; return db.select().from(tools).where(eq(tools.communityId, communityId)); }
export async function createTool(input: InsertTool) { const db = await getDb(); if (!db) throw new Error("Database not available"); const result = await db.insert(tools).values(input); return Number((result as unknown as { insertId?: number }).insertId ?? 0); }
export async function updateOwnedTool(toolId: number, ownerId: number, data: Partial<Pick<InsertTool, "name" | "description" | "status" | "category">>) { const db = await getDb(); if (!db) throw new Error("Database not available"); await db.update(tools).set(data).where(and(eq(tools.id, toolId), eq(tools.ownerId, ownerId))); }
export async function getToolIdsForUser(userId: number) { const db = await getDb(); if (!db) return []; const result = await db.select({ id: tools.id }).from(tools).where(eq(tools.ownerId, userId)); return result.map((row) => row.id); }

export async function listWishlistForUser(userId: number) { const db = await getDb(); if (!db) return []; const entries = await db.select({ toolId: wishlistEntries.toolId }).from(wishlistEntries).where(eq(wishlistEntries.userId, userId)); return entries.map((entry) => entry.toolId); }
export async function addWishlistEntry(userId: number, toolId: number) { const db = await getDb(); if (!db) throw new Error("Database not available"); await db.insert(wishlistEntries).values({ userId, toolId }).onDuplicateKeyUpdate({ set: { userId } }); }
export async function removeWishlistEntry(userId: number, toolId: number) { const db = await getDb(); if (!db) throw new Error("Database not available"); await db.delete(wishlistEntries).where(and(eq(wishlistEntries.userId, userId), eq(wishlistEntries.toolId, toolId))); }
export async function getOwnedToolIdsInWishlist(userId: number, toolIds: number[]) { const db = await getDb(); if (!db || toolIds.length === 0) return []; const result = await db.select({ toolId: wishlistEntries.toolId }).from(wishlistEntries).where(and(eq(wishlistEntries.userId, userId), inArray(wishlistEntries.toolId, toolIds))); return result.map((entry) => entry.toolId); }
