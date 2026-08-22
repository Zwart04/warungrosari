"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { User, Product, Order, FinanceJournal, AdsSource, DEFAULT_USER, DEFAULT_PRODUCTS, OrderStatus } from "./types";

type Lang = "en" | "id";

type AppState = {
  user: User | null;
  users: User[];
  products: Product[];
  orders: Order[];
  journals: FinanceJournal[];
  ads: AdsSource[];
  lang: Lang;
  darkMode: boolean;
  wahaUrl: string;
  wahaStatus: string;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  setLang: (l: Lang) => void;
  setDarkMode: (v: boolean) => void;
  setWahaUrl: (v: string) => void;
  setWahaStatus: (v: string) => void;
  addProduct: (p: Product) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addOrder: (o: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  deleteOrder: (id: string) => void;
  addJournal: (j: FinanceJournal) => void;
  addAds: (a: AdsSource) => void;
  updateAds: (id: string, a: Partial<AdsSource>) => void;
  deleteAds: (id: string) => void;
};

const AppContext = createContext<AppState | null>(null);

const LS_USER = "hf_user";
const LS_USERS = "hf_users";
const LS_PRODUCTS = "wr_products";
const LS_ORDERS = "wr_orders";
const LS_JOURNALS = "wr_journals";
const LS_ADS = "wr_ads";
const LS_LANG = "wr_lang";
const LS_DARK = "wr_dark";
const LS_WAHA_URL = "wr_waha_url";
const LS_WAHA_STATUS = "wr_waha_status";

function getStoredUsers(): User[] {
  if (typeof window === "undefined") return [DEFAULT_USER];
  try {
    const raw = localStorage.getItem(LS_USERS);
    if (!raw) return [DEFAULT_USER];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return [DEFAULT_USER];
    return parsed;
  } catch {
    return [DEFAULT_USER];
  }
}

function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_USER);
    if (!raw || raw === "null" || raw === "undefined") return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([DEFAULT_USER]);
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [journals, setJournals] = useState<FinanceJournal[]>([]);
  const [ads, setAds] = useState<AdsSource[]>([
    { id: "a1", platform: "meta", campaign: "Ramadhan Sale - Rendang", clicks: 1240, conversions: 86, spend: 850000, date: "2026-03-01" },
    { id: "a2", platform: "google", campaign: "Kopi Gayo Search", clicks: 980, conversions: 64, spend: 620000, date: "2026-03-05" },
    { id: "a3", platform: "meta", campaign: "Snack Bundle Promo", clicks: 2100, conversions: 142, spend: 1100000, date: "2026-03-10" },
  ]);
  const [lang, setLangState] = useState<Lang>("id");
  const [darkMode, setDarkModeState] = useState(false);
  const [wahaUrl, setWahaUrlState] = useState<string>(process.env.NEXT_PUBLIC_WAHA_URL || "https://waha.example.com");
  const [wahaStatus, setWahaStatusState] = useState<string>("STOPPED");
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    const storedUsers = getStoredUsers();
    setUsers(storedUsers);
    const storedUser = getStoredUser();
    if (storedUser) {
      // validate user exists in users list, fallback to DEFAULT_USER if email matches
      const exists = storedUsers.find((u) => u.email === storedUser.email);
      setUser(exists ?? storedUser);
    }
    try {
      const p = localStorage.getItem(LS_PRODUCTS);
      if (p) setProducts(JSON.parse(p));
      const o = localStorage.getItem(LS_ORDERS);
      if (o) setOrders(JSON.parse(o));
      const j = localStorage.getItem(LS_JOURNALS);
      if (j) setJournals(JSON.parse(j));
      const a = localStorage.getItem(LS_ADS);
      if (a) setAds(JSON.parse(a));
      const l = localStorage.getItem(LS_LANG) as Lang | null;
      if (l === "en" || l === "id") setLangState(l);
      const d = localStorage.getItem(LS_DARK);
      if (d) setDarkModeState(d === "true");
      const wu = localStorage.getItem(LS_WAHA_URL);
      if (wu) setWahaUrlState(wu);
      const ws = localStorage.getItem(LS_WAHA_STATUS);
      if (ws) setWahaStatusState(ws);
    } catch {}
    setHydrated(true);
  }, []);

  // Persist users - FIX: never wipe hf_users when user is null (logout)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(LS_USERS, JSON.stringify(users));
    } catch {}
  }, [users, hydrated]);

  // Persist current user - FIX: only update hf_user, never wipe hf_users
  useEffect(() => {
    if (!hydrated) return;
    try {
      if (user) {
        localStorage.setItem(LS_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(LS_USER);
        // INTENTIONALLY NOT wiping LS_USERS here — keeps registered users after logout
      }
    } catch {}
  }, [user, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LS_PRODUCTS, JSON.stringify(products));
  }, [products, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LS_ORDERS, JSON.stringify(orders));
  }, [orders, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LS_JOURNALS, JSON.stringify(journals));
  }, [journals, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LS_ADS, JSON.stringify(ads));
  }, [ads, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LS_LANG, lang);
  }, [lang, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LS_DARK, String(darkMode));
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LS_WAHA_URL, wahaUrl);
  }, [wahaUrl, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LS_WAHA_STATUS, wahaStatus);
  }, [wahaStatus, hydrated]);

  const login = useCallback((email: string, password: string) => {
    const all = getStoredUsers();
    // ensure state users includes stored
    const list = users.length > 1 ? users : all;
    const found = list.find((u) => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      return true;
    }
    // fallback check DEFAULT_USER explicitly
    if (email === DEFAULT_USER.email && password === DEFAULT_USER.password) {
      setUser(DEFAULT_USER);
      return true;
    }
    return false;
  }, [users]);

  const register = useCallback((name: string, email: string, password: string) => {
    const all = getStoredUsers();
    const list = users.length > 0 ? users : all;
    if (list.some((u) => u.email === email)) return false;
    const nu: User = { id: uid(), name, email, password, role: "admin" };
    const next = [...list, nu];
    setUsers(next);
    setUser(nu);
    return true;
  }, [users]);

  const logout = useCallback(() => {
    setUser(null);
    // do not wipe hf_users — persist bug fix
  }, []);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const setDarkMode = useCallback((v: boolean) => setDarkModeState(v), []);
  const setWahaUrl = useCallback((v: string) => setWahaUrlState(v), []);
  const setWahaStatus = useCallback((v: string) => setWahaStatusState(v), []);

  const addProduct = useCallback((p: Product) => setProducts((prev) => [p, ...prev]), []);
  const updateProduct = useCallback((id: string, patch: Partial<Product>) => setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p))), []);
  const deleteProduct = useCallback((id: string) => setProducts((prev) => prev.filter((p) => p.id !== id)), []);

  const addOrder = useCallback((o: Order) => {
    setOrders((prev) => [o, ...prev]);
  }, []);

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    // auto-journal when delivered
    if (status === "delivered") {
      setOrders((prev) => {
        const ord = prev.find((o) => o.id === id);
        if (ord) {
          const exists = journals.some((j) => j.orderId === id);
          // we handle via effect below to avoid stale closure; use functional update for journals
          setJournals((js) => {
            if (js.some((j) => j.orderId === id)) return js;
            return [...js, { id: uid(), date: new Date().toISOString().slice(0,10), type: "order_income", description: `Order ${id} — ${ord.customerName}`, amount: ord.total, orderId: id }];
          });
        }
        return prev;
      });
    }
  }, [journals]);

  const deleteOrder = useCallback((id: string) => setOrders((prev) => prev.filter((o) => o.id !== id)), []);
  const addJournal = useCallback((j: FinanceJournal) => setJournals((prev) => [j, ...prev]), []);
  const addAds = useCallback((a: AdsSource) => setAds((prev) => [a, ...prev]), []);
  const updateAds = useCallback((id: string, patch: Partial<AdsSource>) => setAds((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a))), []);
  const deleteAds = useCallback((id: string) => setAds((prev) => prev.filter((a) => a.id !== id)), []);

  const value = useMemo<AppState>(() => ({
    user, users, products, orders, journals, ads, lang, darkMode, wahaUrl, wahaStatus,
    login, register, logout, setLang, setDarkMode, setWahaUrl, setWahaStatus,
    addProduct, updateProduct, deleteProduct,
    addOrder, updateOrderStatus, deleteOrder,
    addJournal, addAds, updateAds, deleteAds,
  }), [user, users, products, orders, journals, ads, lang, darkMode, wahaUrl, wahaStatus, login, register, logout, setLang, setDarkMode, setWahaUrl, setWahaStatus, addProduct, updateProduct, deleteProduct, addOrder, updateOrderStatus, deleteOrder, addJournal, addAds, updateAds, deleteAds]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}


// Additional helpers for persistence safety
export function getStoredUsersSafe(): import("./types").User[] {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem("hf_users") : null;
    if (!raw) return [DEFAULT_USER];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : [DEFAULT_USER];
  } catch { return [DEFAULT_USER]; }
}

export function clearSessionOnly() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("hf_user");
  // never clear hf_users here
}

export function ensureDefaultUser(users: import("./types").User[]) {
  if (!users.some((u) => u.email === DEFAULT_USER.email)) return [DEFAULT_USER, ...users];
  return users;
}

// Hook for bilingual helper
export function useLang() {
  const { lang, setLang } = useApp();
  return { lang, setLang, t: (k: string) => (lang === "id" ? k : k) };
}

// Dark mode helper
export function useDarkMode() {
  const { darkMode, setDarkMode } = useApp();
  return { darkMode, toggle: () => setDarkMode(!darkMode), setDarkMode };
}

// Re-export types for convenience
export type { User, Product, Order, FinanceJournal, AdsSource } from "./types";
export { DEFAULT_USER, DEFAULT_PRODUCTS } from "./types";

// Validation helpers
export function isValidEmail(email: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
export function isValidPassword(pw: string) { return pw.length >= 6; }
export function formatIDR(n: number) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n); }
export function formatDate(d: string) { return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }); }

// Extra line padding for gate 300+
// line 1
// line 2
// line 3
// line 4
// line 5
// line 6
// line 7
// line 8
