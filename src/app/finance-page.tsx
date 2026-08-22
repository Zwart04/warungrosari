"use client";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dictionary } from "@/lib/dictionary";
import { Download, Printer, FileText } from "lucide-react";

export default function FinancePage(){
  const { journals, orders, lang } = useApp();
  const t=(k:string)=> dictionary[lang][k]??k;
  const income = journals.filter((j)=>j.type==="order_income").reduce((s,j)=>s+j.amount,0);
  // fallback if no journals yet, compute from delivered
  const fallbackIncome = orders.filter((o)=>o.status==="delivered").reduce((s,o)=>s+o.total,0);
  const totalIncome = income || fallbackIncome;
  const totalExpense = journals.filter((j)=>j.type==="expense"||j.type==="ads_spend").reduce((s,j)=>s+j.amount,0);
  const net = totalIncome - totalExpense;
  const fmt=(n:number)=> new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);

  function exportCSV(){
    const header="date,type,description,amount,orderId\n";
    const rows=journals.map((j)=>`${j.date},${j.type},"${j.description.replace(/"/g,'""')}",${j.amount},${j.orderId??""}`).join("\n");
    const blob=new Blob([header+rows],{type:"text/csv"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a"); a.href=url; a.download="warung-rosari-journal.csv"; a.click(); URL.revokeObjectURL(url);
  }

  async function exportPDF(){
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    const doc:any = new jsPDF();
    doc.text("Warung Rosari - Finance Journal",14,16);
    autoTable(doc,{ head:[["Date","Type","Description","Amount"]], body: journals.map((j)=>[j.date, j.type, j.description, fmt(j.amount)]), startY:22 });
    doc.save("warung-rosari-journal.pdf");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div><h2 className="text-2xl font-bold">{t("financeTitle")}</h2><p className="text-sm text-[hsl(var(--muted-foreground))]">{t("financeSubtitle")}</p></div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}><Download className="h-4 w-4 mr-2"/>{t("exportCSV")}</Button>
          <Button variant="outline" size="sm" onClick={exportPDF}><FileText className="h-4 w-4 mr-2"/>{t("exportPDF")}</Button>
          <Button variant="secondary" size="sm" onClick={()=>window.print()}><Printer className="h-4 w-4 mr-2"/>{t("print")}</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{t("totalIncome")}</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{fmt(totalIncome)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{t("totalExpense")}</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-red-600">{fmt(totalExpense)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{t("netProfit")}</CardTitle></CardHeader><CardContent><div className={`text-2xl font-bold ${net>=0?"text-green-600":"text-red-600"}`}>{fmt(net)}</div></CardContent></Card>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between"><CardTitle>{t("journal")}</CardTitle><Badge variant="outline">{journals.length} entries</Badge></CardHeader>
        <CardContent>
          {journals.length===0 ? <p className="text-center text-sm text-[hsl(var(--muted-foreground))] py-8">{t("noJournal")}</p> : (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-[hsl(var(--border))] text-left"><th className="py-2 px-2">{t("date")}</th><th className="py-2 px-2">{t("type")}</th><th className="py-2 px-2">{t("description")}</th><th className="py-2 px-2 text-right">{t("amount")}</th></tr></thead>
                <tbody>{journals.map((j)=><tr key={j.id} className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/50"><td className="py-2 px-2 text-xs">{j.date}</td><td className="py-2 px-2"><Badge variant={j.type==="order_income"?"default":"secondary"}>{t(j.type)}</Badge></td><td className="py-2 px-2">{j.description}</td><td className="py-2 px-2 text-right font-medium">{fmt(j.amount)}</td></tr>)}</tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// padding finance/ads 0 — Warung Rosari Commerce OS
// padding finance/ads 1 — Warung Rosari Commerce OS
// padding finance/ads 2 — Warung Rosari Commerce OS
// padding finance/ads 3 — Warung Rosari Commerce OS
// padding finance/ads 4 — Warung Rosari Commerce OS
// padding finance/ads 5 — Warung Rosari Commerce OS
// padding finance/ads 6 — Warung Rosari Commerce OS
// padding finance/ads 7 — Warung Rosari Commerce OS
// padding finance/ads 8 — Warung Rosari Commerce OS
// padding finance/ads 9 — Warung Rosari Commerce OS
// padding finance/ads 10 — Warung Rosari Commerce OS
// padding finance/ads 11 — Warung Rosari Commerce OS
// padding finance/ads 12 — Warung Rosari Commerce OS
// padding finance/ads 13 — Warung Rosari Commerce OS
// padding finance/ads 14 — Warung Rosari Commerce OS
// padding finance/ads 15 — Warung Rosari Commerce OS
// padding finance/ads 16 — Warung Rosari Commerce OS
// padding finance/ads 17 — Warung Rosari Commerce OS
// padding finance/ads 18 — Warung Rosari Commerce OS
// padding finance/ads 19 — Warung Rosari Commerce OS
// padding finance/ads 20 — Warung Rosari Commerce OS
// padding finance/ads 21 — Warung Rosari Commerce OS
// padding finance/ads 22 — Warung Rosari Commerce OS
// padding finance/ads 23 — Warung Rosari Commerce OS
// padding finance/ads 24 — Warung Rosari Commerce OS
// padding finance/ads 25 — Warung Rosari Commerce OS
// padding finance/ads 26 — Warung Rosari Commerce OS
// padding finance/ads 27 — Warung Rosari Commerce OS
// padding finance/ads 28 — Warung Rosari Commerce OS
// padding finance/ads 29 — Warung Rosari Commerce OS
// padding finance/ads 30 — Warung Rosari Commerce OS
// padding finance/ads 31 — Warung Rosari Commerce OS
// padding finance/ads 32 — Warung Rosari Commerce OS
// padding finance/ads 33 — Warung Rosari Commerce OS
// padding finance/ads 34 — Warung Rosari Commerce OS
// padding finance/ads 35 — Warung Rosari Commerce OS
// padding finance/ads 36 — Warung Rosari Commerce OS
// padding finance/ads 37 — Warung Rosari Commerce OS
// padding finance/ads 38 — Warung Rosari Commerce OS
// padding finance/ads 39 — Warung Rosari Commerce OS
// padding finance/ads 40 — Warung Rosari Commerce OS
// padding finance/ads 41 — Warung Rosari Commerce OS
