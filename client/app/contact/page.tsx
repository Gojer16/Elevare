"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaTwitter, FaEnvelope } from "react-icons/fa";
import { faqs } from "../constants/faq";
import Navbar from '../components/landing/Navbar';
import { useForm, ValidationError } from '@formspree/react';
import { Button } from "../components/ui/Button";

const ContactPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [state, handleSubmit] = useForm("xkgvpyyw");

  if (state.succeeded) {
      return (
        <>
        <Navbar />
        <div className="py-24 sm:py-32 bg-gray-50 h-screen flex items-center justify-center">
          <p className="text-2xl font-bold text-gray-900">Thanks for your message!</p>
        </div>
        </>
      )
  }

  return (
    <>
      <Navbar />
      <section
        id="contact"
        className="py-24 sm:py-32 bg-gray-50 relative"
        aria-labelledby="contact-heading"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2
              id="contact-heading"
              className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            >
              Contact the Elevare Team
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Have questions, feedback, or feature requests? We’d love to hear
              from you.
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-16">
            {/* Contact Form */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-gray-900">
                Send us a message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      type="email" 
                      name="email"
                      placeholder="Enter your email"
                      className="block w-full h-8 text-clip p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <ValidationError 
                      prefix="Email" 
                      field="email"
                      errors={state.errors}
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Message
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="message"
                      name="message"
                      placeholder="I love your app!"
                      rows={4}
                      className="block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    ></textarea>
                    <ValidationError 
                      prefix="Message" 
                      field="message"
                      errors={state.errors}
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Button
                    type="submit"
                    disabled={state.submitting}
                    className="flex w-full justify-center rounded-md border border-transparent  py-2 px-4 text-sm font-medium text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
                  >
                    Send Message
                  </Button>
                </div>
              </form>
            </div>

            {/* Contact Info & FAQ */}
            <div className="space-y-12">
              {/* Direct Contact */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Or reach us directly
                </h3>
                <div className="mt-6 space-y-4">
                  <a
                    href="mailto:operation927@gmail.com"
                    className="flex items-center gap-3 text-lg text-gray-600 hover:text-secondary transition-colors"
                  >
                    <FaEnvelope className="text-primary" />
                    operation927@gmail.com
                  </a>
                  <a
                    href="https://x.com/Gojer27"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-lg text-gray-600 hover:text-secondary transition-colors"
                  >
                    <FaTwitter className="text-primary" />
                    @Gojer27
                  </a>
                </div>
              </div>

              {/* FAQ */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Frequently Asked Questions
                </h3>
                <dl className="mt-6 space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-t border-gray-200 pt-4">
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
                            className="ml-6 flex h-7 items-center"
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
                          opacity: openFaq === index ? 1 : 0,
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden text-gray-600"
                      >
                        <p className="pt-2">{faq.answer}</p>
                      </motion.dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;