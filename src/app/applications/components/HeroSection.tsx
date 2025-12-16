"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, Variants } from "framer-motion";
import Image from "next/image";
import heroImage from "@/assets/images/smk.png";

/* =========================
   VARIANTS ANIMASI TEXT (PELAN)
========================= */
const textContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.25,     // lebih pelan
      delayChildren: 0.4,        // delay awal
    },
  },
};

const textItem: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,             // durasi diperpanjang
      ease: [0.22, 1, 0.36, 1],  // smooth ease
    },
  },
};

const HeroSection: React.FC = () => {
  /* =========================
     STATE ANGKA
  ========================= */
  const [alumniCount, setAlumniCount] = useState(0);
  const [lowonganCount, setLowonganCount] = useState(0);
  const [mitraCount, setMitraCount] = useState(0);

  const alumniTarget = 700;
  const lowonganTarget = 120;
  const mitraTarget = 50;

  const statsRef = useRef(null);
  const isInView = useInView(statsRef, { once: true, amount: 0.3 });

  const animationDuration = 2200;

  /* =========================
     ANIMASI COUNT
  ========================= */
  const animateCount = (
    target: number,
    setter: React.Dispatch<React.SetStateAction<number>>,
    delay: number = 0
  ) => {
    setTimeout(() => {
      let startTimestamp: number | null = null;

      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;

        const elapsed = timestamp - startTimestamp;
        const progress = Math.min(elapsed / animationDuration, 1);
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);

        setter(Math.floor(easeOutCubic * target));

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setter(target);
        }
      };

      requestAnimationFrame(step);
    }, delay);
  };

  useEffect(() => {
    if (isInView) {
      animateCount(alumniTarget, setAlumniCount, 0);
      animateCount(lowonganTarget, setLowonganCount, 150);
      animateCount(mitraTarget, setMitraCount, 300);
    }
  }, [isInView]);

  return (
    <section className="relative w-full overflow-hidden">
      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt="Hero Background"
          fill
          priority
          quality={100}
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/50 to-black/5" />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="container mx-auto relative z-10">
        <div className="max-w-[675px] pt-40 pb-20">

          {/* TEXT (PAGE LOAD) */}
          <motion.div
            variants={textContainer}
            initial="hidden"
            animate="show"
            className="text-white flex flex-col gap-6"
          >
            {/* HEADING */}
            <motion.h2
              variants={textItem}
              className="heading-2_semi-bold"
            >
              Menghubungkan Siswa & Alumni ke Dunia Kerja Dan Industri
            </motion.h2>

            {/* PARAGRAPH */}
            <motion.p
              variants={textItem}
              className="body-regular_regular"
            >
              Bursa Kerja Khusus SMKN 1 Purwosari sebagai pusat informasi
              lowongan, magang, dan penyaluran kerja terpercaya
            </motion.p>

            {/* BUTTON */}
            <motion.div
              variants={textItem}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              <button className="px-8 py-3 bg-neutral-500 text-black rounded-2xl font-medium transition-all duration-300 hover:-translate-y-1">
                Lihat Lowongan
              </button>

              <button className="px-8 py-3 bg-transparent backdrop-blur-[1px] border border-white/50 text-white rounded-2xl font-medium hover:backdrop-blur-[2px] hover:border-white/70 transition-all duration-300 hover:-translate-y-1">
                Daftar Alumni
              </button>
            </motion.div>

            {/* ================= STATS (SCROLL) ================= */}
            <div
              ref={statsRef}
              className="mt-12 flex flex-col sm:flex-row gap-8 sm:gap-12"
            >
              {/* Alumni */}
              <div className="min-w-[90px]">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.9, delay: 0.3 }}
                  className="text-4xl md:text-5xl font-bold"
                >
                  {alumniCount}+
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="text-lg md:text-xl mt-2"
                >
                  Alumni
                </motion.p>
              </div>

              {/* Lowongan */}
              <div className="min-w-[90px]">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.9, delay: 0.45 }}
                  className="text-4xl md:text-5xl font-bold"
                >
                  {lowonganCount}+
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.65 }}
                  className="text-lg md:text-xl mt-2"
                >
                  Lowongan
                </motion.p>
              </div>

              {/* Mitra */}
              <div className="min-w-[90px]">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.9, delay: 0.6 }}
                  className="text-4xl md:text-5xl font-bold"
                >
                  {mitraCount}+
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.8 }}
                  className="text-lg md:text-xl mt-2"
                >
                  Mitra Industri
                </motion.p>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
