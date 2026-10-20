"use client";

import { ArrowRight, Key } from "@phosphor-icons/react";
import { useActionState } from "react";
import { changePasswordAction } from "@/app/actions/auth";
import { initialAuthState } from "@/lib/auth/action-state";

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, initialAuthState);
  return (
    <form action={action} className="auth-form">
      <label htmlFor="currentPassword">Senha temporária atual</label>
      <div className="auth-input"><Key size={17} /><input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" required /></div>
      {state.fieldErrors?.currentPassword && <span className="auth-field-error">{state.fieldErrors.currentPassword[0]}</span>}
      <label htmlFor="newPassword">Nova senha</label>
      <div className="auth-input"><Key size={17} /><input id="newPassword" name="newPassword" type="password" autoComplete="new-password" required /></div>
      {state.fieldErrors?.newPassword && <span className="auth-field-error">{state.fieldErrors.newPassword[0]}</span>}
      <label htmlFor="confirmPassword">Confirme a nova senha</label>
      <div className="auth-input"><Key size={17} /><input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required /></div>
      {state.fieldErrors?.confirmPassword && <span className="auth-field-error">{state.fieldErrors.confirmPassword[0]}</span>}
      <ul className="password-rules"><li>12 ou mais caracteres</li><li>Maiúscula, minúscula e número</li><li>Ao menos um caractere especial</li></ul>
      {state.message && <div className="auth-message error" role="alert">{state.message}</div>}
      <button className="auth-submit" type="submit" disabled={pending}>{pending ? "Atualizando..." : "Definir nova senha"}<ArrowRight size={17} /></button>
    </form>
  );
}
