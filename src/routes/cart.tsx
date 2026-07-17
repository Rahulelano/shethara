import { createFileRoute, Link } from "@tanstack/react-router";
import { products, formatINR } from "@/lib/shop-data";
import { Minus, Plus, X, Tag, ArrowRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — Shethara Fashion" },
      { name: "description", content: "Review your selection at Shethara Fashion." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/cart" }],
  }),
  component: CartPage,
});

function CartPage() {
  const [items, setItems] = useState(
    products.slice(0, 2).map((p) => ({ ...p, qty: 1, size: "M" }))
  );
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 1499 ? 0 : 99;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + gst;

  return (
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-16">
      <div className="eyebrow">Checkout</div>
      <h1 className="mt-3 font-display text-5xl">Your Bag</h1>
      <p className="mt-2 text-[var(--muted-foreground)]">{items.length} item{items.length === 1 ? "" : "s"} in your bag</p>

      {items.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-[var(--muted-foreground)]">Your bag is empty.</p>
          <Link to="/shop" className="btn-primary mt-6">Continue shopping</Link>
        </div>
      ) : (
        <div className="mt-10 grid lg:grid-cols-[1fr_400px] gap-10">
          <div className="space-y-4">
            {items.map((it, idx) => (
              <div key={it.id} className="luxe-card p-4 grid grid-cols-[100px_1fr_auto] gap-5 items-center">
                <div className="aspect-square rounded-xl overflow-hidden bg-[var(--muted)]">
                  <img src={it.image} alt={it.name} width={200} height={200} className="h-full w-full object-cover" />
                </div>
                <div>
                  <div className="font-display text-lg text-[var(--ink)]">{it.name}</div>
                  <div className="text-xs text-[var(--muted-foreground)] mt-1">Size {it.size} · Mint</div>
                  <div className="mt-3 inline-flex items-center rounded-full border border-[var(--border)]">
                    <button onClick={() => setItems((s) => s.map((x, i) => i === idx && x.qty > 1 ? { ...x, qty: x.qty - 1 } : x))} className="p-2 hover:bg-[var(--muted)]"><Minus className="h-3 w-3" /></button>
                    <span className="w-8 text-center text-sm">{it.qty}</span>
                    <button onClick={() => setItems((s) => s.map((x, i) => i === idx ? { ...x, qty: x.qty + 1 } : x))} className="p-2 hover:bg-[var(--muted)]"><Plus className="h-3 w-3" /></button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatINR(it.price * it.qty)}</div>
                  <button onClick={() => setItems((s) => s.filter((_, i) => i !== idx))} className="mt-4 text-[var(--muted-foreground)] hover:text-[var(--ink)]" aria-label="Remove">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            <div className="luxe-card p-5 flex items-center gap-3">
              <Tag className="h-4 w-4 text-[var(--forest)]" />
              <input placeholder="Apply coupon code" className="flex-1 bg-transparent outline-none text-sm" />
              <button className="btn-outline !py-2 !px-4 !text-[10px]">Apply</button>
            </div>
          </div>

          <aside className="luxe-card p-7 h-fit lg:sticky lg:top-28">
            <h2 className="font-display text-2xl">Order Summary</h2>
            <div className="mt-6 space-y-3 text-sm">
              <Row l="Subtotal" v={formatINR(subtotal)} />
              <Row l="Shipping" v={shipping === 0 ? "Free" : formatINR(shipping)} />
              <Row l="GST (5%)" v={formatINR(gst)} />
              <div className="border-t border-[var(--border)] pt-3">
                <Row l="Total" v={formatINR(total)} bold />
              </div>
            </div>
            <Link to="/checkout" className="btn-primary w-full mt-6">
              Checkout <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/shop" className="btn-outline w-full mt-3">Continue shopping</Link>
            <p className="text-xs text-[var(--muted-foreground)] mt-4 text-center">Secure payments · Razorpay · UPI · Cards · COD</p>
          </aside>
        </div>
      )}
    </div>
  );
}

function Row({ l, v, bold }: { l: string; v: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "text-[var(--ink)] font-semibold text-base" : "text-[var(--ink)]/80"}`}>
      <span>{l}</span>
      <span>{v}</span>
    </div>
  );
}