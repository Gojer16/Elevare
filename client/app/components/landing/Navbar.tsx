"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Log In", href: "/login" },
  ];

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/90 backdrop-blur-md py-3 shadow-sm" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/">
              <span className="block text-2xl font-serif font-bold text-gray-900 tracking-tight hover:text-primary-accent transition-colors">
                Success-List
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link 
                  href={item.href}
                  className="text-gray-600 hover:text-primary-accent transition-colors font-medium relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-accent transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Link href="/register">
                <motion.button 
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(74, 144, 226, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary-accent text-white font-medium py-2 px-6 rounded-full shadow-sm hover:bg-blue-600 transition-all duration-300"
                >
                  Sign Up
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:hidden text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-accent rounded"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <div className="w-6 flex flex-col gap-1">
              <motion.span 
                className={`h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}
                animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                aria-hidden="true"
              ></motion.span>
              <motion.span 
                className={`h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}
                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                aria-hidden="true"
              ></motion.span>
              <motion.span 
                className={`h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
                animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                aria-hidden="true"
              ></motion.span>
            </div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 overflow-hidden"
              id="mobile-menu"
              role="navigation"
              aria-label="Mobile menu"
            >
              <div className="flex flex-col gap-4 py-4 border-t border-gray-200">
                {navItems.map((item) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link 
                      href={item.href}
                      className="text-gray-600 hover:text-primary-accent transition-colors font-medium py-2 block focus:outline-none focus:ring-2 focus:ring-primary-accent rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                  <Link href="/register" className="w-fit block">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-primary-accent text-white font-medium py-2 px-6 rounded-full shadow-sm hover:bg-blue-600 transition-colors mt-2 focus:outline-none focus:ring-2 focus:ring-primary-accent"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </motion.button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;