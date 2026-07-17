import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
}

export interface IOrder extends Document {
  orderId: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: IOrderItem[];
  subtotal: number;
  total: number;
  paymentMethod: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: Date;
}

const OrderItemSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
  color: { type: String },
});

const OrderSchema: Schema = new Schema({
  orderId: { type: String, required: true, unique: true },
  customer: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  items: { type: [OrderItemSchema], required: true },
  subtotal: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Processing",
  },
  createdAt: { type: Date, default: Date.now },
});

export const Order = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
