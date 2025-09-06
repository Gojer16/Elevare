"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";

const containerVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.09,
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const lineVariant = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: "easeOut" } },
};

const ctaVariant = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.45 } },
};

const Hero = () => {

const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Elevare",
    url: "https://SITE_URL", 
    description:
      "Elevare — a minimalist productivity app that helps you accomplish your single most important task each day and build momentum over time.",
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0.00",
      priceCurrency: "USD",
      url: "https://SITE_URL",
    },
    author: {
      "@type": "Person",
      name: "Orlando Ascanio", 
    },
    screenshot: "https://SITE_URL/hero-screenshot.png",
  };


  return (
    <section
      aria-labelledby="elevare-hero-title"
      className="flex flex-col-reverse items-center justify-between gap-10 md:gap-16 text-center md:text-center py-20 md:py-32 px-6 bg-gradient-to-b from-violet-50 via-white to-gray-50"
    >
      {/* structured data for SEO (JSON-LD) */}
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />

    
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible" 
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-2xl"
      >
        {/* Headline */}
        <h1
          id="elevare-hero-title"
          className="tracking-tight text-4xl md:text-6xl font-extrabold leading-tight text-gray-900 mb-6"
        >
          <motion.span className="block" variants={lineVariant}>
            Stop Drowning in To-Dos.
          </motion.span>
          <motion.span className="block text-primary" variants={lineVariant}>
            Start Winning with One.
          </motion.span>
        </h1>

        {/* Supporting headline */}
        <motion.h2
          variants={lineVariant}
          className="text-lg md:text-xl text-gray-600 font-medium mb-8"
        >
          Most people chase too many tasks and end up burned out. Inspired by Gary
          Keller’s <em>The ONE Thing</em>, Elevare helps you cut through the noise,
          focus on your <strong>most important task</strong>, and build momentum that
          compounds into extraordinary results.
        </motion.h2>

        {/* CTAs */}
        <motion.div
          variants={ctaVariant}
          className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center md:justify-center"
        >
          <Link href="/dashboard">
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              aria-label="Get Started - Find Your ONE Thing"
            >
              <Button size="lg">Find Your ONE Thing</Button>
            </motion.a>
          </Link>

          <Link
            href="https://www.amazon.com/ONE-Thing-Surprisingly-Extraordinary-Results/dp/1885167776"
            target="_blank"
            rel="noopener noreferrer"
          >
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              aria-label="Learn the Philosophy - The ONE Thing by Gary Keller"
            >
              <Button variant="outline" size="md">
                Learn the Philosophy
              </Button>
            </motion.a>
          </Link>
        </motion.div>

        {/* Subtext */}
        <motion.p variants={lineVariant} className="mt-6 text-sm text-gray-500">
          Success builds sequentially, one task, one habit, one win at a time.
          Go small. Stay focused. Elevate your life.
        </motion.p>
      </motion.div>
    </section>
  );
};

export default Hero;