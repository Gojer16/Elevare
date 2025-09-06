"use client";
import React from 'react';
import Navbar from './landing/Navbar';
import Hero from './landing/Hero';
import About from './landing/About';
import Features from './landing/Features';
import Testimonials from './landing/Testimonials';
import Footer from './landing/Footer';

const LandingPage = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Elevare",
    url: "https://elevareapp.vercel.app/", 
    description:
      "Elevare — a minimalist productivity app that helps you accomplish your single most important task each day and build momentum over time.",
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0.00",
      priceCurrency: "USD",
      url: "https://elevareapp.vercel.app/",
    },
    author: {
      "@type": "Person",
      name: "Orlando Ascanio", 
    },
    keywords: "productivity, focus, task management, one thing, gary keller, elevare",
    genre: "Productivity",
    sameAs: [
      "https://www.linkedin.com/in/orlando-ascanio-dev/",
    ],

  };
  return (
    <div>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />
      <Navbar />
      <Hero />
      <About />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default LandingPage;
