"use client";

import { CalendarBlank, DownloadSimple, Funnel, MagnifyingGlass, ShieldCheck } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { auditEvents } from "@/lib/mock-data";
import { PageHeading, PrototypeNotice, StatusPill, Toast } from "@/components/platform-ui";

export default function AuditPage() {
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const rows = useMemo(() => auditEvents.filter((event) => Object.values(event).join(" ").toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <>
      <PageHeading eyebrow="Governança e rastreabilidade" title="Auditoria" description="Consulte ações críticas, alterações e acessos realizados dentro da plataforma." actions={<button className="button secondary-action" type="button" onClick={() => setToast("Extrato de auditoria preparado em CSV.")}><DownloadSimple size={17} /> Exportar extrato</button>} />
      <PrototypeNotice />
      <section className="audit-summary"><div><ShieldCheck size={23} weight="duotone" /><span><strong>Trilha íntegra</strong><small>Todos os eventos exibidos são fictícios</small></span></div><div><span>Eventos hoje</span><strong>148</strong></div><div><span>Ações críticas</span><strong>06</strong></div><div><span>Bloqueios</span><strong>01</strong></div></section>
      <section className="panel data-panel">
        <div className="directory-toolbar audit-toolbar"><label className="directory-search"><MagnifyingGlass size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar usuário, ação ou objeto" /></label><div className="toolbar-actions"><button className="button quiet-action" type="button" onClick={() => setToast("Seletor de período aberto.")}><CalendarBlank size={16} /> Últimas 24h</button><button className="button quiet-action" type="button" onClick={() => setToast("Filtros de auditoria abertos.")}><Funnel size={16} /> Filtros</button></div></div>
        <div className="table-scroll"><table className="data-table"><thead><tr><th>Data e hora</th><th>Usuário</th><th>Ação</th><th>Objeto</th><th>Origem</th><th>Resultado</th><th aria-label="Ação" /></tr></thead><tbody>{rows.map((event) => <tr key={`${event.date}-${event.action}`}><td>{event.date}</td><td><strong>{event.user}</strong></td><td>{event.action}</td><td>{event.target}</td><td><code>{event.origin}</code></td><td><StatusPill tone={event.result === "Concluído" ? "positive" : "danger"}>{event.result}</StatusPill></td><td><button className="text-link" type="button" onClick={() => setToast(`Detalhes de “${event.action}” abertos.`)}>Detalhes</button></td></tr>)}</tbody></table></div>
      </section>
      <Toast message={toast} onClose={() => setToast("")} />
    </>
  );
}
