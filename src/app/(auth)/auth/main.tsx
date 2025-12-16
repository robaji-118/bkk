"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Import file komponen
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";

// Assets
import heroImage from "@/assets/images/smk.png";
import logo from "@/assets/images/logo.png";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      title: "Selamat Datang Kembali.",
      subtitle:
        "Akses ribuan peluang karir eksklusif hanya untuk Alumni SMKN 1 Purwosari.",
    },
    {
      title: "Temukan Lowongan Terbaru",
      subtitle:
        "Dapatkan informasi lowongan kerja dan magang yang sesuai dengan keahlianmu",
    },
    {
      title: "Bergabung dengan Alumni",
      subtitle:
        "Networking dengan alumni dan industri untuk masa depan karirmu",
    },
  ];

  // Auto slider effect
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  // Variabel animasi untuk Text Slider (Stagger effect)
  const textVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: (delay: number) => ({
       opacity: 1,
       y: 0,
       transition: {
        delay: delay,
        duration: 0.8,
            // TAMBAHKAN 'as const' DI SINI
        ease: [0.2, 0.65, 0.3, 0.9] as const, 
       },
      }),
      exit: { 
       opacity: 0, 
       y: -20, 
       transition: { duration: 0.4 } 
      },
     };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* --- LEFT SIDE: IMAGE SLIDER --- */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        
        {/* Background Image dengan efek Zoom halus (Ken Burns effect) */}
        <div className="absolute inset-0 z-1">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.1 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
            className="w-full h-full relative"
          >
            <Image
              src={heroImage}
              alt="Hero Background"
              fill
              priority
              quality={100}
              className="object-cover object-center"
              sizes="50vw"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
        </div>

        {/* CONTENT WRAPPER */}
        <div className="relative z-10 flex flex-col justify-between w-full p-12 text-white">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex gap-3 items-center"
          >
            <Image
              src={logo}
              alt="BKK Logo"
              width={48}
              height={48}
              className="drop-shadow-lg"
            />
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-wider">BKK SMK NEGERI 1</span>
              <span className="font-bold text-sm tracking-wider">PURWOSARI</span>
            </div>
          </motion.div>

          {/* Slider Text Content */}
          <div className="max-w-lg min-h-[220px] flex flex-col justify-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                className="space-y-4"
              >
                {/* Judul */}
                <motion.h1
                  custom={0} // Delay 0s
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-5xl font-bold leading-tight drop-shadow-md"
                >
                  {slides[currentSlide].title}
                </motion.h1>
                
                {/* Subtitle */}
                <motion.p
                  custom={0.2} // Delay 0.2s (muncul setelah judul)
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-lg text-gray-200 font-light leading-relaxed"
                >
                  {slides[currentSlide].subtitle}
                </motion.p>
              </motion.div>
            </AnimatePresence>

            {/* Indicators */}
            <div className="flex space-x-3 mt-10">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300 group"
                  style={{ width: index === currentSlide ? "48px" : "6px" }}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <div className={`absolute inset-0 rounded-full ${index === currentSlide ? "bg-white/20" : "bg-white/40 group-hover:bg-white/60"}`} />
                  
                  {index === currentSlide && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute inset-0 bg-yellow-400 rounded-full"
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 30 
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white overflow-y-auto">
        {/* 'layout' prop membuat container menyesuaikan tinggi secara halus */}
        <motion.div 
          layout 
          className="w-full max-w-md bg-white p-2"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Header (Login/Daftar) */}
          <div className="mb-8">
             <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? "login-text" : "register-text"}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                   <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {isLogin ? "Login" : "Daftar"}
                  </h1>
                  <p className="text-gray-500">
                    {isLogin
                      ? "Silahkan pilih jenis akun Anda untuk masuk."
                      : "Daftar untuk mengakses lowongan kerja eksklusif"}
                  </p>
                </motion.div>
             </AnimatePresence>
          </div>

          {/* Form Content */}
          <AnimatePresence mode="wait" initial={false}>
            {isLogin ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.2, 0.65, 0.3, 0.9] }}
              >
                <LoginPage onToggle={() => setIsLogin(false)} />
              </motion.div>
            ) : (
              <motion.div
                key="register-form"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.2, 0.65, 0.3, 0.9] }}
              >
                <RegisterPage onToggle={() => setIsLogin(true)} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}