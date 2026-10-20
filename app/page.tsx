"use client";

import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  CaretDown,
  ChartLineUp,
  CheckCircle,
  ClipboardText,
  ClockCountdown,
  Database,
  FileXls,
  List,
  LockKey,
  Pulse,
  ShieldCheck,
  SquaresFour,
  Table,
  X,
} from "@phosphor-icons/react";
import { FormEvent, useState } from "react";

const capabilities = [
  {
    icon: ClipboardText,
    step: "01",
    title: "Registre com clareza",
    description:
      "Cadastre cada episódio por um fluxo guiado, com os mesmos campos do censo oficial.",
  },
  {
    icon: Table,
    step: "02",
    title: "Trabalhe como já conhece",
    description:
      "Alterne para a grade estilo Excel, edite células e copie blocos sem perder validações.",
  },
  {
    icon: ChartLineUp,
    step: "03",
    title: "Transforme rotina em visão",
    description:
      "Feche o censo e acompanhe ocupação, permanência, transferências e giro de leitos.",
  },
];

const indicators = [
  {
    value: "24 h",
    label: "Visão contínua",
    description: "Histórico por paciente, episódio e horário de fechamento.",
  },
  {
    value: "100%",
    label: "Rastreável",
    description: "Alterações, reaberturas e exportações registradas em auditoria.",
  },
  {
    value: "1 clique",
    label: "Excel oficial",
    description: "O censo pronto para seguir o modelo usado pela unidade.",
  },
];

const faqs = [
  {
    question: "O WayNIR substitui o modelo de censo em Excel?",
    answer:
      "Ele organiza o trabalho dentro da plataforma e mantém a exportação no formato oficial, preservando a rotina de entrega da unidade.",
  },
  {
    question: "A plataforma funciona sem internet externa?",
    answer:
      "Sim. O WayNIR foi pensado para operar na rede interna da unidade, com aplicação e dados hospedados localmente.",
  },
  {
    question: "Quem pode visualizar ou exportar dados identificados?",
    answer:
      "Somente usuários com permissão específica. Leituras sensíveis e exportações ficam registradas na auditoria.",
  },
  {
    question: "É possível corrigir um censo já fechado?",
    answer:
      "Sim, mediante permissão e justificativa. A versão anterior permanece preservada e a correção é auditada.",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginFeedback, setLoginFeedback] = useState("");

  function openLogin() {
    setMenuOpen(false);
    setLoginFeedback("");
    setLoginOpen(true);
  }

  function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginFeedback(
      "Esta é a demonstração visual. A autenticação será conectada na próxima etapa.",
    );
  }

  return (
    <div className="page-shell">
      <div className="site-frame">
        <header className="site-header" aria-label="Navegação principal">
          <a className="brand" href="#inicio" aria-label="WayNIR — início">
            <span className="brand-mark" aria-hidden="true">
              <Pulse size={20} weight="bold" />
            </span>
            <span>WayNIR</span>
          </a>

          <nav className="desktop-nav" aria-label="Seções da página">
            <a href="#plataforma">Plataforma</a>
            <a href="#indicadores">Indicadores</a>
            <a href="#seguranca">Segurança</a>
            <a href="#duvidas">Dúvidas</a>
          </nav>

          <button className="header-cta" type="button" onClick={openLogin}>
            Acessar plataforma
            <ArrowUpRight size={16} weight="bold" />
          </button>

          <button
            className="menu-button"
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <X size={23} /> : <List size={23} />}
          </button>

          {menuOpen && (
            <nav className="mobile-nav" aria-label="Menu móvel">
              <a href="#plataforma" onClick={() => setMenuOpen(false)}>
                Plataforma
              </a>
              <a href="#indicadores" onClick={() => setMenuOpen(false)}>
                Indicadores
              </a>
              <a href="#seguranca" onClick={() => setMenuOpen(false)}>
                Segurança
              </a>
              <a href="#duvidas" onClick={() => setMenuOpen(false)}>
                Dúvidas
              </a>
              <button type="button" onClick={openLogin}>
                Acessar plataforma
              </button>
            </nav>
          )}
        </header>

        <main>
          <section className="hero" id="inicio">
            <Image
              className="hero-image"
              src="/images/waynir-hero.png"
              alt="Painéis do WayNIR em uma estação de trabalho hospitalar"
              fill
              priority
              sizes="(max-width: 760px) 100vw, 1320px"
            />
            <div className="hero-overlay" aria-hidden="true" />
            <div className="hero-content">
              <span className="eyebrow light-eyebrow">
                <span className="eyebrow-dot" />
                Regulação mais clara, turno após turno
              </span>
              <h1>
                Simplifique o censo.
                <br />
                Amplie a visão do NIR.
              </h1>
              <p>
                Registre pacientes, feche censos e transforme a rotina da UPA
                em informação confiável para agir melhor.
              </p>
              <div className="hero-actions">
                <button className="primary-button" type="button" onClick={openLogin}>
                  Acessar plataforma
                  <ArrowRight size={17} weight="bold" />
                </button>
                <a className="secondary-button" href="#plataforma">
                  Conhecer o fluxo
                </a>
              </div>
            </div>
          </section>

          <section className="trust-strip" aria-label="Pilares do WayNIR">
            <div>
              <Database size={20} weight="duotone" />
              <span>Dados na unidade</span>
            </div>
            <div>
              <ShieldCheck size={20} weight="duotone" />
              <span>Acesso controlado</span>
            </div>
            <div>
              <ClockCountdown size={20} weight="duotone" />
              <span>Censos por horário</span>
            </div>
            <div>
              <FileXls size={20} weight="duotone" />
              <span>Excel oficial</span>
            </div>
          </section>

          <section className="mission section" id="plataforma">
            <span className="eyebrow">Uma rotina, duas formas de trabalhar</span>
            <h2>O censo como operação.<br />Os dados como direção.</h2>
            <p>
              O WayNIR aproxima a agilidade da planilha da segurança de uma
              plataforma: preenchimento simples para quem opera e histórico
              confiável para quem decide.
            </p>
          </section>

          <section className="capability-grid section-tight" aria-label="Fluxo do WayNIR">
            {capabilities.map(({ icon: Icon, step, title, description }) => (
              <article className="capability-card" key={title}>
                <div className="capability-topline">
                  <span className="capability-icon">
                    <Icon size={24} weight="duotone" />
                  </span>
                  <span className="step-number">{step}</span>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </section>

          <section className="feature-split section" id="seguranca">
            <div className="feature-copy">
              <span className="eyebrow">Feito para o plantão real</span>
              <h2>Não é só registrar.<br />É saber o que mudou.</h2>
              <p>
                Cada paciente mantém seu episódio, cada fechamento preserva um
                retrato e cada alteração importante deixa uma trilha clara.
              </p>
              <ul className="feature-list">
                <li>
                  <CheckCircle size={19} weight="fill" />
                  Histórico por paciente, episódio e censo
                </li>
                <li>
                  <CheckCircle size={19} weight="fill" />
                  Reaberturas justificadas e versionadas
                </li>
                <li>
                  <CheckCircle size={19} weight="fill" />
                  Permissões ajustadas por papel e usuário
                </li>
              </ul>
              <button className="text-button" type="button" onClick={openLogin}>
                Entrar no WayNIR
                <ArrowRight size={17} weight="bold" />
              </button>
            </div>

            <div className="feature-visual">
              <Image
                src="/images/waynir-operations.png"
                alt="Profissional do NIR acompanhando o censo em uma estação de trabalho"
                fill
                sizes="(max-width: 800px) 100vw, 48vw"
              />
              <div className="floating-card">
                <span className="floating-label">Censo das 18:30</span>
                <strong>Pronto para revisão</strong>
                <span className="floating-status">
                  <CheckCircle size={15} weight="fill" />
                  32 registros validados
                </span>
              </div>
            </div>
          </section>

          <section className="analytics-band section" id="indicadores">
            <div className="analytics-heading">
              <div>
                <span className="eyebrow dark-eyebrow">Da rotina à leitura do mês</span>
                <h2>Indicadores que mantêm<br />a operação em perspectiva.</h2>
              </div>
              <p>
                Ocupação, permanência, transferências, destino e giro de leitos
                reunidos em uma leitura única e exportável.
              </p>
            </div>

            <div className="indicator-grid">
              {indicators.map((indicator) => (
                <article className="indicator-card" key={indicator.label}>
                  <span className="indicator-value">{indicator.value}</span>
                  <h3>{indicator.label}</h3>
                  <p>{indicator.description}</p>
                </article>
              ))}
            </div>

            <div className="analytics-footnote">
              <SquaresFour size={18} weight="duotone" />
              Visões oficiais usam censos fechados. Rascunhos permanecem na visão operacional.
            </div>
          </section>

          <section className="faq-section section" id="duvidas">
            <div className="faq-heading">
              <span className="eyebrow">Dúvidas frequentes</span>
              <h2>O essencial antes de começar.</h2>
              <p>
                Uma plataforma interna, pensada para manter a rotina simples e
                os dados sob controle da unidade.
              </p>
            </div>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <details key={faq.question} open={index === 0}>
                  <summary>
                    <span>{faq.question}</span>
                    <CaretDown size={18} weight="bold" aria-hidden="true" />
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="final-cta">
            <div className="final-cta-copy">
              <span className="eyebrow light-eyebrow">WayNIR</span>
              <h2>Um censo mais simples.<br />Uma decisão mais segura.</h2>
              <p>
                Entre na plataforma e continue a operação do Núcleo Interno de
                Regulação.
              </p>
              <button className="primary-button light-button" type="button" onClick={openLogin}>
                Acessar plataforma
                <ArrowRight size={17} weight="bold" />
              </button>
            </div>
            <div className="final-cta-image" aria-hidden="true">
              <Image src="/images/waynir-hero.png" alt="" fill sizes="45vw" />
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <a className="brand footer-brand" href="#inicio">
            <span className="brand-mark" aria-hidden="true">
              <Pulse size={20} weight="bold" />
            </span>
            <span>WayNIR</span>
          </a>
          <p>Operação e inteligência para o Núcleo Interno de Regulação.</p>
          <span>Ambiente interno • Santos, SP</span>
        </footer>
      </div>

      {loginOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setLoginOpen(false)}>
          <section
            className="login-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              type="button"
              aria-label="Fechar acesso"
              onClick={() => setLoginOpen(false)}
            >
              <X size={20} />
            </button>
            <span className="modal-icon" aria-hidden="true">
              <LockKey size={24} weight="duotone" />
            </span>
            <span className="eyebrow">Ambiente interno</span>
            <h2 id="login-title">Acesse o WayNIR</h2>
            <p>Use as credenciais fornecidas pelo administrador da unidade.</p>
            <form onSubmit={submitLogin}>
              <label htmlFor="username">Usuário</label>
              <input id="username" name="username" type="text" placeholder="Digite seu usuário" required />
              <label htmlFor="password">Senha</label>
              <input id="password" name="password" type="password" placeholder="Digite sua senha" required />
              <button className="primary-button modal-submit" type="submit">
                Entrar
                <ArrowRight size={17} weight="bold" />
              </button>
            </form>
            {loginFeedback && <div className="login-feedback">{loginFeedback}</div>}
            <span className="modal-help">Problemas de acesso? Procure o gestor do NIR.</span>
          </section>
        </div>
      )}
    </div>
  );
}
