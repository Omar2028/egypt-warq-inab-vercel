import { timingSafeEqual } from "crypto";
import type { Request, Response } from "express";
import { parse } from "cookie";
import { createRemoteJWKSet, jwtVerify, SignJWT } from "jose";
import type { User } from "../drizzle/schema";
import { getUserByOpenId, upsertUser } from "./db";
import { ENV } from "./_core/env";

export const ADMIN_SESSION_COOKIE = "__Host-cairo_admin";
const GOOGLE_STATE_COOKIE = "__Host-cairo_google_state";
const GOOGLE_JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));
const SESSION_SECONDS = 60 * 60 * 8;

type GoogleConfig = { clientId: string; clientSecret: string; redirectUri: string; adminEmail: string };
type GoogleClaims = { sub: string; email: string; email_verified: boolean; name?: string };

function normalized(value: string) { return value.trim().toLowerCase(); }
export function isAuthorizedAdminEmail(email: string, adminEmail: string) { return normalized(email) === normalized(adminEmail); }
function isSecureRequest(req: Request) {
  const forwarded = req.headers["x-forwarded-proto"];
  const forwardedValue = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  const headerValue = typeof req.get === "function" ? req.get("x-forwarded-proto") : undefined;
  return Boolean(req.secure || forwardedValue === "https" || headerValue === "https");
}
function secretKey() { return new TextEncoder().encode(ENV.cookieSecret); }

function getGoogleConfig(): GoogleConfig {
  if (!ENV.googleClientId || !ENV.googleClientSecret || !ENV.googleRedirectUri || !ENV.adminEmail) {
    throw new Error("Google OAuth is not fully configured.");
  }
  return { clientId: ENV.googleClientId, clientSecret: ENV.googleClientSecret, redirectUri: ENV.googleRedirectUri, adminEmail: normalized(ENV.adminEmail) };
}

function sameState(received: string, expected: string) {
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function sessionCookieOptions(req: Request) {
  return { httpOnly: true, secure: isSecureRequest(req), sameSite: "lax" as const, path: "/", maxAge: SESSION_SECONDS * 1000 };
}

export async function startGoogleAdminLogin(req: Request, res: Response) {
  const config = getGoogleConfig();
  const state = crypto.randomUUID();
  res.cookie(GOOGLE_STATE_COOKIE, state, { httpOnly: true, secure: isSecureRequest(req), sameSite: "lax", path: "/", maxAge: 10 * 60 * 1000 });
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("prompt", "select_account");
  url.searchParams.set("access_type", "online");
  res.redirect(url.toString());
}

export async function completeGoogleAdminLogin(req: Request, res: Response) {
  const config = getGoogleConfig();
  const code = typeof req.query.code === "string" ? req.query.code : "";
  const receivedState = typeof req.query.state === "string" ? req.query.state : "";
  const expectedState = parse(req.headers.cookie ?? "")[GOOGLE_STATE_COOKIE] ?? "";
  res.clearCookie(GOOGLE_STATE_COOKIE, { httpOnly: true, secure: isSecureRequest(req), sameSite: "lax", path: "/" });
  if (!code || !receivedState || !expectedState || !sameState(receivedState, expectedState)) throw new Error("Invalid OAuth state.");

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: config.clientId, client_secret: config.clientSecret, redirect_uri: config.redirectUri, grant_type: "authorization_code" }),
  });
  if (!tokenResponse.ok) throw new Error("Google token exchange failed.");
  const tokens = await tokenResponse.json() as { id_token?: string };
  if (!tokens.id_token) throw new Error("Google did not return an identity token.");

  const verified = await jwtVerify(tokens.id_token, GOOGLE_JWKS, { audience: config.clientId, issuer: ["https://accounts.google.com", "accounts.google.com"] });
  const claims = verified.payload as unknown as GoogleClaims;
  if (!claims.sub || !claims.email || claims.email_verified !== true || !isAuthorizedAdminEmail(claims.email, config.adminEmail)) throw new Error("Unauthorized Google account.");

  const openId = `google:${claims.sub}`;
  await upsertUser({ openId, name: claims.name ?? null, email: claims.email, loginMethod: "google", role: "admin", lastSignedIn: new Date() });
  const user = await getUserByOpenId(openId);
  if (!user || user.role !== "admin" || normalized(user.email ?? "") !== config.adminEmail) throw new Error("Administrator record unavailable.");

  const token = await new SignJWT({ email: user.email, role: user.role }).setProtectedHeader({ alg: "HS256" }).setSubject(user.openId).setIssuedAt().setExpirationTime(`${SESSION_SECONDS}s`).sign(secretKey());
  res.cookie(ADMIN_SESSION_COOKIE, token, sessionCookieOptions(req));
  return user;
}

export async function getGoogleAdminFromRequest(req: Request): Promise<User | null> {
  try {
    const token = parse(req.headers.cookie ?? "")[ADMIN_SESSION_COOKIE];
    if (!token) return null;
    const verified = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    const openId = verified.payload.sub;
    if (!openId) return null;
    const user = await getUserByOpenId(openId);
    if (!user || user.role !== "admin" || !user.email || normalized(user.email) !== normalized(ENV.adminEmail)) return null;
    return user;
  } catch { return null; }
}

export function clearGoogleAdminSession(req: Request, res: Response) {
  res.clearCookie(ADMIN_SESSION_COOKIE, { ...sessionCookieOptions(req), maxAge: 0 });
}
