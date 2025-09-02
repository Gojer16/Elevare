"use client";
import Link from "next/link";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white" role="contentinfo">
      <div className="container mx-auto py-12 px-4 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand + Value Prop */}
          <div>
            <h3 className="text-2xl font-bold mb-2">Success-List</h3>
            <p className="text-gray-400 max-w-sm">
              The simple productivity tool that helps you focus on what matters
              most. Organize tasks, track progress, and achieve your goals.
            </p>
          </div>

          {/* Quick Links */}
          <nav aria-label="Footer Navigation" className="flex flex-col space-y-2">
            <Link href="#features" className="text-gray-400 hover:text-white transition">
              Features
            </Link>
            <Link href="#waitlist" className="text-gray-400 hover:text-white transition">
              Join Waitlist
            </Link>
            <Link href="#about" className="text-gray-400 hover:text-white transition">
              About
            </Link>
            <Link href="#contact" className="text-gray-400 hover:text-white transition">
              Contact
            </Link>
          </nav>

          {/* Social + CTA */}
          <div className="flex flex-col items-start md:items-end space-y-4">
            <div className="flex gap-6">
              <Link
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-gray-400 hover:text-white transition"
              >
                <FaGithub size={24} />
              </Link>
              <Link
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-gray-400 hover:text-white transition"
              >
                <FaTwitter size={24} />
              </Link>
              <Link
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-gray-400 hover:text-white transition"
              >
                <FaLinkedin size={24} />
              </Link>
            </div>
            <Link
              href="#waitlist"
              className="bg-purple-600 hover:bg-purple-700 transition text-white px-4 py-2 rounded-lg font-medium"
            >
              Join the Waitlist
            </Link>
          </div>
        </div>

        {/* Bottom Legal */}
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Success-List. All rights reserved.
          </p>
          <p>
            <Link href="#privacy" className="hover:text-white">
              Privacy Policy
            </Link>{" "}
            |{" "}
            <Link href="#terms" className="hover:text-white">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
