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
    title: { default: "Look At This", template: "%s | Look At This" },
    description: lang === "ko"
      ? "내 근처 숨은 명소를 동네 사람들이 올리고 추천으로 순위를 매깁니다. 추천하고, 달러로 감정하고, 동네 1등을 차지하세요."
      : "Hidden gems near you, shown off by locals and ranked by their neighbors. Upvote, appraise in dollars, take the #1 spot in your area.",
    applicationName: "Look At This",
    openGraph: { siteName: "Look At This", type: "website" },
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
