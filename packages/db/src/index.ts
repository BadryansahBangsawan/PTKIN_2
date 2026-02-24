import { env } from "@uin-samata/env/server";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

const rawConnectionString = env.DATABASE_URL;
const usesSupabasePooler = /pooler\.supabase\.com/i.test(rawConnectionString);
const connectionUrl = new URL(rawConnectionString);

// `pg` treats ssl-related URL params as higher priority than the `ssl` option object.
// Strip `sslmode` for Supabase pooler so our custom TLS config is applied on Vercel.
if (usesSupabasePooler) {
  connectionUrl.searchParams.delete("sslmode");
}

const pool = new Pool({
  connectionString: connectionUrl.toString(),
  // Supabase pooler can present a chain that Node rejects on some runtimes (e.g. Vercel).
  ...(usesSupabasePooler ? { ssl: { rejectUnauthorized: false } } : {}),
});

export const db = drizzle(pool, { schema });
export * from "./schema";
