"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, Video, User, Briefcase, 
  Edit, ExternalLink, AlertCircle, Loader2 
} from "lucide-react";
import { createClient } from "@/lib/supabase";

interface Interview {
  id: number;
  status: string;
  interview_date: string | null;
  interview_link: string | null;
  interview_notes: string | null;
  jobseekers: {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
    email: string;
  };
  jobs: {
    title: string;
  };
}

export default function ScheduleComponent() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    link: "",
    notes: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: jobs } = await supabase.from("jobs").select("id").eq("company_id", user.id);
      if (!jobs) return;
      const jobIds = jobs.map(j => j.id);

      const { data, error } = await supabase
        .from("applications")
        .select(`
          id, status, interview_date, interview_link, interview_notes,
          jobseekers ( first_name, last_name, email, avatar_url ),
          jobs ( title )
        `)
        .in("job_id", jobIds)
        .eq("status", "Interview")
        .order("interview_date", { ascending: true });

      if (error) throw error;
      setInterviews(data as unknown as Interview[]);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openModal = (interview: Interview) => {
    setSelectedInterview(interview);
    
    if (interview.interview_date) {
      const dateObj = new Date(interview.interview_date);
      const dateStr = dateObj.toISOString().split('T')[0];
      const timeStr = dateObj.toTimeString().slice(0, 5);
      
      setFormData({
        date: dateStr,
        time: timeStr,
        link: interview.interview_link || "",
        notes: interview.interview_notes || ""
      });
    } else {
      setFormData({ date: "", time: "", link: "", notes: "" });
    }
    
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInterview) return;
    setSubmitting(true);

    try {
      const dateTimeString = new Date(`${formData.date}T${formData.time}:00`).toISOString();

      const { error } = await supabase
        .from("applications")
        .update({
          interview_date: dateTimeString,
          interview_link: formData.link,
          interview_notes: formData.notes
        })
        .eq("id", selectedInterview.id);

      if (error) throw error;

      alert("Jadwal berhasil disimpan!");
      setIsModalOpen(false);
      fetchSchedules();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
      alert("Gagal menyimpan: " + errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const unscheduled = interviews.filter(i => !i.interview_date);
  const scheduled = interviews.filter(i => i.interview_date);
  
  const now = new Date();
  const upcoming = scheduled.filter(i => new Date(i.interview_date!) >= now);
  const past = scheduled.filter(i => new Date(i.interview_date!) < now);

  return (
    <div className="space-y-8">
      
      {/* UNSCHEDULED */}
      {unscheduled.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-amber-800 flex items-center gap-2 mb-4">
            <AlertCircle size={20} />
            Perlu Dijadwalkan ({unscheduled.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unscheduled.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-amber-100 flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
                    {item.jobseekers.first_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{item.jobseekers.first_name} {item.jobseekers.last_name}</h4>
                    <p className="text-xs text-gray-500">{item.jobs.title}</p>
                  </div>
                </div>
                <button 
                  onClick={() => openModal(item)}
                  className="px-3 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 transition"
                >
                  Atur Jadwal
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* UPCOMING */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
          <Calendar className="text-blue-600" /> Jadwal Akan Datang
        </h3>
        
        {loading ? (
           <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-600"/></div>
        ) : upcoming.length === 0 ? (
           <p className="text-gray-500 italic">Tidak ada jadwal interview mendatang.</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((item) => (
              <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col md:flex-row gap-5 items-start md:items-center">
                
                <div className="flex-shrink-0 w-full md:w-48 bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                  <p className="text-blue-800 font-bold text-lg">
                    {new Date(item.interview_date!).toLocaleTimeString("id-ID", {hour: '2-digit', minute:'2-digit'})}
                  </p>
                  <p className="text-blue-600 text-xs font-medium uppercase tracking-wide">
                    {new Date(item.interview_date!).toLocaleDateString("id-ID", {weekday: 'long', day: 'numeric', month: 'short'})}
                  </p>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <User size={16} className="text-gray-400" />
                    <h4 className="font-bold text-gray-800 text-lg">{item.jobseekers.first_name} {item.jobseekers.last_name}</h4>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">Posisi: <b>{item.jobs.title}</b></span>
                  </div>
                  
                  {item.interview_link ? (
                    <a href={item.interview_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:underline bg-blue-50 px-2 py-1 rounded">
                      <Video size={12} /> Link Meeting: {item.interview_link} <ExternalLink size={10} />
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">Belum ada link meeting</span>
                  )}
                </div>

                <button 
                  onClick={() => openModal(item)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 flex items-center gap-2 transition"
                >
                  <Edit size={14} /> Edit
                </button>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* PAST */}
      {past.length > 0 && (
        <div className="pt-8 border-t border-gray-200">
          <h3 className="text-lg font-bold text-gray-500 mb-4">Riwayat Interview</h3>
          <div className="space-y-2 opacity-70">
            {past.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="text-xs font-mono bg-gray-200 px-2 py-1 rounded text-gray-600">
                  {new Date(item.interview_date!).toLocaleDateString("id-ID")}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {item.jobseekers.first_name} - {item.jobs.title}
                </span>
                <span className="text-xs text-gray-400 ml-auto">Selesai</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Atur Jadwal Interview</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Kandidat</label>
                <div className="text-sm font-medium text-gray-800 bg-gray-50 p-2 rounded border border-gray-200">
                  {selectedInterview?.jobseekers.first_name} {selectedInterview?.jobseekers.last_name}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Tanggal</label>
                  <input required type="date" className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Jam</label>
                  <input required type="time" className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Link Meeting / Lokasi</label>
                <div className="relative">
                  <Video className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Contoh: https://meet.google.com/abc..."
                    value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Catatan (Opsional)</label>
                <textarea rows={2} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Instruksi tambahan..."
                  value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Batal</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50">
                  {submitting ? "Menyimpan..." : "Simpan Jadwal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}