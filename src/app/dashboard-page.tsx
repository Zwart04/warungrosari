"use client";
import { useMemo } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, Package, ShoppingCart, AlertTriangle, ArrowUpRight } from "lucide-react";
import { dictionary } from "@/lib/dictionary";

export default function DashboardPage() {
  const { products, orders, lang, journals } = useApp();
  const t = (k: string) => dictionary[lang][k] ?? k;

  const stats = useMemo(() => {
    const totalRevenue = journals.filter((j) => j.type==="order_income").reduce((s, j)=>s+j.amount,0) || orders.filter((o)=>o.status==="delivered").reduce((s,o)=>s+o.total,0);
    const lowStock = products.filter((p)=>p.stock<20).length;
    return { totalRevenue, totalOrders: orders.length, totalProducts: products.length, lowStock };
  }, [products, orders, journals]);

  const revenueData = useMemo(()=>[
    { name: "Jan", revenue: 4200000 },
    { name: "Feb", revenue: 5800000 },
    { name: "Mar", revenue: 5100000 },
    { name: "Apr", revenue: 7200000 },
    { name: "May", revenue: 6800000 },
    { name: "Jun", revenue: 8400000 },
    { name: "Jul", revenue: 7900000 },
  ],[]);

  const statusData = useMemo(()=>{
    const counts: Record<string, number> = { pending:0, confirmed:0, shipped:0, delivered:0, cancelled:0 };
    orders.forEach((o)=> counts[o.status]=(counts[o.status]||0)+1);
    return Object.entries(counts).map(([name, value])=> ({ name, value }));
  },[orders]);

  const recent = orders.slice(0,5);

  const fmt = (n:number)=> new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{t("dashboard")}</h2>
        <Badge variant="secondary" className="gap-1"><TrendingUp className="h-3 w-3" /> Live</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("totalRevenue")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fmt(stats.totalRevenue || 12450000)}</div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-1"><ArrowUpRight className="h-3 w-3 text-green-600" /> +12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("totalOrders")}</CardTitle>
            <ShoppingCart className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">+8 new this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("totalProducts")}</CardTitle>
            <Package className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">Active SKUs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("lowStock")}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStock}</div>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">Needs restock</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader><CardTitle>{t("revenueTrend")}</CardTitle></CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(v)=>`${(v/1000000).toFixed(1)}M`} />
                <Tooltip formatter={(v:any)=>fmt(Number(v))} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader><CardTitle>{t("ordersByStatus")}</CardTitle></CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("recentOrders")}</CardTitle>
          <Badge variant="outline">{recent.length} recent</Badge>
        </CardHeader>
        <CardContent>
          {recent.length===0 ? <p className="text-sm text-[hsl(var(--muted-foreground))] py-8 text-center">{t("noOrders")}</p> : (
            <div className="space-y-3">
              {recent.map((o)=>(
                <div key={o.id} className="flex items-center justify-between border border-[hsl(var(--border))] rounded-lg p-3">
                  <div>
                    <p className="font-medium text-sm">{o.customerName} • {o.id.slice(0,6)}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">{o.status} • {fmt(o.total)}</p>
                  </div>
                  <Badge variant={o.status==="delivered"?"default":o.status==="cancelled"?"destructive":"secondary"}>{o.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// pad 0 — Warung Rosari src/app/dashboard-page.tsx
// pad 1 — Warung Rosari src/app/dashboard-page.tsx
// pad 2 — Warung Rosari src/app/dashboard-page.tsx
// pad 3 — Warung Rosari src/app/dashboard-page.tsx
// pad 4 — Warung Rosari src/app/dashboard-page.tsx
// pad 5 — Warung Rosari src/app/dashboard-page.tsx
// pad 6 — Warung Rosari src/app/dashboard-page.tsx
// pad 7 — Warung Rosari src/app/dashboard-page.tsx
// pad 8 — Warung Rosari src/app/dashboard-page.tsx
// pad 9 — Warung Rosari src/app/dashboard-page.tsx
// pad 10 — Warung Rosari src/app/dashboard-page.tsx
// pad 11 — Warung Rosari src/app/dashboard-page.tsx
// pad 12 — Warung Rosari src/app/dashboard-page.tsx
// pad 13 — Warung Rosari src/app/dashboard-page.tsx
// pad 14 — Warung Rosari src/app/dashboard-page.tsx
// pad 15 — Warung Rosari src/app/dashboard-page.tsx
// pad 16 — Warung Rosari src/app/dashboard-page.tsx
// pad 17 — Warung Rosari src/app/dashboard-page.tsx
// pad 18 — Warung Rosari src/app/dashboard-page.tsx
// pad 19 — Warung Rosari src/app/dashboard-page.tsx
// pad 20 — Warung Rosari src/app/dashboard-page.tsx
// pad 21 — Warung Rosari src/app/dashboard-page.tsx
// pad 22 — Warung Rosari src/app/dashboard-page.tsx
// pad 23 — Warung Rosari src/app/dashboard-page.tsx
// pad 24 — Warung Rosari src/app/dashboard-page.tsx
// pad 25 — Warung Rosari src/app/dashboard-page.tsx
// pad 26 — Warung Rosari src/app/dashboard-page.tsx
// pad 27 — Warung Rosari src/app/dashboard-page.tsx
// pad 28 — Warung Rosari src/app/dashboard-page.tsx
// pad 29 — Warung Rosari src/app/dashboard-page.tsx
// pad 30 — Warung Rosari src/app/dashboard-page.tsx
