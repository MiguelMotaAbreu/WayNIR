export const permissionDefinitions = [
  ["dashboard.view", "Visualizar dashboard", "Acessar a visão operacional principal."],
  ["analytics.view", "Visualizar análises", "Consultar gráficos e indicadores analíticos."],
  ["analytics.export", "Exportar análises", "Exportar gráficos e tabelas analíticas."],
  ["census.view", "Visualizar censos", "Consultar o censo atual e históricos."],
  ["census.edit", "Editar censos", "Criar e alterar rascunhos de censo."],
  ["census.close", "Fechar censos", "Concluir um censo após validação."],
  ["census.reopen", "Reabrir censos", "Reabrir versões fechadas com justificativa."],
  ["patients.view", "Visualizar pacientes", "Consultar pessoas e episódios permitidos."],
  ["patients.view_identified", "Visualizar dados identificados", "Acessar informações identificáveis de pacientes."],
  ["movements.view", "Visualizar movimentações", "Consultar eventos dos episódios."],
  ["movements.manage", "Gerenciar movimentações", "Registrar e corrigir eventos operacionais."],
  ["imports.manage", "Gerenciar importações", "Executar e revisar importações homologadas."],
  ["exports.identified", "Exportar dados identificados", "Gerar arquivos contendo dados identificáveis."],
  ["audit.view", "Visualizar auditoria", "Consultar a trilha de auditoria permitida."],
  ["settings.manage", "Gerenciar configurações", "Alterar parâmetros operacionais delegados."],
  ["users.manage", "Gerenciar usuários", "Criar usuários e alterar acessos."],
  ["system.health", "Visualizar saúde do sistema", "Consultar o estado técnico do ambiente."],
] as const;

export type PermissionKey = (typeof permissionDefinitions)[number][0];
export type RoleKey = "operator" | "manager" | "administrator";

export const roleDefinitions: Record<RoleKey, { name: string; description: string; permissions: PermissionKey[] }> = {
  operator: {
    name: "Operador",
    description: "Executa o registro e a atualização da operação do NIR.",
    permissions: [
      "dashboard.view",
      "census.view",
      "census.edit",
      "patients.view",
      "patients.view_identified",
      "movements.view",
      "movements.manage",
    ],
  },
  manager: {
    name: "Gestor",
    description: "Supervisiona censos, análises, importações e auditoria operacional.",
    permissions: [
      "dashboard.view",
      "analytics.view",
      "analytics.export",
      "census.view",
      "census.edit",
      "census.close",
      "census.reopen",
      "patients.view",
      "patients.view_identified",
      "movements.view",
      "movements.manage",
      "imports.manage",
      "exports.identified",
      "audit.view",
      "settings.manage",
    ],
  },
  administrator: {
    name: "Administrador",
    description: "Administra usuários, configurações e a saúde técnica do WayNIR.",
    permissions: [
      "dashboard.view",
      "analytics.view",
      "audit.view",
      "settings.manage",
      "users.manage",
      "system.health",
    ],
  },
};

export function isPermissionKey(value: string): value is PermissionKey {
  return permissionDefinitions.some(([key]) => key === value);
}

export function hasPermission(permissions: readonly string[], permission: PermissionKey) {
  return permissions.includes(permission);
}
