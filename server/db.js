// server/db.js
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();


const connectionString =
  process.env.DATABASE_URL ||
  `postgres://${process.env.PGUSER || "postgres"}:${process.env.PGPASSWORD || ""}` +
    `@${process.env.PGHOST || "127.0.0.1"}:${process.env.PGPORT || "5432"}/${process.env.PGDATABASE || "job_tracker"}`;

export const pool = new Pool({
  connectionString,
  // If you use Neon/Supabase/etc. over SSL, uncomment:
  // ssl: { rejectUnauthorized: false },
});

export const query = (text, params) => pool.query(text, params);

// Optional: simple health check you can call once at boot
export async function assertDb() {
  const { rows } = await query("SELECT 1 as ok");
  if (!rows?.length) throw new Error("DB connection failed");
  console.log("✅ DB connected");
}
