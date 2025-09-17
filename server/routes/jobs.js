import { Router } from "express";
import { query } from "../db.js";

const router = Router();

// Helpers
async function listJobs(userId) {
  const { rows } = await query(
    "SELECT * FROM jobs WHERE user_id=$1 ORDER BY created_at DESC",
    [userId]
  );
  return rows;
}

async function createJob(userId, job) {
  const { title, company, status, link, source, deadline, notes } = job;
  const { rows } = await query(
    `INSERT INTO jobs (user_id, title, company, status, link, source, deadline, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [userId, title, company, status || "Applied", link || null, source || null, deadline || null, notes || null]
  );
  return rows[0];
}

async function updateJob(userId, id, job) {
  // Build dynamic SET clause
  const fields = ["title", "company", "status", "link", "source", "deadline", "notes"];
  const sets = [];
  const vals = [];
  for (const k of fields) {
    if (job[k] !== undefined) {
      sets.push(`${k}=$${sets.length + 3}`); // $1=id, $2=userId, values start at $3
      vals.push(job[k]);
    }
  }
  if (!sets.length) {
    const { rows } = await query("SELECT * FROM jobs WHERE id=$1 AND user_id=$2", [id, userId]);
    return rows[0];
  }
  const sql = `UPDATE jobs SET ${sets.join(", ")} WHERE id=$1 AND user_id=$2 RETURNING *`;
  const { rows } = await query(sql, [id, userId, ...vals]);
  return rows[0];
}

async function deleteJob(userId, id) {
  const { rows } = await query(
    "DELETE FROM jobs WHERE id=$1 AND user_id=$2 RETURNING *",
    [id, userId]
  );
  return rows[0];
}

// Routes
router.get("/", async (req, res) => {
  try {
    const jobs = await listJobs(req.user.id);
    res.json({ jobs });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const required = ["title", "company"];
    for (const k of required) {
      if (!req.body?.[k]) return res.status(400).json({ msg: `Missing ${k}` });
    }
    const job = await createJob(req.user.id, req.body);
    res.status(201).json({ job });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const job = await updateJob(req.user.id, req.params.id, req.body || {});
    if (!job) return res.status(404).json({ msg: "Not found" });
    res.json({ job });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const job = await deleteJob(req.user.id, req.params.id);
    if (!job) return res.status(404).json({ msg: "Not found" });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
