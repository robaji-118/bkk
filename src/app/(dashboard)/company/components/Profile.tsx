"use client";

import { useState, useEffect } from "react";
import { User, Building2, MapPin, Globe, Loader2, Save, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function ProfileComponent() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    company_name: "",
    pic_name: "",
    industry: "",
    website: "",
    address: "",
    description: "",
    logo_url: "",
  });

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setEmail(user.email || "");

        const { data, error } = await supabase
          .from("companies")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (data) {
          setFormData({
            company_name: data.company_name || "",
            pic_name: data.pic_name || "",
            industry: data.industry || "",
            website: data.website || "",
            address: data.address || "",
            description: data.description || "",
            logo_url: data.logo_url || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    setUpdating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("companies")
        .update({
          company_name: formData.company_name,
          pic_name: formData.pic_name,
          industry: formData.industry,
          website: formData.website,
          address: formData.address,
          description: formData.description,
          logo_url: formData.logo_url,
        })
        .eq("id", user.id);

      if (error) throw error;
      alert("Profil berhasil diperbarui!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
      alert("Gagal menyimpan: " + errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getInitials = () => {
    return formData.company_name ? formData.company_name.substring(0, 2).toUpperCase() : "CO";
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-8 pb-8 border-b border-gray-100">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center border-4 border-white shadow-sm overflow-hidden relative">
            {formData.logo_url ? (
               <img src={formData.logo_url} alt="Logo" className="w-full h-full object-cover" />
            ) : (
               <span className="text-blue-600 font-bold text-3xl">{getInitials()}</span>
            )}
          </div>
          
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">{formData.company_name || "Nama Perusahaan"}</h2>
            <p className="text-gray-500 flex items-center justify-center md:justify-start gap-1">
               <User size={14} /> {email}
            </p>
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wide">
               <Building2 size={12} /> Company Account
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Perusahaan</label>
            <div className="relative">
               <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
               <input
                 name="company_name"
                 type="text"
                 value={formData.company_name}
                 onChange={handleChange}
                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
               />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama PIC (HRD)</label>
            <div className="relative">
               <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
               <input
                 name="pic_name"
                 type="text"
                 value={formData.pic_name}
                 onChange={handleChange}
                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
               />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bidang Industri</label>
            <input
              name="industry"
              type="text"
              placeholder="Contoh: Teknologi, F&B, Retail"
              value={formData.industry}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
            <div className="relative">
               <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
               <input
                 name="website"
                 type="text"
                 placeholder="https://perusahaan.com"
                 value={formData.website}
                 onChange={handleChange}
                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
               />
            </div>
          </div>
          
           <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL (Link Gambar)</label>
            <input
              name="logo_url"
              type="text"
              placeholder="https://example.com/logo.png"
              value={formData.logo_url}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">Masukkan link gambar langsung (opsional).</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Lengkap</label>
            <div className="relative">
               <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
               <textarea
                 name="address"
                 rows={2}
                 value={formData.address}
                 onChange={handleChange}
                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
               />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Perusahaan</label>
            <div className="relative">
               <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
               <textarea
                 name="description"
                 rows={4}
                 placeholder="Jelaskan tentang perusahaan Anda..."
                 value={formData.description}
                 onChange={handleChange}
                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
               />
            </div>
          </div>

        </div>

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
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70"
          >
            {updating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {updating ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>

      </div>
    </div>
  );
}