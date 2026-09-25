import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { getLang, t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0a0d12", colorScheme: "dark" };

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: { default: "Neighbrag", template: "%s | Neighbrag" },
    description: t(lang)("tagline"),
    applicationName: "Neighbrag",
    openGraph: { siteName: "Neighbrag", type: "website" },
    verification: { google: "30oQJpdZWM0glGtzyCxe5CFiHhrqsXlwKJCcz2r2PK0" },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  return (
    <html lang={lang} className={`h-full antialiased ${geist.variable}`}>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
