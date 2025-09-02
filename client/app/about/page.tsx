"use client";
import { motion } from 'framer-motion';
import { team } from '../constants/team';
import Link from 'next/link';

const AboutPage = () => {


  return (
        <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Intro */}
        <div className="mx-auto max-w-3xl lg:mx-0">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            About Success-List
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-700">
            Success-List was born from a simple yet powerful idea:{" "}
            <span className="font-semibold">
              true productivity doesn’t come from doing more—it comes from doing
              less, with focus.
            </span>{" "}
            In a world of endless distractions, this app helps you cut through
            the noise and direct your energy toward{" "}
            <strong>the ONE thing that makes everything else easier or unnecessary</strong>.
          </p>
        </div>

        {/* The WHY Section */}
        <div className="mt-12 max-w-3xl text-gray-700 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            The Philosophy Behind the ONE Thing
          </h2>
          <p>
            This app is inspired by the bestselling book{" "}
            <em>The ONE Thing</em> by{" "}
            <Link
              href="https://www.amazon.com/ONE-Thing-Surprisingly-Extraordinary-Results/dp/1885167776"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              Gary Keller and Jay Papasan
            </Link>
            . In it, the authors challenge us to ask a simple but life-changing
            question:
          </p>
          <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-gray-600">
            “What’s the ONE thing I can do such that by doing it, everything
            else will be easier or unnecessary?”
          </blockquote>
          <p>
            That’s the heartbeat of Success-List. Instead of drowning in endless
            to-do lists, we guide you to identify the{" "}
            <strong>highest-leverage action</strong> each day—the one that
            matters most. Over time, these small daily commitments compound into
            extraordinary results.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mt-12 max-w-3xl text-gray-700 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
          <p>
            We believe productivity is not about cramming more tasks into your
            day—it’s about achieving meaningful progress.{" "}
            <strong>Success-List is your daily success ritual:</strong> one
            focus, one win, one step closer to the life you want.
          </p>
          <p>
            Whether you’re an entrepreneur, a student, or anyone seeking clarity
            in a distracted world, this app helps you focus on{" "}
            <em>what truly matters</em>.
          </p>
        </div>

        {/* Team Section */}
        <div className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-lg"
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
  );
};

export default AboutPage;
