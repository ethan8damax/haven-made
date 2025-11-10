import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Haven Made Media — Lifestyle & Wedding Films",
  description:
    "On the lookout for beautiful things because we were made for more. Haven Made Media crafts heartfelt lifestyle and wedding films.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="fixed inset-x-0 top-0 z-30 bg-white/50 backdrop-blur-lg border-b border-black/5">
          <div className="mx-auto max-w-7xl px-6">
            <Nav />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
