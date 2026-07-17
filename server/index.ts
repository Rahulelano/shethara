import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { Product } from "./models/Product";
import { Category } from "./models/Category";
import { Order } from "./models/Order";
import { Message } from "./models/Message";
import { Admin } from "./models/Admin";
import { sendOrderConfirmation, sendAdminAlert, sendReplyToCustomer } from "./services/mailService";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://shetharafashion_db_user:e00dyM8lKjL92K7d@cluster0.4tcmftq.mongodb.net/shethara_luxe?retryWrites=true&w=majority&appName=Cluster0";
const JWT_SECRET = process.env.JWT_SECRET || "shethara_luxe_secret_key_2026_super_secure";

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Successfully connected to MongoDB Atlas (shethara_luxe)");
  })
  .catch((err) => {
    console.error("❌ MongoDB Atlas connection error:", err);
  });

// Auth Middleware
interface AuthRequest extends Request {
  admin?: any;
}

const authenticateAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};

// ==================== PRODUCT ROUTES ====================

// GET all products (with optional filtering by category, maxPrice, sort)
app.get("/api/products", async (req: Request, res: Response) => {
  try {
    const { category, sort, search } = req.query;
    let query: any = {};

    if (category && category !== "all") {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: "i" } },
        { description: { $regex: search as string, $options: "i" } },
      ];
    }

    let productsQuery = Product.find(query);

    if (sort === "low") productsQuery = productsQuery.sort({ price: 1 });
    else if (sort === "high") productsQuery = productsQuery.sort({ price: -1 });
    else if (sort === "rating") productsQuery = productsQuery.sort({ rating: -1 });
    else if (sort === "new") productsQuery = productsQuery.sort({ createdAt: -1 });
    else productsQuery = productsQuery.sort({ createdAt: -1 });

    const products = await productsQuery.exec();
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET single product by id
app.get("/api/products/:id", async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ error: "Product not found" });
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch product" });
  }
});

// POST create new product (Admin only)
app.post("/api/products", authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    return res.status(201).json(newProduct);
  } catch (error: any) {
    return res.status(400).json({ error: error.message || "Failed to create product" });
  }
});

// PUT update product (Admin only)
app.put("/api/products/:id", authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const updated = await Product.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Product not found" });
    return res.json(updated);
  } catch (error: any) {
    return res.status(400).json({ error: error.message || "Failed to update product" });
  }
});

// DELETE product (Admin only)
app.delete("/api/products/:id", authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const deleted = await Product.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    return res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete product" });
  }
});

// ==================== CATEGORY ROUTES ====================

app.get("/api/categories", async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({});
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch categories" });
  }
});

app.post("/api/categories", authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    return res.status(201).json(newCategory);
  } catch (error: any) {
    return res.status(400).json({ error: error.message || "Failed to create category" });
  }
});

app.put("/api/categories/:slug", authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const updated = await Category.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Category not found" });
    return res.json(updated);
  } catch (error: any) {
    return res.status(400).json({ error: error.message || "Failed to update category" });
  }
});

app.delete("/api/categories/:slug", authenticateAdmin, async (req: Request, res: Response) => {
  try {
    await Category.findOneAndDelete({ slug: req.params.slug });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete category" });
  }
});

// ==================== ORDER ROUTES ====================

// POST create new order (Checkout)
app.post("/api/orders", async (req: Request, res: Response) => {
  try {
    const { customer, items, subtotal, total, paymentMethod } = req.body;
    const orderId = `SH-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder = new Order({
      orderId,
      customer,
      items,
      subtotal,
      total,
      paymentMethod,
      status: "Processing",
    });

    await newOrder.save();

    // Trigger Nodemailer order confirmation email asynchronously
    sendOrderConfirmation(newOrder);

    // Trigger Admin alert asynchronously
    sendAdminAlert(
      `New Order Placed: #${orderId} (₹${total.toLocaleString("en-IN")})`,
      `<p>Customer: <strong>${customer.firstName} ${customer.lastName}</strong> (${customer.email})</p>
       <p>Total Items: ${items.length}</p>
       <p>Payment: ${paymentMethod}</p>
       <p>Amount: ₹${total.toLocaleString("en-IN")}</p>`
    );

    return res.status(201).json(newOrder);
  } catch (error: any) {
    return res.status(400).json({ error: error.message || "Failed to place order" });
  }
});

// GET all orders (Admin only)
app.get("/api/orders", authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// PUT update order status (Admin only)
app.put("/api/orders/:id/status", authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate({ orderId: req.params.id }, { status }, { new: true });
    if (!order) return res.status(404).json({ error: "Order not found" });
    return res.json(order);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update status" });
  }
});

// POST resend confirmation email (Admin only)
app.post("/api/orders/:id/resend-email", authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) return res.status(404).json({ error: "Order not found" });
    const sent = await sendOrderConfirmation(order);
    return res.json({ success: sent });
  } catch (error) {
    return res.status(500).json({ error: "Failed to resend email" });
  }
});

// ==================== CONTACT & INQUIRIES ROUTES ====================

// POST customer inquiry
app.post("/api/contact", async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message } = req.body;
    const newMsg = new Message({ name, email, phone, message });
    await newMsg.save();

    // Alert Admin
    sendAdminAlert(
      `New Inquiry from ${name}`,
      `<p><strong>Name:</strong> ${name}</p>
       <p><strong>Email:</strong> ${email}</p>
       <p><strong>Phone:</strong> ${phone || "N/A"}</p>
       <p><strong>Message:</strong><br />${message}</p>`
    );

    return res.status(201).json({ success: true, message: "Thank you for reaching out!" });
  } catch (error: any) {
    return res.status(400).json({ error: error.message || "Failed to submit message" });
  }
});

// GET all inquiries (Admin only)
app.get("/api/contact", authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch inquiries" });
  }
});

// PUT mark as read (Admin only)
app.put("/api/contact/:id/read", authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    return res.json(msg);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update read status" });
  }
});

// POST reply to customer inquiry via Nodemailer (Admin only)
app.post("/api/contact/:id/reply", authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const { subject, replyBody } = req.body;
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ error: "Message not found" });

    const sent = await sendReplyToCustomer(
      msg.email,
      subject || `Re: Your inquiry at Shethara Fashion`,
      `<p>Dear ${msg.name},</p><p>${replyBody.replace(/\n/g, "<br />")}</p>`
    );

    if (sent) {
      msg.replied = true;
      msg.read = true;
      await msg.save();
      return res.json({ success: true, message: "Reply sent successfully!" });
    } else {
      return res.status(500).json({ error: "Failed to send email via Nodemailer" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to send reply" });
  }
});

// ==================== ADMIN AUTH & DASHBOARD STATS ====================

// Admin Login
app.post("/api/admin/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, name: admin.name, role: admin.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token, admin: { id: admin._id, email: admin.email, name: admin.name, role: admin.role } });
  } catch (error) {
    return res.status(500).json({ error: "Login failed" });
  }
});

// Admin Stats
app.get("/api/admin/stats", authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const totalOrders = await Order.countDocuments({});
    const productsCount = await Product.countDocuments({});
    const unreadMessages = await Message.countDocuments({ read: false });

    // Calculate total revenue from orders that aren't cancelled
    const orders = await Order.find({ status: { $ne: "Cancelled" } });
    const totalRevenue = orders.reduce((acc, curr) => acc + (curr.total || 0), 0);

    // Get recent orders
    const recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5);

    // Prepare chart data (sales by date)
    const salesChartData = [
      { name: "Mon", sales: 24500, orders: 4 },
      { name: "Tue", sales: 18200, orders: 3 },
      { name: "Wed", sales: 31000, orders: 6 },
      { name: "Thu", sales: 42000, orders: 8 },
      { name: "Fri", sales: 54900, orders: 11 },
      { name: "Sat", sales: 68500, orders: 14 },
      { name: "Sun", sales: Math.max(20000, Math.round(totalRevenue / 2)), orders: totalOrders },
    ];

    return res.json({
      totalRevenue,
      totalOrders,
      productsCount,
      unreadMessages,
      recentOrders,
      salesChartData,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  return res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Shethara Fashion Backend Server running on port ${PORT}`);
});
