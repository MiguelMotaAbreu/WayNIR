"use server";

import { and, eq, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { AuthActionState } from "@/lib/auth/action-state";
import { recordAuditEvent } from "@/lib/auth/audit";
import { getCurrentUser, requireUser } from "@/lib/auth/dal";
import { hashPassword, passwordSchema, verifyAgainstDummyHash, verifyPassword } from "@/lib/auth/password";
import { clearRateLimit, getRateLimitState, normalizeUsername, rateLimitKey, registerLoginFailure } from "@/lib/auth/rate-limit";
import { getRequestContext } from "@/lib/auth/request-context";
import { createSession, revokeCurrentSession, rotateSession } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db/client";
import { sessions, users } from "@/lib/db/schema";

const loginSchema = z.object({
  username: z.string().trim().min(3, "Informe seu usuário.").max(80),
  password: z.string().min(1, "Informe sua senha.").max(200),
});

export async function loginAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Revise os campos informados.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const context = await getRequestContext();
  const usernameNormalized = normalizeUsername(parsed.data.username);
  const keyHash = rateLimitKey(usernameNormalized, context.ipAddress);
  let sessionCreated = false;

  try {
    const rateLimit = await getRateLimitState(keyHash);
    if (rateLimit.blocked) {
      await recordAuditEvent({ action: "auth.login", outcome: "blocked", metadata: { reason: "rate_limit", retryAfterSeconds: rateLimit.retryAfterSeconds }, context });
      return { status: "error", message: `Muitas tentativas. Aguarde ${Math.ceil(rateLimit.retryAfterSeconds / 60)} minuto(s).` };
    }

    const db = getDatabase();
    const [user] = await db
      .select({
        id: users.id,
        unitId: users.unitId,
        passwordHash: users.passwordHash,
        active: users.active,
        lockedUntil: users.lockedUntil,
        mustChangePassword: users.mustChangePassword,
      })
      .from(users)
      .where(eq(users.usernameNormalized, usernameNormalized))
      .limit(1);

    if (!user) {
      await verifyAgainstDummyHash(parsed.data.password);
      const failure = await registerLoginFailure(keyHash);
      await recordAuditEvent({ action: "auth.login", outcome: "failure", metadata: { reason: "invalid_credentials", failures: failure.failures }, context });
      return { status: "error", message: "Usuário ou senha inválidos." };
    }

    const validPassword = await verifyPassword(user.passwordHash, parsed.data.password);
    if (!validPassword) {
      const failure = await registerLoginFailure(keyHash);
      await recordAuditEvent({ unitId: user.unitId, actorUserId: user.id, action: "auth.login", outcome: "failure", metadata: { reason: "invalid_credentials", failures: failure.failures }, context });
      return { status: "error", message: "Usuário ou senha inválidos." };
    }

    if (!user.active || (user.lockedUntil && user.lockedUntil > new Date())) {
      const failure = await registerLoginFailure(keyHash);
      await recordAuditEvent({
        unitId: user.unitId,
        actorUserId: user.id,
        action: "auth.login",
        outcome: "blocked",
        metadata: { reason: user.active ? "user_locked" : "user_inactive", failures: failure.failures },
        context,
      });
      return { status: "error", message: "Usuário ou senha inválidos." };
    }

    await clearRateLimit(keyHash);
    await db.update(users).set({ lastLoginAt: new Date(), updatedAt: new Date() }).where(eq(users.id, user.id));
    await createSession(user.id, context);
    sessionCreated = true;
    await recordAuditEvent({ unitId: user.unitId, actorUserId: user.id, action: "auth.login", outcome: "success", context });

    redirect(user.mustChangePassword ? "/trocar-senha" : "/dashboard");
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    if (sessionCreated) {
      try {
        await revokeCurrentSession();
      } catch (cleanupError) {
        console.error("Falha ao revogar a sessão após erro de autenticação.", cleanupError);
      }
    }
    console.error("Falha no login do WayNIR.", error);
    return { status: "error", message: "O serviço de autenticação está indisponível. Verifique o banco local." };
  }
}

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Informe a senha atual."),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "A confirmação não corresponde à nova senha.",
  });

export async function changePasswordAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const user = await requireUser({ allowPasswordChange: true });
  const context = await getRequestContext();
  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    await recordAuditEvent({
      unitId: user.unitId,
      actorUserId: user.id,
      action: "auth.password_change",
      outcome: "failure",
      targetType: "user",
      targetId: user.id,
      metadata: { reason: "password_policy" },
      context,
    });
    return { status: "error", message: "A nova senha não atende aos requisitos.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const db = getDatabase();
  const [record] = await db.select({ passwordHash: users.passwordHash }).from(users).where(eq(users.id, user.id)).limit(1);
  if (!record || !(await verifyPassword(record.passwordHash, parsed.data.currentPassword))) {
    await recordAuditEvent({
      unitId: user.unitId,
      actorUserId: user.id,
      action: "auth.password_change",
      outcome: "failure",
      targetType: "user",
      targetId: user.id,
      metadata: { reason: "invalid_current_password" },
      context,
    });
    return { status: "error", message: "A senha atual está incorreta." };
  }
  if (await verifyPassword(record.passwordHash, parsed.data.newPassword)) {
    await recordAuditEvent({
      unitId: user.unitId,
      actorUserId: user.id,
      action: "auth.password_change",
      outcome: "failure",
      targetType: "user",
      targetId: user.id,
      metadata: { reason: "password_reuse" },
      context,
    });
    return { status: "error", message: "A nova senha precisa ser diferente da senha atual." };
  }

  const passwordHash = await hashPassword(parsed.data.newPassword);
  await db.update(users).set({ passwordHash, mustChangePassword: false, passwordChangedAt: new Date(), updatedAt: new Date() }).where(eq(users.id, user.id));
  await rotateSession(user.id, context);
  await recordAuditEvent({ unitId: user.unitId, actorUserId: user.id, action: "auth.password_changed", outcome: "success", targetType: "user", targetId: user.id, context });
  redirect("/dashboard");
}

export async function logoutAction() {
  const context = await getRequestContext();
  const user = await getCurrentUser();
  if (user) {
    await recordAuditEvent({ unitId: user.unitId, actorUserId: user.id, action: "auth.logout", outcome: "success", context });
  }
  await revokeCurrentSession();
  redirect("/login");
}

export async function revokeAllOtherSessionsAction() {
  const user = await requireUser();
  const context = await getRequestContext();
  await getDatabase().update(sessions).set({ revokedAt: new Date() }).where(and(eq(sessions.userId, user.id), isNull(sessions.revokedAt)));
  await rotateSession(user.id, context);
  await recordAuditEvent({ unitId: user.unitId, actorUserId: user.id, action: "auth.sessions_revoked", outcome: "success", targetType: "user", targetId: user.id, context });
  redirect("/dashboard");
}
