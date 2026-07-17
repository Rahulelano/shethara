import { createFileRoute } from "@tanstack/react-router";
import hero2 from "@/assets/hero-2.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Shethara Fashion Chennai" },
      { name: "description", content: "Shethara Fashion is a Chennai boutique celebrating premium ladies fashion — from heritage sarees to modern western wear." },
      { property: "og:title", content: "About Shethara Fashion" },
      { property: "og:description", content: "A boutique in Chennai, a wardrobe for a lifetime." },
      { property: "og:image", content: hero2 },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <img src={hero2} alt="" width={1600} height={900} className="h-[60vh] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-8 sm:p-16 mx-auto max-w-[1400px] text-white">
          <div className="eyebrow !text-[var(--mint)]">Our Story</div>
          <h1 className="mt-3 font-display text-5xl sm:text-7xl max-w-3xl">Chennai's boutique for modern heirlooms.</h1>
        </div>
      </section>
      <section className="mx-auto max-w-[1200px] px-5 sm:px-8 py-20 grid lg:grid-cols-2 gap-16">
        <div>
          <div className="eyebrow">Est. 2013 · Choolaimedu</div>
          <h2 className="mt-3 font-display text-4xl">Fashion, gently made.</h2>
          <p className="mt-6 text-[var(--ink)]/70 leading-relaxed">
            Shethara Fashion began on a quiet street in Choolaimedu, Chennai, with one simple idea:
            fashion should feel personal. Twelve years later, we still work like a small atelier —
            handpicking every drape, every weave, every detail before it enters our racks.
          </p>
          <p className="mt-4 text-[var(--ink)]/70 leading-relaxed">
            From Kanchi silks to breezy summer linens, our collection is a conversation between heritage
            and modernity — designed for women who wear their style with intent.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 self-center">
          {[
            { k: "12+", v: "Years in Chennai" },
            { k: "50+", v: "Weavers & karigars" },
            { k: "8,400", v: "Loyal customers" },
            { k: "100%", v: "Handpicked pieces" },
          ].map((s) => (
            <div key={s.v} className="luxe-card p-8">
              <div className="font-display text-5xl text-[var(--forest)]">{s.k}</div>
              <div className="mt-2 text-sm text-[var(--muted-foreground)] uppercase tracking-wider">{s.v}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}