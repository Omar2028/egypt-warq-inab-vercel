import { randomUUID } from "crypto";
import type { Express } from "express";
import { z } from "zod";
import { getGoogleAdminFromRequest } from "./adminAuth";
import { upsertSiteImage } from "./db";
import { storagePut } from "./storage";

const uploadSchema = z.object({ slot: z.string().regex(/^[a-z0-9-]{2,128}$/), labelAr: z.string().min(1).max(255), altAr: z.string().max(255).optional(), mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]), dataBase64: z.string().min(20) });
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export function registerAdminUploadRoutes(app: Express) {
  app.post("/api/admin/images/upload", async (req, res) => {
    const user = await getGoogleAdminFromRequest(req);
    if (!user) return res.status(403).json({ error: "Forbidden" });
    const parsed = uploadSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "ملف أو بيانات صورة غير صالحة." });
    const data = Buffer.from(parsed.data.dataBase64.replace(/^data:[^;]+;base64,/, ""), "base64");
    if (!data.length || data.length > MAX_IMAGE_BYTES) return res.status(400).json({ error: "حجم الصورة يجب ألا يتجاوز 5 ميغابايت." });
    try {
      const { key, url } = await storagePut(`site-images/${parsed.data.slot}/${randomUUID()}.${extensions[parsed.data.mimeType]}`, data, parsed.data.mimeType);
      await upsertSiteImage({ slot: parsed.data.slot, labelAr: parsed.data.labelAr, altAr: parsed.data.altAr ?? null, storageKey: key, url, mimeType: parsed.data.mimeType, sizeBytes: data.length, updatedBy: user.id });
      return res.status(201).json({ url, key });
    } catch { return res.status(500).json({ error: "تعذر حفظ الصورة. حاول مرة أخرى." }); }
  });
}
