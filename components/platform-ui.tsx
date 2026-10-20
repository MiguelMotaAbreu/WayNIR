"use client";

import { Check, Info, X } from "@phosphor-icons/react";

export function PageHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <section className="page-heading">
      <div>
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions && <div className="page-heading-actions">{actions}</div>}
    </section>
  );
}

export function StatusPill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "positive" | "warning" | "danger" | "info" | "neutral" }) {
  return <span className={`status-pill ${tone}`}>{children}</span>;
}

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  if (!message) return null;
  return (
    <div className="demo-toast" role="status">
      <span><Check size={16} weight="bold" /></span>
      <div><strong>Ação simulada</strong><small>{message}</small></div>
      <button type="button" aria-label="Fechar mensagem" onClick={onClose}><X size={16} /></button>
    </div>
  );
}

export function PrototypeNotice() {
  return (
    <div className="prototype-notice">
      <Info size={16} weight="fill" />
      <span>Protótipo frontend: dados fictícios, sem persistência ou integração com banco.</span>
    </div>
  );
}

export function MetricCard({ label, value, detail, tone = "blue", icon }: { label: string; value: string; detail: string; tone?: "blue" | "green" | "amber" | "purple"; icon: React.ReactNode }) {
  return (
    <article className={`metric-card ${tone}`}>
      <div className="metric-card-top"><span>{label}</span><i>{icon}</i></div>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}
