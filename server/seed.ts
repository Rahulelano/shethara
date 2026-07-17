import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import { Product } from "./models/Product";
import { Category } from "./models/Category";
import { Order } from "./models/Order";
import { Message } from "./models/Message";
import { Admin } from "./models/Admin";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://shetharafashion_db_user:e00dyM8lKjL92K7d@cluster0.4tcmftq.mongodb.net/shethara_luxe?retryWrites=true&w=majority&appName=Cluster0";

const initialProducts = [
  {
    id: "mint-silk-blouse",
    name: "Aria Mint Silk Blouse",
    price: 2499,
    mrp: 3999,
    image: "/src/assets/p1.jpg",
    category: "top-wear",
    badge: "New",
    rating: 4.8,
    colors: ["#65CCB8", "#F2F2F2"],
    stock: 25,
    description: "Handcrafted pure mulberry silk blouse tailored in a soft mint tone with delicate zari borders.",
  },
  {
    id: "emerald-anarkali",
    name: "Zara Emerald Anarkali Kurti",
    price: 3899,
    mrp: 5499,
    image: "/src/assets/p2.jpg",
    category: "indian-wear",
    badge: "Best Seller",
    rating: 4.9,
    colors: ["#3B945E", "#182628"],
    stock: 18,
    description: "Royal emerald green floor-length Anarkali kurti crafted from rich chanderi cotton and hand-embroidered motifs.",
  },
  {
    id: "floral-midi",
    name: "Meadow Floral Midi Dress",
    price: 2999,
    mrp: 4299,
    image: "/src/assets/p3.jpg",
    category: "dresses",
    badge: "Trending",
    rating: 4.7,
    colors: ["#65CCB8", "#57BA98"],
    stock: 30,
    description: "Breezy pastel floral midi dress designed for effortless brunch-to-evening luxury.",
  },
  {
    id: "green-silk-saree",
    name: "Kaveri Green Silk Saree",
    price: 5499,
    mrp: 7999,
    image: "/src/assets/p4.jpg",
    category: "indian-wear",
    badge: "Festive",
    rating: 4.9,
    colors: ["#3B945E"],
    stock: 12,
    description: "Traditional Kanjivaram-inspired soft silk saree featuring authentic gold weave pallu and forest green drape.",
  },
  {
    id: "ivory-palazzo",
    name: "Cloud Ivory Wide Palazzo",
    price: 1799,
    mrp: 2499,
    image: "/src/assets/p5.jpg",
    category: "bottom-wear",
    rating: 4.6,
    colors: ["#F2F2F2"],
    stock: 40,
    description: "Super soft linen-cotton wide leg palazzo trousers with high-waist comfort fit.",
  },
  {
    id: "green-lehenga",
    name: "Vana Emerald Bridal Lehenga",
    price: 12999,
    mrp: 18999,
    image: "/src/assets/p6.jpg",
    category: "indian-wear",
    badge: "Couture",
    rating: 5.0,
    colors: ["#3B945E"],
    stock: 5,
    description: "Bespoke bridal and festive lehenga set with intricate sequins, cut-dana embroidery, and organza dupatta.",
  },
  {
    id: "linen-shirt-dress",
    name: "Sunday Linen Shirt Dress",
    price: 2299,
    mrp: 3199,
    image: "/src/assets/p7.jpg",
    category: "dresses",
    badge: "Summer",
    rating: 4.5,
    colors: ["#F2F2F2"],
    stock: 22,
    description: "Relaxed tailored pure organic linen shirt dress with wooden buttons and cinched waist belt.",
  },
  {
    id: "mint-coord",
    name: "Marina Mint Co-Ord Set",
    price: 3299,
    mrp: 4599,
    image: "/src/assets/p8.jpg",
    category: "western",
    badge: "New Launch",
    rating: 4.8,
    colors: ["#65CCB8"],
    stock: 15,
    description: "Contemporary two-piece co-ord lounge & vacation ensemble in signature Shethara mint.",
  },
];

const initialCategories = [
  {
    slug: "indian-wear",
    name: "Indian Wear",
    tagline: "Heritage weaves reimagined",
    image: "/src/assets/cat-ethnic.jpg",
    items: ["Saree", "Ready to Wear Saree", "Lehenga", "Anarkali", "Salwar Kameez", "Kurti", "Sharara Suit", "Co-Ord Set"],
  },
  {
    slug: "western",
    name: "Western Wear",
    tagline: "Modern silhouettes, daily luxury",
    image: "/src/assets/cat-western.jpg",
    items: ["Co-Ord Set", "Jumpsuit", "Blazer Set", "Corset Top", "Bustier", "Cami Top"],
  },
  {
    slug: "dresses",
    name: "Dresses",
    tagline: "From day-lights to evening icons",
    image: "/src/assets/cat-lehenga.jpg",
    items: ["A-Line Dress", "Shift Dress", "Wrap Dress", "Fit & Flare Dress", "Maxi Dress", "Midi Dress", "Shirt Dress", "Gown"],
  },
  {
    slug: "top-wear",
    name: "Top Wear",
    tagline: "Everyday essentials, elevated",
    image: "/src/assets/cat-kurti.jpg",
    items: ["T-Shirt", "Camisole", "Crop Top", "Blouse", "Shirt", "Tunic", "Peplum Top", "Kaftan Top"],
  },
  {
    slug: "bottom-wear",
    name: "Bottom Wear",
    tagline: "Cuts that carry you",
    image: "/src/assets/cat-bottom.jpg",
    items: ["Skinny Jeans", "Wide Leg Jeans", "Trousers", "Palazzo Pants", "Culottes", "Leggings", "Shorts", "Maxi Skirt"],
  },
  {
    slug: "outerwear",
    name: "Outerwear",
    tagline: "Layers with intention",
    image: "/src/assets/cat-outer.jpg",
    items: ["Blazer", "Waistcoat", "Shrug", "Cardigan", "Denim Jacket", "Trench Coat", "Cape"],
  },
];

const sampleOrders = [
  {
    orderId: "SH-10248",
    customer: {
      firstName: "Ananya",
      lastName: "Ramaswamy",
      email: "shetharafashion@gmail.com",
      phone: "+91 98401 23456",
      address: "12, Kasturi Ranga Road, Alwarpet",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600018",
    },
    items: [
      { id: "green-silk-saree", name: "Kaveri Green Silk Saree", price: 5499, quantity: 1, image: "/src/assets/p4.jpg", color: "#3B945E" },
    ],
    subtotal: 5499,
    total: 5499,
    paymentMethod: "UPI (Razorpay)",
    status: "Delivered",
  },
  {
    orderId: "SH-10291",
    customer: {
      firstName: "Divya",
      lastName: "Krishnan",
      email: "divya@example.com",
      phone: "+91 95001 88990",
      address: "45, 2nd Avenue, Anna Nagar",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600040",
    },
    items: [
      { id: "emerald-anarkali", name: "Zara Emerald Anarkali Kurti", price: 3899, quantity: 1, image: "/src/assets/p2.jpg", color: "#3B945E" },
      { id: "mint-silk-blouse", name: "Aria Mint Silk Blouse", price: 2499, quantity: 1, image: "/src/assets/p1.jpg", color: "#65CCB8" },
    ],
    subtotal: 6398,
    total: 6398,
    paymentMethod: "Credit / Debit Card",
    status: "Processing",
  },
  {
    orderId: "SH-10310",
    customer: {
      firstName: "Sowmya",
      lastName: "Natarajan",
      email: "sowmya.n@example.com",
      phone: "+91 98840 55667",
      address: "88, CP Ramaswamy Road, Abiramapuram",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600018",
    },
    items: [
      { id: "green-lehenga", name: "Vana Emerald Bridal Lehenga", price: 12999, quantity: 1, image: "/src/assets/p6.jpg", color: "#3B945E" },
    ],
    subtotal: 12999,
    total: 12999,
    paymentMethod: "Net Banking",
    status: "Shipped",
  },
];

const sampleMessages = [
  {
    name: "Meenakshi Sundaram",
    email: "meenakshi@example.com",
    phone: "+91 94440 11223",
    message: "Hi Shethara team! Do you offer custom blouse stitching along with the Kaveri Green Silk Saree for a wedding next month?",
    read: false,
    replied: false,
  },
  {
    name: "Priyanka S",
    email: "priyanka.s@example.com",
    phone: "+91 90030 44556",
    message: "Can we schedule a private consultation visit at your Choolaimedu boutique this Saturday afternoon around 4 PM?",
    read: true,
    replied: true,
  },
];

async function seedDatabase() {
  try {
    console.log("⏳ Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected! Starting database seed...");

    // Clear existing collections
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Order.deleteMany({});
    await Message.deleteMany({});
    await Admin.deleteMany({});
    console.log("🧹 Cleared old records.");

    // Seed Admin account
    const adminPassHash = bcrypt.hashSync(process.env.ADMIN_PASS || "admin123", 10);
    const newAdmin = new Admin({
      email: process.env.ADMIN_EMAIL || "admin@shetharafashion.com",
      passwordHash: adminPassHash,
      name: "Shethara Admin",
      role: "Super Admin",
    });
    await newAdmin.save();
    console.log("👤 Admin user seeded -> Email: admin@shetharafashion.com | Password: admin123");

    // Seed Products
    await Product.insertMany(initialProducts);
    console.log(`👗 Seeded ${initialProducts.length} signature products.`);

    // Seed Categories
    await Category.insertMany(initialCategories);
    console.log(`🏷️ Seeded ${initialCategories.length} categories.`);

    // Seed Orders
    await Order.insertMany(sampleOrders);
    console.log(`📦 Seeded ${sampleOrders.length} sample orders.`);

    // Seed Messages
    await Message.insertMany(sampleMessages);
    console.log(`💬 Seeded ${sampleMessages.length} customer inquiries.`);

    console.log("🌟 Database seeding complete! Shethara Fashion backend is ready.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

seedDatabase();
