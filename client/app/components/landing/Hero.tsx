"use client";
import Link from "next/link";
import { motion, easeOut } from "framer-motion";
import { Button } from "../ui/Button";

const fadeVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: easeOut } },
};

const ctaVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.3, duration: 0.4, ease: easeOut } },
};

const Hero = () => {
  return (
    <section
      aria-labelledby="elevare-hero-title"
      className='flex flex-col-reverse items-center justify-between gap-10 md:gap-16 text-center md:text-center py-20 md:py-32 px-6 bg-gradient-to-b from-violet-50 via-white to-gray-50'
    >
      <div className="max-w-2xl">
        {/* Headline (renders immediately, fade accent only) */}
        <motion.h1
          id="elevare-hero-title"
          className="tracking-tight text-4xl md:text-6xl font-bold leading-tight text-gray-900 mb-6"
          initial="hidden"
          animate="visible"
          variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
          }}
          >
          <span className="block">Stop Drowning in To-Dos.</span>
          <span className="block text-primary">Start Winning with One.</span>
        </motion.h1>

        {/* Supporting headline */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeVariant}
          className="text-lg md:text-xl text-gray-600 font-medium mb-8"
        >
          Most people chase too many tasks and end up burned out. Inspired by Gary
          Keller’s <em>The ONE Thing</em>, Elevare helps you cut through the noise,
          focus on your <strong>most important task</strong>, and build momentum that
          compounds into extraordinary results.
          <p className="mt-4 text-sm text-gray-500">
            Elevare’s core focus, choosing and completing your most important task is
            free forever. Upgrade to Pro anytime for unlimited AI guidance, advanced
            analytics, reminders, and enhanced achievements.
          </p>
        </motion.h2>

        {/* CTAs */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
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
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeVariant}
          className="mt-6 text-sm text-gray-500"
        >
          Success builds sequentially, one task, one habit, one win at a time.
          Go small. Stay focused. Elevate your life.
        </motion.p>
      </div>
    </section>
  );
};

export default Hero;
