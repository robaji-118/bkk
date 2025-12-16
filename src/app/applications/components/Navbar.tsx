"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "@/assets/images/logo.png";
import { Button } from "@/components/ui/button";

const Navbar: React.FC = (

) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();

  const getActiveMenu = () => {
    if (pathname === "/") return "Home";

    if (pathname === "/about") return "Tentang Kami";
    if (pathname === "/contact") return "Contact";
    if (pathname === "/lowongan") return "Lowongan Kerja";
    return "Home";
  };

  const activeMenu = getActiveMenu();

  return (
    <nav
      className="fixed top-5 left-1/2 -translate-x-1/2 w-[95%] max-w-8xl"
      style={{
        zIndex: 888,
      }}
    >
      {/* Floating Navbar Container */}
      <div className="bg-black/50 backdrop-blur-md rounded-full border border-white/20 px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <Link href="/" className="flex gap-2 items-center cursor-pointer">
            <div>
              <Image
                src={logo}
                alt="BKK SMKN 1 Purwosari Logo"
                width={40}
                height={40}
              />
            </div>
            <div className="flex flex-col text-white">
              <div className="text-sm font-semibold leading-tight">BKK SMK NEGERI 1</div>
              <div className="text-sm font-semibold leading-tight">PURWOSARI</div>
            </div>
          </Link>

          {/* Menu Items */}
          <div className="flex items-center gap-12">
            <div className="flex gap-8 items-center">
              {/* Home Menu */}
              <Link
                href="/"
                className="body-regular_regular text-white cursor-pointer 
                  transition-all duration-300 relative pb-1 group
                  hover:text-gray-300"
              >
                Home
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#FEFB09]
                  transition-all duration-300
                  ${activeMenu === "Home" ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              </Link>

              {/* Lowongan Kerja */}
              <Link
                href="/about"
                className="body-regular_regular text-white cursor-pointer 
                  transition-all duration-300 relative pb-1 group
                  hover:text-gray-300"
              >
                Tentang Kami
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#FEFB09] 
                  transition-all duration-300
                  ${activeMenu === "Tentang Kami" ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              </Link>

              {/* Lowongan Kerja */}
              <Link
                href="/lowongan"
                className="body-regular_regular text-white cursor-pointer 
                  transition-all duration-300 relative pb-1 group
                  hover:text-gray-300"
              >
                Lowongan Kerja
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#FEFB09] 
                  transition-all duration-300
                  ${activeMenu === "Lowongan Kerja" ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              </Link>

              {/* Contact */}
              <Link
                href="/contact"
                className="body-regular_regular text-white cursor-pointer 
                  transition-all duration-300 relative pb-1 group
                  hover:text-gray-300"
              >
                Contact
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#FEFB09] 
                  transition-all duration-300
                  ${activeMenu === "Contact" ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              </Link>
            </div>

            {/* Login Button with Dropdown */}
            <div className="relative">
              <Button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-20 h-9 justify-self-center text-white
                  backdrop-blur-md bg-white/40 hover:bg-white/50 
                  transition-all duration-300 relative z-10 border border-white/20"
                style={{
                  borderRadius: 20,
                }}
              >
                Login
              </Button>

              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowDropdown(false)}
                  />

                  {/* Dropdown Menu */}
                  <div
                    className="absolute top-full mt-6 z-30
                      backdrop-blur-lg bg-black/50 border border-white/20 
                      shadow-xl overflow-hidden w-[92px] items-center rounded-xl"
                  >
                    <Link
                      href="/auth"
                      onClick={() => setShowDropdown(false)}
                      className="block w-full px-4 py-3 text-white text-left body-small_regular 
                        transition-colors duration-200 hover:bg-white/10"
                    >
                      Alumni
                    </Link>
                    <hr className="border-white/10 mx-2" />
                    <Link
                      href="/auth"
                      onClick={() => setShowDropdown(false)}
                      className="block w-full px-4 py-3 text-white text-left body-small_regular 
                        transition-colors duration-200 hover:bg-white/10"
                    >
                      Industri
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;