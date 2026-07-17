import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  items: string[];
}

const CategorySchema: Schema = new Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  tagline: { type: String, required: true },
  image: { type: String, required: true },
  items: { type: [String], default: [] },
});

export const Category = mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
