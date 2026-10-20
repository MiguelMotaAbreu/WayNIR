"use client";

import { ArrowRight, Funnel, MagnifyingGlass, Plus, UserCircle, X } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { patients } from "@/lib/mock-data";
import { PageHeading, PrototypeNotice, StatusPill, Toast } from "@/components/platform-ui";

export default function PatientsPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<(typeof patients)[number] | null>(patients[0]);
  const [toast, setToast] = useState("");
  const filtered = useMemo(() => patients.filter((patient) => `${patient.name} ${patient.id} ${patient.bed}`.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <>
      <PageHeading eyebrow="Pessoas e episódios" title="Pacientes" description="Consulte episódios ativos, histórico de passagens e situação atual na unidade." actions={<button className="button primary-action" type="button" onClick={() => setToast("O novo episódio seria aberto pelo mesmo wizard do censo.")}><Plus size={17} /> Novo episódio</button>} />
      <PrototypeNotice />
      <section className="directory-layout">
        <article className="panel data-panel">
          <div className="directory-toolbar">
            <label className="directory-search"><MagnifyingGlass size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nome, atendimento ou leito" /></label>
            <button className="button quiet-action" type="button" onClick={() => setToast("Filtros avançados exibidos nesta demonstração.")}><Funnel size={16} /> Filtros</button>
          </div>
          <div className="patient-directory">
            {filtered.length ? filtered.map((patient) => (
              <button className={`patient-directory-row ${selected?.id === patient.id ? "selected" : ""}`} type="button" key={patient.id} onClick={() => setSelected(patient)}>
                <span className="directory-avatar">{patient.initials}</span>
                <span className="directory-name"><strong>{patient.name}</strong><small>{patient.id} • {patient.specialty}</small></span>
                <span><strong>{patient.bed}</strong><small>{patient.sector}</small></span>
                <StatusPill tone={patient.status === "Estável" ? "positive" : "warning"}>{patient.status}</StatusPill>
                <ArrowRight size={16} />
              </button>
            )) : <div className="empty-state"><UserCircle size={38} weight="duotone" /><strong>Nenhum paciente encontrado</strong><span>Revise os termos da busca.</span></div>}
          </div>
        </article>

        {selected && <aside className="panel patient-detail">
          <div className="detail-header"><span className="detail-avatar">{selected.initials}</span><button type="button" aria-label="Fechar detalhes" onClick={() => setSelected(null)}><X size={18} /></button></div>
          <span className="panel-kicker">Episódio ativo</span>
          <h2>{selected.name}</h2>
          <p>{selected.id} • Admissão {selected.admission}</p>
          <div className="detail-status"><StatusPill tone={selected.status === "Estável" ? "positive" : "warning"}>{selected.status}</StatusPill><span>{selected.stay} na unidade</span></div>
          <dl className="detail-list"><div><dt>Localização atual</dt><dd>{selected.sector} • {selected.bed}</dd></div><div><dt>Diagnóstico</dt><dd>{selected.diagnosis}</dd></div><div><dt>Especialidade</dt><dd>{selected.specialty}</dd></div><div><dt>Última atualização</dt><dd>Hoje, 06:12 • Mariana Costa</dd></div></dl>
          <button className="button primary-action full-button" type="button" onClick={() => setToast(`Episódio ${selected.id} aberto em modo de demonstração.`)}>Abrir episódio <ArrowRight size={16} /></button>
        </aside>}
      </section>
      <Toast message={toast} onClose={() => setToast("")} />
    </>
  );
}
