import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { adminLogin } from "@/lib/api";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "Admin Login — Shethara Fashion" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@shetharafashion.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await adminLogin({ email, password });
      localStorage.setItem("shethara_admin_token", res.token);
      localStorage.setItem("shethara_admin_user", JSON.stringify(res.admin));
      navigate({ to: "/admin" });
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail("admin@shetharafashion.com");
    setPassword("admin123");
  };

  return (
    <div className="min-h-screen w-full bg-[#0F1718] text-white grid place-items-center relative overflow-hidden px-4">
      {/* Background glowing emerald spheres */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[var(--forest)]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[var(--mint)]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#142022]/90 border border-white/15 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative z-10">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-[var(--forest)]/30 border border-[var(--forest)]/60 grid place-items-center text-[var(--mint)] mb-6 shadow-lg shadow-[var(--forest)]/20">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-[var(--mint)] font-semibold block">Restricted Access</span>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white">Shethara Luxe Portal</h1>
          <p className="mt-2 text-sm text-white/60">Log in to manage catalog, orders & customer inquiries</p>
        </div>

        {error && (
          <div className="mt-6 p-4 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-white/60 font-medium mb-2">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@shetharafashion.com"
                className="w-full rounded-2xl bg-white/5 border border-white/15 pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:border-[var(--mint)] outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-white/60 font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl bg-white/5 border border-white/15 pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:border-[var(--mint)] outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-[var(--forest)] to-[var(--mint)] text-[#0F1718] font-bold text-sm tracking-wide uppercase flex items-center justify-center gap-2 shadow-lg shadow-[var(--forest)]/30 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin text-[#0F1718]" /> : null}
            <span>{loading ? "Authenticating..." : "Enter Portal"}</span>
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <button
            type="button"
            onClick={handleDemoFill}
            className="inline-flex items-center gap-1.5 text-xs text-[var(--mint)] hover:underline font-medium"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Use Demo Admin Credentials (admin@shetharafashion.com / admin123)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
