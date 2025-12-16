"use client";

import { useState, useEffect } from "react";
import { User, Phone, MapPin, Link, Loader2, Save, FileText, Briefcase, Linkedin } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function ProfileComponent() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // State Data Profile
  const [email, setEmail] = useState("");
  
  // Struktur Data Jobseeker sesuai ERD (Perkiraan)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    headline: "",    // Contoh: "Full Stack Developer"
    bio: "",         // Deskripsi diri
    phone: "",
    avatar_url: "",  // Link foto profil
    resume_url: "",  // Link CV (Google Drive/PDF Link)
    skills: "",      // Disimpan sebagai string text dulu (opsional)
  });

  // --- 1. FETCH DATA PROFILE ---
  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setEmail(user.email || "");

        // Ambil data detail jobseeker
        const { data, error } = await supabase
          .from("jobseekers") // Pastikan nama tabel sesuai di database kamu
          .select("*")
          .eq("id", user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (data) {
          setFormData({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            headline: data.headline || "",
            bio: data.bio || "",
            phone: data.phone || "",
            avatar_url: data.avatar_url || "",
            resume_url: data.resume_url || "",
            skills: data.skills || "", // Asumsi di DB text, kalau array perlu .join(', ')
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  // --- 2. HANDLE SAVE ---
  const handleSave = async () => {
    setUpdating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("jobseekers")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          headline: formData.headline,
          bio: formData.bio,
          phone: formData.phone,
          avatar_url: formData.avatar_url,
          resume_url: formData.resume_url,
          skills: formData.skills,
        })
        .eq("id", user.id);

      if (error) throw error;
      alert("Profil Anda berhasil diperbarui!");
    } catch (error: any) {
      alert("Gagal menyimpan: " + error.message);
    } finally {
      setUpdating(false);
    }
  };

  // --- 3. HANDLE INPUT CHANGE ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Helper Initials (Gabungan First & Last Name)
  const getInitials = () => {
    const first = formData.first_name?.charAt(0) || "";
    const last = formData.last_name?.charAt(0) || "";
    return (first + last).toUpperCase() || "JS";
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-emerald-600" /></div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-8 pb-8 border-b border-gray-100">
          {/* Avatar Placeholder */}
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-white shadow-sm overflow-hidden relative ring-1 ring-gray-100">
            {formData.avatar_url ? (
               // eslint-disable-next-line @next/next/no-img-element
               <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
               <span className="text-emerald-600 font-bold text-3xl">{getInitials()}</span>
            )}
          </div>
          
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">
              {formData.first_name || formData.last_name 
                ? `${formData.first_name} ${formData.last_name}` 
                : "Nama Belum Diisi"}
            </h2>
            <p className="text-emerald-600 font-medium mb-1">
                {formData.headline || "Tambahkan headline profesional..."}
            </p>
            <p className="text-gray-500 flex items-center justify-center md:justify-start gap-1 text-sm">
               <User size={14} /> {email}
            </p>
          </div>
        </div>

        {/* --- FORM SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Nama Depan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Depan</label>
            <input
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />
          </div>

          {/* Nama Belakang */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Belakang</label>
            <input
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />
          </div>

          {/* Headline */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Headline Profesional</label>
            <div className="relative">
               <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
               <input
                 name="headline"
                 type="text"
                 placeholder="Contoh: Senior Frontend Developer | UI/UX Enthusiast"
                 value={formData.headline}
                 onChange={handleChange}
                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
               />
            </div>
          </div>

          {/* Nomor HP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nomor WhatsApp / Telepon</label>
            <div className="relative">
               <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
               <input
                 name="phone"
                 type="tel"
                 placeholder="+62 812..."
                 value={formData.phone}
                 onChange={handleChange}
                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
               />
            </div>
          </div>

           {/* Link Resume / CV */}
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Link CV / Resume (URL)</label>
            <div className="relative">
               <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
               <input
                 name="resume_url"
                 type="text"
                 placeholder="Link GDrive / LinkedIn / PDF..."
                 value={formData.resume_url}
                 onChange={handleChange}
                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
               />
            </div>
          </div>

          {/* Avatar URL */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Foto Profil (URL Gambar)</label>
            <input
              name="avatar_url"
              type="text"
              placeholder="https://example.com/my-photo.jpg"
              value={formData.avatar_url}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
             <p className="text-xs text-gray-400 mt-1">Masukkan link gambar langsung (opsional).</p>
          </div>

          {/* Bio / Ringkasan */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tentang Saya (Bio)</label>
            <div className="relative">
               <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
               <textarea
                 name="bio"
                 rows={4}
                 placeholder="Ceritakan pengalaman dan keahlian Anda secara singkat..."
                 value={formData.bio}
                 onChange={handleChange}
                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
               />
            </div>
          </div>

           {/* Skills */}
           <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Keahlian (Skills)</label>
            <input
              name="skills"
              type="text"
              placeholder="React, Next.js, TypeScript, Tailwind CSS (Pisahkan dengan koma)"
              value={formData.skills}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

        </div>

        {/* --- ACTION BUTTONS --- */}
        <div className="mt-8 flex justify-end space-x-3 pt-6 border-t border-gray-100">
          <button 
            onClick={() => window.location.reload()}
            disabled={updating}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button 
            onClick={handleSave}
            disabled={updating}
            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-70 shadow-emerald-200 shadow-lg"
          >
            {updating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {updating ? "Menyimpan..." : "Simpan Profil"}
          </button>
        </div>

      </div>
    </div>
  );
}