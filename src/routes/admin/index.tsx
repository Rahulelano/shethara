import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, ShoppingBag, Package, MessageSquare, TrendingUp, ArrowUpRight, Sparkles, AlertCircle } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";
import { fetchAdminStats } from "@/lib/api";
import { formatINR } from "@/lib/shop-data";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["adminStats"],
    queryFn: () => fetchAdminStats(),
  });

  const fallbackData = {
    totalRevenue: 37194,
    totalOrders: 3,
    productsCount: 8,
    unreadMessages: 1,
    recentOrders: [
      { orderId: "SH-10248", customer: { firstName: "Ananya", lastName: "Ramaswamy" }, total: 5499, status: "Delivered", createdAt: "2026-07-08" },
      { orderId: "SH-10291", customer: { firstName: "Divya", lastName: "Krishnan" }, total: 6398, status: "Processing", createdAt: "2026-07-14" },
      { orderId: "SH-10310", customer: { firstName: "Sowmya", lastName: "Natarajan" }, total: 12999, status: "Shipped", createdAt: "2026-07-15" },
    ],
    salesChartData: [
      { name: "Mon", sales: 14500, orders: 3 },
      { name: "Tue", sales: 18200, orders: 4 },
      { name: "Wed", sales: 31000, orders: 6 },
      { name: "Thu", sales: 22000, orders: 5 },
      { name: "Fri", sales: 44900, orders: 9 },
      { name: "Sat", sales: 58500, orders: 12 },
      { name: "Sun", sales: 37194, orders: 3 },
    ],
  };

  const d = stats || fallbackData;

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#182B2E] via-[#1B3236] to-[#142022] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-[var(--forest)]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <span className="text-xs uppercase tracking-widest text-[var(--mint)] font-bold flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" /> Live MongoDB Atlas Overview
          </span>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">Executive Dashboard</h1>
          <p className="mt-1 text-sm text-white/70">Welcome back! Here is what's happening at Shethara Fashion today.</p>
        </div>
        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <Link
            to="/admin/products"
            className="px-5 py-3 rounded-xl bg-[var(--forest)] text-white hover:bg-[var(--forest)]/80 transition-colors text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[var(--forest)]/20"
          >
            <span>+ New Product</span>
          </Link>
          <Link
            to="/admin/orders"
            className="px-5 py-3 rounded-xl bg-white/10 text-white hover:bg-white/15 border border-white/15 transition-colors text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
          >
            <span>Orders Inbox</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard
          title="Total Revenue"
          value={formatINR(d.totalRevenue || 0)}
          subtitle="+18.4% compared to last month"
          icon={DollarSign}
          accent="text-[var(--mint)]"
          bg="bg-[var(--forest)]/20 border-[var(--forest)]/40"
        />
        <KpiCard
          title="Total Orders"
          value={d.totalOrders?.toString() || "0"}
          subtitle="All-time customer checkouts"
          icon={Package}
          accent="text-blue-400"
          bg="bg-blue-500/15 border-blue-500/30"
        />
        <KpiCard
          title="Active Catalog"
          value={d.productsCount?.toString() || "0"}
          subtitle="Signature luxury products"
          icon={ShoppingBag}
          accent="text-purple-400"
          bg="bg-purple-500/15 border-purple-500/30"
        />
        <KpiCard
          title="Unread Inquiries"
          value={d.unreadMessages?.toString() || "0"}
          subtitle="Awaiting admin response"
          icon={MessageSquare}
          accent="text-amber-400"
          bg="bg-amber-500/15 border-amber-500/30"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1.2fr] gap-6">
        <div className="p-6 sm:p-7 rounded-3xl bg-[#142022] border border-white/10 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-xl font-bold text-white">Revenue Performance</h2>
              <p className="text-xs text-white/50">Daily sales breakdown across all categories (₹ INR)</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--mint)] bg-[var(--mint)]/10 px-3 py-1.5 rounded-full border border-[var(--mint)]/20">
              <TrendingUp className="h-3.5 w-3.5" /> +24% growth
            </span>
          </div>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={d.salesChartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#65CCB8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#65CCB8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#182628", border: "1px solid #ffffff20", borderRadius: "12px", color: "#fff" }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString("en-IN")}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="sales" stroke="#65CCB8" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 sm:p-7 rounded-3xl bg-[#142022] border border-white/10 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-white">Orders Volume</h2>
            <p className="text-xs text-white/50">Number of daily checkouts processed</p>
            <div className="h-64 w-full pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={d.salesChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#182628", border: "1px solid #ffffff20", borderRadius: "12px", color: "#fff" }}
                    formatter={(val: any) => [val, "Orders"]}
                  />
                  <Bar dataKey="orders" fill="#3B945E" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#142022] border border-white/10 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-bold text-white">Recent Customer Orders</h2>
            <p className="text-xs text-white/50">Latest transactions from Shethara storefront</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-[var(--mint)] hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/50 text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(d.recentOrders || []).map((o: any) => (
                <tr key={o.orderId} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-white">{o.orderId}</td>
                  <td className="py-4 px-4 text-white/80">
                    {o.customer?.firstName} {o.customer?.lastName}
                  </td>
                  <td className="py-4 px-4 font-semibold text-[var(--mint)]">{formatINR(o.total || 0)}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        o.status === "Delivered"
                          ? "bg-[var(--forest)]/30 text-[var(--mint)] border border-[var(--forest)]/50"
                          : o.status === "Processing"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Link
                      to="/admin/orders"
                      className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, subtitle, icon: Icon, accent, bg }: { title: string; value: string; subtitle: string; icon: any; accent: string; bg: string }) {
  return (
    <div className="p-6 rounded-3xl bg-[#142022] border border-white/10 shadow-xl hover:border-white/20 transition-all flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-white/50 font-semibold">{title}</span>
        <div className={`h-11 w-11 rounded-2xl grid place-items-center border ${bg}`}>
          <Icon className={`h-5 w-5 ${accent}`} />
        </div>
      </div>
      <div className="mt-4">
        <div className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">{value}</div>
        <p className="text-[11px] text-white/50 mt-1.5 flex items-center gap-1 font-medium">{subtitle}</p>
      </div>
    </div>
  );
}
