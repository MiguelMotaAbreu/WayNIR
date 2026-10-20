import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Database = ReturnType<typeof drizzle<typeof schema>>;

const globalForDatabase = globalThis as unknown as {
  waynirSql?: ReturnType<typeof postgres>;
  waynirDb?: Database;
};

export function getDatabase(): Database {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL não está configurada.");
  }

  if (!globalForDatabase.waynirSql) {
    globalForDatabase.waynirSql = postgres(databaseUrl, {
      max: process.env.NODE_ENV === "production" ? 10 : 3,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
    });
  }

  if (!globalForDatabase.waynirDb) {
    globalForDatabase.waynirDb = drizzle(globalForDatabase.waynirSql, { schema });
  }

  return globalForDatabase.waynirDb;
}

export async function closeDatabase() {
  await globalForDatabase.waynirSql?.end({ timeout: 5 });
  delete globalForDatabase.waynirSql;
  delete globalForDatabase.waynirDb;
}
