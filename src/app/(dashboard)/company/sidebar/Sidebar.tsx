"use client";

import Image from "next/image";
import logo from "@/assets/images/logo.png";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  User,
  Settings,
  Bell,
  HelpCircle,
  Briefcase,
  Users,
  Calendar,
  Building2,
  LucideIcon,
} from "lucide-react";
import SidebarItem from "./SidebarItem";
import { MenuKey } from "../types/menu"; // Sesuaikan path

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeMenu: MenuKey;
  onMenuChange: (menuId: MenuKey) => void;
  onLogout?: () => void;
}

const menuItems: {
  id: MenuKey;
  label: string;
  icon: LucideIcon;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "jobs", label: "Lowongan Kerja", icon: Briefcase },
  { id: "applicants", label: "Data Pelamar", icon: Users },
  { id: "schedule", label: "Jadwal Interview", icon: Calendar },
  { id: "notifications", label: "Notifikasi", icon: Bell },
  { id: "profile", label: "Profil Perusahaan", icon: User },
  { id: "settings", label: "Pengaturan", icon: Settings },
  { id: "help", label: "Bantuan", icon: HelpCircle },
];

export default function Sidebar({
  collapsed,
  onToggleCollapse,
  activeMenu,
  onMenuChange,
  onLogout,
}: SidebarProps) {
  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-screen sticky top-0 left-0 relative group`}
    >
      {/* --- TOMBOL TOGGLE --- */}
      <button
        onClick={onToggleCollapse}
        // Tambahkan cursor-pointer di sini
        className="cursor-pointer absolute -right-3 top-9 z-50 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition-all"
        title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* --- HEADER --- */}
      <div className="h-auto py-5 flex items-center justify-center border-b border-gray-200 overflow-hidden min-h-[80px]">
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center w-full" : "px-5 w-full"}`}>
          <div className="relative flex-shrink-0 w-9 h-9 border border-gray-100 rounded-lg p-0.5 bg-white shadow-sm"> 
             <Image src={logo} alt="Company Logo" fill className="object-contain" />
          </div>
          <div className={`flex flex-col transition-all duration-300 ${collapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto"}`}>
            <span className="font-bold text-gray-800 text-sm whitespace-nowrap leading-tight">BKK SMKN 1</span>
            <span className="text-sm font-bold text-gray-800  mb-1.5 leading-tight">PURWOSARI</span>
            <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 px-2 py-0.5 rounded-md w-fit">
              <Building2 size={10} strokeWidth={2.5} />
              <span className="text-[9px] font-bold uppercase tracking-wider">Company</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- MENU SECTION --- */}
      <nav className="flex-1 p-3 overflow-y-auto space-y-1">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            collapsed={collapsed}
            active={activeMenu === item.id}
            onClick={() => onMenuChange(item.id)} 
            // SidebarItem biasanya sudah button, jadi otomatis pointer. 
            // Cek file SidebarItem.tsx Anda.
          />
        ))}
      </nav>

      {/* --- LOGOUT SECTION --- */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          // Tambahkan cursor-pointer di sini (meskipun tag button defaultnya sudah pointer)
          className={`cursor-pointer flex items-center w-full p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors group/logout ${
            collapsed ? "justify-center" : ""
          }`}
          title="Keluar Aplikasi"
        >
          <LogOut size={20} className="flex-shrink-0" />
          <div className={`overflow-hidden transition-all duration-300 ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100 ml-3"}`}>
             <span className="text-sm font-medium whitespace-nowrap">Keluar</span>
          </div>
        </button>
      </div>
    </aside>
  );
}