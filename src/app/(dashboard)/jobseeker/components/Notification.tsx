"use client";

import { useEffect, useState } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale"; // Untuk format "2 menit yang lalu"

// --- SETUP SUPABASE ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Notification = {
  id: number;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
  type?: string;
};

export default function NotificationComponent() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Notifikasi saat load
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }); // Paling baru diatas

        if (error) throw error;
        setNotifications(data || []);
      } catch (error) {
        console.error("Error fetching notif:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Opsional: Realtime subscription (agar notif muncul tanpa refresh)
    const channel = supabase
      .channel('realtime-notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, 
        (payload) => {
          // Tambahkan notif baru ke state paling atas
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 2. Fungsi Tandai Sudah Dibaca (Satu per satu)
  const markAsRead = async (notifId: number) => {
    // Optimistic Update (Ubah UI dulu biar cepat)
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: true } : n));

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notifId);
  };

  // 3. Fungsi Tandai Semua Dibaca
  const markAllAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Optimistic UI
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex justify-center">
        <Loader2 className="animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Bell className="text-emerald-600" size={24} />
          Notifikasi
        </h2>
        {notifications.some(n => !n.is_read) && (
          <button 
            onClick={markAllAsRead}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
          >
            Tandai semua dibaca
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Belum ada notifikasi baru.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => !notif.is_read && markAsRead(notif.id)}
              className={`p-4 rounded-lg border transition-all cursor-pointer relative group ${
                notif.is_read 
                  ? "bg-white border-gray-200" 
                  : "bg-emerald-50 border-emerald-100 shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className={`font-medium ${notif.is_read ? "text-gray-700" : "text-gray-900"}`}>
                    {notif.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: idLocale })}
                  </p>
                </div>
                
                {/* Indikator Belum Dibaca */}
                {!notif.is_read ? (
                  <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full mt-2 animate-pulse"></div>
                ) : (
                  <Check size={16} className="text-gray-300 mt-1" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}