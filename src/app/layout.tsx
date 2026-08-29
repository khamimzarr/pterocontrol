import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/toast";

const untitledSans = Inter({
  subsets: ["latin"],
  variable: "--font-untitled-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const aeonikPro = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-aeonikpro",
  weight: ["400", "500"],
  display: "swap",
});
const dotDigital = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-dotdigital",
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pterocontrol.vercel.app"),
  title: {
    default: "PteroControl — Satu dasbor untuk semua panel",
    template: "%s · PteroControl",
  },
  description: "Aggregator Pterodactyl. Banyak panel jadi satu tabel. API key AES-256-CBC, RLS. Butuh approval admin.",
  applicationName: "PteroControl",
  keywords: ["Pterodactyl", "Panel", "Aggregator", "Game Server", "Next.js", "Supabase"],
  authors: [{ name: "PteroControl" }],
  creator: "PteroControl",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://pterocontrol.vercel.app",
    siteName: "PteroControl",
    title: "PteroControl — Satu dasbor untuk semua panel",
    description: "Aggregator Pterodactyl. Banyak panel jadi satu tabel. Terenkripsi.",
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "PteroControl" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PteroControl — Satu dasbor untuk semua panel",
    description: "Aggregator Pterodactyl. Satu dasbor untuk semua server.",
    images: ["/og.svg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#05060f",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${untitledSans.variable} ${aeonikPro.variable} ${dotDigital.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#05060f] text-[#d1e4fa] selection:bg-[rgba(102,58,243,0.35)]">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
