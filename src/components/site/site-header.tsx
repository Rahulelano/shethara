import { Link } from "@tanstack/react-router";
import { Search, Heart, ShoppingBag, User, Menu, X, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { categories, products } from "@/lib/shop-data";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/collections", label: "Collections" },
  { to: "/new-arrivals", label: "New Arrivals" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-[var(--ink)] text-[var(--mint)] text-[11px] tracking-[0.24em] uppercase py-2 text-center font-[var(--font-button)]">
        Free shipping across India · Flat 15% off first order · Code SHETHARA15
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-500 text-white bg-[var(--ink)] ${
          scrolled ? "shadow-[0_4px_20px_rgba(0,0,0,0.4)]" : ""
        }`}
      >
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 flex items-center justify-between lg:grid lg:grid-cols-[auto_1fr_auto] gap-4 lg:gap-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden -ml-1 p-2 text-white hover:text-[var(--mint)] transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/" className="group flex items-center">
              <img
                src="/1000255917-removebg-preview.png"
                alt="Shethara Fashion Logo"
                className="h-12 sm:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105 brightness-110"
              />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center justify-center gap-9 font-[var(--font-button)] text-[12px] uppercase tracking-[0.2em] text-white">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="relative py-2 transition-colors text-white/85 hover:text-[var(--mint)]"
                activeProps={{ className: "text-[var(--mint)] font-medium" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-1.5 sm:gap-2 text-white ml-auto">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:text-[var(--mint)] transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5 sm:h-[18px] sm:w-[18px]" />
            </button>
            <Link to="/admin" title="Admin Portal" className="p-2 text-[var(--mint)] hover:scale-110 transition-transform hidden sm:inline-flex" aria-label="Admin">
              <ShieldCheck className="h-[18px] w-[18px]" />
            </Link>
            <Link to="/account" className="p-2 hover:text-[var(--mint)] transition-colors hidden sm:inline-flex" aria-label="Account">
              <User className="h-[18px] w-[18px]" />
            </Link>
            <Link to="/wishlist" className="p-2 hover:text-[var(--mint)] transition-colors hidden sm:inline-flex" aria-label="Wishlist">
              <Heart className="h-[18px] w-[18px]" />
            </Link>
            <Link to="/cart" className="relative p-2 hover:text-[var(--mint)] transition-colors" aria-label="Cart">
              <ShoppingBag className="h-5 w-5 sm:h-[18px] sm:w-[18px]" />
              <span className="absolute -top-0.5 -right-0.5 grid place-items-center h-4 min-w-4 px-1 rounded-full bg-[var(--mint)] text-[10px] font-semibold text-[var(--ink)]">
                2
              </span>
            </Link>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div className="border-t border-white/10 bg-[var(--ink)] px-5 sm:px-8 py-3.5 shadow-2xl transition-all duration-300">
            <div className="mx-auto max-w-[1400px] flex items-center gap-3">
              <Search className="h-4 w-4 text-[var(--mint)] shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search sarees, lehengas, kurtis, dresses, western wear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-full py-2 px-4 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-[var(--mint)] transition-colors"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-white/60 hover:text-white text-xs font-[var(--font-button)] uppercase tracking-wider px-2 py-1">
                  Clear
                </button>
              )}
              <button
                onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                className="p-1 text-white/70 hover:text-[var(--mint)] transition-colors shrink-0"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Live Search Results */}
            {searchQuery.trim().length > 0 && (
              <div className="mx-auto max-w-[1400px] mt-4 pt-4 border-t border-white/10 max-h-[350px] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {products
                  .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()))
                  .slice(0, 6)
                  .map((p) => (
                    <Link
                      key={p.id}
                      to="/product/$id"
                      params={{ id: p.id }}
                      onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group border border-white/5 hover:border-white/20"
                    >
                      <img src={p.image} alt={p.name} className="h-14 w-11 object-cover rounded shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-white group-hover:text-[var(--mint)] truncate transition-colors">{p.name}</div>
                        <div className="text-xs text-[var(--mint)] font-semibold mt-1">₹{p.price.toLocaleString("en-IN")}</div>
                      </div>
                    </Link>
                  ))}
                {products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                  <div className="col-span-full text-center py-6 text-sm text-white/60 font-[var(--font-button)] uppercase tracking-wider">
                    No matching products found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setOpen(false)} />
        <aside
          className={`absolute inset-y-0 left-0 w-[86%] max-w-sm bg-[var(--ink)] text-white shadow-2xl transition-transform duration-500 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <Link to="/" onClick={() => setOpen(false)} className="flex items-center">
              <img
                src="/1000255917-removebg-preview.png"
                alt="Shethara Fashion Logo"
                className="h-9 w-auto object-contain brightness-110"
              />
            </Link>
            <button onClick={() => setOpen(false)} className="text-white hover:text-[var(--mint)] transition-colors" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="p-5 flex flex-col gap-1 font-[var(--font-button)] text-sm uppercase tracking-[0.18em]">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-3 border-b border-white/10 text-white/90 hover:text-[var(--mint)] transition-colors"
                activeProps={{ className: "text-[var(--mint)] font-semibold" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="py-3 border-b border-white/10 text-[var(--mint)] font-bold flex items-center gap-2"
            >
              <ShieldCheck className="h-4 w-4" /> Admin Portal
            </Link>
          </nav>
          <div className="px-5 pt-4 pb-2 eyebrow !text-[var(--mint)]">Shop by category</div>
          <div className="px-5 pb-8 flex flex-col">
            {categories.map((c) => (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm text-white/75 hover:text-[var(--mint)] transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}