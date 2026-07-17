import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { sendContactMessage } from "@/lib/api";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Shethara Fashion Chennai" },
      { name: "description", content: "Visit Shethara Fashion at No.16/1, Pari Street 2nd Cross, Choolaimedu, Chennai 600094. Call +91 88078 63026." },
      { property: "og:title", content: "Contact Shethara Fashion" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await sendContactMessage(form);
      setSent(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err: any) {
      setError(err.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] px-5 sm:px-8 py-20">
      <div className="eyebrow">Get in touch</div>
      <h1 className="mt-3 font-display text-5xl sm:text-6xl">Come say hello.</h1>
      <p className="mt-4 text-[var(--muted-foreground)] max-w-xl">
        Visit our boutique in Choolaimedu, WhatsApp us for a private appointment, or drop a note — we usually reply within a few hours.
      </p>

      <div className="mt-14 grid lg:grid-cols-[1.2fr_1fr] gap-10">
        <div className="grid sm:grid-cols-2 gap-4 self-start">
          <Info I={MapPin} t="Boutique" v={<>No.16/1, Pari Street 2nd Cross,<br />Choolaimedu, Chennai — 600094</>} />
          <Info I={Phone} t="Call" v={<>+91 88078 63026<br />+91 95662 86645</>} />
          <Info I={Mail} t="Email" v={<>shetharafashion@gmail.com</>} />
          <Info I={Clock} t="Hours" v={<>Mon — Sat<br />10:30 AM – 8:30 PM</>} />
        </div>
        
        <div className="luxe-card p-8">
          <h2 className="font-display text-2xl mb-4">Send a message</h2>
          {sent ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="h-12 w-12 text-[var(--forest)] mx-auto" />
              <h3 className="font-display text-xl text-[var(--ink)]">Message Dispatched!</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                Thank you for contacting Shethara Fashion. Our boutique team has received your inquiry and will respond to your email shortly.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="text-xs text-[var(--forest)] font-semibold underline pt-2 block mx-auto"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs">{error}</div>}
              <input
                placeholder="Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm outline-none focus:border-[var(--forest)] transition-colors"
              />
              <input
                placeholder="Email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm outline-none focus:border-[var(--forest)] transition-colors"
              />
              <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm outline-none focus:border-[var(--forest)] transition-colors"
              />
              <textarea
                rows={4}
                placeholder="Message"
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-5 py-3 text-sm outline-none focus:border-[var(--forest)] resize-none transition-colors"
              />
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Sending..." : "Send message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ I, t, v }: { I: React.ElementType; t: string; v: React.ReactNode }) {
  return (
    <div className="luxe-card p-6">
      <div className="h-10 w-10 grid place-items-center rounded-full bg-[var(--mint)]/40 text-[var(--forest)]">
        <I className="h-4 w-4" />
      </div>
      <div className="eyebrow mt-4">{t}</div>
      <div className="mt-2 text-[var(--ink)]/80 text-sm leading-relaxed">{v}</div>
    </div>
  );
}