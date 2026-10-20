"use client";

import { ArrowRight, LockKey, User } from "@phosphor-icons/react";
import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";
import { initialAuthState } from "@/lib/auth/action-state";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialAuthState);
  return (
    <form action={action} className="auth-form">
      <label htmlFor="username">Usuário</label>
      <div className="auth-input"><User size={17} /><input id="username" name="username" autoComplete="username" placeholder="Seu usuário" required /></div>
      {state.fieldErrors?.username && <span className="auth-field-error">{state.fieldErrors.username[0]}</span>}
      <label htmlFor="password">Senha</label>
      <div className="auth-input"><LockKey size={17} /><input id="password" name="password" type="password" autoComplete="current-password" placeholder="Sua senha" required /></div>
      {state.fieldErrors?.password && <span className="auth-field-error">{state.fieldErrors.password[0]}</span>}
      {state.message && <div className="auth-message error" role="alert">{state.message}</div>}
      <button className="auth-submit" type="submit" disabled={pending}>{pending ? "Verificando..." : "Entrar no WayNIR"}<ArrowRight size={17} /></button>
    </form>
  );
}
