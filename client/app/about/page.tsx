"use client";
import { motion } from 'framer-motion';
import { team } from '../constants/team';
import Link from 'next/link';
import Navbar from '../components/landing/Navbar';
import Script from "next/script";


const AboutPage = () => {
  return (
<>
      <Navbar />
         <Script
        id="organization-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Elevare",
            url: "https://elevareapp.vercel.app/",
            logo: "https://elevareapp.vercel.app/logo.png",
            sameAs: [
              "https://x.com/Gojer27",
              "https://github.com/Gojer16/Elevare",
              "https://www.linkedin.com/in/orlando-ascanio-dev/",
            ],
            founder: {
              "@type": "Person",
              name: "Orlando",
              jobTitle: "The Visionary",
            },
            description:
              "Elevare is a productivity and focus app inspired by The ONE Thing. It helps creators, professionals, and students cut distractions, focus on what matters, and achieve extraordinary results.",
            foundingDate: "2025",
          }),
        }}
      />
      <div className="py-24 sm:py-32 bg-gradient-to-b from-violet-50 via-white to-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Intro */}
          <div className="mx-auto max-w-3xl lg:mx-0 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              About Elevare
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-700">
              Elevare isn’t about doing more,{" "}
              <span className="font-semibold text-primary">
                it’s about elevating the right things.
              </span>
            </p>
          </div>

          {/* Origin Story + Mission */}
          <div className="mt-20 mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 text-lg text-gray-700">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">The Origin</h2>
              <p>
                Elevare started with a simple frustration: too many productivity
                apps made us feel busy, but not accomplished.{" "}
                <span className="font-medium">
                  Until I read{" "}
                  <Link
                    href="https://www.amazon.com/ONE-Thing-Surprisingly-Extraordinary-Results/dp/1885167776"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    The ONE Thing
                  </Link>
                </span>
                , I thought productivity meant doing more. What clicked was this:
                <strong> not everything matters equally</strong>. We didn’t need
                another to-do list, we needed a focus app that celebrates
                clarity.
              </p>
              <blockquote className="border-l-4 border-secondary pl-6 italic text-gray-800 font-serif">
                “What’s the ONE thing I can do such that by doing it, everything
                else will be easier or unnecessary?”
              </blockquote>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              <p>
                Our mission is to help ambitious people trade{" "}
                <span className="font-medium">overwhelm for clarity</span>, and{" "}
                <span className="font-medium">busyness for meaningful wins</span>.
              </p>
              <p>
                One focus. One habit. One extraordinary result at a time.
                Elevare is your <strong>daily success ritual</strong>.
              </p>
            </div>
          </div>

          {/* Who It’s For */}
          <div className="mx-auto max-w-4xl mt-20 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Who Elevare Is For
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Elevare is built for{" "}
              <strong>creators, professionals, and students</strong> who are
              tired of drowning in to-dos and want a daily ritual of clarity.
            </p>
            <ul className="grid sm:grid-cols-3 gap-6 text-gray-700">
              <li className="bg-white rounded-xl shadow p-6">
                <h3 className="font-semibold text-primary mb-2">
                  🎨 Creators
                </h3>
                <p>Find flow and finish what matters most.</p>
              </li>
              <li className="bg-white rounded-xl shadow p-6">
                <h3 className="font-semibold text-primary mb-2">
                  💼 Professionals
                </h3>
                <p>Cut through noise, reclaim focus, and build discipline.</p>
              </li>
              <li className="bg-white rounded-xl shadow p-6">
                <h3 className="font-semibold text-primary mb-2">📚 Students</h3>
                <p>Simplify your day, stress less, and finish faster.</p>
              </li>
            </ul>
          </div>

          {/* Values Section */}
          <div className="mx-auto max-w-4xl mt-20 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Core Values
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-xl shadow">
                <h3 className="text-xl font-semibold text-primary mb-2">
                  Clarity
                </h3>
                <p>Focus on what truly moves the needle.</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow">
                <h3 className="text-xl font-semibold text-primary mb-2">
                  Focus
                </h3>
                <p>One task, one win, one extraordinary result.</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow">
                <h3 className="text-xl font-semibold text-primary mb-2">
                  Growth
                </h3>
                <p>Small daily actions compound into lifelong progress.</p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mx-auto mt-24 max-w-5xl text-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Meet the Team
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We’re a small, passionate team dedicated to helping you succeed,
              one focus at a time.
            </p>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="mb-4 text-secondary">
                    <member.icon size={40} />
                  </div>
                  <h3 className="text-xl font-semibold leading-7 tracking-tight text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-sm font-semibold leading-6 text-primary">
                    {member.role}
                  </p>
                  <p className="mt-4 text-base leading-7 text-gray-600">
                    {member.bio}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Closing CTA */}
          <div className="mx-auto max-w-3xl text-center mt-24">
            <blockquote className=" pl-6 italic text-gray-800 font-serif mb-6">
              “One focus, one win, one step closer to the life you want.”
            </blockquote>
            <p className="text-lg text-gray-700 mb-8">
              We’re building Elevare in public. If our mission resonates, join
              us early and help shape the journey.
            </p>
            <Link
              href="/register"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold shadow hover:shadow-md transition"
            >
              Join the Journey
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;