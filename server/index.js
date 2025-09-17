import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.js";            // ESM default export
import { requireAuth } from "./middleware/requireAuth.js";
import jobsRoutes from "./routes/jobs.js";            // if you added jobs; otherwise remove this line

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// routes
app.use("/api/auth", authRoutes);
// comment this next line if you haven't created jobs yet
app.use("/api/jobs", requireAuth, jobsRoutes);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ Server on http://localhost:${PORT}`);
});
