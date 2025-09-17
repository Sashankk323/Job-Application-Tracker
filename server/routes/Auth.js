// server/routes/auth.js
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../db.js";

const router = Router();
const isDev = process.env.NODE_ENV !== "production";

function setAuthCookie(res, token) {
  res.cookie(process.env.COOKIE_NAME || "jt_auth", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // set true in production behind HTTPS
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
}

async function getUserByEmail(email) {
  const { rows } = await query("SELECT * FROM users WHERE email=$1", [email]);
  return rows[0];
}

async function getUserById(id) {
  const { rows } = await query("SELECT id, name, email FROM users WHERE id=$1", [id]);
  return rows[0];
}

async function insertUser({ name, email, passwordHash }) {
  const { rows } = await query(
    "INSERT INTO users (name, email, password_hash) VALUES ($1,$2,$3) RETURNING id, name, email",
    [name, email, passwordHash]
  );
  return rows[0];
}

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Missing name, email, or password" });
    }

    const exists = await getUserByEmail(email);
    if (exists) return res.status(409).json({ msg: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await insertUser({ name, email, passwordHash });

    const token = jwt.sign({ uid: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    setAuthCookie(res, token);

    res.status(201).json({ user });
  } catch (err) {
    console.error("AUTH ROUTE ERROR:", err);           // <-- add this
  return res.status(500).json({ msg: err.message });  // <-- send real message in dev
}
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ msg: "Missing email or password" });

    const user = await getUserByEmail(email);
    if (!user) return res.status(401).json({ msg: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ uid: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    setAuthCookie(res, token);

    res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("AUTH ROUTE ERROR:", err);
    const msg = isDev && err?.message ? err.message : "Server error";
    res.status(500).json({ msg });
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME || "jt_auth");
  res.json({ ok: true });
});

// GET /api/auth/me
router.get("/me", async (req, res) => {
  try {
    const raw = req.cookies?.[process.env.COOKIE_NAME || "jt_auth"];
    if (!raw) return res.status(401).json({ msg: "Not logged in" });

    const payload = jwt.verify(raw, process.env.JWT_SECRET);
    const user = await getUserById(payload.uid);
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ user });
  } catch {
    res.status(401).json({ msg: "Not authorized" });
  }
});

export default router;
