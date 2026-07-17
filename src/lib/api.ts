import { products as fallbackProducts, categories as fallbackCategories } from "./shop-data";

const API_BASE = "/api";

// Helper to get auth headers for admin requests
function getAuthHeaders() {
  const token = localStorage.getItem("shethara_admin_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ==================== PUBLIC API ====================

export async function fetchProducts(params?: { category?: string; sort?: string; search?: string }) {
  try {
    const query = new URLSearchParams();
    if (params?.category) query.append("category", params.category);
    if (params?.sort) query.append("sort", params.sort);
    if (params?.search) query.append("search", params.search);

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch products from API");
    const data = await res.json();
    return data.length > 0 ? data : fallbackProducts;
  } catch (error) {
    console.warn("[API] Falling back to static products:", error);
    let list = [...fallbackProducts];
    if (params?.category && params.category !== "all") {
      list = list.filter((p) => p.category === params.category);
    }
    if (params?.sort === "low") list.sort((a, b) => a.price - b.price);
    if (params?.sort === "high") list.sort((a, b) => b.price - a.price);
    if (params?.sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }
}

export async function fetchProductById(id: string) {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error("Product not found via API");
    return await res.json();
  } catch (error) {
    console.warn(`[API] Falling back to static product for id=${id}:`, error);
    return fallbackProducts.find((p) => p.id === id) || null;
  }
}

export async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error("Failed to fetch categories from API");
    const data = await res.json();
    return data.length > 0 ? data : fallbackCategories;
  } catch (error) {
    console.warn("[API] Falling back to static categories:", error);
    return fallbackCategories;
  }
}

export async function createOrder(orderData: any) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to place order");
  }
  return await res.json();
}

export async function sendContactMessage(messageData: { name: string; email: string; phone?: string; message: string }) {
  const res = await fetch(`${API_BASE}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(messageData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to send message");
  }
  return await res.json();
}

// ==================== ADMIN API ====================

export async function adminLogin(credentials: { email: string; password: string }) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Invalid credentials");
  }
  return await res.json();
}

export async function fetchAdminStats() {
  const res = await fetch(`${API_BASE}/admin/stats`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch admin stats");
  return await res.json();
}

export async function fetchAdminOrders() {
  const res = await fetch(`${API_BASE}/orders`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return await res.json();
}

export async function updateOrderStatus(orderId: string, status: string) {
  const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update status");
  return await res.json();
}

export async function resendOrderEmail(orderId: string) {
  const res = await fetch(`${API_BASE}/orders/${orderId}/resend-email`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to resend email");
  return await res.json();
}

export async function fetchAdminProducts() {
  const res = await fetch(`${API_BASE}/products`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return await res.json();
}

export async function createProduct(productData: any) {
  const res = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create product");
  }
  return await res.json();
}

export async function updateProduct(id: string, productData: any) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update product");
  }
  return await res.json();
}

export async function deleteProduct(id: string) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete product");
  return await res.json();
}

export async function fetchAdminMessages() {
  const res = await fetch(`${API_BASE}/contact`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch messages");
  return await res.json();
}

export async function markMessageAsRead(id: string) {
  const res = await fetch(`${API_BASE}/contact/${id}/read`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to mark read");
  return await res.json();
}

export async function replyToMessage(id: string, replyData: { subject: string; replyBody: string }) {
  const res = await fetch(`${API_BASE}/contact/${id}/reply`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(replyData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to send email reply via Nodemailer");
  }
  return await res.json();
}
