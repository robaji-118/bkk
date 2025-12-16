"use client";

import { useState } from "react";
import { Bell, Lock, Shield, ChevronRight, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function SettingsComponent() {
  const supabase = createClient();
  
  const [loading, setLoading] = useState(false);
  
  const [notifSettings, setNotifSettings] = useState({
    email: true,
    push: false,
  });

  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [passForm, setPassForm] = useState({ newPassword: "", confirmPassword: "" });

  const handleToggle = (key: "email" | "push") => {
    setNotifSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      alert("Konfirmasi password tidak cocok!");
      return;
    }
    if (passForm.newPassword.length < 6) {
      alert("Password minimal 6 karakter.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passForm.newPassword,
      });

      if (error) throw error;

      alert("Password berhasil diubah! Silakan login ulang nanti.");
      setIsPassModalOpen(false);
      setPassForm({ newPassword: "", confirmPassword: "" });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
      alert("Gagal mengubah password: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[500px]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Shield className="text-blue-600" /> Pengaturan Akun
        </h2>
        
        <div className="space-y-8">
          
          {/* NOTIFIKASI */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Bell size={18} /> Notifikasi
            </h3>
            <div className="space-y-4">
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div>
                  <p className="font-medium text-gray-800">Notifikasi Email</p>
                  <p className="text-sm text-gray-600">Terima update seputar pelamar via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={notifSettings.email}
                    onChange={() => handleToggle("email")} 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div>
                  <p className="font-medium text-gray-800">Push Notifications</p>
                  <p className="text-sm text-gray-600">Notifikasi popup di browser Anda</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={notifSettings.push}
                    onChange={() => handleToggle("push")} 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* KEAMANAN */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Lock size={18} /> Keamanan
            </h3>
            <div className="space-y-3">
              
              <button 
                onClick={() => setIsPassModalOpen(true)}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">Ganti Password</p>
                    <p className="text-sm text-gray-600">Perbarui kata sandi Anda secara berkala</p>
                  </div>
                  <ChevronRight className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </button>

              <button disabled className="w-full text-left p-4 border border-gray-200 rounded-lg opacity-60 cursor-not-allowed bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">Two-Factor Authentication (2FA)</p>
                    <p className="text-sm text-gray-600">Segera hadir untuk keamanan ekstra</p>
                  </div>
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600 font-medium">Coming Soon</span>
                </div>
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* MODAL PASSWORD */}
      {isPassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Ubah Password</h3>
              <button onClick={() => setIsPassModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                <input 
                  type="password" 
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Minimal 6 karakter"
                  value={passForm.newPassword}
                  onChange={(e) => setPassForm({...passForm, newPassword: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                <input 
                  type="password" 
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ulangi password baru"
                  value={passForm.confirmPassword}
                  onChange={(e) => setPassForm({...passForm, confirmPassword: e.target.value})}
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsPassModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-70 flex items-center gap-2"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {loading ? "Menyimpan..." : "Simpan Password"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}