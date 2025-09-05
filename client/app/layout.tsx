import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elevare: Focus on Your ONE Thing Daily",
  description:
    "Cut the noise and win the day. A minimalist productivity app to choose and complete your ONE most important task—based on the 80/20 principle.",
  keywords: [
    "focus app",
    "one thing app",
    "daily task app",
    "elevare",
    "productivity",
    "80/20 rule",
    "minimalist task manager",
    "get things done",
  ],
  openGraph: {
    title: "Elevare: Focus on Your ONE Thing Daily",
    description:
      "A simple daily focus app: pick one task, do it, and succeed. Inspired by The ONE Thing.",
    url: "",
    siteName: "Elevare",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Elevare: Focus on Your ONE Thing Daily",
    description:
      "Focus on what matters most. A minimalist task manager to win each day.",
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Elevare",
              description:
                "A simple productivity tool to help you focus on what matters most.",
              url: "https://elevare.app", // TODO: Update with actual URL
              applicationCategory: "ProductivityApplication",
              operatingSystem: "Web",
              author: { "@type": "Organization", name: "Elevare" },
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            }),
          }}
        />
        <Analytics />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
