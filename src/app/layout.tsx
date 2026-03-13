import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1A1A1A",
};

export const metadata: Metadata = {
  title: {
    default: "Maison Élégance | Luxury Fashion & Virtual Try-On",
    template: "%s | Maison Élégance",
  },
  description:
    "Discover timeless luxury fashion at Maison Élégance. Shop curated collections and experience our AI-powered virtual try-on technology.",
  keywords: [
    "luxury fashion",
    "virtual try-on",
    "AI fashion",
    "designer clothing",
    "Maison Élégance",
  ],
  authors: [{ name: "Maison Élégance" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Maison Élégance",
    title: "Maison Élégance | Luxury Fashion & Virtual Try-On",
    description:
      "Discover timeless luxury fashion. Shop curated collections and experience AI-powered virtual try-on.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maison Élégance | Luxury Fashion & Virtual Try-On",
    description:
      "Discover timeless luxury fashion. Shop curated collections and experience AI-powered virtual try-on.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
