import Link from "next/link";
import { ArrowLeft, ShieldWarning } from "@phosphor-icons/react/dist/ssr";

export default function AccessDeniedPage() {
  return <section className="access-denied panel"><span><ShieldWarning size={31} weight="duotone" /></span><p className="panel-kicker">Permissão insuficiente</p><h1>Este conteúdo não está disponível para o seu perfil.</h1><p>O acesso direto também é validado no servidor. Caso precise desta função, solicite a revisão das suas permissões ao gestor responsável.</p><Link className="button primary-action" href="/dashboard"><ArrowLeft size={16} /> Voltar à visão geral</Link></section>;
}
