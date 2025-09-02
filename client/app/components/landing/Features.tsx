"use client";
import { motion } from "framer-motion";
import { features } from "@/app/constants/features";


const Features = () => {
  return (
    <section className="py-20 md:py-32" aria-labelledby="features-heading">
      <div className="container mx-auto px-4 md:px-12">
        <h2
          id="features-heading"
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Key Features That Keep You Focused
        </h2>
        <p className="max-w-2xl mx-auto text-center text-lg text-gray-700 mb-16">
          Success-List is a <strong>daily productivity app</strong> built on
          simplicity. Focus on a single priority, track your progress, and
          create habits that lead to long-term success.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
