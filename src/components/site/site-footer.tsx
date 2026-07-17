import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Phone, MapPin, Mail } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-[var(--ink)] text-[var(--cream)]">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pt-20 pb-10 grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link to="/" className="inline-flex items-center group">
            <img
              src="/1000255917-removebg-preview.png"
              alt="Shethara Fashion Logo"
              className="h-14 sm:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105 brightness-110"
            />
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-white/70 max-w-sm">
            A premium boutique for the modern Indian woman — where heritage weaves meet contemporary luxury.
          </p>
          <div className="mt-6 space-y-3 text-sm text-white/80">
            <p className="flex items-start gap-3"><MapPin className="h-4 w-4 mt-0.5 text-[var(--mint)]" /> No.16/1, Pari Street 2nd Cross,<br />Choolaimedu, Chennai — 600094</p>
            <p className="flex items-center gap-3"><Phone className="h-4 w-4 text-[var(--mint)]" /> +91 88078 63026 · +91 95662 86645</p>
            <p className="flex items-center gap-3"><Mail className="h-4 w-4 text-[var(--mint)]" /> shetharafashion@gmail.com</p>
          </div>
          <div className="flex items-center gap-3 mt-6">
            {[Instagram, Facebook, Youtube].map((I, i) => (
              <a
                key={i}
                href="#"
                className="h-10 w-10 grid place-items-center rounded-full border border-white/15 hover:bg-[var(--mint)] hover:text-[var(--ink)] hover:border-[var(--mint)] transition-all"
                aria-label="social"
              >
                <I className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <div className="eyebrow !text-white/60">Shop</div>
          <ul className="mt-5 space-y-3 text-sm text-white/80">
            <li><Link to="/shop" className="hover:text-[var(--mint)]">All Products</Link></li>
            <li><Link to="/new-arrivals" className="hover:text-[var(--mint)]">New Arrivals</Link></li>
            <li><Link to="/collections" className="hover:text-[var(--mint)]">Collections</Link></li>
            <li><Link to="/category/$slug" params={{ slug: "indian-wear" }} className="hover:text-[var(--mint)]">Indian Wear</Link></li>
            <li><Link to="/category/$slug" params={{ slug: "western" }} className="hover:text-[var(--mint)]">Western Wear</Link></li>
            <li><Link to="/category/$slug" params={{ slug: "dresses" }} className="hover:text-[var(--mint)]">Dresses</Link></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow !text-white/60">Support</div>
          <ul className="mt-5 space-y-3 text-sm text-white/80">
            <li><Link to="/contact" className="hover:text-[var(--mint)]">Contact</Link></li>
            <li><a href="#" className="hover:text-[var(--mint)]">Shipping Policy</a></li>
            <li><a href="#" className="hover:text-[var(--mint)]">Returns & Refunds</a></li>
            <li><a href="#" className="hover:text-[var(--mint)]">Size Guide</a></li>
            <li><a href="#" className="hover:text-[var(--mint)]">FAQs</a></li>
            <li><a href="#" className="hover:text-[var(--mint)]">Privacy Policy</a></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow !text-white/60">Newsletter</div>
          <p className="mt-5 text-sm text-white/70">
            Join The Atelier List for private previews, launch access and 10% off your first order.
          </p>
          <form className="mt-5 flex items-center gap-2 border-b border-white/25 pb-2 focus-within:border-[var(--mint)]">
            <input
              type="email"
              required
              placeholder="your@email.com"
              className="w-full bg-transparent text-sm py-2 outline-none placeholder:text-white/40"
            />
            <button className="text-[11px] tracking-[0.24em] uppercase text-[var(--mint)] font-[var(--font-button)]">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>© {new Date().getFullYear()} Shethara Fashion. All rights reserved.</p>
          <p className="tracking-widest uppercase">Crafted in Chennai</p>
        </div>
      </div>
    </footer>
  );
}