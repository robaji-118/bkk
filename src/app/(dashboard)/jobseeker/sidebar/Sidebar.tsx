"use client";

import Image from "next/image";
import logo from "@/assets/images/logo.png";
import { ChevronLeft, ChevronRight, LogOut, LayoutDashboard, User, Settings, Bell, HelpCircle, Search, FileText, Bookmark } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { JobseekerMenuKey } from "../types/menu";



interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeMenu: JobseekerMenuKey;
  onMenuChange: (menuId: JobseekerMenuKey) => void;
  onLogout?: () => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "explore", label: "Cari Lowongan", icon: Search },
  { id: "applications", label: "Lamaran Saya", icon: FileText },
  { id: "saved", label: "Disimpan", icon: Bookmark },
  { id: "notifications", label: "Notifikasi", icon: Bell },
  { id: "profile", label: "Profil & CV", icon: User },
  { id: "settings", label: "Pengaturan", icon: Settings },
  { id: "help", label: "Bantuan", icon: HelpCircle },
] as const;

export default function Sidebar({ collapsed, onToggleCollapse, activeMenu, onMenuChange, onLogout }: SidebarProps) {
  return (
    <aside className={`${collapsed ? "w-20" : "w-64"} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-screen sticky top-0 left-0 relative group`}>
      <button onClick={onToggleCollapse} className="absolute -right-3 top-9 z-50 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm text-gray-500 hover:text-emerald-600">
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="h-auto py-5 flex items-center justify-center border-b border-gray-200 min-h-[80px]">
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : "px-5 w-full"}`}>
          <div className="relative flex-shrink-0 w-9 h-9 border border-gray-100 rounded-lg p-0.5 bg-white shadow-sm">
            <Image src={logo} alt="Logo" fill className="object-contain" />
          </div>
          <div className={`flex flex-col transition-all duration-300 ${collapsed ? "opacity-0 w-0 hidden" : "opacity-100"}`}>
            <span className="font-bold text-gray-800 text-sm whitespace-nowrap">BKK SMKN 1</span>
            <span className="text-sm font-bold text-gray-800 mb-1.5">PURWOSARI</span>
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md w-fit text-[9px] font-bold uppercase">Jobseeker</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto space-y-1">
        {menuItems.map((item) => (
          <SidebarItem key={item.id} item={item} collapsed={collapsed} active={activeMenu === item.id} onClick={() => onMenuChange(item.id)} />
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button onClick={onLogout} className={`flex items-center w-full p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors ${collapsed ? "justify-center" : ""}`}>
          <LogOut size={20} className="flex-shrink-0" />
          {!collapsed && <span className="ml-3 text-sm font-medium">Keluar</span>}
        </button>
      </div>
    </aside>
  );
}