// src/components/sidebar/SidebarItem.tsx
"use client"; // Diperlukan untuk interaksi UI di Next.js

import { LucideIcon } from "lucide-react";
import { JobseekerMenuKey } from "../types/menu";

interface SidebarItemProps {
  item: {
    id: JobseekerMenuKey;
    label: string;
    icon: LucideIcon; // Tipe spesifik dari library icon
  };
  collapsed: boolean;
  active: boolean;
  onClick: () => void;
}

export default function SidebarItem({
  item,
  collapsed,
  active,
  onClick,
}: SidebarItemProps) {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full p-3 rounded-lg mb-1 transition-all ${
        active
          ? "bg-blue-50 text-blue-600"
          : "text-gray-700 hover:bg-gray-50"
      } ${collapsed ? "justify-center" : ""}`}
    >
      <Icon size={20} />
      {!collapsed && (
        <span className="ml-3 text-sm font-medium">{item.label}</span>
      )}
    </button>
  );
}