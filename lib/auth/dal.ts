import "server-only";

import { cache } from "react";
import { and, eq, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/db/client";
import {
  permissions,
  rolePermissions,
  roles,
  sessions,
  units,
  userPermissionOverrides,
  users,
} from "@/lib/db/schema";
import { isPermissionKey, type PermissionKey, type RoleKey } from "./permissions";
import { getSessionToken, hashSessionToken } from "./session";

export type AuthenticatedUser = {
  id: string;
  username: string;
  displayName: string;
  roleKey: RoleKey;
  roleName: string;
  unitId: string;
  unitName: string;
  mustChangePassword: boolean;
  permissions: PermissionKey[];
};

export const getCurrentUser = cache(async (): Promise<AuthenticatedUser | null> => {
  const token = await getSessionToken();
  if (!token) return null;

  try {
    const db = getDatabase();
    const [row] = await db
      .select({
        sessionId: sessions.id,
        expiresAt: sessions.expiresAt,
        absoluteExpiresAt: sessions.absoluteExpiresAt,
        userId: users.id,
        username: users.username,
        displayName: users.displayName,
        mustChangePassword: users.mustChangePassword,
        active: users.active,
        roleId: roles.id,
        roleKey: roles.key,
        roleName: roles.name,
        unitId: units.id,
        unitName: units.name,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .innerJoin(roles, eq(users.roleId, roles.id))
      .innerJoin(units, eq(users.unitId, units.id))
      .where(and(eq(sessions.tokenHash, hashSessionToken(token)), isNull(sessions.revokedAt)))
      .limit(1);

    const now = new Date();
    if (!row || !row.active || row.expiresAt <= now || row.absoluteExpiresAt <= now) return null;

    const [roleRows, overrideRows] = await Promise.all([
      db
        .select({ key: permissions.key })
        .from(rolePermissions)
        .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
        .where(eq(rolePermissions.roleId, row.roleId)),
      db
        .select({ key: permissions.key, allowed: userPermissionOverrides.allowed })
        .from(userPermissionOverrides)
        .innerJoin(permissions, eq(userPermissionOverrides.permissionId, permissions.id))
        .where(eq(userPermissionOverrides.userId, row.userId)),
    ]);

    const resolved = new Set(roleRows.map(({ key }) => key).filter(isPermissionKey));
    for (const override of overrideRows) {
      if (!isPermissionKey(override.key)) continue;
      if (override.allowed) resolved.add(override.key);
      else resolved.delete(override.key);
    }

    return {
      id: row.userId,
      username: row.username,
      displayName: row.displayName,
      roleKey: row.roleKey as RoleKey,
      roleName: row.roleName,
      unitId: row.unitId,
      unitName: row.unitName,
      mustChangePassword: row.mustChangePassword,
      permissions: [...resolved],
    };
  } catch (error) {
    console.error("Falha ao validar sessão do WayNIR.", error);
    return null;
  }
});

export async function requireUser(options: { allowPasswordChange?: boolean } = {}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.mustChangePassword && !options.allowPasswordChange) redirect("/trocar-senha");
  return user;
}

export async function requirePermission(permission: PermissionKey) {
  const user = await requireUser();
  if (!user.permissions.includes(permission)) redirect("/acesso-negado");
  return user;
}
