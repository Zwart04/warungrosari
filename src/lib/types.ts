export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: "admin" | "staff";
};

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  description: string;
  createdAt: string;
};

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  productIds: string[];
  quantities: number[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  note?: string;
};

export type JournalType = "order_income" | "expense" | "ads_spend" | "other";

export type FinanceJournal = {
  id: string;
  date: string;
  type: JournalType;
  description: string;
  amount: number;
  orderId?: string;
};

export type AdsPlatform = "meta" | "google" | "tiktok";

export type AdsSource = {
  id: string;
  platform: AdsPlatform;
  campaign: string;
  clicks: number;
  conversions: number;
  spend: number;
  date: string;
};

export const DEFAULT_USER: User = {
  id: "u1",
  name: "Admin Rosari",
  email: "admin@rosari.id",
  password: "password123",
  role: "admin",
};

export const DEFAULT_PRODUCTS: Product[] = [
  { id: "p1", name: "Rendang Sapi Premium", price: 85000, category: "Makanan", stock: 42, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400", description: "Rendang sapi asli Padang, dimasak 8 jam dengan rempah pilihan.", createdAt: "2026-01-10" },
  { id: "p2", name: "Kopi Gayo Aceh 250g", price: 65000, category: "Minuman", stock: 80, image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400", description: "Biji kopi Gayo premium, aroma floral dan body kuat.", createdAt: "2026-01-12" },
  { id: "p3", name: "Keripik Singkong Balado", price: 25000, category: "Snack", stock: 120, image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400", description: "Keripik singkong renyah dengan bumbu balado pedas manis.", createdAt: "2026-01-15" },
  { id: "p4", name: "Sambal Matah Bali", price: 35000, category: "Sambal", stock: 60, image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400", description: "Sambal matah segar dengan irisan bawang dan cabai rawit.", createdAt: "2026-02-01" },
  { id: "p5", name: "Dendeng Batokok", price: 95000, category: "Makanan", stock: 30, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400", description: "Dendeng sapi tipis khas Minang, gurih dan pedas.", createdAt: "2026-02-10" },
  { id: "p6", name: "Teh Talua Kemasan", price: 18000, category: "Minuman", stock: 100, image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400", description: "Teh talua instan, minuman energi khas Sumatera Barat.", createdAt: "2026-02-14" },
];
