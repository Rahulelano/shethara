import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { ProductCard } from "@/components/site/product-card";
import { products as staticProducts, categories } from "@/lib/shop-data";
import { fetchProducts } from "@/lib/api";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop All — Shethara Fashion" },
      { name: "description", content: "Shop the full Shethara Fashion catalogue — sarees, lehengas, kurtis, dresses, western wear and more." },
      { property: "og:title", content: "Shop All — Shethara Fashion" },
      { property: "og:description", content: "Sarees, lehengas, kurtis, dresses and more, curated for the modern Indian woman." },
      { property: "og:url", content: "/shop" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: ShopPage,
});

const sortOptions = [
  { v: "featured", l: "Featured" },
  { v: "new", l: "Newest" },
  { v: "low", l: "Price: Low to High" },
  { v: "high", l: "Price: High to Low" },
  { v: "rating", l: "Top Rated" },
];

function ShopPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [sort, setSort] = useState("featured");
  const [priceMax, setPriceMax] = useState(15000);
  const [searchQuery, setSearchQuery] = useState("");
  const [openFilter, setOpenFilter] = useState(false);

  const { data: products = staticProducts } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(),
  });

  const filtered = useMemo(() => {
    let list = products.filter((p: any) => p.price <= priceMax);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p: any) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (selected.length) list = list.filter((p: any) => selected.includes(p.category));
    if (sort === "low") list = [...list].sort((a: any, b: any) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a: any, b: any) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a: any, b: any) => b.rating - a.rating);
    return list;
  }, [products, selected, sort, priceMax, searchQuery]);

  const toggle = (slug: string) =>
    setSelected((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]));

  return (
    <div>
      <section className="bg-[var(--cream)] py-16 border-b border-[var(--border)]">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="eyebrow">Collection</div>
          <h1 className="mt-3 font-display text-5xl sm:text-6xl text-[var(--ink)]">All Products</h1>
          <p className="mt-4 text-[var(--muted-foreground)] max-w-xl">
            Explore the full Shethara Fashion catalogue — {products.length} pieces curated across ethnic, western and everyday luxe.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 py-12 grid lg:grid-cols-[260px_1fr] gap-10">
        <aside className={`${openFilter ? "fixed inset-0 z-50 bg-white p-6 overflow-auto" : "hidden"} lg:block lg:static lg:p-0`}>
          <div className="flex items-center justify-between lg:hidden mb-6">
            <h2 className="font-display text-2xl">Filters</h2>
            <button onClick={() => setOpenFilter(false)}><X className="h-5 w-5" /></button>
          </div>
          <FilterBlock title="Category">
            {categories.map((c) => (
              <label key={c.slug} className="flex items-center gap-3 py-1.5 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={selected.includes(c.slug)}
                  onChange={() => toggle(c.slug)}
                  className="h-4 w-4 accent-[var(--forest)]"
                />
                <span className="text-[var(--ink)]/80">{c.name}</span>
              </label>
            ))}
          </FilterBlock>
          <FilterBlock title="Price">
            <input
              type="range"
              min={500}
              max={20000}
              step={500}
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-[var(--forest)]"
            />
            <div className="text-sm text-[var(--muted-foreground)] mt-2">Up to ₹{priceMax.toLocaleString("en-IN")}</div>
          </FilterBlock>
          <FilterBlock title="Color">
            <div className="flex flex-wrap gap-2">
              {["#65CCB8", "#57BA98", "#3B945E", "#182628", "#F2F2F2"].map((c) => (
                <button
                  key={c}
                  className="h-8 w-8 rounded-full border-2 border-white ring-1 ring-[var(--border)]"
                  style={{ background: c }}
                  aria-label={c}
                />
              ))}
            </div>
          </FilterBlock>
          <FilterBlock title="Size">
            <div className="flex flex-wrap gap-2">
              {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                <button key={s} className="px-3 py-1.5 text-xs rounded-full border border-[var(--border)] hover:bg-[var(--ink)] hover:text-[var(--mint)] hover:border-[var(--ink)] transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </FilterBlock>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button onClick={() => setOpenFilter(true)} className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] text-sm shrink-0">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </button>
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                <input
                  type="text"
                  placeholder="Search styles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-full border border-[var(--border)] bg-white text-sm outline-none focus:border-[var(--forest)]"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--ink)]">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
              <div className="text-sm text-[var(--muted-foreground)]">{filtered.length} products</div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm outline-none focus:border-[var(--forest)]"
              >
                {sortOptions.map((o) => <option key={o.v} value={o.v}>Sort: {o.l}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-[var(--muted-foreground)]">
              No products match these filters yet. <button onClick={() => { setSelected([]); setPriceMax(15000); }} className="text-[var(--forest)] underline">Reset</button>
            </div>
          )}
        </div>
      </section>

      <BrowseCategoriesFooter />
    </div>
  );
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-6 border-b border-[var(--border)] first:pt-0">
      <h3 className="eyebrow mb-4 !text-[var(--ink)]">{title}</h3>
      {children}
    </div>
  );
}

function BrowseCategoriesFooter() {
  return (
    <section className="bg-[var(--cream)] py-20">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="eyebrow">Browse</div>
        <h2 className="mt-3 font-display text-4xl text-[var(--ink)]">All Categories</h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="luxe-card p-6 flex items-center justify-between group">
              <div>
                <div className="font-display text-xl text-[var(--ink)]">{c.name}</div>
                <div className="text-sm text-[var(--muted-foreground)] mt-1">{c.items.length} styles</div>
              </div>
              <span className="text-[var(--forest)] group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}