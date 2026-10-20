"use client";

import { Bed, Clock, Database, FloppyDisk, GearSix, ShieldCheck, UsersThree } from "@phosphor-icons/react";
import { useState } from "react";
import { PageHeading, PrototypeNotice, StatusPill, Toast } from "@/components/platform-ui";

const tabs = [
  { id: "operacao", label: "Operação", icon: GearSix },
  { id: "usuarios", label: "Usuários e perfis", icon: UsersThree },
  { id: "catalogos", label: "Catálogos", icon: Database },
  { id: "seguranca", label: "Segurança", icon: ShieldCheck },
];

export default function SettingsPage() {
  const [tab, setTab] = useState("operacao");
  const [toast, setToast] = useState("");
  return (
    <>
      <PageHeading eyebrow="Administração da unidade" title="Configurações" description="Ajuste parâmetros operacionais e preferências do ambiente WayNIR." actions={<button className="button primary-action" type="button" onClick={() => setToast("Alterações salvas apenas na interface demonstrativa.")}><FloppyDisk size={17} /> Salvar alterações</button>} />
      <PrototypeNotice />
      <section className="settings-layout">
        <nav className="settings-tabs" aria-label="Seções de configuração">{tabs.map(({ id, label, icon: Icon }) => <button className={tab === id ? "active" : ""} type="button" key={id} onClick={() => setTab(id)}><Icon size={18} /><span>{label}</span></button>)}</nav>
        <div className="panel settings-panel">
          {tab === "operacao" && <><div className="settings-heading"><div><span className="settings-icon"><Clock size={20} /></span><div><h2>Horários de censo</h2><p>Defina os horários previstos para novos fechamentos.</p></div></div><StatusPill tone="info">4 horários ativos</StatusPill></div><div className="schedule-grid">{["00:30", "06:30", "12:30", "18:30"].map((time) => <label key={time}><span>Horário previsto</span><input type="time" defaultValue={time} /><i className="toggle-switch active" /></label>)}</div><hr /><div className="settings-heading"><div><span className="settings-icon"><Bed size={20} /></span><div><h2>Capacidade por setor</h2><p>A vigência histórica será preservada na implementação futura.</p></div></div></div><div className="capacity-list"><label><span>Observação</span><input type="number" defaultValue="24" /><small>leitos</small></label><label><span>Emergência</span><input type="number" defaultValue="6" /><small>leitos</small></label><label><span>Pediatria</span><input type="number" defaultValue="2" /><small>leitos</small></label></div></>}
          {tab === "usuarios" && <><div className="settings-heading"><div><span className="settings-icon"><UsersThree size={20} /></span><div><h2>Usuários e perfis</h2><p>Visão demonstrativa dos acessos da unidade.</p></div></div><button className="button quiet-action" type="button" onClick={() => setToast("Formulário de usuário aberto na demonstração.")}>Adicionar usuário</button></div><div className="simple-list"><div><span className="directory-avatar">MC</span><div><strong>Mariana Costa</strong><small>Gestora • acesso identificado</small></div><StatusPill tone="positive">Ativa</StatusPill></div><div><span className="directory-avatar">JR</span><div><strong>João Ribeiro</strong><small>Operador • turno noturno</small></div><StatusPill tone="positive">Ativo</StatusPill></div><div><span className="directory-avatar">AN</span><div><strong>Admin WayNIR</strong><small>Administrador • sem acesso clínico</small></div><StatusPill>Ativo</StatusPill></div></div></>}
          {tab === "catalogos" && <><div className="settings-heading"><div><span className="settings-icon"><Database size={20} /></span><div><h2>Catálogos locais</h2><p>Itens usados nos formulários, filtros e importações.</p></div></div></div><div className="catalog-grid">{[["Setores", "3 itens"],["Leitos", "32 itens"],["Especialidades", "9 itens"],["Destinos", "14 itens"],["Dietas", "6 itens"],["CID-10", "Versão piloto"]].map(([name, count]) => <button type="button" key={name} onClick={() => setToast(`Catálogo “${name}” aberto.`)}><strong>{name}</strong><span>{count}</span></button>)}</div></>}
          {tab === "seguranca" && <><div className="settings-heading"><div><span className="settings-icon"><ShieldCheck size={20} /></span><div><h2>Sessão e segurança</h2><p>Parâmetros visuais previstos para o piloto interno.</p></div></div></div><div className="settings-form"><label>Expiração por inatividade<select defaultValue="30"><option value="15">15 minutos</option><option value="30">30 minutos</option><option value="60">60 minutos</option></select></label><label className="setting-toggle"><span><strong>Reautenticação em ações críticas</strong><small>Solicitar senha antes de reabrir censos ou alterar permissões.</small></span><i className="toggle-switch active" /></label><label className="setting-toggle"><span><strong>Exportação identificada</strong><small>Restringir a permissão específica e registrar na auditoria.</small></span><i className="toggle-switch active" /></label></div></>}
        </div>
      </section>
      <Toast message={toast} onClose={() => setToast("")} />
    </>
  );
}
