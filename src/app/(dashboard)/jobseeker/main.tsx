"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Bell, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { User } from "@supabase/supabase-js"; // IMPORT TIPE DATA USER

// --- COMPONENTS ---
import Sidebar from "./sidebar/Sidebar";
import { JobseekerMenuKey } from "./types/menu";
import DashboardComponent from "./components/Dashboard"; 
import ExploreComponent from "./components/Exsplore";
import ApplicationsComponent from "./components/Apllications";
import SavedJobsComponent from "./components/SavedJob";
import NotificationsComponent from "./components/Notification";
import ProfileComponent from "./components/Profile";
import SettingsComponent from "./components/Settings";
import HelpComponent from "./components/Helpsupport";

export default function JobseekerMain() {
  const router = useRouter();
  const supabase = createClient();

  // --- STATE ---
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState<JobseekerMenuKey>("dashboard");
  const [loading, setLoading] = useState(true);
  
  // State Profile (Data tabel)
  const [userProfile, setUserProfile] = useState<{ 
    first_name: string; 
    last_name: string; 
    avatar_url: string | null; 
  } | null>(null);

  // BARU: State untuk Auth User (Data login)
  const [authUser, setAuthUser] = useState<User | null>(null);

  // --- EFFECT: FETCH DATA FROM SUPABASE ---
  useEffect(() => {
    const getUserData = async () => {
      try {
        // 1. Check User Auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          router.replace("/"); 
          return;
        }

        // SIMPAN AUTH USER KE STATE
        setAuthUser(user);

        // 2. Get Jobseeker Data
        const { data, error } = await supabase
          .from("jobseekers")
          .select("first_name, last_name, avatar_url") 
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Failed to fetch profile:", error.message);
        }

        if (data) {
          setUserProfile(data);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  const getInitials = () => {
    if (!userProfile) return "JS";
    const first = userProfile.first_name?.charAt(0) || "";
    const last = userProfile.last_name?.charAt(0) || "";
    return (first + last).toUpperCase();
  };

  // --- RENDER CONTENT (MODIFIKASI DI SINI) ---
  // Kita kirim 'authUser' ke komponen yang butuh (terutama Explore)
  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard": return <DashboardComponent />;
      
      // PASSING PROPS USER KE EXPLORE COMPONENT
      case "explore": return <ExploreComponent user={authUser} />;
      
      case "applications": return <ApplicationsComponent />;
      case "saved": return <SavedJobsComponent />;
      case "notifications": return <NotificationsComponent />;
      case "profile": return <ProfileComponent />;
      case "settings": return <SettingsComponent />;
      case "help": return <HelpComponent />;
      default: return <DashboardComponent />;
    }
  };

  const descriptions: Record<JobseekerMenuKey, string> = {
    dashboard: "Ringkasan aktivitas pencarian kerja Anda",
    explore: "Temukan lowongan yang cocok dengan keahlianmu",
    applications: "Pantau status lamaran yang sudah dikirim",
    saved: "Daftar lowongan yang Anda simpan/bookmark",
    notifications: "Pemberitahuan terbaru seputar lamaran",
    profile: "Kelola data diri, CV, dan Portfolio",
    settings: "Pengaturan akun dan keamanan",
    help: "Pusat bantuan dan dukungan",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <span className="ml-2 text-gray-600 font-medium">Memuat data...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
        activeMenu={activeMenu} 
        onMenuChange={setActiveMenu} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-1 p-6 transition-all duration-300 overflow-x-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 capitalize">
               {activeMenu === "explore" ? "Cari Lowongan" : 
                activeMenu === "applications" ? "Lamaran Saya" : activeMenu}
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
               {descriptions[activeMenu]}
            </p>
          </div>

          <div className="flex items-center gap-4 self-end md:self-auto">
            <button className="relative p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-gray-200 hover:shadow-sm">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-emerald-500 rounded-full border border-white" />
            </button>
            
            <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
               <div className="hidden md:block text-right">
                  <p className="text-sm font-bold text-gray-800 leading-tight">
                    {userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : "User"}
                  </p>
                  <p className="text-[11px] text-gray-500 font-medium">Jobseeker</p>
               </div>

               <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-sm cursor-pointer hover:bg-emerald-200 transition ring-2 ring-white shadow-sm overflow-hidden relative">
                 {userProfile?.avatar_url ? (
                   <Image 
                     src={userProfile.avatar_url} 
                     alt="Avatar" 
                     fill 
                     className="object-cover"
                   />
                 ) : (
                   <span>{getInitials()}</span>
                 )}
               </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[calc(100vh-140px)] p-6">
           {renderContent()}
        </div>
      </main>
    </div>
  );
}