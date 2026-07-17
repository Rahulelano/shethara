import { createFileRoute } from "@tanstack/react-router";
import { products } from "@/lib/shop-data";
import { ProductCard } from "@/components/site/product-card";

export const Route = createFileRoute("/new-arrivals")({
  head: () => ({
    meta: [
      { title: "New Arrivals — Shethara Fashion" },
      { name: "description", content: "Just landed at Shethara Fashion — new sarees, kurtis, dresses and western wear this season." },
      { property: "og:title", content: "New Arrivals — Shethara Fashion" },
      { property: "og:url", content: "/new-arrivals" },
    ],
    links: [{ rel: "canonical", href: "/new-arrivals" }],
  }),
  component: NewArrivalsPage,
});

function NewArrivalsPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-20">
      <div className="eyebrow">Just Landed</div>
      <h1 className="mt-3 font-display text-5xl sm:text-6xl">New Arrivals</h1>
      <p className="mt-4 text-[var(--muted-foreground)] max-w-xl">Fresh from our atelier — the newest pieces to enter the Shethara wardrobe.</p>
      <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}