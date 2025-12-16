"use client";

import { useState } from "react";
import { Eye, EyeOff, GraduationCap, Building2, User } from "lucide-react";
import Image from "next/image";
import googleLogo from "@/assets/images/Google.svg";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface RegisterPageProps {
  onToggle: () => void;
}

type UserType = "jobseeker" | "company";

export default function RegisterPage({ onToggle }: RegisterPageProps) {
  const supabase = createClient();
  const router = useRouter();

  const [userType, setUserType] = useState<UserType>("jobseeker");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- STATE DATA ---
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    picName: "",
    email: "",
    password: "",
  });

  // --- STATE ERROR ---
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    picName: "",
    email: "",
    password: "",
  });

  // --- HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Hapus error saat user mengetik
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = { ...errors };
    let isValid = true;
    Object.keys(newErrors).forEach((key) => (newErrors[key as keyof typeof errors] = ""));

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email tidak valid";
      isValid = false;
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
      isValid = false;
    }

    if (userType === "jobseeker") {
      if (!formData.firstName) {
        newErrors.firstName = "Nama depan wajib diisi";
        isValid = false;
      }
    } else {
      if (!formData.companyName) {
        newErrors.companyName = "Nama perusahaan wajib diisi";
        isValid = false;
      }
      if (!formData.picName) {
        newErrors.picName = "Nama PIC wajib diisi";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      // 1. SignUp Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Gagal membuat user.");

      const userId = authData.user.id;

      // 2. Insert Profile
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        email: formData.email,
        role: userType,
      });
      if (profileError) throw profileError;

      // 3. Insert Detail
      if (userType === "jobseeker") {
        const { error: jsError } = await supabase.from("jobseekers").insert({
          id: userId,
          first_name: formData.firstName,
          last_name: formData.lastName,
        });
        if (jsError) throw jsError;
        
        alert("Registrasi Berhasil!");
        router.push("/jobseeker");
      } else {
        const { error: compError } = await supabase.from("companies").insert({
          id: userId,
          company_name: formData.companyName,
          pic_name: formData.picName,
        });
        if (compError) throw compError;

        alert("Registrasi Berhasil!");
        router.push("/company");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
      alert("Error: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER ---
  return (
    <form onSubmit={handleRegister} className="space-y-5" noValidate>
      
      {/* --- TAB SWITCHER (Sama seperti Login) --- */}
      <div className="grid grid-cols-2 bg-gray-100 p-1 rounded-lg mb-6">
        <button
          type="button"
          onClick={() => setUserType("jobseeker")}
          className={`flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
            userType === "jobseeker"
              ? "bg-white text-black shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <User size={16} />
          Jobseeker
        </button>
        <button
          type="button"
          onClick={() => setUserType("company")}
          className={`flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
            userType === "company"
              ? "bg-white text-black shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Building2 size={16} />
          Company
        </button>
      </div>

      {/* --- INPUTS KONDISIONAL --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userType === "jobseeker" ? (
          <>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Nama Depan</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none transition ${
                  errors.firstName 
                    ? "border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:ring-neutral-500 focus:border-transparent"
                }`}
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Nama Belakang</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition outline-none"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Perusahaan</label>
              <input
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="PT. Maju Mundur"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none transition ${
                  errors.companyName 
                    ? "border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:ring-neutral-500 focus:border-transparent"
                }`}
              />
              {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">PIC</label>
              <input
                name="picName"
                value={formData.picName}
                onChange={handleChange}
                placeholder="Nama HRD"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none transition ${
                  errors.picName 
                    ? "border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:ring-neutral-500 focus:border-transparent"
                }`}
              />
              {errors.picName && <p className="text-red-500 text-xs mt-1">{errors.picName}</p>}
            </div>
          </>
        )}
      </div>

      {/* --- EMAIL --- */}
      <div>
        <label className="block text-sm font-medium text-black mb-2">
           {userType === "jobseeker" ? "Email Pribadi" : "Email Perusahaan"}
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={userType === "jobseeker" ? "nama@email.com" : "hrd@perusahaan.com"}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none transition ${
             errors.email 
               ? "border-red-500 focus:ring-red-200" 
               : "border-gray-300 focus:ring-neutral-500 focus:border-transparent"
          }`}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      {/* --- PASSWORD --- */}
      <div>
        <label className="block text-sm font-medium text-black mb-2">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Min 6 karakter"
            className={`w-full px-4 pr-11 py-3 border rounded-lg focus:ring-2 outline-none transition ${
               errors.password 
                 ? "border-red-500 focus:ring-red-200" 
                 : "border-gray-300 focus:ring-neutral-500 focus:border-transparent"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>

      {/* --- SUBMIT BUTTON --- */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-neutral-500 text-white font-semibold rounded-lg hover:bg-neutral-600 transition disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? "Memproses..." : `Daftar sebagai ${userType === "jobseeker" ? "Pencari Kerja" : "Perusahaan"}`}
      </button>

      {/* --- DIVIDER --- */}
      <div className="relative my-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-400">atau daftar dengan</span>
        </div>
      </div>

      {/* --- SOCIAL BUTTONS --- */}
      <div className={`grid ${userType === "jobseeker" ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
        <button type="button" className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition justify-center">
          <Image src={googleLogo} alt="Google Logo" width={20} height={20} />
          <span className="ml-3 text-sm font-medium text-black">Google</span>
        </button>

        {userType === "jobseeker" && (
          <button type="button" className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition justify-center">
            <GraduationCap className="w-5 h-5 text-black" />
            <span className="ml-3 text-sm font-medium text-black">Belajar.id</span>
          </button>
        )}
      </div>

      {/* --- SWITCH TO LOGIN --- */}
      <div className="text-center mt-6">
        <span className="text-gray-600">Sudah punya akun? </span>
        <button
          type="button"
          onClick={onToggle}
          className="text-black font-semibold hover:underline"
        >
          Login
        </button>
      </div>
    </form>
  );
}