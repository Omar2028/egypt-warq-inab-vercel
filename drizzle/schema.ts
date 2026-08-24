import { boolean, index, int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * User identities for server-side authorization. Google owner identities will
 * be stored here with role=admin after the verified OAuth callback succeeds.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 128 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
}, table => [index("users_email_idx").on(table.email)]);

/** Products displayed in the public Cairo menu. Images live in S3; metadata only lives here. */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  nameAr: varchar("nameAr", { length: 255 }).notNull(),
  nameEn: varchar("nameEn", { length: 255 }),
  descriptionAr: text("descriptionAr"),
  descriptionEn: text("descriptionEn"),
  category: varchar("category", { length: 64 }).notNull().default("ورق عنب"),
  price: int("price").notNull(),
  currency: varchar("currency", { length: 8 }).notNull().default("EGP"),
  options: json("options").$type<Record<string, unknown>>(),
  imageSlot: varchar("imageSlot", { length: 128 }),
  isVisible: boolean("isVisible").notNull().default(true),
  isArchived: boolean("isArchived").notNull().default(false),
  sortOrder: int("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [index("products_public_idx").on(table.isVisible, table.isArchived, table.sortOrder)]);

/** Arbitrary page copy and business settings, organized by a stable key and a group label. */
export const siteSettings = mysqlTable("site_settings", {
  key: varchar("key", { length: 128 }).primaryKey(),
  group: varchar("group", { length: 64 }).notNull(),
  value: text("value").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  updatedBy: int("updatedBy"),
}, table => [index("site_settings_group_idx").on(table.group)]);

/** Every editable image maps a named placement in the site to secure object storage. */
export const siteImages = mysqlTable("site_images", {
  id: int("id").autoincrement().primaryKey(),
  slot: varchar("slot", { length: 128 }).notNull().unique(),
  labelAr: varchar("labelAr", { length: 255 }).notNull(),
  altAr: varchar("altAr", { length: 255 }),
  storageKey: varchar("storageKey", { length: 512 }).notNull(),
  url: varchar("url", { length: 1024 }).notNull(),
  mimeType: varchar("mimeType", { length: 128 }).notNull(),
  sizeBytes: int("sizeBytes").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  updatedBy: int("updatedBy"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type SiteImage = typeof siteImages.$inferSelect;
