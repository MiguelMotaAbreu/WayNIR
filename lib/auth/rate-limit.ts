import "server-only";

import { eq } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import { loginRateLimits } from "@/lib/db/schema";
import { lockDurationMinutes } from "./rate-limit-policy";

export { lockDurationMinutes, normalizeUsername, rateLimitKey } from "./rate-limit-policy";

const RESET_WINDOW_MS = 30 * 60 * 1000;

export async function getRateLimitState(keyHash: string) {
  const db = getDatabase();
  const [record] = await db.select().from(loginRateLimits).where(eq(loginRateLimits.keyHash, keyHash)).limit(1);
  const now = new Date();

  if (!record?.blockedUntil || record.blockedUntil <= now) {
    return { blocked: false, retryAfterSeconds: 0 };
  }

  return {
    blocked: true,
    retryAfterSeconds: Math.max(1, Math.ceil((record.blockedUntil.getTime() - now.getTime()) / 1000)),
  };
}

export async function registerLoginFailure(keyHash: string) {
  const db = getDatabase();
  const now = new Date();
  const [existing] = await db.select().from(loginRateLimits).where(eq(loginRateLimits.keyHash, keyHash)).limit(1);
  const withinWindow = existing && now.getTime() - existing.lastAttemptAt.getTime() <= RESET_WINDOW_MS;
  const failures = withinWindow ? existing.failures + 1 : 1;
  const lockMinutes = lockDurationMinutes(failures);
  const blockedUntil = lockMinutes ? new Date(now.getTime() + lockMinutes * 60 * 1000) : null;

  await db
    .insert(loginRateLimits)
    .values({ keyHash, failures, blockedUntil, lastAttemptAt: now })
    .onConflictDoUpdate({
      target: loginRateLimits.keyHash,
      set: { failures, blockedUntil, lastAttemptAt: now },
    });

  return { failures, blockedUntil };
}

export async function clearRateLimit(keyHash: string) {
  await getDatabase().delete(loginRateLimits).where(eq(loginRateLimits.keyHash, keyHash));
}
