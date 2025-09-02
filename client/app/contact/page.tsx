"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaTwitter, FaEnvelope } from "react-icons/fa";
import { faqs } from "../constants/faq";

const ContactPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section
      id="contact"
      className="py-24 sm:py-32 bg-gray-50 relative"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="contact-heading"
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Contact the Success-List Team
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Have questions about the app, feedback, or feature requests? We’d
            love to hear from you. Reach out directly:
          </p>
        </div>

        {/* Direct Contact Options */}
        <div className="mt-12 flex flex-col items-center gap-6 text-lg">
          <a
            href="mailto:hello@successlist.app" //change latter
            className="flex items-center gap-3 text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <FaEnvelope /> hello@successlist.app 
          </a> //Change later
          <a
            href="https://twitter.com/successlistapp" // change later
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <FaTwitter /> @successlistapp
          </a> //Change later
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-20 max-w-2xl">
          <h3 className="text-2xl font-bold text-gray-900">
            Frequently Asked Questions
          </h3>
          <dl className="mt-10 space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b pb-6">
                <dt>
                  <button
                    onClick={() =>
                      setOpenFaq(openFaq === index ? null : index)
                    }
                    className="flex w-full items-start justify-between text-left text-gray-900"
                  >
                    <span className="font-semibold">{faq.question}</span>
                    <motion.span
                      animate={{ rotate: openFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </motion.span>
                  </button>
                </dt>
                <motion.dd
                  initial={false}
                  animate={{
                    height: openFaq === index ? "auto" : 0,
                    marginTop: openFaq === index ? "1rem" : "0",
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden text-gray-600"
                >
                  {faq.answer}
                </motion.dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
