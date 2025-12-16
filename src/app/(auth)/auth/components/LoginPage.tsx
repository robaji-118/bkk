"use client";

import { useState } from "react";
import { Eye, EyeOff, GraduationCap, Building2, User } from "lucide-react";
import Image from "next/image";
import googleLogo from "@/assets/images/Google.svg";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation"; 

interface LoginPageProps {
  onToggle: () => void;
}

type UserType = "jobseeker" | "company";

export default function LoginPage({ onToggle }: LoginPageProps) {
  const supabase = createClient();
  const router = useRouter();

  const [userType, setUserType] = useState<UserType>("jobseeker");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // State untuk Input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // --- LOGIKA LOGIN UTAMA ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Sign In ke Auth Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw new Error("Email atau password salah.");
      if (!authData.user) throw new Error("Gagal login.");

      // 2. Cek Role User di Tabel 'profiles'
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .single();

      if (profileError || !profile) throw new Error("Profil pengguna tidak ditemukan.");

      // 3. Validasi User Type (Mencegah Jobseeker login di tab Company, dan sebaliknya)
      if (profile.role !== userType) {
        // Logout dulu karena loginnya tidak valid
        await supabase.auth.signOut(); 
        throw new Error(`Akun ini terdaftar sebagai ${profile.role}, silakan pindah tab.`);
      }

      // 4. Redirect sesuai Role
      if (profile.role === "company") {
        router.push("/company");
      } else {
        router.push("/jobseeker");
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      {/* --- TAB SWITCHER: Jobseeker vs Company --- */}
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

      {/* Form Fields */}
      <div>
        <label className="block text-sm font-medium text-black mb-2">
          {userType === "jobseeker" ? "Email Pribadi" : "Email Perusahaan"}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={userType === "jobseeker" ? "nama@email.com" : "hrd@perusahaan.com"}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-2">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 pr-11 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition outline-none"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 text-neutral-600 border-gray-300 rounded focus:ring-neutral-500"
          />
          <span className="ml-2 text-sm text-gray-700">Ingat Saya</span>
        </label>
        <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
          Lupa Password?
        </a>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-neutral-500 text-white font-semibold rounded-lg hover:bg-neutral-600 transition disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? "Memproses..." : `Login sebagai ${userType === "jobseeker" ? "Pencari Kerja" : "Perusahaan"}`}
      </button>

      <div className="relative my-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-400">atau masuk dengan</span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className={`grid ${userType === "jobseeker" ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
        <button type="button" className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition justify-center">
          <Image src={googleLogo} alt="Google Logo" width={20} height={20} />
          <span className="ml-3 text-sm font-medium text-black">Google</span>
        </button>

        {/* Tombol Belajar.id HANYA muncul untuk Jobseeker/Alumni */}
        {userType === "jobseeker" && (
          <button type="button" className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition justify-center">
            <GraduationCap className="w-5 h-5 text-black" />
            <span className="ml-3 text-sm font-medium text-black">Belajar.id</span>
          </button>
        )}
      </div>

      <div className="text-center mt-6">
        <span className="text-gray-600">Belum punya akun? </span>
        <button
          type="button"
          onClick={onToggle}
          className="text-black font-semibold hover:underline"
        >
          Daftar Sekarang
        </button>
      </div>
    </form>
  );
}