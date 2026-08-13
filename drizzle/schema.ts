import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, uniqueIndex } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const tools = mysqlTable("tools", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  communityId: varchar("communityId", { length: 128 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 64 }).notNull(),
  description: text("description").notNull(),
  status: mysqlEnum("status", ["available", "borrowed"]).default("available").notNull(),
  icon: varchar("icon", { length: 64 }).notNull(),
  accent: varchar("accent", { length: 16 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({ ownerCommunityIdx: uniqueIndex("tools_owner_community_name_idx").on(table.ownerId, table.communityId, table.name) }));

export const wishlistEntries = mysqlTable("wishlistEntries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  toolId: int("toolId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({ userToolIdx: uniqueIndex("wishlist_user_tool_idx").on(table.userId, table.toolId) }));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Tool = typeof tools.$inferSelect;
export type InsertTool = typeof tools.$inferInsert;
export type WishlistEntry = typeof wishlistEntries.$inferSelect;
export type InsertWishlistEntry = typeof wishlistEntries.$inferInsert;
