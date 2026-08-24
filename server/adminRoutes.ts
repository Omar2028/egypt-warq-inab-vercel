import type { Express } from "express";
import { clearGoogleAdminSession, completeGoogleAdminLogin, getGoogleAdminFromRequest, startGoogleAdminLogin } from "./adminAuth";

export function registerAdminRoutes(app: Express) {
  app.get("/api/admin/google/login", async (req, res) => {
    try { await startGoogleAdminLogin(req, res); } catch { res.status(503).send("إعداد Google OAuth غير مكتمل."); }
  });
  app.get("/api/admin/google/callback", async (req, res) => {
    try { await completeGoogleAdminLogin(req, res); res.redirect("/admin"); }
    catch { clearGoogleAdminSession(req, res); res.redirect("/admin?auth=unauthorized"); }
  });
  app.post("/api/admin/logout", (req, res) => { clearGoogleAdminSession(req, res); res.status(204).end(); });
  app.get("/api/admin/session", async (req, res) => {
    const user = await getGoogleAdminFromRequest(req);
    if (!user) { clearGoogleAdminSession(req, res); return res.status(403).json({ authorized: false }); }
    return res.json({ authorized: true, user: { name: user.name, email: user.email } });
  });
}
