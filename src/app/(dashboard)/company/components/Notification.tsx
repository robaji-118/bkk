"use client";

import { useEffect, useState } from "react";
import { Check, CheckCheck, Bell, Loader2, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase";

// Tipe data sesuai database
interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  type: string;
}

export default function NotificationComponent() {
  const supabase = createClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 1. FETCH DATA ---
  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }); // Terbaru di atas

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Opsional: Realtime subscription (agar notif muncul tanpa refresh)
    const channel = supabase
      .channel('realtime-notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, 
        (payload) => {
          // Jika ada notif baru, tambahkan ke state
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // --- 2. MARK AS READ (Satu per satu) ---
  const markAsRead = async (id: number) => {
    // Update UI dulu biar cepat (Optimistic UI)
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    
    // Update Database
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  };

  // --- 3. MARK ALL AS READ ---
  const markAllRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id);
  };

  // --- 4. HAPUS SEMUA ---
  const clearAll = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    if(!confirm("Hapus semua notifikasi?")) return;

    setNotifications([]);
    await supabase.from("notifications").delete().eq("user_id", user.id);
  };

  // Helper Time Ago (Format Waktu: "2 jam lalu")
  const timeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return "Baru saja";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam lalu`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} hari lalu`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[500px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Bell className="text-blue-600" /> Notifikasi
          {notifications.filter(n => !n.is_read).length > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {notifications.filter(n => !n.is_read).length} Baru
            </span>
          )}
        </h2>
        <div className="flex gap-3">
            <button onClick={markAllRead} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                <CheckCheck size={16}/> Tandai semua dibaca
            </button>
            <button onClick={clearAll} className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1">
                <Trash2 size={16}/> Hapus Semua
            </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600"/></div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
           <Bell className="mx-auto text-gray-300 mb-2" size={40} />
           <p className="text-gray-500">Belum ada notifikasi baru.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={`p-4 rounded-lg border transition-all cursor-pointer relative group ${
                notif.is_read 
                ? "bg-white border-gray-200 opacity-70 hover:opacity-100" 
                : "bg-blue-50 border-blue-200 shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className={`font-medium ${notif.is_read ? 'text-gray-600' : 'text-gray-900'}`}>
                    {notif.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    {timeAgo(notif.created_at)}
                  </p>
                </div>
                
                {/* Indikator Status */}
                <div className="flex flex-col items-end gap-2">
                    {!notif.is_read && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse"></div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}