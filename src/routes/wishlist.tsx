import { createFileRoute, Link } from "@tanstack/react-router";
import { products } from "@/lib/shop-data";
import { ProductCard } from "@/components/site/product-card";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [{ title: "Wishlist — Shethara Fashion" }, { name: "robots", content: "noindex" }],
    links: [{ rel: "canonical", href: "/wishlist" }],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-20">
      <div className="eyebrow">Saved for later</div>
      <h1 className="mt-3 font-display text-5xl">Your Wishlist</h1>
      <p className="mt-3 text-[var(--muted-foreground)]">The pieces you're thinking about.</p>
      <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.slice(0, 3).map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      <div className="mt-12 text-center">
        <Link to="/shop" className="btn-outline">Discover more</Link>
      </div>
    </div>
  );
}