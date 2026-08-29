import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const sfDisplay = Inter({
  subsets: ["latin"],
  variable: "--font-sf-pro-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sfText = Inter({
  subsets: ["latin"],
  variable: "--font-sf-pro-text",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PteroControl — Semua panel-mu. Satu kendali.",
  description:
    "Agregator Pterodactyl. Hubungkan banyak panel, enkripsi API key pakai AES-256-CBC dan lihat semua server dalam satu dasbor. Tema Apple — cathedral of whitespace.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${sfDisplay.variable} ${sfText.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#1d1d1f]">
        {children}
      </body>
    </html>
  );
}
