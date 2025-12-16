"use client";

import { useEffect, useState } from "react";
import { Search, MapPin, Briefcase, DollarSign, Bookmark, Loader2, Building2, CheckCircle } from "lucide-react";
import { createClient, User } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Job = {
  id: number;
  title: string;
  location: string;
  type: string;
  salary_min: number;
  salary_max: number;
  created_at: string;
  companies: {
    company_name: string;
    logo_url: string | null;
  } | null;
};

const formatRupiah = (angka: number) => {
  if (!angka) return "0";
  if (angka >= 1000000) {
    return (angka / 1000000).toFixed(0) + "jt";
  }
  return new Intl.NumberFormat("id-ID").format(angka);
};

// --- UPDATE 1: TERIMA PROPS USER ---
interface ExploreComponentProps {
  user: User | null;
}

export default function ExploreComponent({ user }: ExploreComponentProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Hapus state user internal karena sudah diambil dari props
  
  const [appliedJobIds, setAppliedJobIds] = useState<number[]>([]); 
  const [applyingId, setApplyingId] = useState<number | null>(null); 
  const [savedJobIds, setSavedJobIds] = useState<number[]>([]); 
  const [savingId, setSavingId] = useState<number | null>(null);

  // --- UPDATE 2: USEEFFECT HANYA UNTUK CEK STATUS (JIKA USER ADA) ---
  useEffect(() => {
    // Kita tidak perlu fetch session lagi di sini.
    // Cukup cek jika props 'user' ada, maka load status aplikasi/saved.
    
    if (user) {
        const checkUserStatus = async (userId: string) => {
            // 1. Cek Lamaran
            const { data: applications } = await supabase
              .from('applications')
              .select('job_id')
              .eq('jobseeker_id', userId);
            
            if (applications) {
              setAppliedJobIds(applications.map(app => app.job_id));
            }
      
            // 2. Cek Saved Jobs
            const { data: saved } = await supabase
              .from('saved_jobs')
              .select('job_id')
              .eq('user_id', userId);
      
            if (saved) {
              setSavedJobIds(saved.map(item => item.job_id));
            }
          };
          
          checkUserStatus(user.id);
    }
  }, [user]); // Jalankan ulang jika props user berubah

  // Fetch Jobs (Tetap sama)
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from("jobs")
          .select(`
            id, title, location, type, salary_min, salary_max, created_at,
            companies (company_name, logo_url)
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (searchQuery) {
          query = query.ilike('title', `%${searchQuery}%`);
        }

        const { data, error } = await query;
        if (error) throw error;
        setJobs(data as unknown as Job[]);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(() => fetchJobs(), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle Apply (User diambil dari props)
  const handleApply = async (jobId: number) => {
    // Props user dijamin ada karena parent (JobseekerMain) sudah mengeceknya
    if (!user) {
      alert("Silakan login kembali."); 
      return;
    }

    setApplyingId(jobId);

    try {
      const { error } = await supabase
        .from('applications')
        .insert({
          job_id: jobId,
          jobseeker_id: user.id, // Pakai user.id dari props
          status: 'pending',     
          applied_at: new Date().toISOString()
        });

      if (error) {
        if (error.code === '23505') { 
             alert("Anda sudah melamar pekerjaan ini.");
        } else {
             throw error;
        }
      } else {
        alert("Lamaran berhasil dikirim!");
        setAppliedJobIds((prev) => [...prev, jobId]);
      }
    } catch (error) {
      console.error("Gagal melamar:", error);
      alert("Terjadi kesalahan saat mengirim lamaran.");
    } finally {
      setApplyingId(null);
    }
  };

  const handleToggleSave = async (jobId: number) => {
    if (!user) {
      alert("Silakan login untuk menyimpan pekerjaan.");
      return;
    }
    setSavingId(jobId);

    const isSaved = savedJobIds.includes(jobId);

    try {
      if (isSaved) {
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('user_id', user.id)
          .eq('job_id', jobId);
        
        if (error) throw error;
        setSavedJobIds(prev => prev.filter(id => id !== jobId));
      } else {
        const { error } = await supabase
          .from('saved_jobs')
          .insert({ user_id: user.id, job_id: jobId });
          
        if (error) throw error;
        setSavedJobIds(prev => [...prev, jobId]);
      }
    } catch (error) {
      console.error("Gagal mengubah status simpan:", error);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* ... (KODE JSX UI SAMA PERSIS SEPERTI SEBELUMNYA) ... */}
      {/* Hanya pastikan tidak ada perubahan logika di UI */}
      
      {/* Search Bar */}
      <div className="flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
         <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari posisi pekerjaan..."
            className="w-full pl-4 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full flex justify-center py-10">
            <Loader2 className="animate-spin text-emerald-600" size={32} />
          </div>
        ) : jobs.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">Tidak ada lowongan.</div>
        ) : (
          jobs.map((job) => {
            const isApplied = appliedJobIds.includes(job.id);
            const isSaved = savedJobIds.includes(job.id);
            const isSaving = savingId === job.id;

            return (
              <div key={job.id} className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-md transition-all group flex flex-col justify-between h-full">
                {/* ... Bagian Header Card ... */}
                 <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      {job.companies?.logo_url ? (
                          <img src={job.companies.logo_url} className="w-12 h-12 rounded-lg bg-gray-50 object-cover" />
                      ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center"><Building2 size={24}/></div>
                      )}
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{job.title}</h3>
                        <p className="text-sm text-gray-500">{job.companies?.company_name}</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleToggleSave(job.id)}
                      disabled={isSaving}
                      className={`transition p-2 rounded-full hover:bg-gray-100 
                        ${isSaved ? 'text-emerald-600' : 'text-gray-400'}
                      `}
                    >
                      {isSaving ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
                      )}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-4 mb-4">
                      <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded"><Briefcase size={14} /> {job.type}</span>
                      <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded"><MapPin size={14} /> {job.location}</span>
                      <span className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded"><DollarSign size={14} /> {formatRupiah(job.salary_min)}</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                    <button className="flex-1 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50">Detail</button>
                    
                    <button 
                      onClick={() => handleApply(job.id)}
                      disabled={isApplied || applyingId === job.id}
                      className={`flex-1 py-2 rounded-lg font-medium transition flex justify-center items-center gap-2
                        ${isApplied 
                          ? "bg-emerald-100 text-emerald-700 cursor-default" 
                          : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200 shadow-lg"
                        }
                      `}
                    >
                      {applyingId === job.id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : isApplied ? (
                        <>
                          <CheckCircle size={18} />
                          Dilamar
                        </>
                      ) : (
                        "Lamar Sekarang"
                      )}
                    </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}