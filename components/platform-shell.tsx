"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { useEffect, useRef, useState } from "react";
import { logoutAction } from "@/app/actions/auth";
import type { AuthenticatedUser } from "@/lib/auth/dal";
import type { PermissionKey } from "@/lib/auth/permissions";

type NavItem = {
  href: string;
  label: string;
  icon: typeof House;
  permission: PermissionKey;
};

const navigation: NavItem[] = [
  { href: "/dashboard", label: "Visão geral", icon: House, permission: "dashboard.view" },
  { href: "/analises", label: "Análises", icon: ChartBar, permission: "analytics.view" },
  { href: "/censos", label: "Censos", icon: ClipboardText, permission: "census.view" },
  { href: "/pacientes", label: "Pacientes", icon: UsersThree, permission: "patients.view" },
  { href: "/movimentacoes", label: "Movimentações", icon: ClockCounterClockwise, permission: "movements.view" },
  { href: "/importacoes", label: "Importar e exportar", icon: ChartLineUp, permission: "imports.manage" },
];

const management: NavItem[] = [
  { href: "/auditoria", label: "Auditoria", icon: SlidersHorizontal, permission: "audit.view" },
  { href: "/configuracoes", label: "Configurações", icon: GearSix, permission: "settings.manage" },
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
  "/acesso-negado": "Acesso restrito",
};

export function PlatformShell({ children, user, idleMinutes }: { children: React.ReactNode; user: AuthenticatedUser; idleMinutes: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const lastActivityRef = useRef(0);
  const lastSyncedActivityRef = useRef(0);
  const heartbeatInFlightRef = useRef(false);
  const initials = user.displayName.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  useEffect(() => {
    const idleMs = idleMinutes * 60 * 1000;

    function registerActivity() {
      lastActivityRef.current = Date.now();
    }

    async function heartbeat() {
      const now = Date.now();
      if (now - lastActivityRef.current >= idleMs) {
        router.replace("/login?reason=expired");
        return;
      }
      if (heartbeatInFlightRef.current || lastSyncedActivityRef.current >= lastActivityRef.current) return;

      heartbeatInFlightRef.current = true;
      try {
        const response = await fetch("/api/session/heartbeat", { method: "POST", cache: "no-store" });
        if (response.status === 401) {
          router.replace("/login?reason=expired");
          return;
        }
        if (response.ok) lastSyncedActivityRef.current = lastActivityRef.current;
      } catch {
        // Uma falha de rede não encerra imediatamente a sessão local.
      } finally {
        heartbeatInFlightRef.current = false;
      }
    }

    function resumeSession() {
      registerActivity();
      void heartbeat();
    }

    registerActivity();
    void heartbeat();
    const interval = window.setInterval(heartbeat, 60 * 1000);
    const activityEvents: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "mousemove", "touchstart", "scroll"];
    for (const event of activityEvents) window.addEventListener(event, registerActivity, { passive: true });
    window.addEventListener("focus", resumeSession);
    return () => {
      window.clearInterval(interval);
      for (const event of activityEvents) window.removeEventListener(event, registerActivity);
      window.removeEventListener("focus", resumeSession);
    };
  }, [idleMinutes, router]);

  return (
    <div className="platform-root">
      <aside className={`platform-sidebar ${mobileOpen ? "is-open" : ""}`}>
        <div className="platform-brand-row">
          <Link className="platform-brand" href="/" aria-label="WayNIR — voltar à landing page">
            <span className="platform-brand-mark"><Pulse size={18} weight="bold" /></span>
            <span>WayNIR</span>
          </Link>
          <button className="sidebar-close" type="button" aria-label="Fechar menu" onClick={() => setMobileOpen(false)}><X size={20} /></button>
        </div>

        <div className="unit-label"><span>Unidade ativa</span><strong>{user.unitName}</strong></div>

        <nav className="platform-nav" aria-label="Navegação da plataforma">
          <span className="nav-caption">Operação</span>
          {navigation.filter((item) => user.permissions.includes(item.permission)).map(({ href, label, icon: Icon }) => (
            <Link className={pathname === href ? "active" : ""} href={href} key={href} onClick={() => setMobileOpen(false)}>
              <Icon size={18} weight={pathname === href ? "fill" : "regular"} /><span>{label}</span>{href === "/censos" && <small>1</small>}
            </Link>
          ))}
          {management.some((item) => user.permissions.includes(item.permission)) && <span className="nav-caption nav-caption-spaced">Gestão</span>}
          {management.filter((item) => user.permissions.includes(item.permission)).map(({ href, label, icon: Icon }) => (
            <Link className={pathname === href ? "active" : ""} href={href} key={href} onClick={() => setMobileOpen(false)}><Icon size={18} weight={pathname === href ? "fill" : "regular"} /><span>{label}</span></Link>
          ))}
        </nav>

        <div className="sidebar-status"><span className="status-live-dot" /><div><strong>Sessão protegida</strong><small>Expira após {idleMinutes} min inativa</small></div></div>
        <div className="sidebar-profile"><span className="profile-avatar">{initials}</span><div><strong>{user.displayName}</strong><small>{user.roleName}</small></div><CaretDown size={14} /></div>
      </aside>

      {mobileOpen && <button className="sidebar-scrim" aria-label="Fechar menu" onClick={() => setMobileOpen(false)} />}

      <div className="platform-main">
        <header className="platform-topbar">
          <div className="topbar-leading"><button className="mobile-sidebar-trigger" type="button" aria-label="Abrir menu" onClick={() => setMobileOpen(true)}><List size={22} /></button><div><span className="topbar-kicker">Núcleo Interno de Regulação</span><strong>{pageNames[pathname] ?? "WayNIR"}</strong></div></div>
          <div className="topbar-actions">
            <label className="global-search"><MagnifyingGlass size={17} /><input type="search" aria-label="Buscar na plataforma" placeholder="Buscar atendimento..." /><kbd>Ctrl K</kbd></label>
            <div className="notification-wrap"><button className="icon-button" type="button" aria-label="Notificações" onClick={() => setNotificationsOpen((open) => !open)}><Bell size={19} /><span className="notification-dot" /></button>{notificationsOpen && <div className="notification-popover"><strong>Central de atenção</strong><p>O censo das 06:30 possui 2 campos pendentes de revisão.</p><Link href="/censos" onClick={() => setNotificationsOpen(false)}>Revisar censo</Link></div>}</div>
            <form action={logoutAction}><button className="icon-button" type="submit" aria-label="Encerrar sessão" title="Encerrar sessão"><SignOut size={19} /></button></form>
          </div>
        </header>
        <main className="platform-content">{children}</main>
      </div>
    </div>
  );
}
