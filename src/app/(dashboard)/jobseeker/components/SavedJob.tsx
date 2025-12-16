"use client";

import { useEffect, useState } from "react";
import { Trash2, Briefcase, MapPin, Loader2, Building2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Init Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type SavedJob = {
  id: number;
  job_id: number;
  jobs: {
    title: string;
    location: string;
    companies: {
      company_name: string;
      logo_url: string | null;
    } | null;
  } | null;
};

export default function SavedJobsComponent() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Ubah fungsi fetch agar menerima userId sebagai parameter
  const fetchSavedJobs = async (userId: string) => {
    // Query Join: saved_jobs -> jobs -> companies
    const { data, error } = await supabase
      .from("saved_jobs")
      .select(`
        id,
        job_id,
        jobs (
          title,
          location,
          companies (
            company_name, 
            logo_url
          )
        )
      `)
      .eq("user_id", userId) // Gunakan userId dari parameter
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetch saved:", error);
    } else {
      setSavedJobs(data as unknown as SavedJob[]);
    }
    setLoading(false);
  };

  // 2. Perbaiki useEffect untuk mengambil Session dengan benar
  useEffect(() => {
    const initData = async () => {
      // Gunakan getSession() karena lebih cepat membaca local storage dibanding getUser()
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // Jika sesi ditemukan, jalankan fetch dengan ID user
        console.log("User ditemukan:", session.user.id);
        fetchSavedJobs(session.user.id);
      } else {
        // Jika tidak ada sesi
        console.log("User tidak ditemukan/belum login");
        setLoading(false);
      }
    };

    initData();
  }, []);

  // Fungsi Hapus
  const handleRemove = async (savedId: number) => {
    const prevData = [...savedJobs];
    setSavedJobs(prev => prev.filter(item => item.id !== savedId));

    const { error } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("id", savedId);

    if (error) {
      alert("Gagal menghapus.");
      setSavedJobs(prevData);
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-emerald-600"/></div>;

  if (savedJobs.length === 0) {
    return (
       <div className="text-center p-10 border border-dashed rounded-xl text-gray-500">
          Belum ada pekerjaan yang disimpan.
       </div>
    );
  }

  return (
    <div className="space-y-4">
      {savedJobs.map((item) => {
        const job = item.jobs; 
        if (!job) return null;

        return (
          <div key={item.id} className="bg-white p-5 rounded-xl border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition">
            <div className="flex gap-4 items-center">
              {job.companies?.logo_url ? (
                <img src={job.companies.logo_url} className="w-12 h-12 rounded-lg object-cover bg-gray-50" />
              ) : (
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700">
                   <Building2 size={24} />
                </div>
              )}
              
              <div>
                <h3 className="font-bold text-gray-800">{job.title}</h3>
                <p className="text-sm text-gray-500 flex gap-2 mt-1">
                   <span className="flex items-center gap-1"><Briefcase size={12}/> {job.companies?.company_name}</span>
                   <span className="flex items-center gap-1"><MapPin size={12}/> {job.location}</span>
                </p>
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <button 
                onClick={() => handleRemove(item.id)}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition flex items-center gap-2"
              >
                <Trash2 size={16} /> Hapus
              </button>
              <button className="px-6 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition flex-1 md:flex-none">
                Lamar Sekarang
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}