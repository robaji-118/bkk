'use client';

import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Clock, ArrowRight, Filter } from 'lucide-react';
import Image, { StaticImageData } from 'next/image';
import Navbar from '../components/Navbar';
import FooterSection from '../components/Footer';

// Sample company logos (ganti dengan path logo yang sesuai)
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const jobs: Job[] = [
    {
      id: 1,
      company: 'Google',
      companyLogo: googleLogo,
      position: 'Senior Webflow Developer',
      location: 'Jakarta',
      type: 'Full-time',
      workModel: 'Remote work',
      postedDate: '2024-01-15',
    },
    {
      id: 2,
      company: 'Toyota',
      companyLogo: toyotaLogo,
      position: 'Senior Automotive Welder',
      location: 'Surabaya',
      type: 'Full-time',
      workModel: 'On-site',
      postedDate: '2024-01-14',
    },
    {
      id: 3,
      company: 'Google',
      companyLogo: googleLogo,
      position: 'Senior Webflow Developer',
      location: 'Jakarta',
      type: 'Full-time',
      workModel: 'Remote work',
      postedDate: '2024-01-13',
    },
    {
      id: 4,
      company: 'BMW',
      companyLogo: bmwLogo,
      position: 'Senior Webflow Developer',
      location: 'Bandung',
      type: 'Full-time',
      workModel: 'Hybrid',
      postedDate: '2024-01-12',
    },
    {
      id: 5,
      company: 'Google',
      companyLogo: googleLogo,
      position: 'Senior Webflow Developer',
      location: 'Jakarta',
      type: 'Part-time',
      workModel: 'Remote work',
      postedDate: '2024-01-11',
    },
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    const matchesType = selectedType === 'all' || job.type === selectedType;
    
    return matchesSearch && matchesLocation && matchesType;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-white overflow-hidden">
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-white/10 to-white/5"></div>
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-neutral-900 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-800 rounded-full filter blur-3xl"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Border Box */}
            <div className="rounded-3xl p-12 text-center">
              {/* Badge */}
              <div className="inline-block mb-6">
                <span className="px-4 py-2 bg-gradient-to-br from-white/10 via-white/5 to-black/20 backdrop-blur-lg text-black text-sm border border-gray-300 rounded-full">
                  Lowongan Kerja Terbuka
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6 leading-tight">
                Bergabung Bersama{' '}
                <span className="italic">Mitra Industri</span> Terbaik
              </h1>

              {/* Description */}
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Ribuan peluang karir eksklusif dari mitra industri terpercaya. Daftar sekarang dan raih masa depan cerah bersama perusahaan nasional dan multinasional.
              </p>

              {/* CTA Buttons */}
              <div className="flex items-center justify-center gap-4">
                <button className="px-8 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-all font-medium">
                  Lihat Semua Lowongan
                </button>
                <button className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-300 rounded-full hover:bg-gray-50 transition-all font-medium">
                  Daftar Alumni
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold text-black mb-4">Our benefits</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We strive to provide a workplace that facilitates productivity and positive team collaborations to help you thrive in your career.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Transparency */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Transparency</h3>
              <p className="text-gray-600">
                Keep everyone on the same page
              </p>
            </div>

            {/* Remote Work */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-purple-500 rounded-lg"></div>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Remote work</h3>
              <p className="text-gray-600">
                Work from anywhere in the world
              </p>
            </div>

            {/* Team Retreats */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Team retreats</h3>
              <p className="text-gray-600">
                Get out of office and have some fun
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings Section */}
      <section className="py-20">
        <div className="container mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-semibold text-black mb-4">Open position</h2>
            <p className="text-lg text-gray-600">
              {`We're currently hiring for roles in the following areas`}
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
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
          </div>

          {/* Job Cards */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between">
                  {/* Left Side - Job Info */}
                  <div className="flex items-center gap-6">
                    {/* Company Logo */}
                    <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
                      <Image
                        src={job.companyLogo}
                        alt={job.company}
                        width={45}
                        height={45}
                        className="object-contain"
                      />
                    </div>

                    {/* Job Details */}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm text-gray-500">{job.company}</span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {job.type}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {job.workModel}
                        </span>
                      </div>
                      <h3 className="text-2xl font-semibold text-black mb-2">
                        {job.position}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Apply Button */}
                  <button className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all font-medium flex items-center gap-2">
                    <span>Apply</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredJobs.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </section>

      <FooterSection />
    </div>
  );
}