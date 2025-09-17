import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api"; // your axios instance

function normalizeUrl(url) {
  if (!url) return "";
  try {
    // allow bare domains like "google.com"
    const hasProtocol = /^https?:\/\//i.test(url);
    return hasProtocol ? url : `https://${url}`;
  } catch {
    return "";
  }
}

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    company: "",
    status: "Applied",
    link: "",
    source: "",
    deadline: "",
    notes: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [meRes, jobsRes] = await Promise.all([
          api.get("/auth/me"),
          api.get("/jobs"),
        ]);
        setMe(meRes.data.user);
        setJobs(jobsRes.data.jobs || []);
      } catch (e) {
        setError(e?.response?.data?.msg || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function addJob(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form };
      if (!payload.deadline) payload.deadline = null;
      const res = await api.post("/jobs", payload);
      setJobs((j) => [res.data.job, ...j]);
      setForm({
        title: "",
        company: "",
        status: "Applied",
        link: "",
        source: "",
        deadline: "",
        notes: "",
      });
    } catch (e) {
      setError(e?.response?.data?.msg || e.message);
    } finally {
      setSaving(false);
    }
  }

  async function delJob(id) {
    try {
      await api.delete(`/jobs/${id}`);
      setJobs((j) => j.filter((x) => x.id !== id));
    } catch (e) {
      setError(e?.response?.data?.msg || e.message);
    }
  }

  async function logout() {
    await api.post("/auth/logout");
    window.location.href = "/";
  }

  const statusOptions = useMemo(
    () => ["Applied", "Interview", "Offer", "Rejected", "Ghosted", "Open"],
    []
  );

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-800 text-slate-100 flex justify-center items-start">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Hi {me?.name?.split(" ")[0] || "there"},{" "}
            <span className="text-indigo-300">track your applications</span>
          </h1>

          <button
            onClick={logout}
            className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 hover:border-slate-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white/10 backdrop-blur shadow-2xl ring-1 ring-white/10 p-5 sm:p-6">
          {/* Form */}
          <form onSubmit={addJob} className="grid grid-cols-1 gap-4 sm:grid-cols-12">
            <input
              className="sm:col-span-4 rounded-lg bg-white/90 text-slate-900 px-3 py-2 outline-none ring-1 ring-slate-300 focus:ring-2 focus:ring-indigo-500"
              placeholder="Job title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              className="sm:col-span-4 rounded-lg bg-white/90 text-slate-900 px-3 py-2 outline-none ring-1 ring-slate-300 focus:ring-2 focus:ring-indigo-500"
              placeholder="Company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              required
            />
            <select
              className="sm:col-span-4 rounded-lg bg-white/90 text-slate-900 px-3 py-2 outline-none ring-1 ring-slate-300 focus:ring-2 focus:ring-indigo-500"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <input
              className="sm:col-span-6 rounded-lg bg-white/90 text-slate-900 px-3 py-2 outline-none ring-1 ring-slate-300 focus:ring-2 focus:ring-indigo-500"
              placeholder="Job link (e.g., linkedin.com/job/...)"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
            />
            <input
              className="sm:col-span-6 rounded-lg bg-white/90 text-slate-900 px-3 py-2 outline-none ring-1 ring-slate-300 focus:ring-2 focus:ring-indigo-500"
              placeholder="Source (LinkedIn, referral, company site...)"
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
            />

            {/* Deadline with label + helper */}
            <div className="sm:col-span-4">
              <label className="block text-sm text-slate-200 mb-1">
                Deadline
              </label>
              <input
                type="date"
                className="w-full rounded-lg bg-white/90 text-slate-900 px-3 py-2 outline-none ring-1 ring-slate-300 focus:ring-2 focus:ring-indigo-500"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
              <p className="mt-1 text-xs text-slate-300">
                The date your application is due (optional).
              </p>
            </div>

            <textarea
              className="sm:col-span-8 min-h-[44px] rounded-lg bg-white/90 text-slate-900 px-3 py-2 outline-none ring-1 ring-slate-300 focus:ring-2 focus:ring-indigo-500"
              placeholder="Notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
            />

            <div className="sm:col-span-12">
              <button
                disabled={saving}
                type="submit"
                className="w-full rounded-lg bg-indigo-500 text-white py-2.5 font-semibold hover:bg-indigo-600 active:bg-indigo-700 disabled:opacity-60 transition"
              >
                {saving ? "Saving..." : "Add Job"}
              </button>
            </div>
          </form>

          {error ? (
            <p className="mt-3 text-sm text-rose-300">{error}</p>
          ) : null}

          {/* Table */}
          <div className="mt-6 overflow-hidden rounded-xl ring-1 ring-white/10 bg-white/5">
            <table className="w-full text-left">
              <thead className="bg-white/10 text-slate-200 text-sm">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Deadline</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {jobs.map((j) => {
                  const safeUrl = normalizeUrl(j.link);
                  const hasUrl = Boolean(safeUrl);
                  return (
                    <tr key={j.id} className="text-slate-100/90">
                      <td className="px-4 py-3">{j.title}</td>
                      <td className="px-4 py-3">{j.company}</td>
                      <td className="px-4 py-3">{j.status}</td>
                      <td className="px-4 py-3">
                        {j.deadline ? new Date(j.deadline).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <a
                            href={hasUrl ? safeUrl : undefined}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm font-medium underline-offset-2 ${
                              hasUrl
                                ? "text-indigo-300 hover:underline"
                                : "text-slate-400 cursor-not-allowed"
                            }`}
                            onClick={(e) => {
                              if (!hasUrl) e.preventDefault();
                            }}
                            title={hasUrl ? "Open job posting" : "No link provided"}
                          >
                            Open
                          </a>

                          <button
                            onClick={() => delJob(j.id)}
                            className="rounded-lg bg-rose-500 text-white px-3 py-1.5 text-sm font-medium hover:bg-rose-600 active:bg-rose-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {jobs.length === 0 && !loading && (
                  <tr>
                    <td className="px-4 py-6 text-slate-300" colSpan={5}>
                      No jobs yet — add your first one above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
