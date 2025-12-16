"use client";

import { useState, useEffect } from "react";
import { 
  Search, User, Briefcase, Calendar, 
  CheckCircle, XCircle, Clock, MessageSquare, FileText, Loader2
} from "lucide-react";
import { createClient } from "@/lib/supabase";

// --- TIPE DATA ---
interface Applicant {
  id: number;
  status: "Pending" | "Review" | "Interview" | "Accepted" | "Rejected";
  applied_at: string;
  cover_letter: string;
  jobseekers: {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
    headline: string | null;
    email: string;
    resume_url: string | null;
  };
  jobs: {
    title: string;
  };
}

export default function ApplicantsComponent() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // --- 1. FETCH APPLICANTS ---
  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: jobsData } = await supabase
        .from("jobs")
        .select("id")
        .eq("company_id", user.id);
        
      if (!jobsData || jobsData.length === 0) {
        setApplicants([]);
        setLoading(false);
        return;
      }

      const jobIds = jobsData.map(j => j.id);

      const { data, error } = await supabase
        .from("applications")
        .select(`
          id,
          status,
          applied_at,
          cover_letter,
          jobseekers (
            first_name,
            last_name,
            avatar_url,
            headline,
            resume_url
          ),
          jobs (
            title
          )
        `)
        .in("job_id", jobIds)
        .order("applied_at", { ascending: false });

      if (error) throw error;
      setApplicants(data as unknown as Applicant[]);

    } catch (error) {
      console.error("Error fetching applicants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- 2. UPDATE STATUS ---
  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("applications")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setApplicants(applicants.map(app => 
        app.id === id ? { ...app, status: newStatus as Applicant['status'] } : app
      ));
    } catch (error) {
      alert("Gagal mengupdate status.");
      console.error(error);
    }
  };

  // --- 3. FILTER LOGIC ---
  const filteredApplicants = applicants.filter((app) => {
    const matchesStatus = filterStatus === "All" || app.status === filterStatus;
    const fullName = `${app.jobseekers.first_name} ${app.jobseekers.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || 
                          app.jobs.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Helper Warna Status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-gray-100 text-gray-600 border-gray-200";
      case "Review": return "bg-amber-50 text-amber-600 border-amber-100";
      case "Interview": return "bg-blue-50 text-blue-600 border-blue-100";
      case "Accepted": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Rejected": return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* --- HEADER & FILTERS --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari nama atau posisi..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {["All", "Pending", "Review", "Interview", "Accepted", "Rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition border ${
                filterStatus === status
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {status === "All" ? "Semua" : status}
            </button>
          ))}
        </div>
      </div>

      {/* --- LIST APPLICANTS --- */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600 w-8 h-8" /></div>
      ) : filteredApplicants.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Tidak ada pelamar ditemukan</h3>
          <p className="text-gray-500 text-sm mt-1">Belum ada kandidat yang sesuai dengan filter Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredApplicants.map((app) => (
            <div key={app.id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-5">
              
              {/* Profile Info */}
              <div className="flex gap-4 flex-1">
                {/* Avatar */}
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden relative border border-gray-200">
                   <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold bg-gray-50">
                      {app.jobseekers.first_name.charAt(0)}
                   </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-800 text-lg">
                      {app.jobseekers.first_name} {app.jobseekers.last_name}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 flex items-center gap-1.5 mb-2">
                    <Briefcase size={14} className="text-blue-500" />
                    Melamar untuk: <span className="font-semibold text-gray-800">{app.jobs.title}</span>
                  </p>
                  
                  {app.jobseekers.headline && (
                    <p className="text-xs text-gray-500 mb-2 italic">&quot;{app.jobseekers.headline}&quot;</p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> 
                      {new Date(app.applied_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-row md:flex-col items-center md:items-end gap-2 md:gap-2 justify-end border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                
                {/* Tombol Lihat Resume */}
                {app.jobseekers.resume_url ? (
                  <a 
                    href={app.jobseekers.resume_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition w-full md:w-auto"
                  >
                    <FileText size={14} /> Lihat CV
                  </a>
                ) : (
                  <button disabled className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium bg-gray-50 border border-gray-200 text-gray-400 rounded-lg cursor-not-allowed w-full md:w-auto">
                    <FileText size={14} /> Tidak ada CV
                  </button>
                )}

                {/* Dropdown / Quick Actions Status */}
                <div className="flex gap-1 w-full md:w-auto">
                   {app.status === "Pending" && (
                     <button onClick={() => updateStatus(app.id, "Review")} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg hover:bg-amber-100 transition">
                       <Clock size={14} /> Review
                     </button>
                   )}
                   
                   {app.status === "Review" && (
                     <button onClick={() => updateStatus(app.id, "Interview")} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-100 transition">
                       <MessageSquare size={14} /> Interview
                     </button>
                   )}

                   {app.status === "Interview" && (
                     <>
                       <button onClick={() => updateStatus(app.id, "Accepted")} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-100 transition" title="Terima">
                         <CheckCircle size={14} />
                       </button>
                       <button onClick={() => updateStatus(app.id, "Rejected")} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-700 text-xs font-bold rounded-lg hover:bg-red-100 transition" title="Tolak">
                         <XCircle size={14} />
                       </button>
                     </>
                   )}

                   {app.status === "Accepted" && <span className="text-xs font-bold text-emerald-600 py-2">Diterima</span>}
                   {app.status === "Rejected" && <span className="text-xs font-bold text-red-600 py-2">Ditolak</span>}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}