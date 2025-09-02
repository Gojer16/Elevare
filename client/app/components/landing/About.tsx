"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const About = () => {
  return (
    <section className="relative py-20 md:py-32 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          {/* SEO-optimized heading */}
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">
            What Is <span className="text-primary-accent">The ONE Thing?</span>
          </h2>

          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              The idea of <em>The ONE Thing</em> comes from the bestselling book{" "}
              <Link
                href="https://www.amazon.com/ONE-Thing-Surprisingly-Extraordinary-Results/dp/1885167776"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                <strong>The ONE Thing</strong> by Gary Keller and Jay Papasan
              </Link>
              . The core principle is simple but powerful:{" "}
              <strong>not all tasks are created equal</strong>. If you focus on
              the single most important action each day, you set off a domino
              effect that makes everything else easier or unnecessary.
            </p>

            <h3 className="text-2xl font-bold text-gray-900">
              Why This Matters
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Most productivity systems overwhelm you with endless{" "}
              <em>to-do lists</em>. But the truth is,{" "}
              <strong>success comes from focus, not busyness</strong>. By
              applying the{" "}
              <span className="font-medium">80/20 principle</span> (and then
              drilling down to the essential 1%), you achieve extraordinary
              results through simplicity and clarity.
            </p>

            <h3 className="text-2xl font-bold text-gray-900">
              How Success-List Helps
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Success-List is a{" "}
              <strong>minimalist focus app</strong> designed to bring this
              principle to life. Each day, you choose{" "}
              <em>your ONE success task</em>, commit to it, and reflect on your
              progress. That’s it—no clutter, no distractions. Just one clear
              win at a time, compounding into lasting success.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
