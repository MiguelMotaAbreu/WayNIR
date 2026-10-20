"use client";

import { CalendarBlank, DownloadSimple, Funnel, Info, MagnifyingGlass, ShieldCheck } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { PageHeading, StatusPill, Toast } from "@/components/platform-ui";

type AuditEvent = { id: string; date: string; user: string; action: string; target: string; result: string; origin: string };

const actionLabels: Record<string, string> = {
  "auth.login": "Autenticação",
  "auth.logout": "Encerramento de sessão",
  "auth.password_changed": "Alteração de senha",
  "auth.sessions_revoked": "Revogação de sessões",
};

export function AuditClient({ events }: { events: AuditEvent[] }) {
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const rows = useMemo(() => events.filter((event) => Object.values(event).join(" ").toLowerCase().includes(query.toLowerCase())), [events, query]);
  const blocked = events.filter((event) => event.result === "blocked").length;
  const failures = events.filter((event) => event.result === "failure").length;
  return (
    <>
      <PageHeading eyebrow="Governança e rastreabilidade" title="Auditoria" description="Consulte eventos reais de autenticação e, progressivamente, todas as ações críticas do WayNIR." actions={<button className="button secondary-action" type="button" onClick={() => setToast("A exportação do extrato será implementada junto às exportações auditadas.")}><DownloadSimple size={17} /> Exportar extrato</button>} />
      <div className="prototype-notice"><Info size={16} weight="fill" /><span>Esta tabela já usa o PostgreSQL. Eventos dos módulos clínicos serão adicionados conforme cada feature for implementada.</span></div>
      <section className="audit-summary"><div><ShieldCheck size={23} weight="duotone" /><span><strong>Trilha transacional ativa</strong><small>Eventos de acesso persistidos no banco local</small></span></div><div><span>Eventos recentes</span><strong>{events.length}</strong></div><div><span>Falhas</span><strong>{failures}</strong></div><div><span>Bloqueios</span><strong>{blocked}</strong></div></section>
      <section className="panel data-panel">
        <div className="directory-toolbar audit-toolbar"><label className="directory-search"><MagnifyingGlass size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar usuário, ação ou objeto" /></label><div className="toolbar-actions"><button className="button quiet-action" type="button" onClick={() => setToast("O filtro temporal será conectado na próxima evolução da auditoria.")}><CalendarBlank size={16} /> Mais recentes</button><button className="button quiet-action" type="button" onClick={() => setToast("Busca textual já está ativa; filtros avançados entram com a auditoria completa.")}><Funnel size={16} /> Filtros</button></div></div>
        <div className="table-scroll"><table className="data-table"><thead><tr><th>Data e hora</th><th>Usuário</th><th>Ação</th><th>Objeto</th><th>Origem</th><th>Resultado</th></tr></thead><tbody>{rows.length ? rows.map((event) => <tr key={event.id}><td>{event.date}</td><td><strong>{event.user}</strong></td><td>{actionLabels[event.action] ?? event.action}</td><td>{event.target}</td><td><code>{event.origin}</code></td><td><StatusPill tone={event.result === "success" ? "positive" : event.result === "blocked" ? "warning" : "danger"}>{event.result === "success" ? "Concluído" : event.result === "blocked" ? "Bloqueado" : "Falhou"}</StatusPill></td></tr>) : <tr><td colSpan={6}><div className="empty-audit"><ShieldCheck size={25} weight="duotone" /><strong>Nenhum evento encontrado</strong><span>A trilha aparecerá aqui após o primeiro login ou alteração de senha.</span></div></td></tr>}</tbody></table></div>
      </section>
      <Toast message={toast} onClose={() => setToast("")} />
    </>
  );
}
