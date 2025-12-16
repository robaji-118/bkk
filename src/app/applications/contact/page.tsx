'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Send, MapPin, Phone, Mail, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import FooterSection from '../components/Footer';
import CustomSelect from '@/components/ui/CustomSelect';

type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    inquiryType: string;
    message: string;
};

export default function ContactPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [inquiryType, setInquiryType] = useState('');

    const inquiryOptions = [
        { value: 'lowongan', label: 'Lowongan Kerja' },
        { value: 'magang', label: 'Magang' },
        { value: 'alumni', label: 'Pendaftaran Alumni' },
        { value: 'kerjasama', label: 'Kerjasama Industri' },
        { value: 'lainnya', label: 'Lainnya' },
    ];

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log('Form submitted:', data);
        setIsSubmitted(true);
        reset();

        setTimeout(() => {
            setIsSubmitted(false);
        }, 5000);
    };

    return (
        <div className="min-h-screen bg-gray-100 pt-35">
            <Navbar />

            {/* Main Content */}
            <main className="container mx-auto pt-32 pb-20">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left Column - Contact Information */}
                    <div className="space-y-12">
                        <div className="flex flex-col gap-4">
                            <h1 className="text-6xl font-medium text-black leading-tight">
                                Get in -
                                <br />
                                touch with us
                            </h1>
                            <p className="body-large-medium text-gray-500 leading-relaxed">
                                Kami siap membantu Anda! Apakah Anda memiliki pertanyaan tentang lowongan kerja,
                                membutuhkan bantuan pendaftaran alumni, atau ingin memberikan feedback,
                                tim BKK SMKN 1 Purwosari siap melayani Anda.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {/* Email */}
                            <div>
                                <p className="body-small_regular text-gray-500 mb-2">Email:</p>
                                <p className="text-xl font-semibold text-gray-90 transition-colors">
                                    bkk@smkn1purwosari.sch.id
                                </p>
                            </div>

                            {/* Phone */}
                            <div>
                                <p className="body-small_regular text-gray-500 mb-2">Phone:</p>
                                <p className="text-xl font-semibold text-black transition-colors">
                                    (0343) 613747
                                </p>
                                <p className="body-small_medium text-gray-500 mt-2">
                                    Available Monday to Friday, 7 AM - 4 PM WIB
                                </p>
                            </div>

                            {/* Address */}
                            <div>
                                <p className="body-small_regular text-gray-500 mb-2">Address:</p>
                                <p className="text-lg font-medium text-black leading-relaxed">
                                    Jl. Raya Purwosari No. 1, Kec Purwosari, Kab Pasuruan,
                                    <br />
                                    Jawa Timur 67162
                                </p>
                            </div>
                        </div>

                        {/* Live Chat Button */}
                        <button className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full transition-all group cursor-pointer">
                            <span className="body-regular_medium">Live Chat</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Right Column - Contact Form */}
                    <div className="bg-white rounded-4xl p-10">
                        {/* Success Message */}
                        {isSubmitted && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                                <p className="body-small_regular text-green-800">
                                    Terima kasih! Pesan Anda telah berhasil dikirim.
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* First Name & Last Name Row */}
                            <div className="grid grid-cols-2 gap-6">
                                {/* First Name */}
                                <div>
                                    <label htmlFor="firstName" className="block body-small_semi-bold text-black mb-2">
                                        First Name
                                    </label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        {...register('firstName', { required: 'First name is required' })}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all body-small_regular"
                                        placeholder="Enter your first name..."
                                    />
                                    {errors.firstName && (
                                        <p className="mt-2 text-sm text-red-600">{errors.firstName.message}</p>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label htmlFor="lastName" className="block body-small_semi-bold text-black mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        {...register('lastName', { required: 'Last name is required' })}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all body-small_regular"
                                        placeholder="Enter your last name..."
                                    />
                                    {errors.lastName && (
                                        <p className="mt-2 text-sm text-red-600">{errors.lastName.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block body-small_semi-bold text-black mb-2">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address',
                                        },
                                    })}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all body-small_regular"
                                    placeholder="Enter your email address..."
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className="block body-small_semi-bold text-black mb-2">
                                    Phone Number
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    {...register('phone', { required: 'Phone number is required' })}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all body-small_regular"
                                    placeholder="(+62) 812-3456-7890"
                                />
                                {errors.phone && (
                                    <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
                                )}
                            </div>

                            {/* Inquiry Type */}
                            <CustomSelect
                                label="What can we help you with?"
                                options={inquiryOptions}
                                value={inquiryType}
                                onChange={(val) => {
                                    setInquiryType(val);
                                    setValue('inquiryType', val);
                                }}
                                placeholder="Select an option"
                                error={errors.inquiryType?.message}
                            />

                            {/* Message */}
                            <div>
                                <label htmlFor="message" className="block body-small_semi-bold text-black mb-2">
                                    How can we help you?
                                </label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    {...register('message', {
                                        required: 'Message is required',
                                        minLength: {
                                            value: 10,
                                            message: 'Message must be at least 10 characters'
                                        }
                                    })}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all resize-none body-small_regular"
                                    placeholder="Enter your message..."
                                />
                                {errors.message && (
                                    <p className="mt-2 text-sm text-red-600">{errors.message.message}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-black text-white py-4 px-6 rounded-full focus:outline-none transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed body-regular_medium group"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <span>Send Message</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Google Maps Section */}
                <div className="my-20">
                    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-md">
                        <div className="relative h-[450px]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.244766286416!2d112.74583117501425!3d-7.767780392240863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7d3c5631acbf5%3A0xa71d9f205034b481!2sSMK%20Negeri%201%20Purwosari!5e0!3m2!1sen!2sid!4v1734158400000!5m2!1sen!2sid"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="absolute inset-0"
                            ></iframe>
                        </div>

                        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                            <div>
                                <h3 className="body-large_semi-bold text-gray-900 mb-2">Visit Our School</h3>
                                <p className="body-small_regular text-gray-500">
                                    Jl. Raya Purwosari No. 1, Kec Purwosari, Kab Pasuruan, Jawa Timur 67162
                                </p>
                            </div>
                            <a
                                href="https://www.google.com/maps/place/SMK+Negeri+1+Purwosari/@-7.7677804,112.7458312,17z/data=!3m1!4b1!4m6!3m5!1s0x2dd7d3c5631acbf5:0xa71d9f205034b481!8m2!3d-7.7677804!4d112.7484061!16s%2Fg%2F1hm2z5xcc?authuser=0&entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full transition-all group body-small_semi-bold"
                            >
                                <MapPin className="w-4 h-4" />
                                <span>Open in Maps</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            <FooterSection />
        </div>
    );
}