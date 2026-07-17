import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { formatINR, products } from "@/lib/shop-data";
import { ShieldCheck, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { createOrder } from "@/lib/api";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [{ title: "Checkout — Shethara Fashion" }, { name: "robots", content: "noindex" }],
    links: [{ rel: "canonical", href: "/checkout" }],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    email: "ananya@example.com",
    phone: "+91 98401 23456",
    firstName: "Ananya",
    lastName: "Ramaswamy",
    address: "16/1, Pari Street 2nd Cross, Choolaimedu",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600094",
    paymentMethod: "UPI (Razorpay)",
  });

  const cartItems = [
    {
      id: "emerald-anarkali",
      name: "Zara Emerald Anarkali Kurti",
      price: 3899,
      quantity: 1,
      image: "/src/assets/p2.jpg",
      color: "#3B945E",
    },
    {
      id: "mint-silk-blouse",
      name: "Aria Mint Silk Blouse",
      price: 2499,
      quantity: 1,
      image: "/src/assets/p1.jpg",
      color: "#65CCB8",
    },
  ];
  const total = 6398;

  const handleFieldChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const orderPayload = {
        customer: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
        items: cartItems,
        subtotal: total,
        total: total,
        paymentMethod: form.paymentMethod,
      };

      const res = await createOrder(orderPayload);
      setOrderPlaced(res);
    } catch (err: any) {
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[var(--mint)]/30 text-[var(--forest)] mb-6">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="eyebrow !text-[var(--forest)]">Order Placed Successfully</div>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl text-[var(--ink)]">Thank You, {orderPlaced.customer?.firstName || form.firstName}!</h1>
        <p className="mt-4 text-[var(--muted-foreground)] max-w-lg mx-auto leading-relaxed">
          Your order <strong className="text-[var(--ink)]">#{orderPlaced.orderId}</strong> has been confirmed. A luxurious confirmation email with itemized invoice has been dispatched to <strong className="text-[var(--forest)]">{orderPlaced.customer?.email || form.email}</strong> via our automated Nodemailer suite.
        </p>
        <div className="mt-10 luxe-card p-6 text-left text-sm max-w-md mx-auto space-y-3 bg-[var(--cream)]/60">
          <div className="flex justify-between border-b border-[var(--border)] pb-2">
            <span className="text-[var(--muted-foreground)]">Order ID</span>
            <span className="font-semibold text-[var(--ink)]">#{orderPlaced.orderId}</span>
          </div>
          <div className="flex justify-between border-b border-[var(--border)] pb-2">
            <span className="text-[var(--muted-foreground)]">Total Paid</span>
            <span className="font-semibold text-[var(--forest)]">{formatINR(total)}</span>
          </div>
          <div className="flex justify-between border-b border-[var(--border)] pb-2">
            <span className="text-[var(--muted-foreground)]">Delivery Address</span>
            <span className="font-semibold text-[var(--ink)] text-right">{form.address}, {form.city}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted-foreground)]">Status</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--mint)]/40 text-[var(--forest)]">Processing</span>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/shop" className="btn-primary px-8">Continue Shopping</Link>
          <Link to="/account" className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-white px-8 py-3 text-sm font-semibold text-[var(--ink)] hover:border-[var(--forest)] transition-colors">
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-5 sm:px-8 py-16">
      <div className="eyebrow">Secure Checkout</div>
      <h1 className="mt-3 font-display text-5xl">Checkout</h1>
      {error && (
        <div className="mt-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
          {error}
        </div>
      )}
      <div className="mt-10 grid lg:grid-cols-[1.4fr_1fr] gap-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          <Section title="Contact">
            <Field label="Email" value={form.email} onChange={(v) => handleFieldChange("email", v)} type="email" required />
            <Field label="Mobile" value={form.phone} onChange={(v) => handleFieldChange("phone", v)} required />
          </Section>
          <Section title="Delivery Address">
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="First name" value={form.firstName} onChange={(v) => handleFieldChange("firstName", v)} required />
              <Field label="Last name" value={form.lastName} onChange={(v) => handleFieldChange("lastName", v)} required />
            </div>
            <Field label="Address" value={form.address} onChange={(v) => handleFieldChange("address", v)} required />
            <div className="grid sm:grid-cols-3 gap-3">
              <Field label="City" value={form.city} onChange={(v) => handleFieldChange("city", v)} required />
              <Field label="State" value={form.state} onChange={(v) => handleFieldChange("state", v)} required />
              <Field label="Pincode" value={form.pincode} onChange={(v) => handleFieldChange("pincode", v)} required />
            </div>
          </Section>
          <Section title="Payment">
            <div className="space-y-2 text-sm">
              {["UPI (Razorpay)", "Credit / Debit Card", "Net Banking", "Cash on Delivery"].map((m) => (
                <label key={m} className="flex items-center gap-3 rounded-2xl border border-[var(--border)] p-4 cursor-pointer hover:border-[var(--forest)] transition-colors">
                  <input
                    type="radio"
                    name="pay"
                    className="accent-[var(--forest)]"
                    checked={form.paymentMethod === m}
                    onChange={() => handleFieldChange("paymentMethod", m)}
                  />
                  <span className="font-medium text-[var(--ink)]">{m}</span>
                </label>
              ))}
            </div>
          </Section>
          <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Placing Order & Sending Email..." : `Place Order · ${formatINR(total)}`}
          </button>
        </form>
        <aside className="luxe-card p-7 h-fit">
          <h2 className="font-display text-2xl">Order Review</h2>
          <div className="mt-4 text-sm text-[var(--ink)]/80 space-y-2">
            <div className="flex justify-between"><span>Subtotal (2 items)</span><span>{formatINR(total)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>Free</span></div>
            <div className="flex justify-between border-t border-[var(--border)] pt-3 font-semibold text-[var(--ink)]"><span>Total</span><span>{formatINR(total)}</span></div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <ShieldCheck className="h-4 w-4 text-[var(--forest)]" /> 256-bit encrypted checkout
          </div>
          <Link to="/cart" className="mt-6 text-xs text-[var(--forest)] hover:underline block">← Return to bag</Link>
        </aside>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-2xl text-[var(--ink)] mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (val: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-[var(--muted-foreground)]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="mt-1 w-full rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm outline-none focus:border-[var(--forest)] transition-colors"
      />
    </label>
  );
}