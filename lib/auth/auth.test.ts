import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { passwordSchema } from "./password";
import { hasPermission, roleDefinitions } from "./permissions";
import { lockDurationMinutes, normalizeUsername, rateLimitKey } from "./rate-limit-policy";

describe("política de autenticação", () => {
  it("normaliza o nome de usuário sem alterar a exibição original", () => {
    assert.equal(normalizeUsername("  Gestor.NIR  "), "gestor.nir");
  });

  it("usa uma chave opaca para limitar tentativas", () => {
    const key = rateLimitKey("gestor.nir", "10.0.0.10");
    assert.match(key, /^[a-f0-9]{64}$/);
    assert.equal(key.includes("gestor"), false);
  });

  it("aplica bloqueio progressivo", () => {
    assert.equal(lockDurationMinutes(2), 0);
    assert.equal(lockDurationMinutes(3), 1);
    assert.equal(lockDurationMinutes(5), 5);
    assert.equal(lockDurationMinutes(7), 15);
  });

  it("rejeita senhas fracas e aceita uma senha forte", () => {
    assert.equal(passwordSchema.safeParse("senha123").success, false);
    assert.equal(passwordSchema.safeParse("WayNIR-Segura!2026").success, true);
  });

  it("mantém o administrador sem acesso clínico por padrão", () => {
    assert.equal(hasPermission(roleDefinitions.administrator.permissions, "users.manage"), true);
    assert.equal(hasPermission(roleDefinitions.administrator.permissions, "patients.view_identified"), false);
  });
});
