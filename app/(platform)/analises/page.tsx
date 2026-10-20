"use client";

import {
  ArrowCounterClockwise,
  ChartBar,
  ChartLine,
  Copy,
  DownloadSimple,
  Export,
  Funnel,
  Info,
  Table,
} from "@phosphor-icons/react";
import { ReactNode, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  averageStayTrend,
  emergencyStay,
  exitsBreakdown,
  externalCts,
  observationBySpecialty,
  occupancyTrend,
  patientBedDays,
  regulationTimes,
  transferDestinations,
  transfersBySpecialty,
  turnoverBySector,
} from "@/lib/analytics-mock-data";
import { PageHeading, PrototypeNotice, StatusPill, Toast } from "@/components/platform-ui";

const labelMap: Record<string, string> = {
  date: "Data",
  observation: "Observação",
  emergency: "Emergência",
  pediatrics: "Pediatria",
  exact: "Exata",
  legacy: "Legado",
  name: "Categoria",
  value: "Quantidade",
  specialty: "Especialidade",
  under24: "Até 24h",
  over24: "Acima de 24h",
  transfers: "Transferências",
  averageHours: "Tempo médio (h)",
  destination: "Destino",
  removal: "Remoção (h)",
  zeroBed: "Vaga zero (h)",
  week: "Semana",
  requested: "Solicitadas",
  performed: "Realizadas",
  bedDays: "Leitos-dia",
  patientDays: "Pacientes-dia",
  sector: "Setor",
  turnover: "Giro",
  stay: "Permanência (dia)",
  hours: "Permanência média (h)",
};

const tooltipStyle = {
  border: "1px solid #dce8f1",
  borderRadius: 12,
  boxShadow: "0 12px 30px rgba(8, 32, 58, .12)",
  fontSize: 11,
};

function AnalyticsCard({
  title,
  subtitle,
  className = "",
  rows,
  children,
  onAction,
}: {
  title: string;
  subtitle: string;
  className?: string;
  rows: readonly object[];
  children: ReactNode;
  onAction: (message: string) => void;
}) {
  const [mode, setMode] = useState<"chart" | "table">("chart");
  const columns = rows.length ? Object.keys(rows[0] as Record<string, unknown>).filter((key) => key !== "color") : [];

  return (
    <article className={`panel analytics-card ${className}`}>
      <header className="analytics-card-header">
        <div><span className="panel-kicker">Indicador demonstrativo</span><h2>{title}</h2><p>{subtitle}</p></div>
        <div className="analytics-card-actions">
          <div className="mini-segmented" aria-label={`Visualização de ${title}`}>
            <button className={mode === "chart" ? "active" : ""} type="button" aria-label="Exibir gráfico" onClick={() => setMode("chart")}><ChartLine size={15} /></button>
            <button className={mode === "table" ? "active" : ""} type="button" aria-label="Exibir tabela" onClick={() => setMode("table")}><Table size={15} /></button>
          </div>
          <button className="ghost-icon" type="button" aria-label={`Exportar ${title}`} onClick={() => onAction(`${title}: exportação PNG preparada.`)}><DownloadSimple size={16} /></button>
        </div>
      </header>
      {mode === "chart" ? <div className="analytics-chart">{children}</div> : (
        <div className="analytics-table-wrap">
          <table className="analytics-table">
            <thead><tr>{columns.map((column) => <th key={column}>{labelMap[column] ?? column}</th>)}</tr></thead>
            <tbody>{rows.map((row, index) => <tr key={index}>{columns.map((column) => <td key={column}>{String((row as Record<string, unknown>)[column])}</td>)}</tr>)}</tbody>
          </table>
          <button className="copy-table-button" type="button" onClick={() => onAction(`${title}: dados tabulares copiados.`)}><Copy size={14} /> Copiar tabela</button>
        </div>
      )}
    </article>
  );
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("Últimos 7 dias");
  const [sector, setSector] = useState("Todos os setores");
  const [specialty, setSpecialty] = useState("Todas as especialidades");
  const [destination, setDestination] = useState("Todos os destinos");
  const [methodology, setMethodology] = useState<"exact" | "legacy">("exact");
  const [toast, setToast] = useState("");

  const visibleOccupancy = useMemo(() => period === "Últimos 7 dias" ? occupancyTrend.slice(-7) : occupancyTrend, [period]);
  const visibleSpecialties = useMemo(() => specialty === "Todas as especialidades" ? observationBySpecialty : observationBySpecialty.filter((item) => item.specialty === specialty), [specialty]);
  const visibleTransfers = useMemo(() => specialty === "Todas as especialidades" ? transfersBySpecialty : transfersBySpecialty.filter((item) => item.specialty === specialty), [specialty]);
  const visibleDestinations = useMemo(() => destination === "Todos os destinos" ? transferDestinations : transferDestinations.filter((item) => item.destination === destination), [destination]);
  const selectedOccupancy = useMemo(() => {
    const map: Record<string, { occupied: number; capacity: number }> = {
      "Todos os setores": { occupied: 27, capacity: 32 },
      "Observação": { occupied: 20, capacity: 24 },
      "Emergência": { occupied: 5, capacity: 6 },
      "Pediatria": { occupied: 2, capacity: 2 },
    };
    const selected = map[sector];
    return [
      { name: "Ocupados", value: selected.occupied, color: "#2388c4" },
      { name: "Disponíveis", value: selected.capacity - selected.occupied, color: "#dceaf1" },
    ];
  }, [sector]);

  function resetFilters() {
    setPeriod("Últimos 7 dias");
    setSector("Todos os setores");
    setSpecialty("Todas as especialidades");
    setDestination("Todos os destinos");
    setMethodology("exact");
    setToast("Filtros restaurados para a visão padrão.");
  }

  return (
    <>
      <PageHeading
        eyebrow="Inteligência operacional"
        title="Análise de indicadores"
        description="Explore tendências de ocupação, permanência, transferências e produtividade dos leitos."
        actions={<button className="button primary-action" type="button" onClick={() => setToast("Pacote analítico preparado em XLSX com os filtros ativos.")}><Export size={17} /> Exportar análise</button>}
      />
      <PrototypeNotice />

      <section className="analytics-method-banner">
        <div><span className="method-icon"><Info size={18} weight="fill" /></span><div><strong>Metodologia {methodology === "exact" ? "exata" : "legado"}</strong><span>{methodology === "exact" ? "Eventos reais, permanência rateada por hora e capacidade histórica." : "Reprodução aproximada das fórmulas usadas nas planilhas históricas."}</span></div></div>
        <div className="method-toggle" role="group" aria-label="Metodologia dos indicadores"><button className={methodology === "exact" ? "active" : ""} type="button" onClick={() => setMethodology("exact")}>Exata</button><button className={methodology === "legacy" ? "active" : ""} type="button" onClick={() => setMethodology("legacy")}>Legado</button></div>
      </section>

      <section className="analytics-filters" aria-label="Filtros globais dos indicadores">
        <span className="filters-label"><Funnel size={16} /> Filtros</span>
        <label><span>Período</span><select value={period} onChange={(event) => setPeriod(event.target.value)}><option>Últimos 7 dias</option><option>Outubro de 2026</option></select></label>
        <label><span>Setor</span><select value={sector} onChange={(event) => setSector(event.target.value)}><option>Todos os setores</option><option>Observação</option><option>Emergência</option><option>Pediatria</option></select></label>
        <label><span>Especialidade</span><select value={specialty} onChange={(event) => setSpecialty(event.target.value)}><option>Todas as especialidades</option><option>Clínica médica</option><option>Ortopedia</option><option>Cirurgia</option><option>Psiquiatria</option><option>Pediatria</option></select></label>
        <label><span>Destino</span><select value={destination} onChange={(event) => setDestination(event.target.value)}><option>Todos os destinos</option>{transferDestinations.map((item) => <option key={item.destination}>{item.destination}</option>)}</select></label>
        <button className="reset-filter" type="button" onClick={resetFilters}><ArrowCounterClockwise size={15} /> Limpar</button>
      </section>

      <section className="analytics-context-row">
        <div><span>Recorte ativo</span><strong>{period} • {sector}</strong></div>
        <div><span>Fonte oficial</span><strong>Censos fechados</strong></div>
        <div><span>Última consolidação</span><strong>20/10/2026 • 06:30</strong></div>
        <StatusPill tone={methodology === "exact" ? "positive" : "warning"}>{methodology === "exact" ? "Oficial • exata" : "Reconciliação • legado"}</StatusPill>
      </section>

      <section className="analytics-grid">
        <AnalyticsCard title="Evolução da ocupação por setor" subtitle="Percentual de capacidade ocupada nos censos fechados." className="analytics-wide" rows={visibleOccupancy} onAction={setToast}>
          <ResponsiveContainer width="100%" height="100%"><AreaChart data={visibleOccupancy} margin={{ top: 14, right: 16, left: -18, bottom: 0 }}>
            <defs><linearGradient id="analyticsObservation" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2388c4" stopOpacity={0.3}/><stop offset="95%" stopColor="#2388c4" stopOpacity={0.02}/></linearGradient></defs>
            <CartesianGrid stroke="#e9eff3" strokeDasharray="3 3" vertical={false}/><XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#76899a", fontSize: 10 }}/><YAxis domain={[0, 120]} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} tick={{ fill: "#76899a", fontSize: 10 }}/><Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}%`]}/><Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 10 }}/>
            {(sector === "Todos os setores" || sector === "Observação") && <Area type="monotone" dataKey="observation" name="Observação" stroke="#2388c4" strokeWidth={2.4} fill="url(#analyticsObservation)"/>}
            {(sector === "Todos os setores" || sector === "Emergência") && <Area type="monotone" dataKey="emergency" name="Emergência" stroke="#e39b4d" strokeWidth={2.2} fill="transparent"/>}
            {(sector === "Todos os setores" || sector === "Pediatria") && <Area type="monotone" dataKey="pediatrics" name="Pediatria" stroke="#7b68b7" strokeWidth={2.2} fill="transparent"/>}
            <ReferenceLine y={85} stroke="#bd655f" strokeDasharray="4 4" label={{ value: "atenção 85%", fill: "#a85d58", fontSize: 9 }}/>
          </AreaChart></ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard title="Ocupação atual" subtitle={`${sector} • capacidade configurada`} rows={selectedOccupancy} onAction={setToast}>
          <div className="donut-chart-shell"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={selectedOccupancy} dataKey="value" nameKey="name" innerRadius="60%" outerRadius="82%" paddingAngle={2}>{selectedOccupancy.map((entry) => <Cell key={entry.name} fill={entry.color}/>)}</Pie><Tooltip contentStyle={tooltipStyle}/><Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 10 }}/></PieChart></ResponsiveContainer><div className="donut-center"><strong>{Math.round((selectedOccupancy[0].value / (selectedOccupancy[0].value + selectedOccupancy[1].value)) * 100)}%</strong><span>ocupação</span></div></div>
        </AnalyticsCard>

        <AnalyticsCard title="Observação por especialidade" subtitle="Pacientes abaixo e acima de 24 horas." className="analytics-half" rows={visibleSpecialties} onAction={setToast}>
          <ResponsiveContainer width="100%" height="100%"><BarChart data={visibleSpecialties} layout="vertical" margin={{ top: 8, right: 14, left: 18, bottom: 0 }}><CartesianGrid stroke="#e9eff3" horizontal={false}/><XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#76899a", fontSize: 9 }}/><YAxis type="category" dataKey="specialty" width={90} axisLine={false} tickLine={false} tick={{ fill: "#667b8d", fontSize: 9 }}/><Tooltip contentStyle={tooltipStyle}/><Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 10 }}/><Bar dataKey="under24" name="Até 24h" stackId="stay" fill="#42a779" radius={[5,0,0,5]}/><Bar dataKey="over24" name="Acima de 24h" stackId="stay" fill="#e39b4d" radius={[0,5,5,0]}/></BarChart></ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard title="Permanência na emergência" subtitle="Distribuição dos pacientes ativos por faixa de tempo." rows={emergencyStay} onAction={setToast}>
          <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={emergencyStay} dataKey="value" nameKey="name" innerRadius="46%" outerRadius="76%" paddingAngle={3} label>{emergencyStay.map((entry) => <Cell key={entry.name} fill={entry.color}/>)}</Pie><Tooltip contentStyle={tooltipStyle}/><Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 10 }}/></PieChart></ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard title="Permanência média e casos acima de 24h" subtitle="Tendência diária com limite operacional de 10 horas." className="analytics-wide" rows={averageStayTrend} onAction={setToast}>
          <ResponsiveContainer width="100%" height="100%"><ComposedChart data={averageStayTrend} margin={{ top: 14, right: 16, left: -16, bottom: 0 }}><CartesianGrid stroke="#e9eff3" strokeDasharray="3 3" vertical={false}/><XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#76899a", fontSize: 10 }}/><YAxis yAxisId="left" axisLine={false} tickLine={false} tickFormatter={(value) => `${value}h`} tick={{ fill: "#76899a", fontSize: 9 }}/><YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: "#76899a", fontSize: 9 }}/><Tooltip contentStyle={tooltipStyle}/><Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 10 }}/><ReferenceLine yAxisId="left" y={10} stroke="#bd655f" strokeDasharray="4 4"/><Bar yAxisId="right" dataKey="over24" name="Casos acima de 24h" fill="#dceaf1" radius={[5,5,0,0]} maxBarSize={32}/><Line yAxisId="left" type="monotone" dataKey="hours" name="Permanência média" stroke="#163c68" strokeWidth={2.5} dot={{ r: 3, fill: "#163c68" }}/></ComposedChart></ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard title="Transferências por especialidade" subtitle="Volume de transferências externas concluídas." rows={visibleTransfers} onAction={setToast}>
          <ResponsiveContainer width="100%" height="100%"><BarChart data={visibleTransfers} margin={{ top: 10, right: 10, left: -25, bottom: 24 }}><CartesianGrid stroke="#e9eff3" vertical={false}/><XAxis dataKey="specialty" angle={-20} textAnchor="end" axisLine={false} tickLine={false} tick={{ fill: "#6f8293", fontSize: 8 }}/><YAxis axisLine={false} tickLine={false} tick={{ fill: "#76899a", fontSize: 9 }}/><Tooltip contentStyle={tooltipStyle}/><Bar dataKey="transfers" name="Transferências" fill="#2388c4" radius={[6,6,0,0]} maxBarSize={38}/></BarChart></ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard title="Destinos de transferência" subtitle="Distribuição das saídas externas por instituição." rows={visibleDestinations} onAction={setToast}>
          <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={visibleDestinations} dataKey="value" nameKey="destination" innerRadius="43%" outerRadius="73%" paddingAngle={2}>{visibleDestinations.map((entry) => <Cell key={entry.destination} fill={entry.color}/>)}</Pie><Tooltip contentStyle={tooltipStyle}/><Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 9 }}/></PieChart></ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard title="Tempo de remoção e vaga zero" subtitle="Média diária entre os marcos operacionais registrados." className="analytics-wide" rows={regulationTimes} onAction={setToast}>
          <ResponsiveContainer width="100%" height="100%"><LineChart data={regulationTimes} margin={{ top: 14, right: 18, left: -16, bottom: 0 }}><CartesianGrid stroke="#e9eff3" strokeDasharray="3 3" vertical={false}/><XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#76899a", fontSize: 10 }}/><YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value}h`} tick={{ fill: "#76899a", fontSize: 9 }}/><Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value} horas`]}/><Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 10 }}/><Line type="monotone" dataKey="removal" name="Remoção" stroke="#2388c4" strokeWidth={2.5}/><Line type="monotone" dataKey="zeroBed" name="Vaga zero" stroke="#e39b4d" strokeWidth={2.5}/></LineChart></ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard title="Tomografias externas" subtitle="Solicitações e exames efetivamente realizados." rows={externalCts} onAction={setToast}>
          <ResponsiveContainer width="100%" height="100%"><BarChart data={externalCts} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}><CartesianGrid stroke="#e9eff3" vertical={false}/><XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: "#76899a", fontSize: 9 }}/><YAxis axisLine={false} tickLine={false} tick={{ fill: "#76899a", fontSize: 9 }}/><Tooltip contentStyle={tooltipStyle}/><Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 10 }}/><Bar dataKey="requested" name="Solicitadas" fill="#b9d9e8" radius={[5,5,0,0]}/><Bar dataKey="performed" name="Realizadas" fill="#163c68" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard title="Leitos-dia e pacientes-dia" subtitle="Base diária usada na leitura de ocupação e produtividade." className="analytics-wide" rows={patientBedDays} onAction={setToast}>
          <ResponsiveContainer width="100%" height="100%"><AreaChart data={patientBedDays} margin={{ top: 14, right: 18, left: -18, bottom: 0 }}><defs><linearGradient id="patientDays" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#42a779" stopOpacity={0.3}/><stop offset="95%" stopColor="#42a779" stopOpacity={0.02}/></linearGradient></defs><CartesianGrid stroke="#e9eff3" strokeDasharray="3 3" vertical={false}/><XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#76899a", fontSize: 10 }}/><YAxis axisLine={false} tickLine={false} tick={{ fill: "#76899a", fontSize: 9 }}/><Tooltip contentStyle={tooltipStyle}/><Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 10 }}/><Area type="monotone" dataKey="bedDays" name="Leitos-dia" stroke="#163c68" fill="transparent" strokeWidth={2}/><Area type="monotone" dataKey="patientDays" name="Pacientes-dia" stroke="#42a779" fill="url(#patientDays)" strokeWidth={2.5}/></AreaChart></ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard title="Giro de leitos por setor" subtitle="Número médio de pacientes por leito no período." rows={turnoverBySector} onAction={setToast}>
          <ResponsiveContainer width="100%" height="100%"><BarChart data={turnoverBySector} margin={{ top: 12, right: 10, left: -20, bottom: 0 }}><CartesianGrid stroke="#e9eff3" vertical={false}/><XAxis dataKey="sector" axisLine={false} tickLine={false} tick={{ fill: "#6f8293", fontSize: 9 }}/><YAxis axisLine={false} tickLine={false} tick={{ fill: "#76899a", fontSize: 9 }}/><Tooltip contentStyle={tooltipStyle}/><Bar dataKey="turnover" name="Giro" fill="#7b68b7" radius={[6,6,0,0]} maxBarSize={48}/></BarChart></ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard title="Saídas por tipo" subtitle="Desfechos efetivos atribuídos à data do evento." rows={exitsBreakdown} onAction={setToast}>
          <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={exitsBreakdown} dataKey="value" nameKey="name" innerRadius="43%" outerRadius="73%" paddingAngle={2}>{exitsBreakdown.map((entry) => <Cell key={entry.name} fill={entry.color}/>)}</Pie><Tooltip contentStyle={tooltipStyle}/><Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 9 }}/></PieChart></ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard title="Exata x legado" subtitle="Diferença metodológica na taxa de ocupação geral." className="analytics-wide" rows={visibleOccupancy.map(({ date, exact, legacy }) => ({ date, exact, legacy }))} onAction={setToast}>
          <ResponsiveContainer width="100%" height="100%"><LineChart data={visibleOccupancy} margin={{ top: 14, right: 18, left: -18, bottom: 0 }}><CartesianGrid stroke="#e9eff3" strokeDasharray="3 3" vertical={false}/><XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#76899a", fontSize: 10 }}/><YAxis domain={[60, 100]} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} tick={{ fill: "#76899a", fontSize: 9 }}/><Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}%`]}/><Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 10 }}/><Line type="monotone" dataKey="exact" name="Metodologia exata" stroke="#2388c4" strokeWidth={2.6}/><Line type="monotone" dataKey="legacy" name="Metodologia legado" stroke="#e39b4d" strokeDasharray="6 4" strokeWidth={2.2}/></LineChart></ResponsiveContainer>
        </AnalyticsCard>
      </section>

      <footer className="analytics-footnote-panel"><ChartBar size={18} weight="duotone" /><div><strong>Leitura demonstrativa</strong><span>Os dados são fictícios e existem apenas para validar a experiência visual. Na implementação real, cada indicador será calculado a partir dos censos fechados e eventos auditáveis.</span></div></footer>
      <Toast message={toast} onClose={() => setToast("")} />
    </>
  );
}
