import type { Request, Response } from "express";
import { createApp } from "../server/_core/index";

// Vercel invokes this Express application as a Node.js serverless function.
// Requests for the real backend routes are rewritten here with __route so
// Express still sees the original pathname (for example /api/trpc).
const app = createApp({ serveStaticFiles: false });

export default function handler(req: Request, res: Response) {
  const host = req.headers.host || "localhost";
  const url = new URL(req.url || "/", `https://${host}`);
  const originalRoute = url.searchParams.get("__route");

  if (originalRoute) {
    url.searchParams.delete("__route");
    const query = url.searchParams.toString();
    req.url = `${originalRoute}${query ? `?${query}` : ""}`;
  }

  return app(req, res);
}
