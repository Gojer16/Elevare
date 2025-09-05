"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";

const Hero = () => {
  return (
    <section className="flex flex-col items-center justify-center text-center py-20 md:py-32 px-4 bg-gradient-to-b from-white to-gray-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl"
      >
        {/* SEO: Primary headline */}
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900 mb-6">
          Focus on <span className="text-primary">The ONE Thing</span> That Truly Matters
        </h1>

        {/* SEO: Supporting headline */}
        <h2 className="text-lg md:text-xl text-gray-700 font-medium mb-8">
          Inspired by Gary Keller’s bestselling book{" "}
          <em>The ONE Thing</em>, Elevare is a minimalist{" "}
          <strong>daily focus app</strong> that helps you cut distractions and
          achieve meaningful progress—one task at a time.
        </h2>

        {/* Call to action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button size="lg">Start Focusing Today</Button>
          </Link>

          {/* Secondary CTA */}
          <Link
            href="https://www.amazon.com/ONE-Thing-Surprisingly-Extraordinary-Results/dp/1885167776"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg">Learn the Philosophy</Button>
          </Link>
        </div>

        {/* Subtext for extra SEO juice */}
        <p className="mt-6 text-sm text-gray-500">
          Build your <strong>daily focus</strong> with one task,
          based on the proven <em>80/20 principle</em>. Small wins compound into
          extraordinary results.
        </p>
      </motion.div>
    </section>
  );
};

export default Hero;
