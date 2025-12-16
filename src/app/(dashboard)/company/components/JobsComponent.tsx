"use client";

import { useState, useEffect } from "react";
import { Plus, Search, MapPin, Briefcase, DollarSign, Trash2, X, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase";

// Tipe Data Job sesuai Database Supabase
interface Job {
  id: number;
  title: string;
  type: "Fulltime" | "Parttime" | "Internship" | "Contract";
  location: string;
  salary_min: number;
  salary_max: number;
  description: string;
  requirements: string;
  is_active: boolean;
  created_at: string;
}

export default function JobsComponent() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // State untuk Form Input
  const [formData, setFormData] = useState({
    title: "",
    type: "Fulltime",
    location: "",
    salary_min: "",
    salary_max: "",
    description: "",
    requirements: "",
  });

  // --- 1. FETCH JOBS (READ) ---
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("company_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs(data as unknown as Job[]);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- 2. HANDLE SUBMIT (CREATE) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesi pengguna tidak ditemukan");

      const { error } = await supabase.from("jobs").insert({
        company_id: user.id,
        title: formData.title,
        type: formData.type,
        location: formData.location,
        salary_min: parseInt(formData.salary_min) || 0,
        salary_max: parseInt(formData.salary_max) || 0,
        description: formData.description,
        requirements: formData.requirements,
        is_active: true,
      });

      if (error) throw error;

      alert("Lowongan berhasil dibuat!");
      setIsModalOpen(false);
      setFormData({ 
        title: "", type: "Fulltime", location: "", salary_min: "", salary_max: "", description: "", requirements: "" 
      });
      fetchJobs();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
      alert("Gagal membuat lowongan: " + errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // --- 3. HANDLE DELETE (DELETE) ---
  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Apakah Anda yakin ingin menghapus lowongan ini? Data tidak bisa dikembalikan.");
    if (!confirmDelete) return;

    try {
      const { error } = await supabase.from("jobs").delete().eq("id", id);
      if (error) throw error;
      
      setJobs(jobs.filter((job) => job.id !== id));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
      alert("Gagal menghapus: " + errorMessage);
    }
  };

  // --- 4. TOGGLE STATUS (UPDATE) ---
  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("jobs")
        .update({ is_active: !currentStatus })
        .eq("id", id);
      
      if (error) throw error;
      
      setJobs(jobs.map(job => job.id === id ? { ...job, is_active: !currentStatus } : job));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Gagal mengubah status lowongan.");
    }
  };

  // Helper Format Rupiah
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="space-y-6">
      {/* --- HEADER & ACTIONS --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari lowongan saya..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium text-sm w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          Buat Lowongan Baru
        </button>
      </div>

      {/* --- LIST JOBS --- */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600 w-8 h-8" /></div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="text-blue-500" size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Belum ada lowongan</h3>
          <p className="text-gray-500 text-sm mt-1">Mulai rekrut talenta terbaik dengan membuat lowongan baru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className={`group bg-white rounded-xl border p-5 transition-all hover:shadow-lg hover:-translate-y-1 relative ${job.is_active ? 'border-gray-200' : 'border-gray-100 bg-gray-50 opacity-80'}`}>
              
              <div className="flex justify-between items-start mb-3">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                  job.is_active ? "bg-green-50 text-green-700 border-green-100" : "bg-gray-100 text-gray-500 border-gray-200"
                }`}>
                  {job.is_active ? "Publik (Aktif)" : "Ditutup"}
                </span>
                <button 
                  onClick={() => handleDelete(job.id)} 
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition opacity-0 group-hover:opacity-100"
                  title="Hapus Lowongan"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">{job.title}</h3>
              
              <div className="space-y-2.5 text-sm text-gray-600 mb-5 mt-3">
                <div className="flex items-center gap-2">
                  <Briefcase size={14} className="text-blue-500 flex-shrink-0" />
                  <span className="truncate">{job.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-red-500 flex-shrink-0" />
                  <span className="truncate">{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={14} className="text-emerald-500 flex-shrink-0" />
                  <span className="truncate font-medium text-gray-900">
                    {formatRupiah(job.salary_min)} - {formatRupiah(job.salary_max)}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex gap-3">
                <button 
                  onClick={() => toggleStatus(job.id, job.is_active)}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition ${
                    job.is_active 
                    ? "border-red-200 text-red-600 bg-red-50 hover:bg-red-100" 
                    : "border-green-200 text-green-700 bg-green-50 hover:bg-green-100"
                  }`}
                >
                  {job.is_active ? "Tutup Lowongan" : "Aktifkan Kembali"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- MODAL FORM CREATE JOB --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            
            <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Buat Lowongan Baru</h2>
                <p className="text-xs text-gray-500 mt-0.5">Isi detail pekerjaan dengan lengkap</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded-full transition">
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              <form id="createJobForm" onSubmit={handleSubmit} className="space-y-5">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Judul Posisi <span className="text-red-500">*</span></label>
                    <input required type="text" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                      placeholder="Contoh: Senior Frontend Developer" 
                      value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Tipe Pekerjaan</label>
                    <select className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                      <option value="Fulltime">Fulltime</option>
                      <option value="Parttime">Parttime</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Lokasi Kerja <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input required type="text" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition" 
                      placeholder="Contoh: Jakarta Selatan (On-site) atau Remote"
                      value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Gaji Minimum (Rp)</label>
                    <input required type="number" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" placeholder="0"
                      value={formData.salary_min} onChange={e => setFormData({...formData, salary_min: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Gaji Maksimum (Rp)</label>
                    <input required type="number" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500" placeholder="0"
                      value={formData.salary_max} onChange={e => setFormData({...formData, salary_max: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Deskripsi Pekerjaan <span className="text-red-500">*</span></label>
                  <textarea required rows={4} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
                    placeholder="Jelaskan tanggung jawab dan gambaran pekerjaan..."
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Kualifikasi / Syarat <span className="text-red-500">*</span></label>
                  <textarea required rows={4} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
                    placeholder="- Minimal Pendidikan S1&#10;- Menguasai React.js&#10;- Berpengalaman 1 tahun"
                    value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})}></textarea>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><AlertCircle size={12}/> Gunakan baris baru (Enter) untuk membuat poin.</p>
                </div>

              </form>
            </div>

            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-lg transition text-sm">
                Batal
              </button>
              <button form="createJobForm" type="submit" disabled={submitting} className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-70 text-sm flex items-center gap-2">
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {submitting ? "Menyimpan..." : "Terbitkan Lowongan"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}