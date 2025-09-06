"use client";
import Link from "next/link";
import { Button } from "../ui/Button";
import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
 <footer className="bg-gray-900 text-white" role="contentinfo">
  <div className="container mx-auto py-12 px-4 md:px-12">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Brand + Value Prop */}
      <div>
        <h3 className="text-2xl font-bold mb-2 text-primary">Elevare</h3>
        <p className="text-gray-400 max-w-sm">
          Rise above the noise. Elevare helps you focus on the one thing that truly matters each day, 
          so small wins turn into extraordinary results.
        </p>
      </div>

      {/* Quick Links */}
      <nav aria-label="Footer Navigation" className="flex flex-col space-y-2">
        <span className="text-sm uppercase tracking-wide text-gray-500">Explore</span>
        <Link href="/features" className="text-gray-400 hover:text-primary transition">
          See How It Works
        </Link>
        <Link href="/about" className="text-gray-400 hover:text-primary transition">
          Discover the ONE Thing
        </Link>
        <Link href="/contact" className="text-gray-400 hover:text-primary transition">
          Contact Us
        </Link>
      </nav>

      {/* Social + CTA */}
      <div className="flex flex-col items-start md:items-end space-y-4">
        <span className="text-sm uppercase tracking-wide text-gray-500">Connect</span>
        <div className="flex gap-6">
          {/* Social icons */}
          <div className="flex gap-6">
    <Link
      href="https://github.com/gojer16"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GitHub"
      className="text-gray-400 hover:text-primary transition"
    >
      <Github size={24} />
    </Link>
    <Link
      href="https://x.com/Gojer27"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Twitter"
      className="text-gray-400 hover:text-primary transition"
    >
      <Twitter size={24} />
    </Link>
    <Link
      href="https://www.linkedin.com/in/orlando-ascanio-dev/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="LinkedIn"
      className="text-gray-400 hover:text-primary transition"
    >
      <Linkedin size={24} />
    </Link>
  </div>
        </div>
        <Link href="/dashboard">
          <Button variant="secondary">Join the Journey</Button>
        </Link>
      </div>
    </div>

    {/* Bottom Legal */}
    <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
      <p>
        &copy; {new Date().getFullYear()} Elevare. All rights reserved.
      </p>
      <p>Elevare is built with ❤️ for people who believe less is more.</p>
      <p>We respect your time and your privacy.</p>
    </div>
  </div>
</footer>
  );
};

export default Footer;
