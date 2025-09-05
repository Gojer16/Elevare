"use client";
import { motion } from 'framer-motion';
import { team } from '../constants/team';
import Link from 'next/link';
import Navbar from '../components/landing/Navbar';

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <div className="py-24 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Intro */}
          <div className="mx-auto max-w-3xl lg:mx-0 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              About Success-List
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-700">
              Success-List is built on a simple, powerful idea:{" "}
              <span className="font-semibold text-indigo-600">
                true productivity comes from doing less, with focus.
              </span>
            </p>
          </div>

          {/* The WHY and Mission Section */}
          <div className="mt-20 mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 text-lg text-gray-700">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                The Philosophy
              </h2>
              <p>
                Inspired by{' '}
                <Link
                  href="https://www.amazon.com/ONE-Thing-Surprisingly-Extraordinary-Results/dp/1885167776"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline font-medium"
                >
                  &apos;The ONE Thing&apos;
                </Link>
                , we challenge the myth of multitasking. We ask:
              </p>
              <blockquote className="border-l-4 border-indigo-500 pl-6 italic text-gray-800 font-serif">
                “What’s the ONE thing I can do such that by doing it, everything else will be easier or unnecessary?”
              </blockquote>
              <p>
                This question is the heart of Success-List. It’s about finding the highest-leverage action each day.
              </p>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              <p>
                Our mission is to help you achieve meaningful progress. We believe productivity &apos;isn&apos;t just about cramming more tasks into your day, but about achieving what truly matters.
              </p>
              <p>
                <strong>Success-List is your daily success ritual:</strong> one focus, one win, one step closer to the life you want.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="mx-auto mt-24 max-w-5xl text-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Meet the Team</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              &apos;The ONE Thing&apos; - We&apos;re a small, passionate team dedicated to helping you succeed.
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
                  <div className="mb-4 text-indigo-500">
                    <member.icon size={40} />
                  </div>
                  <h3 className="text-xl font-semibold leading-7 tracking-tight text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-sm font-semibold leading-6 text-indigo-600">
                    {member.role}
                  </p>
                  <p className="mt-4 text-base leading-7 text-gray-600">
                    {member.bio}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;