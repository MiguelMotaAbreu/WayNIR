"use client";

import { CheckCircle, DownloadSimple, FileArrowDown, FileArrowUp, FileXls, UploadSimple, WarningCircle } from "@phosphor-icons/react";
import { ChangeEvent, useState } from "react";
import { PageHeading, PrototypeNotice, StatusPill, Toast } from "@/components/platform-ui";

export default function ImportsPage() {
  const [fileName, setFileName] = useState("");
  const [toast, setToast] = useState("");
  function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) setFileName(file.name);
  }
  return (
    <>
      <PageHeading eyebrow="Interoperabilidade" title="Importar e exportar" description="Traga censos homologados e gere entregáveis no modelo Excel oficial da unidade." />
      <PrototypeNotice />
      <section className="transfer-grid">
        <article className="panel transfer-card">
          <span className="transfer-icon"><FileArrowUp size={25} weight="duotone" /></span><span className="panel-kicker">Entrada de dados</span><h2>Importar censo</h2><p>Selecione uma planilha homologada. A demonstração valida apenas o nome do arquivo.</p>
          <label className={`upload-dropzone ${fileName ? "has-file" : ""}`}><input type="file" accept=".xlsx,.xls" onChange={chooseFile} /><UploadSimple size={27} /><strong>{fileName || "Arraste ou escolha uma planilha"}</strong><span>{fileName ? "Arquivo pronto para validação simulada" : "XLSX ou XLS • até 10 MB"}</span></label>
          <button className="button primary-action full-button" type="button" disabled={!fileName} onClick={() => setToast(`${fileName} validado no fluxo demonstrativo.`)}>Validar importação</button>
        </article>
        <article className="panel transfer-card export-card">
          <span className="transfer-icon green"><FileArrowDown size={25} weight="duotone" /></span><span className="panel-kicker">Saída oficial</span><h2>Exportar censo</h2><p>Gere o arquivo conforme o modelo institucional, preservando ordem, abas e campos esperados.</p>
          <div className="export-summary"><FileXls size={28} weight="duotone" /><div><strong>Censo 20.10.2026 • 06:30</strong><span>27 registros • rascunho</span></div><StatusPill tone="warning">2 pendências</StatusPill></div>
          <button className="button primary-action full-button" type="button" onClick={() => setToast("Prévia XLSX simulada preparada para download.")}><DownloadSimple size={17} /> Gerar prévia Excel</button>
        </article>
      </section>
      <section className="panel data-panel">
        <div className="table-toolbar"><div><h2>Histórico de tarefas</h2><span>Importações e exportações recentes da unidade</span></div></div>
        <div className="table-scroll"><table className="data-table"><thead><tr><th>Arquivo</th><th>Tipo</th><th>Solicitado por</th><th>Data e hora</th><th>Registros</th><th>Status</th><th aria-label="Ação" /></tr></thead><tbody>
          <tr><td><strong>CENSO_20-10_0030.xlsx</strong><span>Modelo oficial v1</span></td><td>Exportação</td><td>João Ribeiro</td><td>20/10 • 05:58</td><td>25</td><td><StatusPill tone="positive"><CheckCircle size={13} weight="fill" /> Concluído</StatusPill></td><td><button className="ghost-icon" type="button" aria-label="Baixar arquivo" onClick={() => setToast("Download do arquivo demonstrativo iniciado.")}><DownloadSimple size={17} /></button></td></tr>
          <tr><td><strong>CENSO_19-10_1830.xlsx</strong><span>Modelo oficial v1</span></td><td>Importação</td><td>Mariana Costa</td><td>19/10 • 18:54</td><td>29</td><td><StatusPill tone="positive"><CheckCircle size={13} weight="fill" /> Concluído</StatusPill></td><td><button className="text-link" type="button" onClick={() => setToast("Resumo da importação aberto.")}>Resumo</button></td></tr>
          <tr><td><strong>CENSO_18-10_1230.xlsx</strong><span>Layout não homologado</span></td><td>Importação</td><td>Carla Nunes</td><td>18/10 • 13:02</td><td>—</td><td><StatusPill tone="danger"><WarningCircle size={13} weight="fill" /> Falhou</StatusPill></td><td><button className="text-link" type="button" onClick={() => setToast("Relatório de inconsistências aberto.")}>Ver erros</button></td></tr>
        </tbody></table></div>
      </section>
      <Toast message={toast} onClose={() => setToast("")} />
    </>
  );
}
