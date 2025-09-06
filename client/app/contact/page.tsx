"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaTwitter, FaEnvelope } from "react-icons/fa";
import { faqs } from "../constants/faq";
import Navbar from '../components/landing/Navbar';
import { useForm, ValidationError } from '@formspree/react';
import { Button } from "../components/ui/Button";
import Link from "next/link";

const ContactPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [state, handleSubmit] = useForm("xkgvpyyw");

  if (state.succeeded) {
      return (
        <>
        <Navbar />
        <div className="py-24 sm:py-32 bg-gradient-to-b from-violet-50 via-white to-gray-50 h-screen flex items-center justify-center">
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
          {/* Warm Welcome */}
          <div className="mx-auto max-w-2xl text-center">
            <h2
              id="contact-heading"
              className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            >
              Let’s Talk <span className="text-primary">Focus</span>
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Contact Elevare, the productivity and focus app inspired by{" "}
              <em>The ONE Thing</em>. We’d love to hear from you, whether it’s
              feedback, feature ideas, or just a hello.
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-16">
            {/* Contact Form */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-gray-900">
                We’re building Elevare with you
              </h3>
              <p className="text-gray-600">
                Every message helps us create a tool that truly elevates your
                work and life. Drop us a note below 👇
              </p>

              {state.succeeded ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-green-50 border border-green-200 rounded-lg text-green-700 font-medium shadow-sm"
                >
                  🎉 Thanks for your message! We’ll get back to you soon.
                </motion.div>
              ) : (
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
                        className="block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
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
                        className="block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
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
                      className="flex w-full justify-center py-2 px-4 text-sm font-medium shadow-sm disabled:opacity-50"
                    >
                      Send Message
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Direct Contact & FAQ */}
            <div className="space-y-12">
              {/* Direct Contact */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Prefer direct? Reach me fast
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
                  Quick Answers to Common Questions
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
                            {openFaq === index ? "–" : "+"}
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

          {/* Soft CTA After FAQ */}
          <div className="mt-16 text-center">
            <p className="text-gray-700 text-lg">
              Still unsure? Send us a note, we reply to every message.  

            </p>
          </div>
        </div>
      </section>

      {/* SEO: Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            mainEntity: {
              "@type": "Organization",
              name: "Elevare",
              url: "https://yourelevare.com",
              contactPoint: {
                "@type": "ContactPoint",
                email: "operation927@gmail.com",
                contactType: "customer support",
              },
              sameAs: [
                "https://x.com/Gojer27",
                "https://github.com/Gojer16/Elevare",
                "https://linkedin.com/in/gojer27",
              ],
            },
          }),
        }}
      />
    </>
  );
};

export default ContactPage;