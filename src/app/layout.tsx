import type { Metadata, Viewport } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
});

const hedvigLetters = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-hedvig-letters-serif",
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pterocontrol.vercel.app"),
  title: {
    default: "Pterodactyl Control Panel — Deploy & Manage Game Servers Effortlessly",
    template: "%s · Pterodactyl",
  },
  description: "Powerful control panel for game server management. Intuitive interface, robust features, and built to scale.",
  applicationName: "Pterodactyl",
  keywords: ["Pterodactyl", "Game Server", "Control Panel", "Server Management", "Next.js", "Vercel"],
  authors: [{ name: "Pterodactyl" }],
  creator: "Pterodactyl",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pterocontrol.vercel.app",
    siteName: "Pterodactyl",
    title: "Pterodactyl Control Panel — Deploy your game servers effortlessly",
    description: "Deploy your game servers with ease. Powerful, intuitive, and built for scale.",
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "Pterodactyl" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pterodactyl Control Panel — Deploy & Manage Game Servers Effortlessly",
    description: "Powerful control panel for game server management.",
    images: ["/og.svg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f9fbf2",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${hedvigLetters.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-surface-canvas text-deep-ink selection:bg-[rgba(255,226,40,0.35)]">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
