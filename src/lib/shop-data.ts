import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";
import p8 from "@/assets/p8.jpg";
import catEthnic from "@/assets/cat-ethnic.jpg";
import catWestern from "@/assets/cat-western.jpg";
import catLehenga from "@/assets/cat-lehenga.jpg";
import catKurti from "@/assets/cat-kurti.jpg";
import catBottom from "@/assets/cat-bottom.jpg";
import catOuter from "@/assets/cat-outer.jpg";

export type Product = {
  id: string;
  name: string;
  price: number;
  mrp: number;
  image: string;
  category: string;
  badge?: string;
  rating: number;
  colors: string[];
};

export const products: Product[] = [
  { id: "mint-silk-blouse", name: "Aria Mint Silk Blouse", price: 2499, mrp: 3999, image: p1, category: "top-wear", badge: "New", rating: 4.8, colors: ["#65CCB8", "#F2F2F2"] },
  { id: "emerald-anarkali", name: "Zara Emerald Anarkali Kurti", price: 3899, mrp: 5499, image: p2, category: "indian-wear", badge: "Best Seller", rating: 4.9, colors: ["#3B945E", "#182628"] },
  { id: "floral-midi", name: "Meadow Floral Midi Dress", price: 2999, mrp: 4299, image: p3, category: "dresses", badge: "Trending", rating: 4.7, colors: ["#65CCB8", "#57BA98"] },
  { id: "green-silk-saree", name: "Kaveri Green Silk Saree", price: 5499, mrp: 7999, image: p4, category: "indian-wear", badge: "Festive", rating: 4.9, colors: ["#3B945E"] },
  { id: "ivory-palazzo", name: "Cloud Ivory Wide Palazzo", price: 1799, mrp: 2499, image: p5, category: "bottom-wear", rating: 4.6, colors: ["#F2F2F2"] },
  { id: "green-lehenga", name: "Vana Emerald Bridal Lehenga", price: 12999, mrp: 18999, image: p6, category: "indian-wear", badge: "Couture", rating: 5.0, colors: ["#3B945E"] },
  { id: "linen-shirt-dress", name: "Sunday Linen Shirt Dress", price: 2299, mrp: 3199, image: p7, category: "dresses", badge: "Summer", rating: 4.5, colors: ["#F2F2F2"] },
  { id: "mint-coord", name: "Marina Mint Co-Ord Set", price: 3299, mrp: 4599, image: p8, category: "western", badge: "New Launch", rating: 4.8, colors: ["#65CCB8"] },
];

export type Category = {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  items: string[];
};

export const categories: Category[] = [
  {
    slug: "indian-wear",
    name: "Indian Wear",
    tagline: "Heritage weaves reimagined",
    image: catEthnic,
    items: ["Saree", "Ready to Wear Saree", "Lehenga", "Lehenga Choli", "Ghagra", "Chaniya Choli", "Kurti", "Straight Kurti", "Anarkali", "Angrakha Kurta", "Salwar Kameez", "Churidar Suit", "Palazzo Suit", "Sharara Suit", "Gharara Suit", "Dhoti Set", "Indo Western", "Co-Ord Set", "Dupatta Collection", "Cape Style Kurti", "Jacket Lehenga", "Saree Gown", "Lehenga Saree"],
  },
  {
    slug: "western",
    name: "Western Wear",
    tagline: "Modern silhouettes, daily luxury",
    image: catWestern,
    items: ["Co-Ord Set", "Jumpsuit", "Playsuit", "Blazer Set", "Corset Top", "Bustier", "Bralette", "Cami Top"],
  },
  {
    slug: "dresses",
    name: "Dresses",
    tagline: "From day-lights to evening icons",
    image: catLehenga,
    items: ["A-Line Dress", "Shift Dress", "Sheath Dress", "Bodycon Dress", "Wrap Dress", "Empire Dress", "Fit & Flare Dress", "Maxi Dress", "Midi Dress", "Mini Dress", "Shirt Dress", "Slip Dress", "Sundress", "Smock Dress", "Tiered Dress", "Gown", "Ball Gown", "Cocktail Dress", "Evening Dress", "Kaftan Dress", "High Low Dress", "Tunic Dress", "Tea Dress"],
  },
  {
    slug: "top-wear",
    name: "Top Wear",
    tagline: "Everyday essentials, elevated",
    image: catKurti,
    items: ["T-Shirt", "Polo T-Shirt", "Henley Top", "Tank Top", "Camisole", "Tube Top", "Crop Top", "Blouse", "Shirt", "Tunic", "Peplum Top", "Wrap Top", "Halter Top", "Off Shoulder Top", "Cold Shoulder Top", "Cape Top", "Kaftan Top", "Sweatshirt", "Hoodie", "Bodysuit"],
  },
  {
    slug: "bottom-wear",
    name: "Bottom Wear",
    tagline: "Cuts that carry you",
    image: catBottom,
    items: ["Skinny Jeans", "Straight Jeans", "Wide Leg Jeans", "Mom Jeans", "Flared Jeans", "Cargo Pants", "Trousers", "Palazzo Pants", "Culottes", "Leggings", "Jeggings", "Capri Pants", "Shorts", "Bermuda Shorts", "Pencil Skirt", "A-Line Skirt", "Pleated Skirt", "Circle Skirt", "Maxi Skirt", "Mini Skirt", "Tulip Skirt", "Wrap Skirt", "Denim Skirt"],
  },
  {
    slug: "outerwear",
    name: "Outerwear",
    tagline: "Layers with intention",
    image: catOuter,
    items: ["Blazer", "Waistcoat", "Shrug", "Cardigan", "Denim Jacket", "Bomber Jacket", "Leather Jacket", "Trench Coat", "Overcoat", "Cape", "Poncho", "Kimono", "Raincoat", "Puffer Jacket", "Parka Jacket"],
  },
];

export const collections = [
  { name: "Summer", tag: "Breezy edit", count: 48 },
  { name: "Festive", tag: "Occasion couture", count: 62 },
  { name: "Ethnic", tag: "Heritage revival", count: 84 },
  { name: "Western", tag: "Everyday luxe", count: 72 },
];

export function findProduct(id: string) {
  return products.find((p) => p.id === id);
}

export function findCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}