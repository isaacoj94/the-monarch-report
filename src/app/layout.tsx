import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Monarch Report — Defending Democracy, Faith & Freedom",
  description: "Independent journalism bringing the truth about Korea and Japan to the West. Trusted by U.S. legislators and policymakers as a resource for facts.",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "The Monarch Report",
    description: "Defending Democracy, Faith & Freedom — Independent journalism on Korea and Japan.",
    type: "website",
    siteName: "The Monarch Report",
  },
  twitter: {
    card: "summary_large_image",
    site: "@monarchreport25",
  },
};

// Inline script to prevent FOUC — sets data-theme before first paint
const themeScript = `(function(){var t=localStorage.getItem('tm-theme');if(t)document.documentElement.setAttribute('data-theme',t)})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} ${cormorant.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
