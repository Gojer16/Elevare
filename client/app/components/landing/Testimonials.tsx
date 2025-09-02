"use client";
import { motion } from "framer-motion";
import { betaTesters } from "@/app/constants/betaTesters";
import WaitlistCTA from "./WaitListCTA";

const Testimonials = () => {
  return (
    <section
      className="py-20 md:py-32 bg-gray-50"
      aria-labelledby="testimonials-heading"
    >
      <div className="container mx-auto px-4 md:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <h2
            id="testimonials-heading"
            className="text-3xl md:text-4xl font-bold text-center mb-6"
          >
            What People Are Saying
          </h2>
          <p className="max-w-2xl mx-auto text-center text-lg text-gray-700 mb-16">
            Success-List is more than a <strong>productivity app</strong>—it’s
            a daily practice of focus. Here’s how professionals, creators, and
            leaders use it to achieve clarity and results.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {betaTesters.map((t, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              >
              <p className="text-lg text-gray-800 italic mb-6">“{t.quote}”</p>
              <p className="font-semibold text-purple-600">{t.author}</p>
              <p className="text-sm text-gray-600">{t.title}</p>
            </motion.div>
            ))}
          </div>

        </motion.div>
        <WaitlistCTA />
      </div>
    </section>
  );
};

export default Testimonials;
