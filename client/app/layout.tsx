import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import Script from "next/script";

<Script
  id="structured-data"
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Success-List",
      description: "A simple productivity tool to help you focus on what matters most.",
      url: "https://success-list.com", // replace with domain
      applicationCategory: "ProductivityApplication",
      operatingSystem: "Web",
      author: {
        "@type": "Organization",
        name: "Success-List"
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD"
      },
      sameAs: [
        "https://twitter.com/",
        "https://www.linkedin.com/company/",
        "https://github.com/"
      ]
    })
  }}
/>

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The ONE Thing Focus App | Daily Success List",
  description:
    "Cut the noise and win the day. A minimalist productivity app to choose and complete your ONE most important task—based on the 80/20 principle.",
  keywords: [
    "focus app",
    "one thing app",
    "daily task app",
    "success list",
    "productivity",
    "80/20 rule",
    "minimalist task manager",
    "get things done",
  ],
  openGraph: {
    title: "The ONE Thing Focus App",
    description:
      "A simple daily focus app: pick one task, do it, and succeed. Inspired by The ONE Thing.",
    url: "",
    siteName: "ONE Thing Focus App",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "The ONE Thing Focus App",
    description:
      "Focus on what matters most. A minimalist success list to win each day.",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}