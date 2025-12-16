"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  ArrowRight,
  Filter,
} from "lucide-react";
import Image, { StaticImageData } from "next/image";
import Navbar from "../applications/components/Navbar";
import FooterSection from "../applications/components/Footer";

import googleLogo from "@/assets/images/Google_logo.svg";
import toyotaLogo from "@/assets/images/Toyota.svg";
import bmwLogo from "@/assets/images/Bmw.svg";

interface Job {
  id: number;
  company: string;
  companyLogo: StaticImageData;
  position: string;
  location: string;
  type: string;
  workModel: string;
  postedDate: string;
}

export default function JobListingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const jobs: Job[] = [
    {
      id: 1,
      company: "Google",
      companyLogo: googleLogo,
      position: "Senior Webflow Developer",
      location: "Jakarta",
      type: "Full-time",
      workModel: "Remote work",
      postedDate: "2024-01-15",
    },
    {
      id: 2,
      company: "Toyota",
      companyLogo: toyotaLogo,
      position: "Senior Automotive Welder",
      location: "Surabaya",
      type: "Full-time",
      workModel: "On-site",
      postedDate: "2024-01-14",
    },
    {
      id: 3,
      company: "Google",
      companyLogo: googleLogo,
      position: "Senior Webflow Developer",
      location: "Jakarta",
      type: "Full-time",
      workModel: "Remote work",
      postedDate: "2024-01-13",
    },
    {
      id: 4,
      company: "BMW",
      companyLogo: bmwLogo,
      position: "Senior Webflow Developer",
      location: "Bandung",
      type: "Full-time",
      workModel: "Hybrid",
      postedDate: "2024-01-12",
    },
    {
      id: 5,
      company: "Google",
      companyLogo: googleLogo,
      position: "Senior Webflow Developer",
      location: "Jakarta",
      type: "Part-time",
      workModel: "Remote work",
      postedDate: "2024-01-11",
    },
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation =
      selectedLocation === "all" || job.location === selectedLocation;
    const matchesType = selectedType === "all" || job.type === selectedType;

    return matchesSearch && matchesLocation && matchesType;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative pt-32 pb-20 bg-white overflow-hidden">
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-white/10 to-white/5"></div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-neutral-900 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-800 rounded-full filter blur-3xl"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            {/* Border Box */}
            <div className="rounded-3xl p-12 text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="inline-block mb-6"
              >
                <span className="px-4 py-2 bg-gradient-to-br from-white/10 via-white/5 to-black/20 backdrop-blur-lg text-black text-sm border border-gray-300 rounded-full">
                  Lowongan Kerja Terbuka
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6 leading-tight"
              >
                Bergabung Bersama <span className="italic">Mitra Industri</span>{" "}
                Terbaik
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
              >
                Ribuan peluang karir eksklusif dari mitra industri terpercaya.
                Daftar sekarang dan raih masa depan cerah bersama perusahaan
                nasional dan multinasional.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex items-center justify-center gap-4"
              >
                <button className="px-8 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-all font-medium">
                  Lihat Semua Lowongan
                </button>
                <button className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-300 rounded-full hover:bg-gray-50 transition-all font-medium">
                  Daftar Alumni
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="pb-20 bg-white">
  <div className="container mx-auto">
    {/* Header */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center mb-12"
    >
      <h2 className="text-4xl font-semibold text-black mb-4">
        Keunggulan BKK
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        BKK membantu mempertemukan pencari kerja dengan perusahaan secara
        profesional, transparan, dan terpercaya.
      </p>
    </motion.div>

    {/* Cards */}
    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {/* Penyaluran Kerja */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
        </div>
        <h3 className="text-xl font-semibold text-black mb-2">
          Penyaluran Kerja
        </h3>
        <p className="text-gray-600">
          Menghubungkan pencari kerja dengan perusahaan mitra
        </p>
      </motion.div>

      {/* Mitra Industri */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 bg-green-500 rounded-lg"></div>
        </div>
        <h3 className="text-xl font-semibold text-black mb-2">
          Mitra Industri
        </h3>
        <p className="text-gray-600">
          Bekerja sama dengan berbagai perusahaan terpercaya
        </p>
      </motion.div>

      {/* Pendampingan Karier */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full"></div>
        </div>
        <h3 className="text-xl font-semibold text-black mb-2">
          Pendampingan Karier
        </h3>
        <p className="text-gray-600">
          Membantu persiapan kerja hingga proses rekrutmen
        </p>
      </motion.div>
    </div>
  </div>
</section>


      {/* ================= JOB LIST ================= */}

      <section className="py-20">
        <div className="container mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            <h2 className="text-4xl font-semibold text-black mb-4">
              Open position
            </h2>
            <p className="text-lg text-gray-600">
              {`We're currently hiring for roles in the following areas`}
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="flex flex-wrap gap-4 mb-8"
          >
            {/* Search */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search position..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Location Filter */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-6 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="all">All Locations</option>
              <option value="Jakarta">Jakarta</option>
              <option value="Surabaya">Surabaya</option>
              <option value="Bandung">Bandung</option>
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-6 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="all">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </motion.div>
        </div>
        <div className="container mx-auto">
          <div className="space-y-4">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 flex items-center justify-center">
                      <Image
                        src={job.companyLogo}
                        alt={job.company}
                        width={45}
                        height={45}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm text-gray-500">
                          {job.company}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-xs rounded-full">
                          {job.type}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-xs rounded-full">
                          {job.workModel}
                        </span>
                      </div>

                      <h3 className="text-2xl font-semibold text-black mb-2">
                        {job.position}
                      </h3>

                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                    </div>
                  </div>

                  <button className="px-6 py-3 bg-black text-white rounded-full flex items-center gap-2">
                    Apply <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Briefcase className="w-8 h-8 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900">
                No jobs found
              </h3>
            </motion.div>
          )}
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
