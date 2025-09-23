"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";

const About = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Elevare",
      applicationCategory: "Productivity",
      operatingSystem: "Web",
      description:
        "Elevare is a minimalist focus app that helps you achieve extraordinary results by focusing on your most important task each day.",
      url: "https://elevareapp.vercel.app",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
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
    });
    document.head.appendChild(script);
  }, []);

  return (
    <section className="relative py-20 md:py-32 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ staggerChildren: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          {/* Hero headline */}
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            Why <span className="text-primary">One Thing</span> Changes Everything
          </motion.h2>

          {/* Problem */}
          <motion.p
            className="text-lg text-gray-700 leading-relaxed"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
            Most of us chase too many tasks, drown in endless to-do lists, and end the day
            feeling busy but not fulfilled. The truth?{" "}
            <blockquote className=" pl-4 italic text-gray-700 my-6">
              “Not everything matters equally.”
            </blockquote>
            Trying to do it all leads to stress, burnout, and average results.
          </motion.p>

          {/* The ONE Thing principle */}
          <motion.p
            className="text-lg text-gray-700 leading-relaxed"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
            Inspired by Gary Keller’s bestseller{" "}
            <Link
              href="https://www.amazon.com/ONE-Thing-Surprisingly-Extraordinary-Results/dp/1885167776"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Read The ONE Thing book on Amazon"
              className="text-primary hover:underline font-semibold"
            >
              The ONE Thing
            </Link>
            , the principle is simple:{" "}
            <em>focus on the single most important action each day</em>, and you set off
            a domino effect that makes everything else easier or unnecessary.
          </motion.p>

          {/* Before / After */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left mt-8"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <h4 className="font-bold text-gray-800 mb-2">Before Elevare</h4>
              <ul className="space-y-2 text-gray-600 list-disc list-inside">
                <li>Scattered priorities.</li>
                <li>Constant overwhelm.</li>
                <li>Busy but unproductive.</li>
              </ul>
            </div>
            <div className="p-6 bg-primary/5 rounded-xl shadow-sm">
              <h4 className="font-bold text-primary mb-2">After Elevare</h4>
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                <li>Clarity and focus.</li>
                <li>Confidence in progress.</li>
                <li>Momentum that compounds.</li>
              </ul>
            </div>
          </motion.div>

          {/* How Elevare helps */}
          <motion.div
            className="space-y-4"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
            <h3 className="text-2xl font-bold text-primary">How Elevare Elevates You</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Elevare turns this philosophy into a <strong>daily practice</strong>.
              Each day, you choose your <em>ONE focus task</em>, commit to it,
              and reflect on what you’ve learned. Step by step, you replace
              overwhelm with clarity, busyness with momentum, and distraction with purpose.
            </p>
          </motion.div>

          {/* Transformation */}
          <motion.p
            className="text-lg text-gray-600 leading-relaxed"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
            Extraordinary success isn’t built overnight, it’s built{" "}
            <strong>one task, one habit, one win at a time</strong>. Elevare helps
            you line up the dominoes. All you have to do is tip the first one.
          </motion.p>

          {/* Brand promise */}
          <motion.p
            className="text-lg font-semibold text-gray-800 mt-10"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
            Elevare isn’t about doing more, it’s about <span className="text-primary">elevating the right things</span>.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
