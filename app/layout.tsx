import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Soulink | Gifting should feel personal again",
  description:
    "Soulink is a complete gifting marketplace — traditional ecommerce, creator stores, and shoppable reels — enhanced by creator-driven content that makes every gift personal.",
  keywords: [
    "gifting marketplace",
    "personalized gifts",
    "creator commerce",
    "shoppable reels",
    "handmade gifts",
  ],
  openGraph: {
    title: "Soulink — Gifting should feel personal again",
    description:
      "A complete gifting marketplace enhanced by creator-driven content. Discover, personalize, and gift through stories.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("soulink-theme");document.documentElement.dataset.theme=t==="dark"?"dark":"light"}catch(e){document.documentElement.dataset.theme="light"}`,
          }}
        />
      </head>
      <body className={`${fraunces.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
