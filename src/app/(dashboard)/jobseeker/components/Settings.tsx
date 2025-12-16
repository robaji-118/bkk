// src/components/pages/SettingsComponent.tsx
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Shield, 
  Key, 
  Lock, 
  ChevronRight, 
  LogOut 
} from "lucide-react";

export default function SettingsComponent() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* --- HEADER --- */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Pengaturan Akun</h2>
        <p className="text-gray-500 text-sm mt-1">Kelola preferensi notifikasi dan keamanan akun Anda.</p>
      </div>

      <div className="space-y-6">
        
        {/* --- SECTION 1: GENERAL (NOTIFICATIONS) --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Notifikasi</h3>
              <p className="text-xs text-gray-500">Atur bagaimana kami menghubungi Anda.</p>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {/* Email Toggle */}
            <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex gap-4">
                <Mail className="text-gray-400 mt-1" size={20} />
                <div>
                  <p className="font-medium text-gray-800">Notifikasi Email</p>
                  <p className="text-sm text-gray-500">Terima update tentang aktivitas akun via email.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Push Notification Toggle */}
            <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex gap-4">
                <Smartphone className="text-gray-400 mt-1" size={20} />
                <div>
                  <p className="font-medium text-gray-800">Push Notifications</p>
                  <p className="text-sm text-gray-500">Terima notifikasi langsung di perangkat ini.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: SECURITY --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
             <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Keamanan</h3>
              <p className="text-xs text-gray-500">Jaga keamanan akun Anda.</p>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {/* Change Password */}
            <button className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors group">
              <div className="flex gap-4">
                <Key className="text-gray-400 mt-1 group-hover:text-emerald-500 transition-colors" size={20} />
                <div>
                  <p className="font-medium text-gray-800 group-hover:text-emerald-700 transition-colors">Ganti Password</p>
                  <p className="text-sm text-gray-500">Disarankan mengganti password secara berkala.</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
            </button>

            {/* 2FA */}
            <button className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors group">
              <div className="flex gap-4">
                <Lock className="text-gray-400 mt-1 group-hover:text-emerald-500 transition-colors" size={20} />
                <div>
                  <p className="font-medium text-gray-800 group-hover:text-emerald-700 transition-colors">Autentikasi Dua Faktor (2FA)</p>
                  <p className="text-sm text-gray-500">Tambahkan lapisan keamanan ekstra saat login.</p>
                </div>
              </div>
               <div className="flex items-center gap-3">
                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">Nonaktif</span>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
              </div>
            </button>
          </div>
        </div>

        {/* --- DANGER ZONE (Optional) --- */}
        <div className="flex justify-end pt-4">
            <button className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                <LogOut size={16} />
                Keluar dari Akun
            </button>
        </div>

      </div>
    </div>
  );
}