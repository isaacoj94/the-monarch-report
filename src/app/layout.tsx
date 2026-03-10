import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Monarch Report — Korea Economic Reality Monitor",
  description: "See how policy decisions affect everyday life in Korea. Track gas prices, food costs, exchange rates, debt ratios, and more.",
  openGraph: {
    title: "The Monarch Report",
    description: "Korea Economic Reality Monitor — Policy decisions vs. your wallet.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} font-mono antialiased bg-[#0a0a0a] text-white`}>
        {children}
      </body>
    </html>
  );
}
