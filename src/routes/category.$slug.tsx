import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findCategory, categories, products } from "@/lib/shop-data";
import { ProductCard } from "@/components/site/product-card";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const cat = findCategory(params.slug);
    if (!cat) throw notFound();
    return cat;
  },
  head: ({ loaderData, params }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Shethara Fashion Chennai` },
          { name: "description", content: `Shop premium ${loaderData.name.toLowerCase()} at Shethara Fashion Chennai. ${loaderData.tagline}.` },
          { property: "og:title", content: `${loaderData.name} — Shethara Fashion` },
          { property: "og:description", content: loaderData.tagline },
          { property: "og:image", content: loaderData.image },
          { property: "og:url", content: `/category/${params.slug}` },
        ]
      : [{ title: "Category — Shethara Fashion" }, { name: "robots", content: "noindex" }],
    links: [{ rel: "canonical", href: `/category/${params.slug}` }],
  }),
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-32 text-center">
      <h1 className="font-display text-4xl">Category not found</h1>
      <Link to="/shop" className="btn-primary mt-8">Back to Shop</Link>
    </div>
  ),
});

function CategoryPage() {
  const cat = Route.useLoaderData();
  const list = products.filter((p) => p.category === cat.slug);
  const shown = list.length ? list : products.slice(0, 4);

  return (
    <div>
      <section className="relative overflow-hidden bg-[var(--ink)] text-white">
        <div className="absolute inset-0 opacity-40">
          <img src={cat.image} alt="" width={1600} height={800} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--ink)] via-[var(--ink)]/70 to-[var(--ink)]/20" />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 py-24 sm:py-32">
          <div className="eyebrow !text-[var(--mint)]">Category</div>
          <h1 className="mt-4 font-display text-5xl sm:text-7xl leading-[1.02] max-w-2xl">{cat.name}</h1>
          <p className="mt-5 text-white/70 text-lg max-w-lg">{cat.tagline}</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 py-16">
        <div className="eyebrow mb-6">Explore Styles</div>
        <div className="flex flex-wrap gap-2">
          {cat.items.map((it: string) => (
            <span key={it} className="px-4 py-1.5 rounded-full border border-[var(--border)] bg-white text-sm text-[var(--ink)]/80 hover:bg-[var(--ink)] hover:text-[var(--mint)] hover:border-[var(--ink)] transition-colors cursor-pointer">
              {it}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 pb-24">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-3xl sm:text-4xl">Featured in {cat.name}</h2>
          <Link to="/shop" className="text-sm text-[var(--forest)] hover:text-[var(--ink)]">View all →</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {shown.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="bg-[var(--cream)] py-20">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="eyebrow">More to explore</div>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">Other categories</h2>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.filter((c) => c.slug !== cat.slug).map((c) => (
              <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="luxe-card p-6 flex items-center justify-between">
                <div>
                  <div className="font-display text-xl">{c.name}</div>
                  <div className="text-sm text-[var(--muted-foreground)] mt-1">{c.items.length} styles</div>
                </div>
                <ArrowRight className="h-4 w-4 text-[var(--forest)]" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}