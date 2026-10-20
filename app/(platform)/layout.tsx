import { Suspense } from "react";
import { PlatformShell } from "@/components/platform-shell";
import { requireUser } from "@/lib/auth/dal";
import { sessionIdleMinutes } from "@/lib/auth/session";

async function AuthenticatedPlatform({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return <PlatformShell user={user} idleMinutes={sessionIdleMinutes()}>{children}</PlatformShell>;
}

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="platform-auth-loading">Validando acesso seguro…</div>}><AuthenticatedPlatform>{children}</AuthenticatedPlatform></Suspense>;
}
