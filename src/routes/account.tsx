import { createFileRoute } from "@tanstack/react-router";
import { User, Package, Heart, MapPin, Bell, Gift, Wallet, LogOut } from "lucide-react";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [{ title: "My Account — Shethara Fashion" }, { name: "robots", content: "noindex" }],
    links: [{ rel: "canonical", href: "/account" }],
  }),
  component: AccountPage,
});

function AccountPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 sm:px-8 py-16">
      <div className="eyebrow">Welcome back</div>
      <h1 className="mt-3 font-display text-5xl">Hello, Ananya</h1>

      <div className="mt-10 grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="luxe-card p-5 h-fit">
          {[
            { I: User, t: "Profile" },
            { I: Package, t: "Orders" },
            { I: Heart, t: "Wishlist" },
            { I: MapPin, t: "Addresses" },
            { I: Bell, t: "Notifications" },
            { I: Gift, t: "Rewards" },
            { I: Wallet, t: "Wallet" },
            { I: LogOut, t: "Log out" },
          ].map(({ I, t }, i) => (
            <button key={t} className={`w-full flex items-center gap-3 py-3 px-3 rounded-xl text-sm transition-colors ${i === 0 ? "bg-[var(--ink)] text-[var(--mint)]" : "hover:bg-[var(--muted)]"}`}>
              <I className="h-4 w-4" /> {t}
            </button>
          ))}
        </aside>

        <div className="space-y-6">
          <div className="luxe-card p-8">
            <h2 className="font-display text-2xl">Profile</h2>
            <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
              <Kv l="Name" v="Ananya Ramaswamy" />
              <Kv l="Email" v="ananya@example.com" />
              <Kv l="Mobile" v="+91 98xxxxxx24" />
              <Kv l="Member since" v="March 2024" />
            </div>
          </div>
          <div className="luxe-card p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Recent Orders</h2>
              <span className="text-sm text-[var(--forest)]">View all</span>
            </div>
            <div className="mt-6 divide-y divide-[var(--border)]">
              {[
                { id: "SH-10248", d: "8 July 2026", s: "Delivered", t: "₹5,499" },
                { id: "SH-10192", d: "22 June 2026", s: "Delivered", t: "₹2,299" },
                { id: "SH-10120", d: "12 May 2026", s: "Delivered", t: "₹12,999" },
              ].map((o) => (
                <div key={o.id} className="py-4 grid grid-cols-4 gap-2 text-sm">
                  <div className="font-semibold">{o.id}</div>
                  <div className="text-[var(--muted-foreground)]">{o.d}</div>
                  <div className="text-[var(--forest)]">{o.s}</div>
                  <div className="text-right font-semibold">{o.t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Kv({ l, v }: { l: string; v: string }) {
  return (
    <div>
      <div className="eyebrow">{l}</div>
      <div className="mt-1 text-[var(--ink)]">{v}</div>
    </div>
  );
}