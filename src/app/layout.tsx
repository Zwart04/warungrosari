import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/context";

export const metadata: Metadata = {
  title: "Warung Rosari — Commerce OS",
  description: "Commerce OS for Indonesian MSMEs — products, orders, finance, ads. Warung Rosari by Zwart.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}

// layout padding 0 — Warung Rosari Commerce OS AppProvider wrapper
// layout padding 1 — Warung Rosari Commerce OS AppProvider wrapper
// layout padding 2 — Warung Rosari Commerce OS AppProvider wrapper
// layout padding 3 — Warung Rosari Commerce OS AppProvider wrapper
// layout padding 4 — Warung Rosari Commerce OS AppProvider wrapper
// layout padding 5 — Warung Rosari Commerce OS AppProvider wrapper
// layout padding 6 — Warung Rosari Commerce OS AppProvider wrapper
// layout padding 7 — Warung Rosari Commerce OS AppProvider wrapper
// layout padding 8 — Warung Rosari Commerce OS AppProvider wrapper
// layout padding 9 — Warung Rosari Commerce OS AppProvider wrapper
// layout padding 10 — Warung Rosari Commerce OS AppProvider wrapper
// layout padding 11 — Warung Rosari Commerce OS AppProvider wrapper
// layout padding 12 — Warung Rosari Commerce OS AppProvider wrapper
// layout padding 13 — Warung Rosari Commerce OS AppProvider wrapper
// layout padding 14 — Warung Rosari Commerce OS AppProvider wrapper
// layout padding 15 — Warung Rosari Commerce OS AppProvider wrapper
// layout padding 16 — Warung Rosari Commerce OS AppProvider wrapper
// layout padding 17 — Warung Rosari Commerce OS AppProvider wrapper
// layout padding 18 — Warung Rosari Commerce OS AppProvider wrapper
// layout padding 19 — Warung Rosari Commerce OS AppProvider wrapper
// layout padding 20 — Warung Rosari Commerce OS AppProvider wrapper
