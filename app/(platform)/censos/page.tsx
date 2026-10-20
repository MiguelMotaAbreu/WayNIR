"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  FileXls,
  FloppyDisk,
  GridFour,
  ListChecks,
  Plus,
  Rows,
  Warning,
  X,
} from "@phosphor-icons/react";
import { useState } from "react";
import { censusHistory, patients } from "@/lib/mock-data";
import { PageHeading, PrototypeNotice, StatusPill, Toast } from "@/components/platform-ui";

const steps = ["Identificação", "Leito", "Quadro", "Revisão"];

export default function CensusPage() {
  const [view, setView] = useState<"grid" | "history">("grid");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [toast, setToast] = useState("");

  function closeWizard() {
    setWizardOpen(false);
    setStep(0);
  }

  return (
    <>
      <PageHeading
        eyebrow="Operação • Censo das 06:30"
        title="Censo atual"
        description="Registre, revise e prepare o retrato operacional da unidade para fechamento."
        actions={
          <>
            <button className="button secondary-action" type="button" onClick={() => setToast("Prévia do Excel oficial gerada com dados demonstrativos.")}><FileXls size={17} /> Prévia Excel</button>
            <button className="button primary-action" type="button" onClick={() => setWizardOpen(true)}><Plus size={17} weight="bold" /> Novo paciente</button>
          </>
        }
      />
      <PrototypeNotice />

      <section className="census-status-strip">
        <div><span className="status-live-dot" /><strong>Rascunho em revisão</strong><small>Salvo localmente há 12 segundos</small></div>
        <div className="census-status-metrics"><span><b>27</b> registros</span><span><b>25</b> válidos</span><span className="warning-text"><b>2</b> pendências</span></div>
        <button className="button dark-action" type="button" onClick={() => setToast("Simulação concluída: o fechamento exigirá corrigir 2 pendências.")}><ListChecks size={17} /> Revisar fechamento</button>
      </section>

      <div className="view-toolbar">
        <div className="segmented-control" role="tablist" aria-label="Visualização de censos">
          <button className={view === "grid" ? "active" : ""} type="button" role="tab" aria-selected={view === "grid"} onClick={() => setView("grid")}><GridFour size={16} /> Grade operacional</button>
          <button className={view === "history" ? "active" : ""} type="button" role="tab" aria-selected={view === "history"} onClick={() => setView("history")}><Rows size={16} /> Histórico</button>
        </div>
        <div className="toolbar-actions">
          <button className="button quiet-action" type="button" onClick={() => setToast("Último censo copiado para um novo rascunho.")}><Copy size={16} /> Copiar último censo</button>
          <button className="button quiet-action" type="button" onClick={() => setToast("Rascunho salvo nesta demonstração visual.")}><FloppyDisk size={16} /> Salvar agora</button>
        </div>
      </div>

      {view === "grid" ? (
        <section className="panel data-panel">
          <div className="table-toolbar">
            <div><h2>Pacientes no censo</h2><span>Edição direta em grade • células destacadas precisam de atenção</span></div>
            <div className="table-legend"><span><i className="legend-dot saved" /> Salvo</span><span><i className="legend-dot pending" /> Pendente</span></div>
          </div>
          <div className="table-scroll census-grid-wrap">
            <table className="data-table census-grid-table">
              <thead><tr><th>Leito</th><th>Paciente</th><th>Atendimento</th><th>Admissão</th><th>Setor</th><th>Diagnóstico</th><th>Especialidade</th><th>Status</th><th aria-label="Ações" /></tr></thead>
              <tbody>
                {patients.map((patient, index) => (
                  <tr key={patient.id}>
                    <td><input aria-label={`Leito de ${patient.name}`} defaultValue={patient.bed} /></td>
                    <td className="patient-cell"><span className="mini-avatar">{patient.initials}</span><strong>{patient.name}</strong></td>
                    <td>{patient.id}</td>
                    <td>{patient.admission}</td>
                    <td><select aria-label={`Setor de ${patient.name}`} defaultValue={patient.sector}><option>Observação</option><option>Emergência</option><option>Pediatria</option></select></td>
                    <td><input className={index === 1 ? "field-warning" : ""} aria-label={`Diagnóstico de ${patient.name}`} defaultValue={index === 1 ? "" : patient.diagnosis} placeholder="Obrigatório" /></td>
                    <td>{patient.specialty}</td>
                    <td><StatusPill tone={patient.status === "Atenção" || patient.status === "Aguardando vaga" ? "warning" : "positive"}>{patient.status}</StatusPill></td>
                    <td><button className="row-menu" type="button" aria-label={`Opções de ${patient.name}`} onClick={() => setToast(`Menu de ações aberto para ${patient.id}.`)}>•••</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-footer"><span>Mostrando 5 de 27 registros demonstrativos</span><button type="button" onClick={() => setWizardOpen(true)}><Plus size={15} /> Adicionar linha</button></div>
        </section>
      ) : (
        <section className="panel data-panel">
          <div className="table-toolbar"><div><h2>Histórico de censos</h2><span>Versões e fechamentos recentes da unidade</span></div></div>
          <div className="table-scroll">
            <table className="data-table">
              <thead><tr><th>Referência</th><th>Status</th><th>Pacientes</th><th>Ocupação</th><th>Responsável</th><th aria-label="Ações" /></tr></thead>
              <tbody>{censusHistory.map((census) => <tr key={`${census.date}-${census.time}`}><td><strong>{census.time}</strong><span>{census.date}</span></td><td><StatusPill tone={census.status === "Fechado" ? "positive" : census.status === "Reaberto" ? "danger" : "warning"}>{census.status}</StatusPill></td><td>{census.patients}</td><td>{census.occupancy}</td><td>{census.owner}</td><td><button className="text-link" type="button" onClick={() => setToast(`Detalhes do censo de ${census.time} abertos.`)}>Ver detalhes</button></td></tr>)}</tbody>
            </table>
          </div>
        </section>
      )}

      {wizardOpen && (
        <div className="modal-layer" role="presentation" onMouseDown={closeWizard}>
          <section className="wizard-modal" role="dialog" aria-modal="true" aria-labelledby="wizard-title" onMouseDown={(event) => event.stopPropagation()}>
            <header className="wizard-header">
              <div><span>Novo registro</span><h2 id="wizard-title">Adicionar paciente ao censo</h2></div>
              <button type="button" aria-label="Fechar formulário" onClick={closeWizard}><X size={20} /></button>
            </header>
            <div className="wizard-steps">
              {steps.map((label, index) => <div className={index === step ? "active" : index < step ? "complete" : ""} key={label}><span>{index < step ? <Check size={14} weight="bold" /> : index + 1}</span><small>{label}</small></div>)}
            </div>
            <div className="wizard-content">
              {step === 0 && <><div className="wizard-intro"><h3>Identificação e admissão</h3><p>Dados básicos do episódio atual na unidade.</p></div><div className="form-grid"><label className="wide">Nome completo<input placeholder="Nome do paciente" /></label><label>Nascimento<input type="date" /></label><label>Nº do atendimento<input placeholder="Ex.: 263900" /></label><label>Data de admissão<input type="date" defaultValue="2026-10-20" /></label><label>Hora<input type="time" defaultValue="06:30" /></label></div></>}
              {step === 1 && <><div className="wizard-intro"><h3>Localização e leito</h3><p>Defina onde o paciente está sendo acompanhado.</p></div><div className="form-grid"><label>Setor<select><option>Observação</option><option>Emergência</option><option>Pediatria</option></select></label><label>Leito<select><option>Selecione</option><option>OBS-01</option><option>OBS-02</option><option>OBS-03</option></select></label><label className="wide">Cidade de origem<input placeholder="Santos" /></label></div></>}
              {step === 2 && <><div className="wizard-intro"><h3>Quadro e cuidados</h3><p>Informações operacionais usadas no censo e nos indicadores.</p></div><div className="form-grid"><label className="wide">Diagnóstico<textarea placeholder="Descrição do diagnóstico" rows={3} /></label><label>Especialidade<select><option>Clínica médica</option><option>Ortopedia</option><option>Pediatria</option></select></label><label>Dieta<select><option>Livre</option><option>Jejum</option><option>Enteral</option></select></label><label>IOT<select><option>Não</option><option>Sim</option></select></label><label>CID-10 (opcional)<input placeholder="Pesquisar código" /></label></div></>}
              {step === 3 && <><div className="wizard-intro"><h3>Revisão final</h3><p>Confira os dados antes de incluir o registro no censo.</p></div><div className="review-card"><div><span>Paciente</span><strong>Dados preenchidos na demonstração</strong></div><div><span>Setor e leito</span><strong>Observação • a definir</strong></div><div><span>Validação</span><StatusPill tone="positive">Pronto para incluir</StatusPill></div></div><div className="attention-note soft"><Warning size={17} weight="fill" /><div><strong>Ambiente de demonstração</strong><span>O registro não será persistido nem enviado a um servidor.</span></div></div></>}
            </div>
            <footer className="wizard-footer">
              <button className="button quiet-action" type="button" disabled={step === 0} onClick={() => setStep((current) => current - 1)}><ArrowLeft size={16} /> Voltar</button>
              {step < steps.length - 1 ? <button className="button primary-action" type="button" onClick={() => setStep((current) => current + 1)}>Continuar <ArrowRight size={16} /></button> : <button className="button primary-action" type="button" onClick={() => { closeWizard(); setToast("Paciente incluído apenas na simulação do frontend."); }}><Check size={16} /> Incluir no censo</button>}
            </footer>
          </section>
        </div>
      )}

      <Toast message={toast} onClose={() => setToast("")} />
    </>
  );
}
