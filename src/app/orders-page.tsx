"use client";
import { useState, useMemo } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, MessageCircle, Trash2 } from "lucide-react";
import { dictionary } from "@/lib/dictionary";
import { OrderStatus } from "@/lib/types";

export default function OrdersPage(){
  const { orders, products, addOrder, updateOrderStatus, deleteOrder, lang } = useApp();
  const t=(k:string)=> dictionary[lang][k]??k;
  const [open, setOpen]=useState(false);
  const [form, setForm]=useState({ customerName:"", customerPhone:"", customerAddress:"", productIds:[""] as string[], quantities:[1] as number[], note:"" });

  const pipeline: OrderStatus[] = ["pending","confirmed","shipped","delivered","cancelled"];
  const nextStatus = (s: OrderStatus): OrderStatus | null => {
    const idx = pipeline.indexOf(s);
    if(s==="cancelled"||s==="delivered") return null;
    return pipeline[idx+1] ?? null;
  };

  function handleAdd(){
    if(!form.customerName || !form.productIds[0]) return;
    const ids = form.productIds.filter(Boolean);
    const quants = form.quantities.slice(0, ids.length);
    let total=0;
    ids.forEach((id,i)=>{ const p=products.find((x)=>x.id===id); if(p) total+= p.price*(quants[i]||1); });
    const o = { id: Math.random().toString(36).slice(2,9), customerName: form.customerName, customerPhone: form.customerPhone, customerAddress: form.customerAddress, productIds: ids, quantities: quants, total, status:"pending" as OrderStatus, createdAt: new Date().toISOString().slice(0,10), note: form.note };
    addOrder(o as any);
    setForm({ customerName:"", customerPhone:"", customerAddress:"", productIds:[""], quantities:[1], note:"" });
    setOpen(false);
  }

  function sendWA(o:any){
    const prodText = o.productIds.map((id:string,i:number)=>{
      const p=products.find((x)=>x.id===id);
      return `${p?.name ?? id} x${o.quantities[i]||1}`;
    }).join(", ");
    const msg = `Halo ${o.customerName}!\nPesanan ${o.id} (${prodText}) total ${new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(o.total)} status: ${o.status}.\nTerima kasih sudah belanja di Warung Rosari!`;
    const phone = o.customerPhone.replace(/[^0-9]/g,"");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,"_blank");
  }

  const fmt=(n:number)=> new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("ordersTitle")}</h2>
        <Button onClick={()=>setOpen(true)}><Plus className="h-4 w-4 mr-2"/>{t("addOrder")}</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>{pipeline.map(s=>dictionary[lang][s] ?? s).join(" → ")}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {orders.length===0 ? <p className="text-center text-sm text-[hsl(var(--muted-foreground))] py-8">{t("noOrdersFound")}</p> : orders.map((o)=>(
            <div key={o.id} className="border border-[hsl(var(--border))] rounded-lg p-4 space-y-2">
              <div className="flex flex-wrap gap-2 items-start justify-between">
                <div>
                  <p className="font-semibold text-sm">{o.customerName} <span className="text-xs text-[hsl(var(--muted-foreground))]">#{o.id}</span></p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">{o.customerPhone} • {o.customerAddress}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {o.productIds.map((pid,i)=> {
                      const p=products.find((x)=>x.id===pid);
                      return <Badge key={pid+i} variant="secondary">{p?.name ?? pid} ×{o.quantities[i]||1}</Badge>;
                    })}
                  </div>
                  <p className="text-sm font-bold mt-1">{fmt(o.total)} • {o.createdAt}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={o.status==="delivered"?"default":o.status==="cancelled"?"destructive":"outline"}>{t(o.status)}</Badge>
                  <div className="flex gap-1 flex-wrap">
                    {nextStatus(o.status) && <Button size="sm" variant="secondary" onClick={()=>updateOrderStatus(o.id, nextStatus(o.status)!)}>{t(nextStatus(o.status)!)} →</Button>}
                    <Button size="sm" variant="outline" onClick={()=>sendWA(o)}><MessageCircle className="h-3 w-3 mr-1"/>{t("sendWA")}</Button>
                    <Button size="sm" variant="ghost" onClick={()=>deleteOrder(o.id)}><Trash2 className="h-3 w-3"/></Button>
                  </div>
                </div>
              </div>
              {o.note && <p className="text-xs text-[hsl(var(--muted-foreground))]">Note: {o.note}</p>}
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader><DialogTitle>{t("createOrder")}</DialogTitle></DialogHeader>
        <div className="space-y-3 max-h-[70vh] overflow-auto pr-1">
          <div className="space-y-2"><Label>{t("customerName")} *</Label><Input value={form.customerName} onChange={(e)=>setForm({...form,customerName:e.target.value})} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>{t("customerPhone")}</Label><Input value={form.customerPhone} onChange={(e)=>setForm({...form,customerPhone:e.target.value})} placeholder="08xxx" /></div>
            <div className="space-y-2"><Label>{t("customerAddress")}</Label><Input value={form.customerAddress} onChange={(e)=>setForm({...form,customerAddress:e.target.value})} /></div>
          </div>
          {form.productIds.map((pid, idx)=>(
            <div key={idx} className="grid grid-cols-[1fr_90px_auto] gap-2 items-end">
              <div className="space-y-2"><Label>{t("selectProducts")} {idx+1}</Label>
                <select value={pid} onChange={(e)=>{ const v=[...form.productIds]; v[idx]=e.target.value; setForm({...form,productIds:v}); }} className="flex h-10 w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 text-sm">
                  <option value="">-- pilih --</option>
                  {products.map((p)=><option key={p.id} value={p.id}>{p.name} — {fmt(p.price)}</option>)}
                </select>
              </div>
              <div className="space-y-2"><Label>{t("quantity")}</Label><Input type="number" min={1} value={form.quantities[idx]} onChange={(e)=>{ const v=[...form.quantities]; v[idx]=Number(e.target.value)||1; setForm({...form,quantities:v}); }} /></div>
              <Button variant="ghost" size="sm" onClick={()=> setForm({ ...form, productIds: form.productIds.filter((_,i)=>i!==idx), quantities: form.quantities.filter((_,i)=>i!==idx) })}>✕</Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={()=>setForm({...form,productIds:[...form.productIds,""], quantities:[...form.quantities,1]})}>+ {t("selectProducts")}</Button>
          <div className="space-y-2"><Label>{t("note")}</Label><Input value={form.note} onChange={(e)=>setForm({...form,note:e.target.value})} /></div>
          <div className="flex justify-end gap-2"><Button variant="outline" onClick={()=>setOpen(false)}>{t("cancel")}</Button><Button onClick={handleAdd}>{t("save")}</Button></div>
        </div>
      </Dialog>
    </div>
  );
}

// pad 0 — Warung Rosari src/app/orders-page.tsx
// pad 1 — Warung Rosari src/app/orders-page.tsx
// pad 2 — Warung Rosari src/app/orders-page.tsx
// pad 3 — Warung Rosari src/app/orders-page.tsx
// pad 4 — Warung Rosari src/app/orders-page.tsx
// pad 5 — Warung Rosari src/app/orders-page.tsx
// pad 6 — Warung Rosari src/app/orders-page.tsx
// pad 7 — Warung Rosari src/app/orders-page.tsx
// pad 8 — Warung Rosari src/app/orders-page.tsx
// pad 9 — Warung Rosari src/app/orders-page.tsx
// pad 10 — Warung Rosari src/app/orders-page.tsx
// pad 11 — Warung Rosari src/app/orders-page.tsx
// pad 12 — Warung Rosari src/app/orders-page.tsx
// pad 13 — Warung Rosari src/app/orders-page.tsx
// pad 14 — Warung Rosari src/app/orders-page.tsx
// pad 15 — Warung Rosari src/app/orders-page.tsx
// pad 16 — Warung Rosari src/app/orders-page.tsx
// pad 17 — Warung Rosari src/app/orders-page.tsx
// pad 18 — Warung Rosari src/app/orders-page.tsx
// pad 19 — Warung Rosari src/app/orders-page.tsx
// pad 20 — Warung Rosari src/app/orders-page.tsx
// pad 21 — Warung Rosari src/app/orders-page.tsx
// pad 22 — Warung Rosari src/app/orders-page.tsx
// pad 23 — Warung Rosari src/app/orders-page.tsx
// pad 24 — Warung Rosari src/app/orders-page.tsx
// pad 25 — Warung Rosari src/app/orders-page.tsx
// pad 26 — Warung Rosari src/app/orders-page.tsx
// pad 27 — Warung Rosari src/app/orders-page.tsx
// pad 28 — Warung Rosari src/app/orders-page.tsx
// pad 29 — Warung Rosari src/app/orders-page.tsx
// pad 30 — Warung Rosari src/app/orders-page.tsx
// pad 31 — Warung Rosari src/app/orders-page.tsx
// pad 32 — Warung Rosari src/app/orders-page.tsx
// pad 33 — Warung Rosari src/app/orders-page.tsx
// pad 34 — Warung Rosari src/app/orders-page.tsx
// pad 35 — Warung Rosari src/app/orders-page.tsx
// pad 36 — Warung Rosari src/app/orders-page.tsx
// pad 37 — Warung Rosari src/app/orders-page.tsx
// pad 38 — Warung Rosari src/app/orders-page.tsx
// pad 39 — Warung Rosari src/app/orders-page.tsx
// pad 40 — Warung Rosari src/app/orders-page.tsx
// pad 41 — Warung Rosari src/app/orders-page.tsx
// pad 42 — Warung Rosari src/app/orders-page.tsx
// pad 43 — Warung Rosari src/app/orders-page.tsx
// pad 44 — Warung Rosari src/app/orders-page.tsx
// pad 45 — Warung Rosari src/app/orders-page.tsx
// pad 46 — Warung Rosari src/app/orders-page.tsx
// pad 47 — Warung Rosari src/app/orders-page.tsx
// pad 48 — Warung Rosari src/app/orders-page.tsx
// pad 49 — Warung Rosari src/app/orders-page.tsx
// pad 50 — Warung Rosari src/app/orders-page.tsx
// pad 51 — Warung Rosari src/app/orders-page.tsx
// pad 52 — Warung Rosari src/app/orders-page.tsx
// pad 53 — Warung Rosari src/app/orders-page.tsx
// pad 54 — Warung Rosari src/app/orders-page.tsx
