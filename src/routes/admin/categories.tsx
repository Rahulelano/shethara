import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Tags, Plus, Trash2, Sparkles, X, Loader2 } from "lucide-react";
import { fetchCategories } from "@/lib/api";
import { categories as staticCategories } from "@/lib/shop-data";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategoriesPage,
});

function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    slug: "",
    name: "",
    tagline: "",
    image: "/src/assets/cat-ethnic.jpg",
    items: "Saree, Lehenga, Kurti",
  });

  const { data: categories = staticCategories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        items: form.items.split(",").map((s) => s.trim()),
      };
      const token = localStorage.getItem("shethara_admin_token");
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create category");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsModalOpen(false);
    } catch (err: any) {
      alert("Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!window.confirm(`Delete category slug: ${slug}?`)) return;
    try {
      const token = localStorage.getItem("shethara_admin_token");
      await fetch(`/api/categories/${slug}`, {
        method: "DELETE",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#142022] border border-white/10 shadow-xl">
        <div>
          <span className="text-xs uppercase tracking-widest text-[var(--mint)] font-bold flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" /> Live Taxonomy & Categories
          </span>
          <h1 className="mt-1 font-display text-3xl font-bold text-white">Shethara Categories ({categories.length})</h1>
          <p className="text-xs text-white/60 mt-1">Organize fashion collections and storefront filters</p>
        </div>
        <button
          onClick={() => {
            setForm({ slug: "", name: "", tagline: "", image: "/src/assets/cat-ethnic.jpg", items: "Co-Ord, Dress" });
            setIsModalOpen(true);
          }}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[var(--forest)] to-[var(--mint)] text-[#0F1718] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[var(--forest)]/30 hover:brightness-110 active:scale-95 transition-all shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c: any) => (
          <div key={c.slug} className="p-6 rounded-3xl bg-[#142022] border border-white/10 shadow-xl hover:border-white/20 transition-all flex flex-col justify-between group">
            <div>
              <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-white/5 border border-white/10 relative mb-4">
                <img src={c.image} alt={c.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#0F1718]/80 text-white backdrop-blur-md">
                  /{c.slug}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-white group-hover:text-[var(--mint)] transition-colors">{c.name}</h3>
              <p className="text-xs text-white/60 mt-1 italic">{c.tagline}</p>

              <div className="flex flex-wrap gap-1.5 mt-4">
                {(c.items || []).map((item: string, i: number) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-[#182628] text-[var(--mint)] text-[11px] font-medium border border-white/5">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 mt-6 border-t border-white/10">
              <button
                onClick={() => handleDelete(c.slug)}
                title="Delete Category"
                className="p-2 rounded-xl bg-red-500/15 hover:bg-red-500/30 text-red-300 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#142022] border border-white/15 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h2 className="font-display text-2xl font-bold text-white">Create New Category</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">Category Slug (URL Identifier)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. bridal-wear"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                  className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-white focus:border-[var(--mint)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">Category Display Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bridal Wear"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-white focus:border-[var(--mint)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Handcrafted wedding couture"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-white focus:border-[var(--mint)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">Image URL / Asset Path</label>
                <input
                  type="text"
                  required
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-white focus:border-[var(--mint)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">Items Tags (comma separated)</label>
                <input
                  type="text"
                  value={form.items}
                  onChange={(e) => setForm({ ...form, items: e.target.value })}
                  className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-white focus:border-[var(--mint)] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl bg-[var(--forest)] hover:bg-[var(--forest)]/80 text-white font-bold transition-all flex items-center gap-2">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
