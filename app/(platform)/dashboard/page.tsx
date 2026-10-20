"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bed,
  CalendarBlank,
  CheckCircle,
  Clock,
  DownloadSimple,
  Export,
  FirstAid,
  HourglassMedium,
  Pulse,
  UsersThree,
  ChartBar,
} from "@phosphor-icons/react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { exitsByType, movements, occupancySeries } from "@/lib/mock-data";
import { MetricCard, PageHeading, PrototypeNotice, StatusPill, Toast } from "@/components/platform-ui";

export default function DashboardPage() {
  const [period, setPeriod] = useState("Hoje");
  const [toast, setToast] = useState("");

  return (
    <>
      <PageHeading
        eyebrow="Terça-feira, 20 de outubro"
        title="Bom dia, Mariana."
        description="Acompanhe o censo atual e os principais sinais da operação da unidade."
        actions={
          <>
            <Link className="button secondary-action" href="/analises"><ChartBar size={17} /> Painel analítico</Link>
            <label className="compact-select"><CalendarBlank size={16} /><select value={period} onChange={(event) => setPeriod(event.target.value)} aria-label="Período do dashboard"><option>Hoje</option><option>Últimos 7 dias</option><option>Este mês</option></select></label>
            <button className="button secondary-action" type="button" onClick={() => setToast("Relatório do dashboard preparado para exportação.")}><Export size={17} /> Exportar visão</button>
          </>
        }
      />
      <PrototypeNotice />

      <section className="metric-grid" aria-label="Indicadores principais">
        <MetricCard label="Pacientes ativos" value="27" detail="+3 desde 00:30" icon={<UsersThree size={21} weight="duotone" />} />
        <MetricCard label="Ocupação geral" value="84%" detail="27 de 32 leitos" tone="green" icon={<Bed size={21} weight="duotone" />} />
        <MetricCard label="Permanência média" value="8h 42" detail="Meta operacional: 10h" tone="purple" icon={<HourglassMedium size={21} weight="duotone" />} />
        <MetricCard label="Pendências do censo" value="02" detail="Revisão antes do fechamento" tone="amber" icon={<FirstAid size={21} weight="duotone" />} />
      </section>

      <section className="dashboard-primary-grid">
        <article className="panel occupancy-chart-panel">
          <div className="panel-heading">
            <div><span className="panel-kicker">Capacidade assistencial</span><h2>Ocupação por setor</h2></div>
            <div className="panel-actions"><StatusPill tone="positive">Atualizado agora</StatusPill><button className="ghost-icon" type="button" aria-label="Exportar gráfico" onClick={() => setToast("Gráfico de ocupação exportado em PNG.")}><DownloadSimple size={17} /></button></div>
          </div>
          <div className="chart-wrap" aria-label="Gráfico de ocupação por setor">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={occupancySeries} margin={{ top: 16, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="observation" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2388c4" stopOpacity={0.32}/><stop offset="95%" stopColor="#2388c4" stopOpacity={0.02}/></linearGradient>
                </defs>
                <CartesianGrid stroke="#e8eef4" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: "#77889b", fontSize: 11 }} />
                <YAxis domain={[0, 120]} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} tick={{ fill: "#77889b", fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #dce8f1", boxShadow: "0 12px 30px rgba(8, 32, 58, .12)" }} formatter={(value) => [`${value}%`]} />
                <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Area type="monotone" dataKey="observation" name="Observação" stroke="#2388c4" strokeWidth={2.5} fill="url(#observation)" />
                <Area type="monotone" dataKey="emergency" name="Emergência" stroke="#e39546" strokeWidth={2} fill="transparent" />
                <Area type="monotone" dataKey="pediatrics" name="Pediatria" stroke="#7f6ac8" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel census-focus-card">
          <div className="census-focus-top">
            <span><Pulse size={19} weight="fill" /> Censo atual</span>
            <StatusPill tone="warning">Em revisão</StatusPill>
          </div>
          <div className="census-time"><strong>06:30</strong><span>20 out 2026</span></div>
          <div className="census-progress-row"><span>Validação dos registros</span><strong>93%</strong></div>
          <div className="progress-track"><span style={{ width: "93%" }} /></div>
          <div className="census-mini-stats">
            <div><strong>27</strong><span>pacientes</span></div>
            <div><strong>02</strong><span>pendências</span></div>
            <div><strong>05:41</strong><span>última edição</span></div>
          </div>
          <div className="attention-note"><Clock size={17} weight="fill" /><div><strong>Fechamento previsto para 06:30</strong><span>Revise os campos sinalizados antes de concluir.</span></div></div>
          <Link className="button primary-action full-button" href="/censos">Continuar revisão <ArrowRight size={17} /></Link>
        </article>
      </section>

      <section className="sector-grid" aria-label="Ocupação atual dos setores">
        {[
          { name: "Observação", count: "20 / 24", percentage: 83, tone: "blue" },
          { name: "Emergência", count: "5 / 6", percentage: 83, tone: "amber" },
          { name: "Pediatria", count: "2 / 2", percentage: 100, tone: "purple" },
        ].map((sector) => (
          <article className={`sector-card ${sector.tone}`} key={sector.name}>
            <div><span>{sector.name}</span><strong>{sector.percentage}%</strong></div>
            <div className="sector-bar"><span style={{ width: `${sector.percentage}%` }} /></div>
            <small>{sector.count} leitos ocupados</small>
          </article>
        ))}
      </section>

      <section className="dashboard-secondary-grid">
        <article className="panel recent-activity-panel">
          <div className="panel-heading"><div><span className="panel-kicker">Linha do tempo</span><h2>Movimentações recentes</h2></div><Link className="text-link" href="/movimentacoes">Ver todas <ArrowRight size={14} /></Link></div>
          <div className="activity-list">
            {movements.slice(0, 4).map((item) => (
              <div className="activity-row" key={`${item.time}-${item.patient}`}>
                <span className="activity-icon"><CheckCircle size={17} weight="fill" /></span>
                <div><strong>{item.event}</strong><span>{item.patient} • {item.detail}</span></div>
                <time>{item.time}</time>
              </div>
            ))}
          </div>
        </article>

        <article className="panel exits-panel">
          <div className="panel-heading"><div><span className="panel-kicker">Últimos 30 dias</span><h2>Saídas por tipo</h2></div><button className="ghost-icon" type="button" aria-label="Exportar dados de saídas" onClick={() => setToast("Tabela de saídas copiada para a área de transferência.")}><DownloadSimple size={17} /></button></div>
          <div className="bar-chart-wrap" aria-label="Gráfico de saídas por tipo">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={exitsByType} margin={{ top: 10, right: 0, left: -27, bottom: 0 }}>
                <CartesianGrid stroke="#e8eef4" vertical={false} />
                <XAxis dataKey="type" axisLine={false} tickLine={false} tick={{ fill: "#77889b", fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#77889b", fontSize: 10 }} />
                <Tooltip cursor={{ fill: "#f5f8fb" }} contentStyle={{ borderRadius: 12, border: "1px solid #dce8f1" }} />
                <Bar dataKey="value" name="Saídas" fill="#163c68" radius={[6, 6, 0, 0]} maxBarSize={34} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <Toast message={toast} onClose={() => setToast("")} />
    </>
  );
}
