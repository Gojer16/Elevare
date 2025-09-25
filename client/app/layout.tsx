import type { Metadata } from "next";
import {Roboto } from "next/font/google"
import "./globals.css";
import Providers from "./providers";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next"
import '../app/dashboard/theme.css';
import { SpeedInsights } from "@vercel/speed-insights/next"


const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700", "900"]
})

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
    url: "https://elevareapp.vercel.app",
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
              url: "https://elevareapp.vercel.app",
              applicationCategory: "ProductivityApplication",
              operatingSystem: "Web",
              author: { "@type": "Organization", name: "Elevare" },
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            }),
          }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#4F46E5" />
        <link rel="icon" href="/logo.webp" />
        <link rel="apple-touch-icon" href="/logo.webp" />
        <link rel="preconnect" href="https://va.vercel-scripts.com"/>
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://va.vercel-scripts.com" />

        <link
          rel="preconnect"
          as="font"
          href="https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          as="font"
          href="https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc-.woff2"
          type="font/woff2"
          crossOrigin="anonymous"
        />
          
        <Analytics />
        <SpeedInsights />
      </head>
      <body
        className={`${roboto.className} antialiased`}
      >
            <Providers>{children}</Providers>
      </body>
    </html>
  );
}
