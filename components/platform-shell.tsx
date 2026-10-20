"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CaretDown,
  ChartBar,
  ChartLineUp,
  ClipboardText,
  ClockCounterClockwise,
  GearSix,
  House,
  List,
  MagnifyingGlass,
  Pulse,
  SignOut,
  SlidersHorizontal,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import { useState } from "react";

const navigation = [
  { href: "/dashboard", label: "Visão geral", icon: House },
  { href: "/analises", label: "Análises", icon: ChartBar },
  { href: "/censos", label: "Censos", icon: ClipboardText },
  { href: "/pacientes", label: "Pacientes", icon: UsersThree },
  { href: "/movimentacoes", label: "Movimentações", icon: ClockCounterClockwise },
  { href: "/importacoes", label: "Importar e exportar", icon: ChartLineUp },
];

const management = [
  { href: "/auditoria", label: "Auditoria", icon: SlidersHorizontal },
  { href: "/configuracoes", label: "Configurações", icon: GearSix },
];

const pageNames: Record<string, string> = {
  "/dashboard": "Visão geral",
  "/analises": "Análises",
  "/censos": "Censos",
  "/pacientes": "Pacientes",
  "/movimentacoes": "Movimentações",
  "/importacoes": "Importar e exportar",
  "/auditoria": "Auditoria",
  "/configuracoes": "Configurações",
};

export function PlatformShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="platform-root">
      <aside className={`platform-sidebar ${mobileOpen ? "is-open" : ""}`}>
        <div className="platform-brand-row">
          <Link className="platform-brand" href="/" aria-label="WayNIR — voltar à landing page">
            <span className="platform-brand-mark"><Pulse size={18} weight="bold" /></span>
            <span>WayNIR</span>
          </Link>
          <button className="sidebar-close" type="button" aria-label="Fechar menu" onClick={() => setMobileOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="unit-label">
          <span>Unidade ativa</span>
          <strong>UPA Santos</strong>
        </div>

        <nav className="platform-nav" aria-label="Navegação da plataforma">
          <span className="nav-caption">Operação</span>
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link
              className={pathname === href ? "active" : ""}
              href={href}
              key={href}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={18} weight={pathname === href ? "fill" : "regular"} />
              <span>{label}</span>
              {href === "/censos" && <small>1</small>}
            </Link>
          ))}
          <span className="nav-caption nav-caption-spaced">Gestão</span>
          {management.map(({ href, label, icon: Icon }) => (
            <Link
              className={pathname === href ? "active" : ""}
              href={href}
              key={href}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={18} weight={pathname === href ? "fill" : "regular"} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-status">
          <span className="status-live-dot" />
          <div><strong>Sistema operacional</strong><small>Frontend demonstrativo</small></div>
        </div>

        <div className="sidebar-profile">
          <span className="profile-avatar">MC</span>
          <div><strong>Mariana Costa</strong><small>Gestora do NIR</small></div>
          <CaretDown size={14} />
        </div>
      </aside>

      {mobileOpen && <button className="sidebar-scrim" aria-label="Fechar menu" onClick={() => setMobileOpen(false)} />}

      <div className="platform-main">
        <header className="platform-topbar">
          <div className="topbar-leading">
            <button className="mobile-sidebar-trigger" type="button" aria-label="Abrir menu" onClick={() => setMobileOpen(true)}>
              <List size={22} />
            </button>
            <div>
              <span className="topbar-kicker">Núcleo Interno de Regulação</span>
              <strong>{pageNames[pathname] ?? "WayNIR"}</strong>
            </div>
          </div>

          <div className="topbar-actions">
            <label className="global-search">
              <MagnifyingGlass size={17} />
              <input type="search" aria-label="Buscar na plataforma" placeholder="Buscar atendimento..." />
              <kbd>Ctrl K</kbd>
            </label>
            <div className="notification-wrap">
              <button className="icon-button" type="button" aria-label="Notificações" onClick={() => setNotificationsOpen((open) => !open)}>
                <Bell size={19} />
                <span className="notification-dot" />
              </button>
              {notificationsOpen && (
                <div className="notification-popover">
                  <strong>Central de atenção</strong>
                  <p>O censo das 06:30 possui 2 campos pendentes de revisão.</p>
                  <Link href="/censos" onClick={() => setNotificationsOpen(false)}>Revisar censo</Link>
                </div>
              )}
            </div>
            <Link className="icon-button" href="/" aria-label="Sair da demonstração" title="Voltar à landing page">
              <SignOut size={19} />
            </Link>
          </div>
        </header>

        <main className="platform-content">{children}</main>
      </div>
    </div>
  );
}
