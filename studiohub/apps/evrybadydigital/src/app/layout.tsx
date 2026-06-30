import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopProgress from '@/components/TopProgress';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Evrybady Digital",
  description: "Creative digital agency for web, marketing, and growth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface-alt text-white">
        <TopProgress />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded focus:bg-brand focus:px-4 focus:py-2 focus:text-surface focus:text-sm focus:font-semibold focus:outline-none">
          Skip to main content
        </a>
        <Navbar />

        <div id="main-content" className="pt-16">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
