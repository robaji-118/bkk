'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  useInView,
  Variants,
} from 'framer-motion';

import bmwLogo from '@/assets/images/Bmw.svg';
import lexusLogo from '@/assets/images/Lexus.svg';
import toyotaLogo from '@/assets/images/Toyota.svg';
import adobeLogo from '@/assets/images/Adobe-logo.svg';
import GoogleLogo from '@/assets/images/Google_logo.svg';
import indosatLogo from '@/assets/images/Indosat.svg';
import microsoftLogo from '@/assets/images/Microsoft.svg';
import telkomLogo from '@/assets/images/Telkom.svg';
import juniperLogo from '@/assets/images/Juniper.svg';
import yaskawaLogo from '@/assets/images/Yaskawa.svg';
import plnLogo from '@/assets/images/Pln.svg';
import indofoodLogo from '@/assets/images/Indofood.svg';
import teslaLogo from '@/assets/images/Tesla.svg';
import hyundaiLogo from '@/assets/images/Hyundai.svg';
import daewooLogo from '@/assets/images/Daewoo.svg';
import komatsuLogo from '@/assets/images/Komatsu.svg';
import caterpillarLogo from '@/assets/images/Caterpillar.svg';
import sygentaLogo from '@/assets/images/Syngenta.svg';
import haasLogo from '@/assets/images/Haas.svg';
import frisianLogo from '@/assets/images/Frisian.svg';
import BasfLogo from '@/assets/images/BASF.svg';
import nestleLogo from '@/assets/images/Nestle.svg';
import unileverLogo from '@/assets/images/Unilever.svg';

type Company = {
  name: string;
  logo: any;
};

/* ================= COMPANY LOGO ================= */

function CompanyLogo({ company }: { company: Company }) {
  return (
    <div
      className="flex items-center justify-center border border-gray-600 p-20 px-8 flex-shrink-0
                 grayscale hover:grayscale-0 opacity-60 hover:opacity-100
                 transition-all duration-300"
      style={{ width: '250px' }}
    >
      <div className="relative w-full h-16">
        <Image
          src={company.logo}
          alt={company.name}
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}

/* ================= AUTO SCROLL ROW ================= */

function AutoScrollRow({
  items,
  reverse = false,
  speed = 60,
}: {
  items: Company[];
  reverse?: boolean;
  speed?: number;
}) {
  const baseX = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const direction = reverse ? -1 : 1;

  useAnimationFrame((_, delta) => {
    const moveBy = (direction * speed * delta) / 1000;
    const container = containerRef.current;
    if (!container) return;

    const totalWidth = container.scrollWidth / 2;
    let next = baseX.get() - moveBy;

    if (next <= -totalWidth) next += totalWidth;
    if (next >= 0) next -= totalWidth;

    baseX.set(next);
  });

  return (
    <div className="overflow-hidden">
      <motion.div
        ref={containerRef}
        className="flex"
        style={{
          x: baseX,
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
      >
        <div className="flex shrink-0">
          {items.map((company, i) => (
            <CompanyLogo key={`a-${i}`} company={company} />
          ))}
        </div>
        <div className="flex shrink-0" aria-hidden>
          {items.map((company, i) => (
            <CompanyLogo key={`b-${i}`} company={company} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ================= VARIANTS ================= */

const container: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

/* ================= MAIN SECTION ================= */

export default function IndustrySection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.25 });

  const companies: Company[] = [
    { name: 'BMW', logo: bmwLogo },
    { name: 'Adobe', logo: adobeLogo },
    { name: 'Toyota', logo: toyotaLogo },
    { name: 'Lexus', logo: lexusLogo },
    { name: 'Google', logo: GoogleLogo },
    { name: 'Indosat', logo: indosatLogo },
    { name: 'Microsoft', logo: microsoftLogo },
    { name: 'Telkom Indonesia', logo: telkomLogo },
    { name: 'Juniper Networks', logo: juniperLogo },
    { name: 'Yaskawa', logo: yaskawaLogo },
    { name: 'PLN', logo: plnLogo },
    { name: 'Indofood', logo: indofoodLogo },
    { name: 'Tesla', logo: teslaLogo },
    { name: 'Hyundai Heavy Industries', logo: hyundaiLogo },
    { name: 'DSME', logo: daewooLogo },
    { name: 'Komatsu', logo: komatsuLogo },
    { name: 'Caterpillar', logo: caterpillarLogo },
    { name: 'Syngenta', logo: sygentaLogo },
    { name: 'Itali', logo: haasLogo },
    { name: 'Nestle', logo: nestleLogo },
    { name: 'BASF', logo: BasfLogo },
    { name: 'Frisian Flag', logo: frisianLogo },
    { name: 'Unilever', logo: unileverLogo },
  ];

  const mid = Math.ceil(companies.length / 2);

  return (
    <section ref={sectionRef} className="py-20 overflow-hidden">
      <motion.div
        variants={container}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="flex flex-col gap-16"
      >
        {/* HEADER */}
        <motion.div variants={container} className="text-center px-16 space-y-3">
          <motion.h2
            variants={fadeUp}
            className="text-5xl font-semibold text-black"
          >
            Mitra Industri Kami
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-lg text-black opacity-80 max-w-2xl mx-auto"
          >
            Bekerja sama dengan berbagai perusahaan nasional dan internasional
            dalam penyaluran kerja dan magang.
          </motion.p>
        </motion.div>

        {/* SLIDER */}
        <motion.div variants={fadeUp} className="flex flex-col">
          <AutoScrollRow items={companies.slice(0, mid)} />
          <AutoScrollRow items={companies.slice(mid)} reverse />
        </motion.div>

        {/* FOOTER */}
        <motion.div variants={fadeUp} className="text-center px-16">
          <p className="text-2xl text-black">
            Dipercaya oleh lebih dari 50+ perusahaan
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
