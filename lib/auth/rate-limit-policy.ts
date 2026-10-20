import { createHash } from "node:crypto";

export function normalizeUsername(username: string) {
  return username.normalize("NFKC").trim().toLocaleLowerCase("pt-BR");
}

export function rateLimitKey(username: string, ipAddress: string | null) {
  return createHash("sha256")
    .update(`${normalizeUsername(username)}|${ipAddress ?? "local"}`)
    .digest("hex");
}

export function lockDurationMinutes(failures: number) {
  if (failures >= 7) return 15;
  if (failures >= 5) return 5;
  if (failures >= 3) return 1;
  return 0;
}
