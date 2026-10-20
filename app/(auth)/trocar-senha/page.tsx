import { Suspense } from "react";
import { Pulse, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { requireUser } from "@/lib/auth/dal";
import { ChangePasswordForm } from "./change-password-form";

async function ChangePasswordContent() {
  const user = await requireUser({ allowPasswordChange: true });
  return (
    <main className="auth-page password-page">
      <section className="auth-card">
        <div className="auth-brand"><span><Pulse size={20} weight="bold" /></span>WayNIR</div>
        <div className="auth-copy"><span className="auth-eyebrow"><ShieldCheck size={15} weight="fill" /> Primeiro acesso</span><h1>Proteja sua conta</h1><p>Olá, {user.displayName}. Substitua a senha temporária antes de continuar.</p></div>
        <ChangePasswordForm />
      </section>
      <aside className="auth-context"><div><span className="auth-context-mark"><ShieldCheck size={28} weight="duotone" /></span><h2>Uma senha pessoal.<br />Uma trilha confiável.</h2><p>Nunca compartilhe suas credenciais, mesmo em computadores da unidade.</p></div><small>Sessão protegida • expiração por inatividade</small></aside>
    </main>
  );
}

export default function ChangePasswordPage() {
  return <Suspense fallback={<main className="auth-page auth-loading">Validando sua sessão…</main>}><ChangePasswordContent /></Suspense>;
}
