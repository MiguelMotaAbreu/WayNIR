import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { and, eq, isNull } from "drizzle-orm";
import { cookies } from "next/headers";
import { getDatabase } from "@/lib/db/client";
import { sessions } from "@/lib/db/schema";
import type { RequestContext } from "./request-context";

export const SESSION_COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? "waynir_session";

export function sessionIdleMinutes() {
  const value = Number(process.env.SESSION_IDLE_MINUTES ?? 30);
  return Number.isFinite(value) && value > 0 ? value : 30;
}

function absoluteHours() {
  const value = Number(process.env.SESSION_ABSOLUTE_HOURS ?? 12);
  return Number.isFinite(value) && value > 0 ? value : 12;
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string, context: RequestContext) {
  const db = getDatabase();
  const token = randomBytes(32).toString("base64url");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + sessionIdleMinutes() * 60 * 1000);
  const absoluteExpiresAt = new Date(now.getTime() + absoluteHours() * 60 * 60 * 1000);

  await db.insert(sessions).values({
    userId,
    tokenHash: hashSessionToken(token),
    expiresAt,
    absoluteExpiresAt,
    lastSeenAt: now,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.AUTH_COOKIE_SECURE === "true",
    sameSite: "strict",
    path: "/",
    maxAge: absoluteHours() * 60 * 60,
    priority: "high",
  });
}

export async function getSessionToken() {
  return (await cookies()).get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function revokeCurrentSession() {
  const token = await getSessionToken();
  try {
    if (token) {
      await getDatabase()
        .update(sessions)
        .set({ revokedAt: new Date() })
        .where(and(eq(sessions.tokenHash, hashSessionToken(token)), isNull(sessions.revokedAt)));
    }
  } finally {
    (await cookies()).delete(SESSION_COOKIE_NAME);
  }
}

export async function rotateSession(userId: string, context: RequestContext) {
  await getDatabase()
    .update(sessions)
    .set({ revokedAt: new Date() })
    .where(and(eq(sessions.userId, userId), isNull(sessions.revokedAt)));
  (await cookies()).delete(SESSION_COOKIE_NAME);
  await createSession(userId, context);
}

export async function touchCurrentSession() {
  const token = await getSessionToken();
  if (!token) return false;

  const db = getDatabase();
  const tokenHash = hashSessionToken(token);
  const [session] = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.tokenHash, tokenHash), isNull(sessions.revokedAt)))
    .limit(1);
  const now = new Date();

  if (!session || session.expiresAt <= now || session.absoluteExpiresAt <= now) {
    if (session) {
      await db.update(sessions).set({ revokedAt: now }).where(eq(sessions.id, session.id));
    }
    (await cookies()).delete(SESSION_COOKIE_NAME);
    return false;
  }

  const nextIdleExpiry = new Date(now.getTime() + sessionIdleMinutes() * 60 * 1000);
  await db
    .update(sessions)
    .set({
      lastSeenAt: now,
      expiresAt: nextIdleExpiry < session.absoluteExpiresAt ? nextIdleExpiry : session.absoluteExpiresAt,
    })
    .where(eq(sessions.id, session.id));
  return true;
}
