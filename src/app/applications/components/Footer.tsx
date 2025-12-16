// components/Footer.tsx
import React from 'react';
import { Facebook, Youtube, Twitter, Instagram } from 'lucide-react';
import Image from 'next/image';
import logo from "@/assets/images/logo.png";

export default function Footer() {
    const footerLinks = {
        company: [
            { label: 'About us', href: '#' },
            { label: 'Contact Us', href: '#' },
            { label: 'Careers', href: '#' }
        ],
        products: [
            { label: 'Billings', href: '#' },
            { label: 'Expenses', href: '#' },
            { label: 'Payments', href: '#' },
            { label: 'Bookkeeping', href: '#' },
            { label: 'Budgeting', href: '#' }
        ],
        solutions: [
            { label: 'For Small Businesses', href: '#' },
            { label: 'For Agencies', href: '#' },
            { label: 'For Freelancers', href: '#' },
            { label: 'For Enterprises', href: '#' }
        ],
        resource: [
            { label: 'Help Center', href: '#' },
            { label: 'Blogs & Articles', href: '#' },
            { label: 'FAQs', href: '#' },
            { label: 'Tutorials', href: '#' }
        ],
        legal: [
            { label: 'Privacy Policy', href: '#' },
            { label: 'Terms of Use', href: '#' },
            { label: 'Cookie Policy', href: '#' }
        ]
    };

    const socialLinks = [
        { icon: Facebook, href: '#', label: 'Facebook' },
        { icon: Youtube, href: '#', label: 'YouTube' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Instagram, href: '#', label: 'Instagram' }
    ];

    return (
        <footer className="bg-[#132133] text-white pt-20 px-16">
            <div className="flex flex-col gap-16 max-w-7xl mx-auto">
                {/* Main Footer Content */}
                <div className="flex justify-between">
                    {/* Logo Column */}
                    <div className="flex gap-2">
                        <div>
                            <Image
                                src={logo}
                                alt="BKK SMKN 1 Purwosari Logo"
                                width={45}
                                height={45}
                            />
                        </div>
                        <div className="flex flex-col text-white">
                            <div className="body-large_semi-bold">BKK SMK NEGERI 1</div>
                            <div className="body-large_semi-bold">PURWOSARI</div>
                        </div>
                    </div>

                    <div className='flex gap-15'>
                        {/* Company */}
                        <div className='flex flex-col gap-3'>
                            <h4 className="font-semibold text-md">Company</h4>
                            <ul className="space-y-3">
                                {footerLinks.company.map((link, index) => (
                                    <li key={index}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-gray-300 hover:text-neutral-500 transition-all duration-300"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Products */}
                        <div className='flex flex-col gap-3'>
                            <h4 className="font-semibold text-md">Products</h4>
                            <ul className="space-y-3">
                                {footerLinks.products.map((link, index) => (
                                    <li key={index}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-gray-300 hover:text-neutral-500 transition-all duration-300"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Solutions */}
                        <div className='flex flex-col gap-3'>
                            <h4 className="font-semibold text-md">Solutions</h4>
                            <ul className="space-y-3">
                                {footerLinks.solutions.map((link, index) => (
                                    <li key={index}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-gray-300 hover:text-neutral-500 transition-all duration-300"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Resource */}
                        <div className='flex flex-col gap-3'>
                            <h4 className="font-semibold text-md">Resource</h4>
                            <ul className="space-y-3">
                                {footerLinks.resource.map((link, index) => (
                                    <li key={index}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-gray-300 hover:text-neutral-500 transition-all duration-300"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal */}
                        <div className='flex flex-col gap-3'>
                            <h4 className="font-semibold text-md">Legal</h4>
                            <ul className="space-y-3">
                                {footerLinks.legal.map((link, index) => (
                                    <li key={index}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-gray-300 hover:text-neutral-500 transition-all duration-300"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div>
                    {/* Divider */}
                    <div className="border-t border-white"></div>

                    {/* Bottom Footer */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        {/* Copyright */}
                        <p className="text-sm text-white">
                            © 2025 BKK SMKN 1 Purwosari. All Rights Reserved.
                        </p>

                        {/* Social Links */}
                        <div className="flex">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-10 h-10 flex items-center justify-center transition-all duration-300"
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Large Background Text */}
                <div className="relative overflow-hidden">
                    <h2
                        className="text-[9rem] font-bold text-center leading-none select-none"
                        style={{
                            background: 'linear-gradient(180deg, rgba(208, 208, 208, 1) 30%, rgba(19, 33, 51, 1) 80%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            letterSpacing: '-0.07em'
                        }}
                    >
                        SMKN 1 PURWOSARI
                    </h2>
                </div>
            </div>
        </footer>
    );
}