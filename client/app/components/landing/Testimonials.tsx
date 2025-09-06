"use client";
import { motion } from "framer-motion";
import { betaTesters } from "@/app/constants/betaTesters";
import EndedCTA from "./EndedCTA";

const Testimonials = () => {
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
    <section
    className="py-20 md:py-32 bg-gray-50"
    aria-labelledby="testimonials-heading"
    >
    <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
        />
    <div className="container mx-auto px-4 md:px-12">
      <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8 }}
      >
      {/* Headline */}
      <h2
        id="testimonials-heading"
        className="text-3xl md:text-4xl font-extrabold text-center mb-6 text-gray-900"
      >
        Imagine the <span className="text-primary">Impact of ONE Thing</span>
      </h2>

      {/* Supporting copy */}
      <p className="max-w-2xl mx-auto text-center text-lg text-gray-700 mb-16">
        While Elevare is still growing, the philosophy it’s built on has already
        transformed how <strong>creators, professionals, and students </strong> 
        approach their day. Here’s the kind of clarity users say they crave,
        and what Elevare helps deliver.
      </p>

      {/* Testimonial Grid */}
      <div className="grid md:grid-cols-3 gap-8">
      {betaTesters.map((beta, index) => {
      const Icon = beta.icon;
      return (
        <motion.div
          key={index}
          className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
        >
        {/* Avatar/Icon */}
        <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full mb-4">
          <Icon size={28} className="text-primary" />
        </div>

        {/* Segment */}
        <h3 className="text-lg font-semibold text-primary mb-2">
          {beta.segment}
        </h3>

        {/* Quote */}
        <p className="text-gray-800 italic mb-4">“{beta.quote}”</p>

        {/* Stars */}
        <div className="flex mb-2">
          {Array.from({ length: beta.stars }).map((_, i) => (
            <span key={i} className="text-yellow-400">⭐</span>
          ))}
        </div>
      </motion.div>
      );
    })}
  </div>
    </motion.div>
    <EndedCTA />
  </div>
</section>
  );
};

export default Testimonials;
