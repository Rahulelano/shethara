import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findProduct, products, formatINR } from "@/lib/shop-data";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart, Share2, Star, Truck, RefreshCw, ShieldCheck, Minus, Plus, ShoppingBag } from "lucide-react";
import { ProductCard } from "@/components/site/product-card";
import { fetchProductById, fetchProducts } from "@/lib/api";

export const Route = createFileRoute("/product/$id")({
  loader: async ({ params }) => {
    try {
      const liveProduct = await fetchProductById(params.id);
      if (liveProduct) return liveProduct;
    } catch (e) {
      console.warn("Loader failed to fetch live product, using static:", e);
    }
    const p = findProduct(params.id);
    if (!p) throw notFound();
    return p;
  },yg
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Shethara Fashion` },
          { name: "description", content: `${loaderData.name} at ${formatINR(loaderData.price)}. Shop premium ladies fashion at Shethara Fashion Chennai.` },
          { property: "og:title", content: `${loaderData.name} — Shethara Fashion` },
          { property: "og:description", content: `Now ${formatINR(loaderData.price)}. Handpicked from Shethara Fashion Chennai.` },
          { property: "og:image", content: loaderData.image },
          { property: "og:type", content: "product" },
          { property: "og:url", content: `/product/${params.id}` },
        ]
      : [{ title: "Product — Shethara Fashion" }, { name: "robots", content: "noindex" }],
    links: [{ rel: "canonical", href: `/product/${params.id}` }],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-32 text-center">
      <h1 className="font-display text-4xl">Product not found</h1>
      <Link to="/shop" className="btn-primary mt-8">Back to Shop</Link>
    </div>
  ),
});

function ProductPage() {
  const initialProduct = Route.useLoaderData();
  const { id } = Route.useParams();

  const { data: p = initialProduct } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    initialData: initialProduct,
  });

  const { data: allProducts = products } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(),
  });

  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("M");
  const [color, setColor] = useState(p.colors?.[0] || "#3B945E");
  const related = allProducts.filter((x: any) => x.id !== p.id).slice(0, 4);
  const discount = Math.round(((p.mrp - p.price) / p.mrp) * 100);

  return (
    <div>
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-8 text-xs text-[var(--muted-foreground)]">
        <Link to="/" className="hover:text-[var(--ink)]">Home</Link> / <Link to="/shop" className="hover:text-[var(--ink)]">Shop</Link> / <span className="text-[var(--ink)]">{p.name}</span>
      </div>

      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 py-10 grid lg:grid-cols-2 gap-12">
        <div className="grid grid-cols-[80px_1fr] gap-4">
          <div className="hidden sm:flex flex-col gap-3">
            {[p.image, p.image, p.image, p.image].map((im, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-[var(--muted)] border border-[var(--border)]">
                <img src={im} alt="" width={200} height={200} className="h-full w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-[var(--muted)]">
            <img src={p.image} alt={p.name} width={800} height={1000} className="h-full w-full object-cover" />
            {p.badge && (
              <span className="absolute top-4 left-4 bg-[var(--ink)] text-[var(--mint)] text-[10px] tracking-[0.2em] uppercase px-3 py-1 rounded-full">
                {p.badge}
              </span>
            )}
          </div>
        </div>

        <div>
          <div className="eyebrow">Shethara · Handcrafted</div>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl leading-tight text-[var(--ink)]">{p.name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(p.rating) ? "fill-[var(--forest)] text-[var(--forest)]" : "text-[var(--border)]"}`} />
              ))}
            </div>
            <span className="text-sm text-[var(--muted-foreground)]">{p.rating} · 128 reviews</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-3xl text-[var(--ink)]">{formatINR(p.price)}</span>
            <span className="text-[var(--muted-foreground)] line-through">{formatINR(p.mrp)}</span>
            {discount > 0 && <span className="text-sm text-[var(--forest)] font-semibold">Save {discount}%</span>}
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">Inclusive of all taxes · Free shipping across India</p>

          <div className="mt-8">
            <div className="eyebrow mb-3 !text-[var(--ink)]">Color</div>
            <div className="flex gap-2">
              {p.colors.map((c: string) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-10 w-10 rounded-full border-2 transition-all ${color === c ? "border-[var(--ink)] scale-110" : "border-white ring-1 ring-[var(--border)]"}`}
                  style={{ background: c }}
                  aria-label={c}
                />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="eyebrow !text-[var(--ink)]">Size</div>
              <button className="text-xs text-[var(--forest)] underline">Size guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-[52px] px-4 py-2.5 rounded-full text-sm border transition-colors ${
                    size === s ? "bg-[var(--ink)] text-[var(--mint)] border-[var(--ink)]" : "border-[var(--border)] hover:border-[var(--ink)]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-[var(--border)] overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-[var(--muted)]"><Minus className="h-4 w-4" /></button>
              <span className="w-10 text-center font-medium">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-3 hover:bg-[var(--muted)]"><Plus className="h-4 w-4" /></button>
            </div>
            <Link to="/cart" className="btn-primary flex-1">
              <ShoppingBag className="h-4 w-4" /> Add to Bag
            </Link>
            <button className="h-12 w-12 grid place-items-center rounded-full border border-[var(--border)] hover:border-[var(--ink)]" aria-label="Wishlist">
              <Heart className="h-4 w-4" />
            </button>
            <button className="h-12 w-12 grid place-items-center rounded-full border border-[var(--border)] hover:border-[var(--ink)]" aria-label="Share">
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            {[
              { I: Truck, t: "Free Shipping" },
              { I: RefreshCw, t: "7-Day Return" },
              { I: ShieldCheck, t: "Secure Checkout" },
            ].map(({ I, t }, i) => (
              <div key={i} className="rounded-xl border border-[var(--border)] p-3">
                <I className="h-4 w-4 mx-auto text-[var(--forest)]" />
                <div className="text-[11px] mt-1.5 text-[var(--muted-foreground)]">{t}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 space-y-4 border-t border-[var(--border)] pt-8">
            <details open className="group">
              <summary className="cursor-pointer eyebrow !text-[var(--ink)] list-none flex justify-between">
                Description <span className="text-[var(--forest)] group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-sm text-[var(--ink)]/75 leading-relaxed">
                A hand-finished piece from Shethara's Chennai atelier. Cut in premium fabric with a modern
                silhouette that flatters every drape. Tailored to sit softly against the body with clean,
                heirloom-quality stitching.
              </p>
            </details>
            <details className="group border-t border-[var(--border)] pt-4">
              <summary className="cursor-pointer eyebrow !text-[var(--ink)] list-none flex justify-between">
                Fabric & Care <span className="text-[var(--forest)] group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-sm text-[var(--ink)]/75 leading-relaxed">
                Premium blended silk. Dry clean only. Iron on reverse at low temperature. Store folded in
                the muslin bag provided.
              </p>
            </details>
            <details className="group border-t border-[var(--border)] pt-4">
              <summary className="cursor-pointer eyebrow !text-[var(--ink)] list-none flex justify-between">
                Shipping & Returns <span className="text-[var(--forest)] group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-sm text-[var(--ink)]/75 leading-relaxed">
                Ships within 24 hours from Chennai. Free shipping India-wide above ₹1,499. 7-day easy return
                on unworn pieces with tags.
              </p>
            </details>
          </div>
        </div>
      </section>

      <section className="bg-[var(--cream)] py-20">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <h2 className="font-display text-3xl sm:text-4xl mb-10">You may also love</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((rp) => <ProductCard key={rp.id} product={rp} />)}
          </div>
        </div>
      </section>
    </div>
  );
}