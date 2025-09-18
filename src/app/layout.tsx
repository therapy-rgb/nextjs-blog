import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});


export const metadata: Metadata = {
  title: "Suburban Dad Mode",
  description: "Life, parenting, and everything in between from the suburbs",
  keywords: ["suburban", "dad", "family", "parenting", "lifestyle", "blog"],
  authors: [{ name: "Suburban Dad" }],
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://suburbandadmode.com",
    title: "Suburban Dad Mode",
    description: "Life, parenting, and everything in between from the suburbs",
    siteName: "Suburban Dad Mode",
  },
  twitter: {
    card: "summary_large_image",
    title: "Suburban Dad Mode",
    description: "Life, parenting, and everything in between from the suburbs",
    creator: "@suburbandadmode",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FF7F00",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="font-cooper antialiased min-h-screen flex flex-col text-sdm-text" style={{backgroundColor: '#FFF1E6'}}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
