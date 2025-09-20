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


// Cache busting version for favicons - update this to force mobile cache refresh
const FAVICON_VERSION = "v20250918b";

export const metadata: Metadata = {
  title: "Suburban Dad Mode",
  description: "Life, parenting, and everything in between from the suburbs",
  keywords: ["suburban", "dad", "family", "parenting", "lifestyle", "blog"],
  authors: [{ name: "Suburban Dad" }],
  manifest: `/site.webmanifest?${FAVICON_VERSION}`,
  icons: {
    icon: [
      { url: `/favicon.ico?${FAVICON_VERSION}`, sizes: "32x32" },
      { url: `/favicon-16x16.png?${FAVICON_VERSION}`, sizes: "16x16", type: "image/png" },
      { url: `/favicon-32x32.png?${FAVICON_VERSION}`, sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: `/apple-touch-icon.png?${FAVICON_VERSION}`, sizes: "180x180", type: "image/png" },
    ],
    shortcut: `/favicon.ico?${FAVICON_VERSION}`,
    other: [
      // Additional mobile-specific icons for better compatibility
      { url: `/icon-192.png?${FAVICON_VERSION}`, sizes: "192x192", type: "image/png" },
      { url: `/icon-512.png?${FAVICON_VERSION}`, sizes: "512x512", type: "image/png" },
    ],
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
  themeColor: "#FFF1E6",
  colorScheme: "light",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        {/* Explicit favicon links for aggressive mobile cache busting */}
        <link rel="icon" type="image/x-icon" href={`/favicon.ico?${FAVICON_VERSION}`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`/favicon-16x16.png?${FAVICON_VERSION}`} />
        <link rel="icon" type="image/png" sizes="32x32" href={`/favicon-32x32.png?${FAVICON_VERSION}`} />
        <link rel="apple-touch-icon" sizes="180x180" href={`/apple-touch-icon.png?${FAVICON_VERSION}`} />
        <link rel="manifest" href={`/site.webmanifest?${FAVICON_VERSION}`} />
        <meta name="theme-color" content="#FFF1E6" />
        <meta name="msapplication-TileColor" content="#FFF1E6" />
      </head>
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
