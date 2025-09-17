import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function AuthPage() {
  const [mode, setMode] = useState("signup"); // "signup" | "login"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "signup") {
        await api.post("/auth/signup", form);
      } else {
        await api.post("/auth/login", { email: form.email, password: form.password });
      }
      navigate("/dashboard");
    } catch (err) {
      const server = err?.response?.data;
      console.error("AUTH ERROR:", server || err);
      setError(
        server?.msg ||
        server?.error ||
        (typeof server === "string" ? server : "") ||
        err.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-6">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>

          <form className="space-y-4" onSubmit={onSubmit}>
            {mode === "signup" && (
              <div>
                <label className="block text-sm text-gray-700 mb-1" htmlFor="name">Full name</label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Jane Doe"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-700 mb-1" htmlFor="email">Email</label>
              <input
                id="email"
                type={mode === "signup" ? "email" : "text"}
                name="email"
                value={form.email}
                onChange={onChange}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="jane@company.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Toggle ABOVE submit; force visible colors */}
            {mode === "signup" ? (
              <button
                type="button"
                onClick={() => setMode("login")}
                className="w-full rounded-lg border border-neutral-300 !bg-white !text-gray-900 py-2.5 font-medium hover:bg-neutral-50"
              >
                Log in instead
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="w-full rounded-lg border border-neutral-300 !bg-white !text-gray-900 py-2.5 font-medium hover:bg-neutral-50"
              >
                Create an account instead
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 text-white py-2.5 font-medium hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60"
            >
              {loading ? "Please wait..." : mode === "signup" ? "Sign up" : "Log in"}
            </button>

            {error && (
              <p className="text-center text-sm text-red-600">
                {error}
              </p>
            )}
          </form>

          <p className="text-center text-xs text-gray-500 mt-4">
            By continuing you agree to our Terms & Privacy Policy.
          </p>
        </div>

        <p className="text-center text-sm text-gray-200 mt-4">
          Job Application Tracker
        </p>
      </div>
    </div>
  );
}
