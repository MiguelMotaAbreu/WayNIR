import "server-only";

import { desc, eq } from "drizzle-orm";
import { getDatabase } from "@/lib/db/client";
import { auditEvents, users } from "@/lib/db/schema";
import type { RequestContext } from "./request-context";
import { requirePermission } from "./dal";

export type AuditInput = {
  unitId?: string | null;
  actorUserId?: string | null;
  action: string;
  outcome: "success" | "failure" | "blocked";
  targetType?: string | null;
  targetId?: string | null;
  metadata?: Record<string, string | number | boolean | null>;
  context?: RequestContext;
};

export async function recordAuditEvent(input: AuditInput) {
  await getDatabase().insert(auditEvents).values({
    unitId: input.unitId ?? null,
    actorUserId: input.actorUserId ?? null,
    action: input.action,
    outcome: input.outcome,
    targetType: input.targetType ?? null,
    targetId: input.targetId ?? null,
    metadata: input.metadata ?? {},
    ipAddress: input.context?.ipAddress ?? null,
    userAgent: input.context?.userAgent ?? null,
  });
}

export async function getRecentAuditEvents(limit = 100) {
  await requirePermission("audit.view");
  const rows = await getDatabase()
    .select({
      id: auditEvents.id,
      occurredAt: auditEvents.occurredAt,
      action: auditEvents.action,
      outcome: auditEvents.outcome,
      targetType: auditEvents.targetType,
      targetId: auditEvents.targetId,
      ipAddress: auditEvents.ipAddress,
      actorName: users.displayName,
    })
    .from(auditEvents)
    .leftJoin(users, eq(auditEvents.actorUserId, users.id))
    .orderBy(desc(auditEvents.occurredAt))
    .limit(Math.min(limit, 250));

  return rows.map((row) => ({
    id: row.id,
    date: new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "medium",
      timeZone: "America/Sao_Paulo",
    }).format(row.occurredAt),
    user: row.actorName ?? "Sistema/usuário não identificado",
    action: row.action,
    target: [row.targetType, row.targetId].filter(Boolean).join(" • ") || "—",
    result: row.outcome,
    origin: row.ipAddress ?? "rede local",
  }));
}
