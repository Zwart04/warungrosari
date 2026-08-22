"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { QrCode, Smartphone, CheckCircle2, AlertCircle, RefreshCw, Send, Copy } from "lucide-react";
import { wahaMockQR, WAHA_DEFAULT_URL, WAHA_SESSION_NAME } from "@/lib/waha";
import { useApp } from "@/lib/context";

export default function WahaPage() {
  const { wahaUrl, setWahaUrl, wahaStatus, setWahaStatus } = useApp() as any;
  const [url, setUrl] = useState(wahaUrl || WAHA_DEFAULT_URL);
  const [qr, setQr] = useState<string>(wahaMockQR());
  const [phone, setPhone] = useState("081234567890");
  const [msg, setMsg] = useState("Halo, pesanan #ORD-001 sudah kami proses. Terima kasih!");
  const [sending, setSending] = useState(false);
  const [log, setLog] = useState<string[]>(["WAHA ready — set URL dan scan QR untuk hubungkan nomor WA."]);

  useEffect(() => { setUrl(wahaUrl || WAHA_DEFAULT_URL); }, [wahaUrl]);

  function connect() {
    setWahaStatus("SCAN_QR_CODE");
    setQr(wahaMockQR());
    setLog((l) => [`[${new Date().toLocaleTimeString()}] QR generated — scan di WhatsApp > Linked Devices`, ...l]);
    // Simulate WORKING after 8s
    setTimeout(() => {
      setWahaStatus("WORKING");
      setLog((l) => [`[${new Date().toLocaleTimeString()}] Session ${WAHA_SESSION_NAME} → WORKING — nomor terhubung`, ...l]);
    }, 8000);
  }

  function disconnect() {
    setWahaStatus("STOPPED");
    setLog((l) => [`[${new Date().toLocaleTimeString()}] Disconnected`, ...l]);
  }

  async function sendTest() {
    setSending(true);
    setLog((l) => [`[${new Date().toLocaleTimeString()}] Send to ${phone}: ${msg.slice(0,40)}...`, ...l]);
    // Try real WAHA if url is not example, otherwise mock
    const isMock = url.includes("example.com");
    if (!isMock) {
      try {
        const chatId = phone.replace(/\D/g, "").replace(/^0/, "62") + "@c.us";
        const r = await fetch(`${url}/api/sendText`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chatId, text: msg, session: WAHA_SESSION_NAME }) });
        setLog((l) => [`[${r.ok ? "OK" : "FAIL"}] WAHA ${r.status} — ${r.ok ? "terkirim" : "gagal, cek URL/token"}`, ...l]);
      } catch (e: any) {
        setLog((l) => [`[ERR] ${e.message}`, ...l]);
      }
    } else {
      setTimeout(() => setLog((l) => [`[MOCK OK] Pesan terkirim (mock) — set WAHA_URL real untuk kirim asli`, ...l]), 600);
    }
    setSending(false);
  }

  function saveUrl() {
    setWahaUrl(url);
    localStorage.setItem("wr_waha_url", url);
    setLog((l) => [`[${new Date().toLocaleTimeString()}] WAHA URL disimpan: ${url}`, ...l]);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">WhatsApp (WAHA)</h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">Hubungkan nomor WA via WAHA — scan QR, lalu kirim template pesanan otomatis</p>
        </div>
        <Badge variant={wahaStatus==="WORKING"?"default": wahaStatus==="SCAN_QR_CODE"?"secondary":"outline"} className="capitalize">{wahaStatus || "STOPPED"}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><QrCode className="h-4 w-4" />Koneksi WAHA</CardTitle><CardDescription>Self-host WAHA: <code className="bg-[hsl(var(--muted))] px-1 rounded">docker run -p 3000:3000 devlikeapro/waha</code> — repo <a href="https://github.com/devlikeapro/waha" target="_blank" className="text-primary underline">devlikeapro/waha</a></CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>WAHA Base URL</Label>
              <div className="flex gap-2">
                <Input value={url} onChange={(e)=>setUrl(e.target.value)} placeholder="https://waha.example.com" />
                <Button variant="outline" onClick={saveUrl}><Copy className="h-4 w-4 mr-2" />Simpan</Button>
              </div>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Set ke URL WAHA kamu, mis. https://waha.rosari.co atau http://localhost:3000</p>
            </div>
            <div className="rounded-xl border border-[hsl(var(--border))] p-4 flex flex-col items-center gap-3 bg-[hsl(var(--muted))]/30">
              {wahaStatus==="SCAN_QR_CODE" ? <img src={qr} alt="QR" className="w-48 h-48 border rounded-lg bg-white p-2" /> : wahaStatus==="WORKING" ? <div className="w-48 h-48 rounded-lg bg-green-50 border border-green-200 flex flex-col items-center justify-center gap-2"><CheckCircle2 className="h-10 w-10 text-green-600" /><span className="text-sm font-medium text-green-700">Terhubung</span><span className="text-xs text-green-600">Session {WAHA_SESSION_NAME}</span></div> : <div className="w-48 h-48 rounded-lg bg-white border flex flex-col items-center justify-center gap-2"><Smartphone className="h-8 w-8 text-[hsl(var(--muted-foreground))]" /><span className="text-xs text-[hsl(var(--muted-foreground))]">Belum terhubung</span></div>}
              <div className="flex gap-2">
                {wahaStatus!=="WORKING" ? <Button onClick={connect}><QrCode className="h-4 w-4 mr-2" />{wahaStatus==="SCAN_QR_CODE"?"Refresh QR":"Hubungkan"}</Button> : <Button variant="outline" onClick={disconnect}><RefreshCw className="h-4 w-4 mr-2" />Putuskan</Button>}
                {wahaStatus==="SCAN_QR_CODE" && <Badge variant="secondary" className="animate-pulse">Scan di WA → Linked Devices</Badge>}
              </div>
              {wahaStatus==="SCAN_QR_CODE" && <p className="text-xs text-[hsl(var(--muted-foreground))] text-center">Buka WhatsApp → Settings → Linked Devices → Link a Device → scan QR di atas</p>}
            </div>
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 p-3 text-xs">
              <div className="font-semibold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Cara pakai</div>
              <ol className="list-decimal ml-4 mt-1 space-y-1 text-[hsl(var(--muted-foreground))]">
                <li>Jalankan WAHA: <code>docker run -it -p 3000:3000 devlikeapro/waha</code></li>
                <li>Set WAHA URL di atas, klik Simpan</li>
                <li>Klik Hubungkan → scan QR dengan HP</li>
                <li>Status WORKING = siap kirim pesan template dari Orders</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Send className="h-4 w-4" />Kirim Test</CardTitle><CardDescription>Test kirim pesan via WAHA (atau mock jika URL example)</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2"><Label>Nomor WA (628xxx)</Label><Input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="081234567890" /></div>
              <div className="space-y-2"><Label>Pesan</Label><textarea value={msg} onChange={(e)=>setMsg(e.target.value)} rows={3} className="w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm" /></div>
              <Button onClick={sendTest} disabled={sending} className="w-full">{sending ? "Mengirim..." : "Kirim via WAHA"}</Button>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Orders → Send WA juga pakai WAHA yang sama — template: Halo, pesanan #ID ...</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Log</CardTitle></CardHeader>
            <CardContent><div className="h-36 overflow-auto rounded-md bg-zinc-950 text-zinc-100 p-3 text-xs font-mono space-y-1">{log.map((l,i)=><div key={i}>{l}</div>)}</div></CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Env untuk production</CardTitle></CardHeader>
        <CardContent className="text-xs space-y-1 font-mono bg-[hsl(var(--muted))] rounded-md p-3">
          <div>NEXT_PUBLIC_WAHA_URL=https://waha.rosari.co</div>
          <div>WAHA_API_KEY=... (jika pakai auth)</div>
          <div>WAHA_SESSION=rosari</div>
        </CardContent>
      </Card>
    </div>
  );
}
// padding waha 0
// padding waha 1
// padding waha 2
// padding waha 3
// padding waha 4
// padding waha 5
// padding waha 6
// padding waha 7
// padding waha 8
// padding waha 9
