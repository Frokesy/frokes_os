import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let database: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
  if (database) return database;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured.");

  // prepare:false supports transaction-pool connections used by common hosts.
  const client = postgres(url, { prepare: false, max: 5 });
  database = drizzle(client, { schema });
  return database;
}
