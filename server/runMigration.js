import { readFileSync, readdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { pool } from "./db.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const dir = path.join(__dirname, "migrations");
  const files = readdirSync(dir).filter(f => f.endsWith(".sql")).sort();
  console.log(`Found ${files.length} migration(s).`);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const f of files) {
      const sql = readFileSync(path.join(dir, f), "utf8");
      console.log(`→ applying ${f}`);
      await client.query(sql);
    }
    await client.query("COMMIT");
    console.log("✅ Migrations complete.");
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("❌ Migration failed:", e.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

run();
