"use client";
import React from 'react';
import Navbar from './landing/Navbar';
import Hero from './landing/Hero';
import About from './landing/About';
import Features from './landing/Features';
import Testimonials from './landing/Testimonials';
import Footer from './landing/Footer';

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default LandingPage;
