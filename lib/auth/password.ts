import { hash, verify } from "@node-rs/argon2";
import { z } from "zod";

const argonPolicy = {
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
  outputLen: 32,
} as const;

export const passwordSchema = z
  .string()
  .min(12, "Use pelo menos 12 caracteres.")
  .max(128, "A senha deve ter no máximo 128 caracteres.")
  .regex(/[a-z]/, "Inclua ao menos uma letra minúscula.")
  .regex(/[A-Z]/, "Inclua ao menos uma letra maiúscula.")
  .regex(/[0-9]/, "Inclua ao menos um número.")
  .regex(/[^A-Za-z0-9]/, "Inclua ao menos um caractere especial.");

export async function hashPassword(password: string) {
  return hash(password, argonPolicy);
}

export async function verifyPassword(passwordHash: string, password: string) {
  try {
    return await verify(passwordHash, password, argonPolicy);
  } catch {
    return false;
  }
}

let dummyHashPromise: Promise<string> | undefined;

export async function verifyAgainstDummyHash(password: string) {
  dummyHashPromise ??= hashPassword("WayNIR-invalid-credential-sentinel!2026");
  return verifyPassword(await dummyHashPromise, password);
}
