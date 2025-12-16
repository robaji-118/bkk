"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import Router untuk redirect
import Sidebar from "./sidebar/Sidebar";
import { Bell, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase"; // Import Supabase Client
import { MenuKey } from "./types/menu";

// --- EXISTING COMPONENTS ---
import DashboardComponent from "./components/Dashboard";
import JobsComponent from "./components/JobsComponent";
import ApplicantsComponent from "./components/Pelamar"; // Pastikan nama file sesuai
import ScheduleComponent from "./components/Schedule";
import ProfileComponent from "./components/Profile";
import NotificationComponent from "./components/Notification";
import HelpSupportComponent from "./components/Helpsupport";
import SettingsComponent from "./components/Settings";

export default function CompanyMain() {
  const router = useRouter();
  const supabase = createClient();

  // --- STATE ---
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuKey>("dashboard");
  const [loading, setLoading] = useState(true); // State loading agar tidak blank putih
  
  // State untuk menyimpan data profil perusahaan
  const [companyProfile, setCompanyProfile] = useState<{ company_name: string; pic_name: string } | null>(null);

  // --- EFFECT: FETCH DATA DARI SUPABASE ---
  useEffect(() => {
    const getCompanyData = async () => {
      try {
        // 1. Cek User yang sedang login (Auth)
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          router.replace("/"); // Jika tidak ada user, tendang ke login
          return;
        }

        // 2. Ambil detail perusahaan dari tabel 'companies' berdasarkan ID user
        const { data, error } = await supabase
          .from("companies")
          .select("company_name, pic_name")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Gagal mengambil profil perusahaan:", error.message);
        }

        if (data) {
          setCompanyProfile(data);
        }
      } catch (error) {
        console.error("Terjadi kesalahan:", error);
      } finally {
        setLoading(false);
      }
    };

    getCompanyData();
  }, [router, supabase]);

  // --- LOGOUT HANDLER ---
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  // --- HELPER: INISIAL NAMA PERUSAHAAN ---
  const getInitials = () => {
    if (!companyProfile?.company_name) return "CO";
    return companyProfile.company_name.substring(0, 2).toUpperCase();
  };

  // --- RENDER CONTENT SWITCHER ---
  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard": return <DashboardComponent />;
      case "jobs": return <JobsComponent />;
      case "applicants": return <ApplicantsComponent />;
      case "schedule": return <ScheduleComponent />;
      case "profile": return <ProfileComponent />;
      case "notifications": return <NotificationComponent />;
      case "help": return <HelpSupportComponent />;
      case "settings": return <SettingsComponent />;
      default: return <DashboardComponent />;
    }
  };

  const descriptions: Record<MenuKey, string> = {
    dashboard: "Ringkasan aktivitas rekrutmen perusahaan Anda",
    jobs: "Buat dan kelola lowongan pekerjaan",
    applicants: "Pantau kandidat yang melamar",
    schedule: "Atur jadwal interview dengan kandidat",
    notifications: "Pemberitahuan sistem terbaru",
    profile: "Kelola informasi dan branding perusahaan",
    settings: "Konfigurasi akun dan preferensi",
    help: "Pusat bantuan penggunaan sistem",
  };

  // --- TAMPILAN LOADING ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
        <span className="ml-2 text-gray-600 font-medium">Memuat dashboard...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
        onLogout={handleLogout} // Pastikan Sidebar Company menerima prop ini
      />

      {/* Main Content */}
      <main className="flex-1 p-6 transition-all duration-300 overflow-x-hidden">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 capitalize">
              {activeMenu === "jobs" ? "Lowongan Kerja" : 
               activeMenu === "applicants" ? "Data Pelamar" :
               activeMenu === "schedule" ? "Jadwal Interview" : 
               activeMenu === "profile" ? "Profil Perusahaan" : activeMenu}
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              {descriptions[activeMenu]}
            </p>
          </div>

          <div className="flex items-center gap-4 self-end md:self-auto">
            {/* Notifikasi */}
            <button className="relative p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-gray-200 hover:shadow-sm">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
            
            {/* Profil Company Dinamis */}
            <div className="flex items-start gap-3 pl-2 border-l border-gray-200">
               <div className="hidden md:block text-right">
                  <p className="text-sm font-bold text-gray-800 leading-tight">
                    {/* TAMPILKAN NAMA DARI DATABASE */}
                    {companyProfile ? companyProfile.company_name : "Perusahaan"}
                  </p>
                  <p className="text-[11px] text-gray-500 font-medium">
                    {companyProfile?.pic_name ? `PIC: ${companyProfile.pic_name}` : "Admin HR"}
                  </p>
               </div>

               {/* Avatar Inisial */}
               <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm cursor-pointer hover:bg-blue-200 transition ring-2 ring-white shadow-sm">
                 {getInitials()}
               </div>
            </div>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[calc(100vh-140px)] p-6">
            {renderContent()}
        </div>
      </main>
    </div>
  );
}