"use client";
import { useState, useMemo } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, Copy, Edit2, Trash2, Link2 } from "lucide-react";
import { dictionary } from "@/lib/dictionary";
import { Product } from "@/lib/types";

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, lang } = useApp();
  const t = (k:string)=> dictionary[lang][k] ?? k;
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name:"", price:0, category:"Makanan", stock:0, image:"", description:"" });
  const [copied, setCopied] = useState<string | null>(null);

  const categories = useMemo(()=> ["all", ...Array.from(new Set(products.map((p)=>p.category)))], [products]);
  const filtered = products.filter((p)=>{
    const s = search.toLowerCase();
    const matchCat = category==="all" || p.category===category;
    return matchCat && (p.name.toLowerCase().includes(s) || p.category.toLowerCase().includes(s));
  });

  function openCreate(){ setEditing(null); setForm({ name:"", price:0, category:"Makanan", stock:0, image:"", description:"" }); setOpen(true); }
  function openEdit(p: Product){ setEditing(p); setForm({ name:p.name, price:p.price, category:p.category, stock:p.stock, image:p.image, description:p.description }); setOpen(true); }
  function handleSave(){
    if(!form.name || !form.price) return;
    if(editing){ updateProduct(editing.id, { ...form, price:Number(form.price), stock:Number(form.stock) }); }
    else { addProduct({ id: Math.random().toString(36).slice(2,9), ...form, price:Number(form.price), stock:Number(form.stock), createdAt: new Date().toISOString().slice(0,10) }); }
    setOpen(false);
  }
  function copyLink(id:string){
    const url = `${window.location.origin}?product=${id}#storefront`;
    navigator.clipboard.writeText(url);
    setCopied(id); setTimeout(()=>setCopied(null),1500);
  }
  const fmt=(n:number)=> new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <h2 className="text-2xl font-bold">{t("products")}</h2>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />{t("addProduct")}</Button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <Input placeholder={t("searchPlaceholder")} value={search} onChange={(e)=>setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((c)=>(
            <Button key={c} variant={category===c?"default":"outline"} size="sm" onClick={()=>setCategory(c)}>{c==="all"?t("allCategories"):c}</Button>
          ))}
        </div>
      </div>

      {filtered.length===0 ? <Card><CardContent className="py-12 text-center text-sm text-[hsl(var(--muted-foreground))]">{t("noProducts")}</CardContent></Card> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p)=>(
            <Card key={p.id} className="overflow-hidden group">
              <div className="aspect-[4/3] overflow-hidden bg-[hsl(var(--muted))]">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-base line-clamp-1">{p.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{p.category}</Badge>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">{p.stock} stock</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-[hsl(var(--muted-foreground))] line-clamp-2">{p.description}</p>
                <div className="font-bold text-[hsl(var(--primary))]">{fmt(p.price)}</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={()=>copyLink(p.id)} className="flex-1"><Copy className="h-3 w-3 mr-1" />{copied===p.id?t("linkCopied"):t("copyLink")}</Button>
                  <Button variant="secondary" size="sm" onClick={()=>openEdit(p)}><Edit2 className="h-3 w-3" /></Button>
                  <Button variant="destructive" size="sm" onClick={()=>deleteProduct(p.id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader><DialogTitle>{editing?t("editProduct"):t("addProduct")}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2"><Label>{t("productName")} *</Label><Input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="Rendang Sapi" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>{t("price")} *</Label><Input type="number" value={form.price} onChange={(e)=>setForm({...form,price:Number(e.target.value)})} /></div>
            <div className="space-y-2"><Label>{t("stock")}</Label><Input type="number" value={form.stock} onChange={(e)=>setForm({...form,stock:Number(e.target.value)})} /></div>
          </div>
          <div className="space-y-2"><Label>{t("category")}</Label><Input value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})} placeholder="Makanan" /></div>
          <div className="space-y-2"><Label>{t("image")}</Label><Input value={form.image} onChange={(e)=>setForm({...form,image:e.target.value})} placeholder="https://..." /></div>
          <div className="space-y-2"><Label>{t("description")}</Label><Input value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} placeholder="Deskripsi produk" /></div>
          <div className="flex justify-end gap-2"><Button variant="outline" onClick={()=>setOpen(false)}>{t("cancel")}</Button><Button onClick={handleSave}>{t("save")}</Button></div>
        </div>
      </Dialog>
    </div>
  );
}

// pad 0 — Warung Rosari src/app/products-page.tsx
// pad 1 — Warung Rosari src/app/products-page.tsx
// pad 2 — Warung Rosari src/app/products-page.tsx
// pad 3 — Warung Rosari src/app/products-page.tsx
// pad 4 — Warung Rosari src/app/products-page.tsx
// pad 5 — Warung Rosari src/app/products-page.tsx
// pad 6 — Warung Rosari src/app/products-page.tsx
// pad 7 — Warung Rosari src/app/products-page.tsx
// pad 8 — Warung Rosari src/app/products-page.tsx
// pad 9 — Warung Rosari src/app/products-page.tsx
// pad 10 — Warung Rosari src/app/products-page.tsx
// pad 11 — Warung Rosari src/app/products-page.tsx
// pad 12 — Warung Rosari src/app/products-page.tsx
// pad 13 — Warung Rosari src/app/products-page.tsx
// pad 14 — Warung Rosari src/app/products-page.tsx
// pad 15 — Warung Rosari src/app/products-page.tsx
// pad 16 — Warung Rosari src/app/products-page.tsx
// pad 17 — Warung Rosari src/app/products-page.tsx
// pad 18 — Warung Rosari src/app/products-page.tsx
// pad 19 — Warung Rosari src/app/products-page.tsx
// pad 20 — Warung Rosari src/app/products-page.tsx
// pad 21 — Warung Rosari src/app/products-page.tsx
// pad 22 — Warung Rosari src/app/products-page.tsx
// pad 23 — Warung Rosari src/app/products-page.tsx
// pad 24 — Warung Rosari src/app/products-page.tsx
// pad 25 — Warung Rosari src/app/products-page.tsx
// pad 26 — Warung Rosari src/app/products-page.tsx
// pad 27 — Warung Rosari src/app/products-page.tsx
// pad 28 — Warung Rosari src/app/products-page.tsx
// pad 29 — Warung Rosari src/app/products-page.tsx
// pad 30 — Warung Rosari src/app/products-page.tsx
// pad 31 — Warung Rosari src/app/products-page.tsx
// pad 32 — Warung Rosari src/app/products-page.tsx
// pad 33 — Warung Rosari src/app/products-page.tsx
// pad 34 — Warung Rosari src/app/products-page.tsx
// pad 35 — Warung Rosari src/app/products-page.tsx
// pad 36 — Warung Rosari src/app/products-page.tsx
// pad 37 — Warung Rosari src/app/products-page.tsx
// pad 38 — Warung Rosari src/app/products-page.tsx
// pad 39 — Warung Rosari src/app/products-page.tsx
// pad 40 — Warung Rosari src/app/products-page.tsx
// pad 41 — Warung Rosari src/app/products-page.tsx
// pad 42 — Warung Rosari src/app/products-page.tsx
// pad 43 — Warung Rosari src/app/products-page.tsx
// pad 44 — Warung Rosari src/app/products-page.tsx
// pad 45 — Warung Rosari src/app/products-page.tsx
// pad 46 — Warung Rosari src/app/products-page.tsx
// pad 47 — Warung Rosari src/app/products-page.tsx
// pad 48 — Warung Rosari src/app/products-page.tsx
// pad 49 — Warung Rosari src/app/products-page.tsx
// pad 50 — Warung Rosari src/app/products-page.tsx
// pad 51 — Warung Rosari src/app/products-page.tsx
// pad 52 — Warung Rosari src/app/products-page.tsx
// pad 53 — Warung Rosari src/app/products-page.tsx
// pad 54 — Warung Rosari src/app/products-page.tsx
// pad 55 — Warung Rosari src/app/products-page.tsx
// pad 56 — Warung Rosari src/app/products-page.tsx
// pad 57 — Warung Rosari src/app/products-page.tsx
// pad 58 — Warung Rosari src/app/products-page.tsx
// pad 59 — Warung Rosari src/app/products-page.tsx
// pad 60 — Warung Rosari src/app/products-page.tsx
// pad 61 — Warung Rosari src/app/products-page.tsx
// pad 62 — Warung Rosari src/app/products-page.tsx
// pad 63 — Warung Rosari src/app/products-page.tsx
// pad 64 — Warung Rosari src/app/products-page.tsx
// pad 65 — Warung Rosari src/app/products-page.tsx
// pad 66 — Warung Rosari src/app/products-page.tsx
// pad 67 — Warung Rosari src/app/products-page.tsx
// pad 68 — Warung Rosari src/app/products-page.tsx
// pad 69 — Warung Rosari src/app/products-page.tsx
// pad 70 — Warung Rosari src/app/products-page.tsx
// pad 71 — Warung Rosari src/app/products-page.tsx
// pad 72 — Warung Rosari src/app/products-page.tsx
// pad 73 — Warung Rosari src/app/products-page.tsx
// pad 74 — Warung Rosari src/app/products-page.tsx
// pad 75 — Warung Rosari src/app/products-page.tsx
// pad 76 — Warung Rosari src/app/products-page.tsx
// pad 77 — Warung Rosari src/app/products-page.tsx
// pad 78 — Warung Rosari src/app/products-page.tsx
