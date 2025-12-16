"use client";

import React, { useState } from "react";
import { Search, Bookmark } from "lucide-react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

import googleLogo from "@/assets/images/Google.svg";
import bmwLogo from "@/assets/images/Bmw.svg";
import lexusLogo from "@/assets/images/Lexus.svg";

interface Job {
  id: number;
  company: string;
  companyLogo: string;
  position: string;
  salary: string;
  postedDaysAgo: number;
  type: string;
  schedule: string;
  isSaved: boolean;
}

/* ================= ANIMATION VARIANTS ================= */

const sectionVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 32,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function JobListings() {
  const [searchQuery, setSearchQuery] = useState("");

  const [jobs, setJobs] = useState<Job[]>([
    {
      id: 1,
      company: "Google",
      companyLogo: googleLogo,
      position: "Senior Webflow Developer",
      salary: "$125-145/hr",
      postedDaysAgo: 3,
      type: "Full-time",
      schedule: "Flexible schedule",
      isSaved: false,
    },
    {
      id: 2,
      company: "Lexus Manufacturing",
      companyLogo: lexusLogo,
      position: "Senior Automotive Welder",
      salary: "$135-185/hr",
      postedDaysAgo: 7,
      type: "Full-time",
      schedule: "Flexible schedule",
      isSaved: true,
    },
    {
      id: 3,
      company: "BMW",
      companyLogo: bmwLogo,
      position: "Human Resource Development",
      salary: "$125-145/hr",
      postedDaysAgo: 3,
      type: "Full-time",
      schedule: "Flexible schedule",
      isSaved: false,
    },
    {
      id: 4,
      company: "Google",
      companyLogo: googleLogo,
      position: "Senior Frontend Developer",
      salary: "$125-145/hr",
      postedDaysAgo: 3,
      type: "Full-time",
      schedule: "Flexible schedule",
      isSaved: true,
    },
    {
      id: 5,
      company: "BMW",
      companyLogo: bmwLogo,
      position: "Management Automotive Machine",
      salary: "$180-245/hr",
      postedDaysAgo: 3,
      type: "Full-time",
      schedule: "Flexible schedule",
      isSaved: false,
    },
    {
      id: 6,
      company: "Google",
      companyLogo: googleLogo,
      position: "FullStack Web Developer",
      salary: "$200-379/hr",
      postedDaysAgo: 3,
      type: "Full-time",
      schedule: "Flexible schedule",
      isSaved: true,
    },
  ]);

  /* ================= ACTIONS ================= */

  const toggleSave = (id: number) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id ? { ...job, isSaved: !job.isSaved } : job
      )
    );
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
      className="py-20 md:px-12 lg:px-24"
    >
      <div className="flex flex-col gap-16 max-w-7xl mx-auto">
        {/* ================= HEADER ================= */}
        <motion.div variants={sectionVariants} className="text-center">
          <motion.p
            variants={fadeUp}
            className="inline-block text-sm text-black bg-gray-100 px-4 py-2 rounded-full mb-3"
          >
            Lowongan Kerja
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="text-5xl font-semibold text-black mb-10"
          >
            Temukan Lowongan Kerja
            <br />
            untuk Siswa & Alumni
          </motion.h2>

          {/* Search Bar */}
          <motion.div
            variants={fadeUp}
            className="max-w-2xl mx-auto relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Lowongan berdasarkan perusahaan atau posisi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
            />
          </motion.div>
        </motion.div>

        {/* ================= JOB GRID ================= */}
        <motion.div
          variants={gridVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredJobs.map((job) => (
            <motion.div
              key={job.id}
              variants={cardVariants}
              className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Card Header */}
              <motion.div variants={fadeUp} className="flex justify-between items-start mb-22">
                <p className="text-md font-medium text-black">
                  {job.salary}
                </p>

                <button
                  onClick={() => toggleSave(job.id)}
                  className={`text-xs px-2 py-1.5 rounded-md cursor-pointer transition-colors flex items-center gap-1.5 ${
                    job.isSaved
                      ? "bg-black text-white"
                      : "text-gray-600 border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {job.isSaved ? "Saved" : "Save"}
                  <Bookmark
                    className="w-3.5 h-3.5"
                    fill={job.isSaved ? "white" : "none"}
                  />
                </button>
              </motion.div>

              {/* Company Info */}
              <motion.div variants={fadeUp} className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <p className="text-black text-md font-normal">
                    {job.company}
                  </p>
                  <p className="text-gray-400 text-sm font-normal">
                    {job.postedDaysAgo} days ago
                  </p>
                </div>

                <h4 className="heading-4_semi-bold text-black">
                  {job.position}
                </h4>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-gray-100 text-black text-sm rounded-full">
                    {job.type}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-black text-sm rounded-full">
                    {job.schedule}
                  </span>
                </div>
              </motion.div>

              {/* Card Footer */}
              <motion.div
                variants={fadeUp}
                className="flex items-center justify-between pt-4 border-t border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 overflow-hidden">
                    <Image
                      src={job.companyLogo}
                      alt={job.company}
                      className="w-full h-full"
                    />
                  </div>
                  <div>
                    <p className="text-md font-semibold text-black">
                      {job.position.split(" ").slice(0, 2).join(" ")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {job.company}
                    </p>
                  </div>
                </div>

                <a href="components/careers-detail">
                  <button className="px-4 py-2 bg-black text-white text-sm rounded-full cursor-pointer hover:bg-gray-900 transition-colors">
                    View
                  </button>
                </a>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
