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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="font-body antialiased min-h-screen flex flex-col text-sdm-text" style={{backgroundColor: '#FFF1E6'}}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
