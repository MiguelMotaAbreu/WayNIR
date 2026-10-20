import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Pulse, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { getCurrentUser } from "@/lib/auth/dal";
import { LoginForm } from "./login-form";

async function LoginContent() {
  const user = await getCurrentUser();
  if (user) redirect(user.mustChangePassword ? "/trocar-senha" : "/dashboard");
  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link className="auth-brand" href="/"><span><Pulse size={20} weight="bold" /></span>WayNIR</Link>
        <div className="auth-copy"><span className="auth-eyebrow"><ShieldCheck size={15} weight="fill" /> Ambiente interno protegido</span><h1>Acesse a plataforma</h1><p>Use as credenciais fornecidas pelo administrador da unidade.</p></div>
        <LoginForm />
        <div className="auth-help"><strong>Primeiro acesso?</strong><span>Senhas temporárias precisam ser alteradas antes de entrar na operação.</span></div>
        <Link className="auth-back" href="/">Voltar ao portal WayNIR</Link>
      </section>
      <aside className="auth-context"><div><span className="auth-context-mark"><Pulse size={28} weight="duotone" /></span><h2>Operação protegida.<br />Rastreabilidade desde o acesso.</h2><p>Cada sessão e ação crítica será associada ao usuário responsável.</p></div><small>UPA Santos • Rede interna</small></aside>
    </main>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<main className="auth-page auth-loading">Preparando acesso seguro…</main>}><LoginContent /></Suspense>;
}
