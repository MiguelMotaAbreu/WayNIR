import { requirePermission } from "@/lib/auth/dal";
import type { PermissionKey } from "@/lib/auth/permissions";

export async function PermissionBoundary({ permission, children }: { permission: PermissionKey; children: React.ReactNode }) {
  await requirePermission(permission);
  return children;
}
