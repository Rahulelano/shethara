import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Edit3, Trash2, Search, X, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { fetchAdminProducts, createProduct, updateProduct, deleteProduct } from "@/lib/api";
import { formatINR, products as staticProducts } from "@/lib/shop-data";

export const Route = createFileRoute("/admin/products")({
  component: AdminProductsPage,
});

function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    id: "",
    name: "",
    price: 2499,
    mrp: 3999,
    image: "/src/assets/p1.jpg",
    category: "top-wear",
    badge: "New",
    rating: 4.8,
    stock: 25,
    colors: "#65CCB8,#F2F2F2",
    description: "Premium handcrafted ensemble tailored with luxurious fabrics and intricate detailing.",
  });

  const { data: products = staticProducts, isLoading } = useQuery({
    queryKey: ["adminProducts"],
    queryFn: () => fetchAdminProducts(),
  });

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      id: `sh-${Math.floor(1000 + Math.random() * 9000)}`,
      name: "",
      price: 2999,
      mrp: 4499,
      image: "/src/assets/p1.jpg",
      category: "indian-wear",
      badge: "New",
      rating: 4.8,
      stock: 20,
      colors: "#3B945E,#182628",
      description: "Handcrafted pure silk luxury ensemble from Shethara Fashion.",
    });
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditingId(p.id);
    setForm({
      id: p.id,
      name: p.name,
      price: p.price,
      mrp: p.mrp,
      image: p.image,
      category: p.category,
      badge: p.badge || "",
      rating: p.rating || 4.8,
      stock: p.stock || 20,
      colors: Array.isArray(p.colors) ? p.colors.join(",") : p.colors || "#3B945E",
      description: p.description || "",
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        mrp: Number(form.mrp),
        rating: Number(form.rating),
        stock: Number(form.stock),
        colors: form.colors.split(",").map((c) => c.trim()),
      };

      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }

      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete product ID: ${id}?`)) return;
    try {
      await deleteProduct(id);
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (err: any) {
      alert(err.message || "Failed to delete product");
    }
  };

  const filtered = products.filter((p: any) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#142022] border border-white/10 shadow-xl">
        <div>
          <span className="text-xs uppercase tracking-widest text-[var(--mint)] font-bold flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" /> Live Catalog Management
          </span>
          <h1 className="mt-1 font-display text-3xl font-bold text-white">Shethara Products ({products.length})</h1>
          <p className="text-xs text-white/60 mt-1">Add, update or remove items from the live storefront catalog</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[var(--forest)] to-[var(--mint)] text-[#0F1718] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[var(--forest)]/30 hover:brightness-110 active:scale-95 transition-all shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
        <input
          type="text"
          placeholder="Search catalog by name, ID or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl bg-[#142022] border border-white/15 pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[var(--mint)] outline-none transition-colors shadow-lg"
        />
      </div>

      {/* Products Table */}
      <div className="p-6 rounded-3xl bg-[#142022] border border-white/10 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/50 text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Product Info</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price / MRP</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((p: any) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                  <td className="py-3 px-4">
                    <div className="h-14 w-14 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                      <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-white group-hover:text-[var(--mint)] transition-colors">{p.name}</div>
                    <div className="text-xs text-white/40 font-mono mt-0.5">ID: {p.id}</div>
                    {p.badge && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-[var(--forest)]/25 text-[var(--mint)] border border-[var(--forest)]/40">
                        {p.badge}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 rounded-full bg-white/5 text-white/80 text-xs font-medium border border-white/10">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-[var(--mint)]">{formatINR(p.price)}</div>
                    <div className="text-xs text-white/40 line-through">{formatINR(p.mrp)}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        (p.stock || 20) > 10
                          ? "bg-[var(--forest)]/20 text-green-300 border border-[var(--forest)]/30"
                          : "bg-red-500/20 text-red-300 border border-red-500/30"
                      }`}
                    >
                      {(p.stock || 20) > 10 ? <CheckCircle2 className="h-3 w-3" /> : null}
                      <span>{p.stock || 20} in stock</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(p)}
                      title="Edit Product"
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      title="Delete Product"
                      className="p-2 rounded-xl bg-red-500/15 hover:bg-red-500/30 text-red-300 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#142022] border border-white/15 rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h2 className="font-display text-2xl font-bold text-white">
                {editingId ? `Edit Product: ${editingId}` : "Create New Luxury Product"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && <div className="mb-4 p-3 rounded-xl bg-red-500/20 text-red-200 text-xs">{error}</div>}

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">Unique Product ID</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingId}
                    value={form.id}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                    className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-white disabled:opacity-50 focus:border-[var(--mint)] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-white focus:border-[var(--mint)] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-white focus:border-[var(--mint)] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={form.mrp}
                    onChange={(e) => setForm({ ...form, mrp: Number(e.target.value) })}
                    className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-white focus:border-[var(--mint)] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                    className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-white focus:border-[var(--mint)] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">Category Slug</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-xl bg-[#182628] border border-white/15 px-4 py-2.5 text-white focus:border-[var(--mint)] outline-none"
                  >
                    <option value="indian-wear">Indian Wear</option>
                    <option value="western">Western Wear</option>
                    <option value="dresses">Dresses</option>
                    <option value="top-wear">Top Wear</option>
                    <option value="bottom-wear">Bottom Wear</option>
                    <option value="outerwear">Outerwear</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={form.badge}
                    placeholder="New, Best Seller, Couture..."
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-white focus:border-[var(--mint)] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">Image URL / Asset Path</label>
                <input
                  type="text"
                  required
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="/src/assets/p1.jpg or https://..."
                  className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-white focus:border-[var(--mint)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">Hex Colors (comma separated)</label>
                <input
                  type="text"
                  value={form.colors}
                  onChange={(e) => setForm({ ...form, colors: e.target.value })}
                  placeholder="#3B945E,#65CCB8"
                  className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-white focus:border-[var(--mint)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-white focus:border-[var(--mint)] outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-[var(--forest)] hover:bg-[var(--forest)]/80 text-white font-bold transition-all flex items-center gap-2"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{editingId ? "Save Changes" : "Create Product"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
