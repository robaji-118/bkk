"use client";

import { useEffect, useState } from "react";
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  MoreHorizontal, 
  Loader2, 
  Building2, 
  Calendar,
  FileText,
  Briefcase
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { format } from "date-fns";
import { id } from "date-fns/locale"; // Untuk format tanggal Indonesia

// --- SETUP SUPABASE ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- TIPE DATA ---
// Kita perlu tipe yang nested karena kita join 3 tabel (Applications -> Jobs -> Companies)
type Application = {
  id: number;
  status: string;
  applied_at: string;
  // Relasi ke Jobs
  jobs: {
    title: string;
    type: string;
    location: string;
    // Relasi Jobs ke Companies
    companies: {
      company_name: string;
      logo_url: string | null;
    } | null;
  } | null;
};

export default function ApplicationsComponent() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        
        // 1. Ambil User saat ini
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setLoading(false);
          return; 
        }

        // 2. Query Data: Applications -> Join Jobs -> Join Companies
        const { data, error } = await supabase
          .from('applications')
          .select(`
            id,
            status,
            applied_at,
            jobs (
              title,
              type,
              location,
              companies (
                company_name,
                logo_url
              )
            )
          `)
          .eq('jobseeker_id', session.user.id) // Filter punya user ini saja
          .order('applied_at', { ascending: false }); // Urutkan dari yang terbaru

        if (error) throw error;

        setApplications(data as unknown as Application[]);
      } catch (error) {
        console.error("Gagal mengambil lamaran:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // --- HELPER: Badge Status ---
  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    switch(s) {
      case "interview": 
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100"><CheckCircle size={14}/> Interview</span>;
      case "review": 
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100"><Clock size={14}/> Sedang Direview</span>;
      case "rejected": 
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100"><XCircle size={14}/> Ditolak</span>;
      case "accepted": 
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100"><CheckCircle size={14}/> Diterima</span>;
      default: // Pending
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200"><FileText size={14}/> Terkirim</span>;
    }
  };

  // --- HELPER: Format Tanggal ---
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy", { locale: id });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-emerald-600" size={32} />
          <p className="text-gray-400 text-sm">Memuat riwayat lamaran...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Briefcase className="text-emerald-600" size={24} />
          Riwayat Lamaran Saya
        </h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Total: {applications.length}
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {applications.length === 0 ? (
          // --- EMPTY STATE (Jika belum ada lamaran) ---
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <FileText size={32} />
            </div>
            <h3 className="text-gray-800 font-medium mb-1">Belum ada lamaran</h3>
            <p className="text-gray-500 text-sm mb-6">Anda belum melamar pekerjaan apapun.</p>
            <a href="/explore" className="text-emerald-600 font-medium text-sm hover:underline">
              Cari Lowongan Sekarang &rarr;
            </a>
          </div>
        ) : (
          // --- TABEL DATA ---
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Perusahaan & Posisi</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tipe</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tanggal Lamar</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/80 transition duration-200 group">
                    
                    {/* Kolom Info Perusahaan & Job */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                          {app.jobs?.companies?.logo_url ? (
                            <img 
                              src={app.jobs.companies.logo_url} 
                              alt="Logo" 
                              className="w-10 h-10 rounded-lg object-cover border border-gray-100 shadow-sm"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                              <Building2 size={20} />
                            </div>
                          )}
                        </div>
                        {/* Judul & Nama PT */}
                        <div>
                          <p className="font-semibold text-gray-800 text-sm group-hover:text-emerald-600 transition">
                            {app.jobs?.title || "Judul Tidak Tersedia"}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {app.jobs?.companies?.company_name || "Perusahaan"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Kolom Tipe & Lokasi */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {app.jobs?.type}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {app.jobs?.location}
                      </div>
                    </td>

                    {/* Kolom Tanggal */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} className="text-gray-400" />
                        {formatDate(app.applied_at)}
                      </div>
                    </td>

                    {/* Kolom Status */}
                    <td className="px-6 py-4">
                      {getStatusBadge(app.status || 'Pending')}
                    </td>

                    {/* Kolom Aksi */}
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition">
                        <MoreHorizontal size={20} />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}