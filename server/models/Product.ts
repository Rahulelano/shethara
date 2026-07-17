import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  id: string;
  name: string;
  price: number;
  mrp: number;
  image: string;
  category: string;
  badge?: string;
  rating: number;
  colors: string[];
  stock: number;
  description?: string;
  createdAt: Date;
}

const ProductSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  badge: { type: String },
  rating: { type: Number, default: 4.8 },
  colors: { type: [String], default: ["#3B945E"] },
  stock: { type: Number, default: 20 },
  description: { type: String, default: "Premium handcrafted ensemble from Shethara Fashion, tailored with luxurious fabrics and intricate detailing." },
  createdAt: { type: Date, default: Date.now },
});

export const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
