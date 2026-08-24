import { asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertProduct, InsertUser, customerReviewImages, products, siteImages, siteSettings, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
export async function getDb() { if (!_db && process.env.DATABASE_URL) _db = drizzle(process.env.DATABASE_URL); return _db; }

export async function upsertUser(user: InsertUser): Promise<void> {
  const db = await getDb(); if (!db) throw new Error("Database unavailable");
  await db.insert(users).values({ ...user, lastSignedIn: user.lastSignedIn ?? new Date() }).onDuplicateKeyUpdate({ set: { name: user.name ?? null, email: user.email ?? null, loginMethod: user.loginMethod ?? null, role: user.role ?? "user", lastSignedIn: new Date() } });
}
export async function getUserByOpenId(openId: string) { const db = await getDb(); if (!db) return undefined; return (await db.select().from(users).where(eq(users.openId, openId)).limit(1))[0]; }

export async function listProducts(publicOnly = false) { const db = await getDb(); if (!db) return []; const rows = await db.select().from(products).orderBy(asc(products.sortOrder), asc(products.id)); return publicOnly ? rows.filter(row => row.isVisible && !row.isArchived) : rows; }
export async function createProduct(input: InsertProduct) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); const result = await db.insert(products).values(input); return result[0]?.insertId; }
export async function updateProduct(id: number, input: Partial<InsertProduct>) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); await db.update(products).set(input).where(eq(products.id, id)); }
export async function archiveProduct(id: number) { await updateProduct(id, { isArchived: true, isVisible: false }); }

export async function listSettings() { const db = await getDb(); if (!db) return []; return db.select().from(siteSettings).orderBy(asc(siteSettings.group), asc(siteSettings.key)); }
export async function setSiteSetting(key: string, group: string, value: string, updatedBy: number) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); await db.insert(siteSettings).values({ key, group, value, updatedBy }).onDuplicateKeyUpdate({ set: { group, value, updatedBy } }); }
export async function deleteSiteSetting(key: string) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); await db.delete(siteSettings).where(eq(siteSettings.key, key)); }
export async function listSiteImages() { const db = await getDb(); if (!db) return []; return db.select().from(siteImages).orderBy(asc(siteImages.slot)); }
export async function upsertSiteImage(input: typeof siteImages.$inferInsert) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); await db.insert(siteImages).values(input).onDuplicateKeyUpdate({ set: { labelAr: input.labelAr, altAr: input.altAr, storageKey: input.storageKey, url: input.url, mimeType: input.mimeType, sizeBytes: input.sizeBytes, updatedBy: input.updatedBy } }); }
export async function deleteSiteImage(slot: string) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); await db.delete(siteImages).where(eq(siteImages.slot, slot)); }
export async function listCustomerReviewImages(publicOnly = false) { const db = await getDb(); if (!db) return []; const rows = await db.select().from(customerReviewImages).orderBy(asc(customerReviewImages.sortOrder), asc(customerReviewImages.id)); return publicOnly ? rows.filter(row => row.isVisible) : rows; }
export async function createCustomerReviewImage(input: typeof customerReviewImages.$inferInsert) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); const result = await db.insert(customerReviewImages).values(input); return result[0]?.insertId; }
export async function updateCustomerReviewImage(id: number, input: Partial<typeof customerReviewImages.$inferInsert>) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); await db.update(customerReviewImages).set(input).where(eq(customerReviewImages.id, id)); }
export async function deleteCustomerReviewImage(id: number) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); await db.delete(customerReviewImages).where(eq(customerReviewImages.id, id)); }
