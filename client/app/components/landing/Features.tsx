"use client";
import { motion } from "framer-motion";
import { features } from "@/app/constants/features";

const Features = () => {
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
      aria-labelledby="features-heading"
    >
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />
      <div className="container mx-auto px-4 md:px-12">
        {/* Headline */}
        <h2
          id="features-heading"
          className="text-3xl md:text-4xl font-extrabold text-center mb-6 text-gray-900"
        >
          The Tools That Keep You <span className="text-primary">Focused</span>
        </h2>

        {/* Supporting copy */}
        <p className="max-w-2xl mx-auto text-center text-lg text-gray-700 mb-16 leading-relaxed">
          Most productivity apps overload you with endless lists.{" "}
          <strong>Elevare is different.</strong> We give you just the tools you
          need to focus on what matters, build momentum, and turn small daily
          wins into extraordinary results.
        </p>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-transform hover:scale-[1.02]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="flex justify-center mb-4">
                  <Icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-primary">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Pull quote for emphasis */}
        <motion.blockquote
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mx-auto mt-16 text-center text-xl font-semibold text-gray-800 italic"
        >
          “Extraordinary success isn’t about doing more, it’s about doing the
          right thing.”
        </motion.blockquote>
      </div>
    </section>
  );
};

export default Features;
