import { Suspense } from "react";
import { getRecentAuditEvents } from "@/lib/auth/audit";
import { AuditClient } from "./audit-client";

async function AuditContent() {
  const events = await getRecentAuditEvents();
  return <AuditClient events={events} />;
}

export default function AuditPage() {
  return <Suspense fallback={<section className="panel audit-loading">Carregando trilha de auditoria…</section>}><AuditContent /></Suspense>;
}
