"use client";

import { ArrowRight, CalendarBlank, ClockCounterClockwise, Funnel, Plus, X } from "@phosphor-icons/react";
import { useState } from "react";
import { movements } from "@/lib/mock-data";
import { PageHeading, PrototypeNotice, StatusPill, Toast } from "@/components/platform-ui";

export default function MovementsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  return (
    <>
      <PageHeading eyebrow="Linha do tempo operacional" title="Movimentações" description="Registre eventos que explicam entradas, transferências, mudanças e saídas da unidade." actions={<button className="button primary-action" type="button" onClick={() => setModalOpen(true)}><Plus size={17} /> Registrar movimentação</button>} />
      <PrototypeNotice />
      <section className="movement-summary-grid">
        <article><span>Admissões hoje</span><strong>18</strong><small>+4 vs. ontem</small></article>
        <article><span>Altas hoje</span><strong>14</strong><small>77% das saídas</small></article>
        <article><span>Transferências</span><strong>04</strong><small>1 aguardando conclusão</small></article>
        <article><span>Tempo médio de remoção</span><strong>2h 18</strong><small>Dentro da meta</small></article>
      </section>
      <section className="panel data-panel">
        <div className="table-toolbar">
          <div><h2>Atividade recente</h2><span>Eventos efetivos registrados nos episódios</span></div>
          <div className="toolbar-actions"><button className="button quiet-action" type="button" onClick={() => setToast("Filtro de período aberto.")}><CalendarBlank size={16} /> Hoje</button><button className="button quiet-action" type="button" onClick={() => setToast("Filtros de evento abertos.")}><Funnel size={16} /> Tipo</button></div>
        </div>
        <div className="timeline-list">
          {movements.map((movement) => <div className="timeline-row" key={`${movement.time}-${movement.patient}`}><div className="timeline-time"><strong>{movement.time}</strong><span>Hoje</span></div><span className="timeline-marker"><ClockCounterClockwise size={17} weight="fill" /></span><div className="timeline-copy"><strong>{movement.event}</strong><span>{movement.patient}</span><small>{movement.detail}</small></div><div className="timeline-author"><span>{movement.author}</span><StatusPill tone="positive">Registrado</StatusPill></div><button className="text-link" type="button" onClick={() => setToast(`Evento de ${movement.time} aberto.`)}>Detalhes <ArrowRight size={14} /></button></div>)}
        </div>
      </section>
      {modalOpen && <div className="modal-layer" role="presentation" onMouseDown={() => setModalOpen(false)}><section className="compact-modal" role="dialog" aria-modal="true" aria-labelledby="movement-title" onMouseDown={(event) => event.stopPropagation()}><header><div><span>Novo evento</span><h2 id="movement-title">Registrar movimentação</h2></div><button type="button" aria-label="Fechar" onClick={() => setModalOpen(false)}><X size={20} /></button></header><div className="form-stack"><label>Paciente<select><option>Selecione um episódio ativo</option>{movements.slice(0,4).map((item) => <option key={item.patient}>{item.patient}</option>)}</select></label><label>Tipo de movimentação<select><option>Admissão</option><option>Mudança de setor</option><option>Mudança de leito</option><option>Alta</option><option>Transferência externa</option></select></label><div className="form-grid"><label>Data efetiva<input type="date" defaultValue="2026-10-20" /></label><label>Hora efetiva<input type="time" defaultValue="06:30" /></label></div><label>Detalhes<textarea rows={3} placeholder="Destino, motivo ou observação" /></label></div><footer><button className="button quiet-action" type="button" onClick={() => setModalOpen(false)}>Cancelar</button><button className="button primary-action" type="button" onClick={() => { setModalOpen(false); setToast("Movimentação registrada apenas na simulação do frontend."); }}>Registrar evento</button></footer></section></div>}
      <Toast message={toast} onClose={() => setToast("")} />
    </>
  );
}
