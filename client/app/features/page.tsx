"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "../components/ui/Button";
import { features } from "../data/features";
import Navbar from "../components/landing/Navbar";
import FeatureDetailModal from "../components/features/FeatureDetailModal";
import { Feature } from "@/types/feature";

export default function FeaturesPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  return (
    <main className="bg-gradient-to-b from-violet-50 via-white to-gray-50 min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <section className="py-20 md:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-4"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-gray-900">
            Extraordinary Results Come From <span className="text-primary">Focus</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10">
            Elevare isn’t just another productivity app or task manager. It’s a{" "}
            <strong>focus app built on the ONE Thing method</strong>. We help you strip away the noise, 
            commit to what truly matters, and build momentum, one clear win at a time.
          </p>
        </motion.div>
      </section>

      {/* Interactive Features Section */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Column: Feature List */}
            <div className="flex flex-col space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setSelectedFeature(feature)}
                  className={`cursor-pointer p-6 rounded-xl transition-all duration-300 ${
                    activeIndex === index
                      ? "bg-white ring-1 ring-primary/20 shadow-lg"
                      : "hover:bg-gray-100/50 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <feature.icon
                      className={`w-8 h-8 transition-colors duration-300 ${
                        activeIndex === index ? "text-primary" : "text-gray-500"
                      }`}
                    />
                    <h2
                      className={`text-xl md:text-2xl font-bold transition-colors duration-300 ${
                        activeIndex === index ? "text-gray-900" : "text-gray-600"
                      }`}
                    >
                      {feature.title}
                    </h2>
                  </div>
                  {activeIndex === index && (
                    <p className="text-xs text-primary/80 mt-2">
                      Click to learn more →
                    </p>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Right Column: Feature Details */}
            <div className="relative h-[500px] bg-white/50 rounded-2xl shadow-lg overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    {(() => {
                      const Icon = features[activeIndex].icon;
                      return <Icon className="w-10 h-10 text-primary" />;
                    })()}
                    <h2 className="text-3xl font-bold text-primary">
                      {features[activeIndex].title}
                    </h2>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {features[activeIndex].description}
                  </p>
                </motion.div>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex + "-image"}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  {/* <Image
                    src={features[activeIndex].image}
                    alt={features[activeIndex].title}
                    fill
                    className="object-cover opacity-20"
                  /> */}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* CTA for Beta Testing */}
      <section className="py-20 md:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto px-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Be Part of Building the Future of Focus
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Don’t just download another productivity app. Join our beta and{" "}
            <strong>co-create Elevare</strong> with us. Your feedback will shape the tools 
            that help thousands focus on what truly matters.
          </p>
          <Link href="/register">
            <Button variant="default" size="lg">
              Join the Journey
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Elevare",
            applicationCategory: "Productivity",
            operatingSystem: "Web",
            description:
              "Elevare is a focus and productivity app based on the ONE Thing method. Commit to your most important task daily, track progress, and build lasting momentum.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            url: "https://elevareapp.vercel.app/features",
            sameAs: [
              "https://www.linkedin.com/in/orlando-ascanio-dev/",
            ],
            author: {
              "@type": "Person",
              name: "Orlando Ascanio",
            },
            keywords: "productivity, focus, task management, one thing, gary keller, elevare",
          genre: "Productivity",
          }),
        }}
      />

      <FeatureDetailModal
        isOpen={!!selectedFeature}
        onClose={() => setSelectedFeature(null)}
        feature={selectedFeature}
      />
    </main>
  );
}