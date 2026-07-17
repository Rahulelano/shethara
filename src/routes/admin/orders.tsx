import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Package, Truck, CheckCircle2, Clock, Mail, RefreshCw, Search, Eye, Sparkles, Send, Loader2 } from "lucide-react";
import { fetchAdminOrders, updateOrderStatus, resendOrderEmail } from "@/lib/api";
import { formatINR } from "@/lib/shop-data";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrdersPage,
});

function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [emailingId, setEmailingId] = useState<string | null>(null);

  const fallbackOrders = [
    {
      _id: "1",
      orderId: "SH-10248",
      customer: { firstName: "Ananya", lastName: "Ramaswamy", email: "shetharafashion@gmail.com", phone: "+91 98401 23456", address: "12, Kasturi Ranga Road, Alwarpet", city: "Chennai", state: "Tamil Nadu", pincode: "600018" },
      items: [{ id: "green-silk-saree", name: "Kaveri Green Silk Saree", price: 5499, quantity: 1, image: "/src/assets/p4.jpg", color: "#3B945E" }],
      subtotal: 5499,
      total: 5499,
      paymentMethod: "UPI (Razorpay)",
      status: "Delivered",
      createdAt: "2026-07-08T10:30:00Z",
    },
    {
      _id: "2",
      orderId: "SH-10291",
      customer: { firstName: "Divya", lastName: "Krishnan", email: "divya@example.com", phone: "+91 95001 88990", address: "45, 2nd Avenue, Anna Nagar", city: "Chennai", state: "Tamil Nadu", pincode: "600040" },
      items: [
        { id: "emerald-anarkali", name: "Zara Emerald Anarkali Kurti", price: 3899, quantity: 1, image: "/src/assets/p2.jpg", color: "#3B945E" },
        { id: "mint-silk-blouse", name: "Aria Mint Silk Blouse", price: 2499, quantity: 1, image: "/src/assets/p1.jpg", color: "#65CCB8" },
      ],
      subtotal: 6398,
      total: 6398,
      paymentMethod: "Credit / Debit Card",
      status: "Processing",
      createdAt: "2026-07-14T15:20:00Z",
    },
  ];

  const { data: orders = fallbackOrders, isLoading } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: () => fetchAdminOrders(),
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      if (selectedOrder && selectedOrder.orderId === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err: any) {
      alert("Status update failed: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleResendEmail = async (orderId: string) => {
    setEmailingId(orderId);
    try {
      await resendOrderEmail(orderId);
      alert(`Luxurious order confirmation email successfully dispatched via Nodemailer for Order #${orderId}!`);
    } catch (err: any) {
      alert("Failed to resend email: " + err.message);
    } finally {
      setEmailingId(null);
    }
  };

  const filtered = orders.filter((o: any) => {
    if (statusFilter !== "All" && o.status !== statusFilter) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      o.orderId.toLowerCase().includes(s) ||
      o.customer?.firstName?.toLowerCase().includes(s) ||
      o.customer?.lastName?.toLowerCase().includes(s) ||
      o.customer?.email?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#142022] border border-white/10 shadow-xl">
        <div>
          <span className="text-xs uppercase tracking-widest text-[var(--mint)] font-bold flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" /> Live Order Management & Fulfillment
          </span>
          <h1 className="mt-1 font-display text-3xl font-bold text-white">Customer Orders ({orders.length})</h1>
          <p className="text-xs text-white/60 mt-1">Review checkouts, update delivery milestones & dispatch invoice emails</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {["All", "Processing", "Shipped", "Delivered", "Cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === st
                  ? "bg-[var(--forest)] text-white shadow-lg shadow-[var(--forest)]/25 border border-white/15"
                  : "bg-[#142022] text-white/60 hover:text-white border border-white/10"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search by ID, name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl bg-[#142022] border border-white/15 pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[var(--mint)] outline-none"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="p-6 rounded-3xl bg-[#142022] border border-white/10 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/50 text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((o: any) => (
                <tr key={o.orderId} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-mono font-bold text-white text-base">{o.orderId}</div>
                    <div className="text-xs text-white/40 mt-0.5">{o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN") : "Today"}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-white">
                      {o.customer?.firstName} {o.customer?.lastName}
                    </div>
                    <div className="text-xs text-[var(--mint)] mt-0.5">{o.customer?.email}</div>
                    <div className="text-xs text-white/40">{o.customer?.phone}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-white/90 text-xs space-y-1">
                      {(o.items || []).map((item: any, i: number) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="font-mono text-[var(--mint)]">{item.quantity || 1}x</span>
                          <span className="truncate max-w-[180px]">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-[var(--mint)] text-base">{formatINR(o.total || 0)}</div>
                    <div className="text-[10px] uppercase tracking-wider text-white/40 mt-0.5">{o.paymentMethod || "UPI"}</div>
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={o.status}
                      disabled={updatingId === o.orderId}
                      onChange={(e) => handleStatusChange(o.orderId, e.target.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#182628] border border-white/20 text-white outline-none cursor-pointer focus:border-[var(--mint)] ${
                        updatingId === o.orderId ? "opacity-50" : ""
                      }`}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-4 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleResendEmail(o.orderId)}
                      disabled={emailingId === o.orderId}
                      title="Resend Nodemailer Email Invoice"
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50"
                    >
                      {emailingId === o.orderId ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4 text-[var(--mint)]" />}
                    </button>
                    <button
                      onClick={() => setSelectedOrder(o)}
                      title="Inspect Order Breakdown"
                      className="p-2 rounded-xl bg-[var(--forest)]/40 hover:bg-[var(--forest)]/60 text-white transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#142022] border border-white/15 rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl relative my-8 text-sm">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-[var(--mint)] font-bold">Order Breakdown</span>
                <h2 className="font-display text-2xl font-bold text-white">Invoice #{selectedOrder.orderId}</h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/50 mb-1">Customer Address</p>
                <p className="font-bold text-white">
                  {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}
                </p>
                <p className="text-white/80 mt-1">{selectedOrder.customer?.address}</p>
                <p className="text-white/80">
                  {selectedOrder.customer?.city}, {selectedOrder.customer?.state} - {selectedOrder.customer?.pincode}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-white/50 mb-1">Contact & Payment</p>
                <p className="text-white/90">Email: <span className="text-[var(--mint)]">{selectedOrder.customer?.email}</span></p>
                <p className="text-white/90">Mobile: {selectedOrder.customer?.phone}</p>
                <p className="text-white/90 mt-2 font-semibold">Payment: {selectedOrder.paymentMethod || "UPI (Razorpay)"}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <p className="text-xs uppercase tracking-wider text-white/50 font-semibold">Itemized Products</p>
              {(selectedOrder.items || []).map((it: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#182628] border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg overflow-hidden bg-white/5 border border-white/10 shrink-0">
                      <img src={it.image} alt={it.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{it.name}</p>
                      <p className="text-xs text-white/50">Qty: {it.quantity || 1}</p>
                    </div>
                  </div>
                  <span className="font-bold text-[var(--mint)]">{formatINR(it.price * (it.quantity || 1))}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--forest)]/20 border border-[var(--forest)]/40">
              <span className="font-display text-lg font-bold text-white">Total Paid</span>
              <span className="font-display text-2xl font-bold text-[var(--mint)]">{formatINR(selectedOrder.total || 0)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
