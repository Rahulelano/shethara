import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import type { Product } from "@/lib/shop-data";
import { formatINR } from "@/lib/shop-data";

export function ProductCard({ product }: { product: Product }) {
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="group block"
    >
      <div className="luxe-card relative">
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--muted)]">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={800}
            height={1000}
            className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
          />
          {product.badge && (
            <span className="absolute top-3 left-3 bg-[var(--ink)] text-[var(--mint)] text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full font-[var(--font-button)]">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="absolute top-3 right-3 bg-[var(--mint)] text-[var(--ink)] text-[10px] tracking-[0.16em] uppercase px-2.5 py-1 rounded-full font-[var(--font-button)] font-semibold">
              -{discount}%
            </span>
          )}
          <button
            onClick={(e) => e.preventDefault()}
            className="absolute bottom-3 right-3 h-9 w-9 grid place-items-center rounded-full bg-white/90 backdrop-blur text-[var(--ink)] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 hover:bg-[var(--ink)] hover:text-[var(--mint)]"
            aria-label="Wishlist"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-1 text-[11px] text-[var(--muted-foreground)]">
            <Star className="h-3 w-3 fill-[var(--forest)] text-[var(--forest)]" />
            <span className="font-medium">{product.rating}</span>
          </div>
          <h3 className="mt-1.5 font-display text-[17px] leading-tight text-[var(--ink)] line-clamp-1">
            {product.name}
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-[var(--ink)] font-semibold">{formatINR(product.price)}</span>
            <span className="text-xs text-[var(--muted-foreground)] line-through">{formatINR(product.mrp)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}