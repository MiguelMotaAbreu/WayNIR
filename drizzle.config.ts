import { defineConfig } from "drizzle-kit";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://waynir:waynir_dev_only@localhost:5432/waynir",
  },
  migrations: {
    prefix: "timestamp",
  },
  strict: true,
  verbose: true,
});
