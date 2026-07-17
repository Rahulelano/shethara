import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Sparkles, Truck, ShieldCheck, RefreshCw, Star } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import { ProductCard } from "@/components/site/product-card";
import { products, categories, collections } from "@/lib/shop-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shethara Fashion — Luxury Ladies Boutique in Chennai" },
      { name: "description", content: "Shop premium sarees, lehengas, kurtis, dresses and western wear at Shethara Fashion, Chennai's modern luxury ladies boutique." },
      { property: "og:title", content: "Shethara Fashion — Luxury Ladies Boutique in Chennai" },
      { property: "og:description", content: "Sarees, lehengas, kurtis, dresses and western wear crafted for the modern Indian woman." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const slides = [
  {
    image: hero1,
    eyebrow: "Festive Couture · 2026",
    title: "Woven in mint, cut for moments",
    subtitle: "The new heritage saree edit — hand-loomed silks in whispering pastel tones.",
    cta: "Shop the Edit",
    to: "/category/indian-wear",
  },
  {
    image: hero2,
    eyebrow: "Ethnic Icons",
    title: "The Anarkali, reimagined",
    subtitle: "Emerald silks with fine zardosi work, tailored for the modern silhouette.",
    cta: "Explore Collection",
    to: "/collections",
  },
  {
    image: hero3,
    eyebrow: "Everyday Luxe",
    title: "Mint, forever a mood",
    subtitle: "Fluid midis, breezy co-ords and Sunday linens for city days.",
    cta: "Shop Western",
    to: "/category/western",
  },
];

function Index() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 6500);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      {/* HERO SLIDER */}
      <section className="relative overflow-hidden bg-[var(--cream)]">
        <div className="relative h-[88vh] min-h-[620px] max-h-[880px]">
          {slides.map((s, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${
                idx === i ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={s.image}
                alt={s.title}
                width={1600}
                height={1200}
                className={`h-full w-full object-cover ${idx === i ? "animate-slow-zoom" : ""}`}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--cream)] via-[var(--cream)]/40 to-transparent" />
            </div>
          ))}

          <div className="relative z-10 h-full mx-auto max-w-[1400px] px-5 sm:px-8 flex items-center">
            <div key={i} className="max-w-xl animate-fade-up">
              <div className="eyebrow flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                {slides[i].eyebrow}
              </div>
              <h1 className="mt-5 font-display text-[46px] sm:text-[68px] leading-[1.02] text-[var(--ink)]">
                {slides[i].title}
              </h1>
              <p className="mt-5 text-[var(--ink)]/70 text-lg max-w-md leading-relaxed">
                {slides[i].subtitle}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to={slides[i].to} className="btn-primary">
                  {slides[i].cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/shop" className="btn-outline">Shop All</Link>
              </div>
            </div>
          </div>

          {/* Slide indicators */}
          <div className="absolute z-10 bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`slide ${idx + 1}`}
                className={`h-[3px] transition-all duration-500 rounded-full ${
                  idx === i ? "w-10 bg-[var(--ink)]" : "w-5 bg-[var(--ink)]/25"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Feature strip */}
        <div className="border-t border-[var(--border)] bg-white">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 grid grid-cols-2 md:grid-cols-4 divide-x divide-[var(--border)]">
            {[
              { I: Truck, t: "Free Shipping", s: "Across India above ₹1499" },
              { I: RefreshCw, t: "Easy Returns", s: "7-day hassle-free" },
              { I: ShieldCheck, t: "Secure Payments", s: "UPI, cards, COD" },
              { I: Sparkles, t: "Handpicked Craft", s: "Boutique quality" },
            ].map(({ I, t, s }, idx) => (
              <div key={idx} className="flex items-center gap-3 px-4 py-5">
                <I className="h-5 w-5 text-[var(--forest)] shrink-0" />
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-[var(--ink)]">{t}</div>
                  <div className="text-[11px] text-[var(--muted-foreground)] truncate">{s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="eyebrow">Shop by category</div>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl text-[var(--ink)]">Trending Categories</h2>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-[var(--forest)] hover:text-[var(--ink)] font-medium">
            View all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((c, idx) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className={`group relative overflow-hidden rounded-3xl ${
                idx === 0 ? "md:col-span-2 md:row-span-2 aspect-square md:aspect-auto" : "aspect-[4/5]"
              }`}
            >
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                width={800}
                height={1000}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/80 via-[var(--ink)]/10 to-transparent" />
              <div className="absolute inset-0 p-5 sm:p-7 flex flex-col justify-end text-white">
                <div className="eyebrow !text-[var(--mint)]">{c.tagline}</div>
                <div className="mt-2 flex items-center justify-between">
                  <h3 className="font-display text-2xl sm:text-3xl">{c.name}</h3>
                  <span className="h-10 w-10 grid place-items-center rounded-full bg-white/15 backdrop-blur border border-white/25 group-hover:bg-[var(--mint)] group-hover:text-[var(--ink)] transition-all">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="bg-[var(--cream)] py-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="eyebrow">Best Sellers</div>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl text-[var(--ink)]">Loved by our women</h2>
            </div>
            <Link to="/shop" className="btn-outline">Shop all</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* FEATURED COLLECTION BANNER */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 py-24 grid lg:grid-cols-2 gap-8 items-stretch">
        <div className="relative overflow-hidden rounded-3xl bg-[var(--mint)]">
          <div className="p-10 sm:p-14 h-full flex flex-col justify-between min-h-[440px]">
            <div>
              <div className="eyebrow !text-[var(--ink)]">Flash Sale · 48 hours</div>
              <h3 className="mt-4 font-display text-4xl sm:text-5xl text-[var(--ink)] leading-[1.05]">
                Up to 40% off<br />festive edits
              </h3>
              <p className="mt-4 text-[var(--ink)]/70 max-w-sm">
                A curated selection of sarees, lehengas and Anarkalis, priced to celebrate the season.
              </p>
            </div>
            <Link to="/collections" className="btn-primary self-start">
              Shop Sale <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-3xl bg-[var(--ink)] text-white">
          <div className="p-10 sm:p-14 h-full flex flex-col justify-between min-h-[440px]">
            <div>
              <div className="eyebrow !text-[var(--mint)]">New Launch</div>
              <h3 className="mt-4 font-display text-4xl sm:text-5xl leading-[1.05]">
                The Summer<br />Mint Capsule
              </h3>
              <p className="mt-4 text-white/70 max-w-sm">
                Breezy co-ords, linen shirts and fluid midis — designed for Chennai heat with grace.
              </p>
            </div>
            <Link to="/category/western" className="btn-outline !border-[var(--mint)] !text-[var(--mint)] hover:!bg-[var(--mint)] hover:!text-[var(--ink)]">
              Discover <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 pb-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="eyebrow">Just Landed</div>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl text-[var(--ink)]">New Arrivals</h2>
          </div>
          <Link to="/new-arrivals" className="btn-outline">See all new</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(4, 8).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="bg-[var(--ink)] text-white py-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 grid lg:grid-cols-[1fr_1.2fr] gap-16 items-center">
          <div>
            <div className="eyebrow !text-[var(--mint)]">The Shethara Promise</div>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl leading-[1.05]">
              A boutique in Chennai, a wardrobe for a lifetime.
            </h2>
            <p className="mt-6 text-white/70 max-w-lg leading-relaxed">
              Every piece at Shethara Fashion is chosen by hand — from the drape of a Kanchi silk to
              the fall of a linen midi. We work with a small circle of weavers, karigars and ateliers
              across India to bring you fashion that lasts far beyond a season.
            </p>
            <div className="mt-8 flex gap-3">
              <Link to="/about" className="btn-outline !border-[var(--mint)] !text-[var(--mint)] hover:!bg-[var(--mint)] hover:!text-[var(--ink)]">Our story</Link>
              <Link to="/shop" className="btn-primary">Shop the edit <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { k: "12+", v: "Years of craft" },
              { k: "8,400", v: "Happy women" },
              { k: "24hr", v: "Chennai dispatch" },
              { k: "100%", v: "Quality checked" },
            ].map((s, idx) => (
              <div key={idx} className="rounded-3xl border border-white/10 p-8 bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                <div className="font-display text-5xl text-[var(--mint)]">{s.k}</div>
                <div className="mt-2 text-sm tracking-wider uppercase text-white/60">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="eyebrow">Kind words</div>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl text-[var(--ink)]">From our women</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { n: "Ananya R.", c: "Chennai", q: "The mint saree is a poem — the silk, the finish, everything is a level above what I've bought before." },
            { n: "Divya S.", c: "Bengaluru", q: "My Anarkali arrived in two days. The stitching, the fall, the packaging — it feels like a couture experience." },
            { n: "Priya M.", c: "Chennai", q: "I've been shopping with Shethara for three seasons now. Quality never dips. Service always warms." },
          ].map((r, idx) => (
            <div key={idx} className="luxe-card p-8">
              <div className="flex gap-0.5 text-[var(--forest)]">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-5 text-[var(--ink)]/80 leading-relaxed italic font-display text-lg">
                “{r.q}”
              </p>
              <div className="mt-6 pt-5 border-t border-[var(--border)]">
                <div className="font-semibold text-[var(--ink)]">{r.n}</div>
                <div className="text-xs text-[var(--muted-foreground)] tracking-wider uppercase mt-0.5">{r.c}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COLLECTIONS MARQUEE */}
      <section className="border-y border-[var(--border)] bg-[var(--cream)] py-8 overflow-hidden">
        <div className="flex gap-16 animate-marquee whitespace-nowrap">
          {[...collections, ...collections, ...collections].map((c, idx) => (
            <div key={idx} className="flex items-center gap-4 font-display text-3xl sm:text-4xl text-[var(--ink)]/70">
              {c.name} Collection
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--forest)]" />
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 py-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[var(--mint)] via-[var(--sage)] to-[var(--forest)] p-10 sm:p-16 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="eyebrow !text-[var(--ink)]">The Atelier List</div>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl text-[var(--ink)] leading-tight">
              Private previews, first.
            </h2>
            <p className="mt-4 text-[var(--ink)]/70">
              Get 10% off your first order and be the first to shop new drops, festive edits and quiet sales.
            </p>
            <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="your@email.com"
                className="flex-1 rounded-full bg-white/95 px-6 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[var(--ink)]"
              />
              <button type="submit" className="btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
