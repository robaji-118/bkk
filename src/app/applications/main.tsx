'use client';

import React from 'react';

import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import JobsSection from './components/JobsSection';
import IndustrySection from './components/Industry';
import FrequentlySection from './components/Frequently';
import FooterSection from './components/Footer';
import Clock from './components/Clock'

const LandingPage: React.FC = () => {
  return (
    <div>
      <Navbar/>
      <HeroSection/>
      <AboutSection/>
      <JobsSection/>
      <IndustrySection/>
      <FrequentlySection/>
      <FooterSection/>
      <Clock/>
    </div>
  );
};

export default LandingPage;