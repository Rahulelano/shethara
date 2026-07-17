import { createFileRoute, Link } from "@tanstack/react-router";
import { categories } from "@/lib/shop-data";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections — Shethara Fashion" },
      { name: "description", content: "Explore Shethara Fashion collections — Summer, Festive, Ethnic and Western edits from Chennai's premium boutique." },
      { property: "og:title", content: "Collections — Shethara Fashion" },
      { property: "og:url", content: "/collections" },
    ],
    links: [{ rel: "canonical", href: "/collections" }],
  }),
  component: CollectionsPage,
});

function CollectionsPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-20">
      <div className="eyebrow">The Edits</div>
      <h1 className="mt-3 font-display text-5xl sm:text-6xl max-w-3xl">Collections curated by season & story.</h1>
      <div className="mt-14 grid md:grid-cols-2 gap-6">
        {categories.map((c, idx) => (
          <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className={`group relative overflow-hidden rounded-3xl ${idx % 3 === 0 ? "aspect-[4/3]" : "aspect-[4/5]"}`}>
            <img src={c.image} alt={c.name} loading="lazy" width={800} height={1000} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8 text-white">
              <div className="eyebrow !text-[var(--mint)]">{c.tagline}</div>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl">{c.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}