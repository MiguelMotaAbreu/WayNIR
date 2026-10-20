import { and, eq } from "drizzle-orm";
import { loadEnvConfig } from "@next/env";
import { hashPassword, passwordSchema } from "../lib/auth/password";
import { permissionDefinitions, roleDefinitions, type RoleKey } from "../lib/auth/permissions";
import { normalizeUsername } from "../lib/auth/rate-limit-policy";
import { closeDatabase, getDatabase } from "../lib/db/client";
import { organizations, permissions, rolePermissions, roles, units, users } from "../lib/db/schema";

loadEnvConfig(process.cwd());

async function seed() {
  const adminUsername = process.env.ADMIN_USERNAME ?? "admin";
  const adminDisplayName = process.env.ADMIN_DISPLAY_NAME ?? "Administrador WayNIR";
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;
  if (!adminPassword) throw new Error("Defina ADMIN_INITIAL_PASSWORD antes de executar o seed.");
  const passwordCheck = passwordSchema.safeParse(adminPassword);
  if (!passwordCheck.success) throw new Error(`A senha inicial não atende à política: ${passwordCheck.error.issues.map((issue) => issue.message).join(" ")}`);

  const db = getDatabase();

  let [organization] = await db.select().from(organizations).where(eq(organizations.name, "Prefeitura de Santos")).limit(1);
  if (!organization) [organization] = await db.insert(organizations).values({ name: "Prefeitura de Santos" }).returning();

  let [unit] = await db.select().from(units).where(and(eq(units.organizationId, organization.id), eq(units.name, "UPA Santos"))).limit(1);
  if (!unit) [unit] = await db.insert(units).values({ organizationId: organization.id, name: "UPA Santos", city: "Santos" }).returning();

  const roleIds = new Map<RoleKey, string>();
  for (const [key, definition] of Object.entries(roleDefinitions) as Array<[RoleKey, (typeof roleDefinitions)[RoleKey]]>) {
    const [role] = await db.insert(roles).values({ key, name: definition.name, description: definition.description }).onConflictDoUpdate({ target: roles.key, set: { name: definition.name, description: definition.description, updatedAt: new Date() } }).returning();
    roleIds.set(key, role.id);
  }

  const permissionIds = new Map<string, string>();
  for (const [key, name, description] of permissionDefinitions) {
    const [permission] = await db.insert(permissions).values({ key, name, description }).onConflictDoUpdate({ target: permissions.key, set: { name, description, updatedAt: new Date() } }).returning();
    permissionIds.set(key, permission.id);
  }

  for (const [roleKey, definition] of Object.entries(roleDefinitions) as Array<[RoleKey, (typeof roleDefinitions)[RoleKey]]>) {
    const roleId = roleIds.get(roleKey)!;
    await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));
    await db.insert(rolePermissions).values(definition.permissions.map((permission) => ({ roleId, permissionId: permissionIds.get(permission)! })));
  }

  const usernameNormalized = normalizeUsername(adminUsername);
  const [existingAdmin] = await db.select({ id: users.id }).from(users).where(eq(users.usernameNormalized, usernameNormalized)).limit(1);
  if (!existingAdmin) {
    await db.insert(users).values({
      unitId: unit.id,
      roleId: roleIds.get("administrator")!,
      username: adminUsername.trim(),
      usernameNormalized,
      displayName: adminDisplayName.trim(),
      passwordHash: await hashPassword(adminPassword),
      mustChangePassword: true,
    });
    process.stdout.write(`Administrador inicial criado: ${adminUsername}\n`);
  } else {
    process.stdout.write(`Administrador inicial já existe: ${adminUsername}\n`);
  }
}

seed()
  .catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; })
  .finally(closeDatabase);
