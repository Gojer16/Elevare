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
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-NLQ7D3LQ');
            `,
          }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#4F46E5" />
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="preconnect" href="https://va.vercel-scripts.com"
        />
        <Analytics />
        <SpeedInsights />
      </head>
      <body
        className={`${roboto.className} antialiased`}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NLQ7D3LQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
            <Providers>{children}</Providers>
      </body>
    </html>
  );
}
