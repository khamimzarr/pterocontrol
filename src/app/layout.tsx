import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
  title: "PteroControl — Satu dasbor untuk semua panel",
  description:
    "Aggregator Pterodactyl. Hubungkan banyak panel, API key terenkripsi AES-256-CBC, satu dasbor untuk semua server.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${untitledSans.variable} ${aeonikPro.variable} ${dotDigital.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#05060f] text-[#d1e4fa] selection:bg-[rgba(102,58,243,0.35)]">
        {children}
      </body>
    </html>
  );
}
