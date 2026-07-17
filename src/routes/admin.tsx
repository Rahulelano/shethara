import { createFileRoute, Outlet, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { LayoutDashboard, ShoppingBag, PackageOpen, MessageSquare, Tags, LogOut, ExternalLink, ShieldCheck, User } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Portal — Shethara Fashion" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("shethara_admin_token");
    const userStr = localStorage.getItem("shethara_admin_user");
    if (!token && window.location.pathname !== "/admin/login") {
      navigate({ to: "/admin/login" });
    } else if (userStr) {
      try {
        setAdminUser(JSON.parse(userStr));
      } catch (e) {
        setAdminUser({ name: "Shethara Admin", email: "admin@shetharafashion.com" });
      }
    } else if (token) {
      setAdminUser({ name: "Shethara Admin", email: "admin@shetharafashion.com" });
    }
  }, [navigate, router.state.location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("shethara_admin_token");
    localStorage.removeItem("shethara_admin_user");
    navigate({ to: "/admin/login" });
  };

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/products", label: "Catalog & Products", icon: ShoppingBag },
    { to: "/admin/orders", label: "Orders Management", icon: PackageOpen },
    { to: "/admin/messages", label: "Customer Inquiries", icon: MessageSquare },
    { to: "/admin/categories", label: "Categories", icon: Tags },
  ];

  if (router.state.location.pathname === "/admin/login") {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-[#0F1718] text-white flex flex-col lg:flex-row font-body selection:bg-[var(--mint)] selection:text-[var(--ink)]">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-[#142022] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-xl bg-[var(--forest)]/30 border border-[var(--forest)] grid place-items-center text-[var(--mint)] group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="font-display text-xl font-bold tracking-wider text-white block leading-none">SHETHARA</span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--mint)] block mt-1 font-semibold">Luxe Admin</span>
              </div>
            </Link>
            <Link
              to="/"
              target="_blank"
              title="Open Storefront"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-[var(--mint)] transition-colors text-xs flex items-center gap-1"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>

          {/* User badge */}
          <div className="p-4 mx-4 mt-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-[var(--mint)]/20 text-[var(--mint)] grid place-items-center font-semibold text-sm">
              <User className="h-4 w-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{adminUser?.name || "Super Admin"}</p>
              <p className="text-[11px] text-white/60 truncate">{adminUser?.email || "admin@shetharafashion.com"}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 mt-2">
            <p className="px-3 py-2 text-[10px] uppercase tracking-widest text-white/40 font-semibold">Main Menu</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: item.exact }}
                  className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all text-white/75 hover:text-white hover:bg-white/5"
                  activeProps={{
                    className: "!bg-[var(--forest)] !text-white font-semibold shadow-lg shadow-[var(--forest)]/25 border border-white/10",
                  }}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 hover:bg-red-500/25 transition-colors text-sm font-medium"
          >
            <LogOut className="h-4 w-4" />
            <span>Secure Log Out</span>
          </button>
          <p className="text-center text-[11px] text-white/30 mt-3">Shethara Luxe v2.0 · MongoDB Atlas</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="p-6 sm:p-10 max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
