"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";

const Hero = () => {
  return (
    <section className="flex flex-col items-center justify-center text-center py-20 md:py-32 px-4 bg-gradient-to-b from-violet-50 via-white to-gray-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl"
      >
        {/* SEO: Primary headline */}
        <h1 className="tracking-tight text-4xl md:text-6xl font-extrabold leading-tight text-gray-900 mb-6">
        Stop Drowning in To Dos. <br />
        <span className="text-primary">Start Winning with One.</span>
        </h1>

        {/* SEO: Supporting headline */}
        <h2 className="text-lg md:text-xl text-gray-600 font-medium mb-8">
        Most people chase too many tasks and end up burned out.  
        Inspired by Gary Keller’s <em>The ONE Thing</em>, Elevare helps you  
        cut through the noise, focus on your <strong>most important task</strong>,  
        and build momentum that compounds into extraordinary results.
        </h2>

        {/* Call to action */}
        <div className="flex-col sm:flex-row gap-3 w-full sm:w-auto flex justify-center">
          <Link href="/dashboard">
            <Button 
            aria-label="Get Started - Find Your ONE Thing"
            size="lg">Find Your ONE Thing</Button>
          </Link>

          {/* Secondary CTA */}
          <Link
            href="https://www.amazon.com/ONE-Thing-Surprisingly-Extraordinary-Results/dp/1885167776"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button 
            variant="outline" 
            size="md"
            aria-label="Learn the Philosophy - The ONE Thing by Gary Keller"
            >Learn the Philosophy</Button>
          </Link>
        </div>

        {/* Subtext for extra SEO juice */}
        <p className="mt-6 text-sm text-gray-500">
        Success builds sequentially, one task, one habit, one win at a time.  
        Go small. Stay focused. Elevate your life.
        </p>
      </motion.div>
      {/* Right side: Illustration */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="flex-shrink-0"
      >
      </motion.div>
    </section>
  );
};

export default Hero;
