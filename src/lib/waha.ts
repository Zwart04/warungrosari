// WAHA integration helper — devlikeapro/waha https://github.com/devlikeapro/waha
// Self-host WAHA via Docker, then set NEXT_PUBLIC_WAHA_URL
// Docker: docker run -it -p 3000:3000 devlikeapro/waha
// Docs: https://waha.devlike.pro

export type WahaSession = "STOPPED" | "STARTING" | "SCAN_QR_CODE" | "WORKING" | "FAILED";

export const WAHA_DEFAULT_URL = process.env.NEXT_PUBLIC_WAHA_URL || "https://waha.example.com";
export const WAHA_SESSION_NAME = "rosari";

export async function wahaGetSession(baseUrl: string, session: string = WAHA_SESSION_NAME) {
  try {
    const r = await fetch(`${baseUrl}/api/sessions/${session}`, { cache: "no-store" });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

export async function wahaStartSession(baseUrl: string, session: string = WAHA_SESSION_NAME) {
  try {
    const r = await fetch(`${baseUrl}/api/sessions/${session}/start`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    return r.ok;
  } catch { return false; }
}

export async function wahaGetQR(baseUrl: string, session: string = WAHA_SESSION_NAME) {
  try {
    const r = await fetch(`${baseUrl}/api/${session}/auth/qr?format=image`, { cache: "no-store" });
    if (!r.ok) return null;
    const blob = await r.blob();
    return URL.createObjectURL(blob);
  } catch { return null; }
}

export async function wahaSendText(baseUrl: string, chatId: string, text: string, session: string = WAHA_SESSION_NAME) {
  try {
    const r = await fetch(`${baseUrl}/api/sendText`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId: `${chatId}@c.us`, text, session }),
    });
    return r.ok;
  } catch { return false; }
}

// Mock for local demo without real WAHA server
export function wahaMockQR(): string {
  // Returns a data URL placeholder QR (clean, not random)
  return "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><rect width='200' height='200' fill='white'/><rect x='20' y='20' width='40' height='40' fill='black'/><rect x='30' y='30' width='20' height='20' fill='white'/><rect x='35' y='35' width='10' height='10' fill='black'/><rect x='140' y='20' width='40' height='40' fill='black'/><rect x='150' y='30' width='20' height='20' fill='white'/><rect x='155' y='35' width='10' height='10' fill='black'/><rect x='20' y='140' width='40' height='40' fill='black'/><rect x='30' y='150' width='20' height='20' fill='white'/><rect x='35' y='155' width='10' height='10' fill='black'/><g fill='black'><rect x='80' y='80' width='10' height='10'/><rect x='100' y='80' width='10' height='10'/><rect x='80' y='100' width='10' height='10'/><rect x='90' y='90' width='20' height='10'/><rect x='120' y='120' width='40' height='10'/><rect x='80' y='130' width='30' height='10'/><rect x='130' y='140' width='10' height='10'/></g><text x='100' y='195' text-anchor='middle' font-size='10' fill='#666'>WAHA QR — scan di WA</text></svg>`);
}

export function formatChatId(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const withCountry = digits.startsWith("0") ? "62" + digits.slice(1) : digits;
  return `${withCountry}@c.us`;
}
