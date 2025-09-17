import { useAuth } from "../auth/AuthContext";

export default function AppHeader({ user }) {
  const { logout } = useAuth();
  return (
    <header className="bg-white border-b">
      <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Job Application Tracker</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">{user?.name} · {user?.email}</span>
          <button onClick={logout} className="px-3 py-1 rounded bg-black text-white text-sm">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
