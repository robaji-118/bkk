"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement, // Ditambahkan
  LineElement,  // Ditambahkan
  Filler,       // Ditambahkan untuk area fill
} from "chart.js";
import { Bar, Line } from "react-chartjs-2"; // Ganti Doughnut dengan Line
import { Eye, Briefcase, Calendar, CheckCircle, XCircle, Clock, Loader2, ArrowRight } from "lucide-react";
import Image from "next/image";

// Registrasi Komponen Chart.js
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  PointElement, 
  LineElement, 
  Filler
);

// --- TIPE DATA ---
interface Application {
  id: number;
  status: string;
  applied_at: string;
  jobs: {
    title: string;
    type: string;
    salary_min: number;
    salary_max: number;
    companies: {
      company_name: string;
      logo_url: string | null;
    };
  };
}

export default function DashboardComponent() {
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    interview: 0,
    accepted: 0,
    rejected: 0
  });

  // State untuk Bar Chart (Aktivitas Melamar Bulanan)
  const [monthlyActivity, setMonthlyActivity] = useState<number[]>(new Array(6).fill(0));
  const [monthLabels, setMonthLabels] = useState<string[]>([]);

  // Helper untuk membuat tanggal mundur (agar chart bar dinamis)
  const getDateMonthsAgo = (months: number, daysOffset: number = 0) => {
    const d = new Date();
    d.setMonth(d.getMonth() - months);
    d.setDate(d.getDate() - daysOffset);
    return d.toISOString();
  };

  // --- 1. FETCH DATA (SIMULASI DUMMY) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        // --- DATA DUMMY ---
        const dummyData: Application[] = [
            {
                id: 1,
                status: "Interview",
                applied_at: getDateMonthsAgo(0, 2),
                jobs: {
                    title: "Senior Frontend Engineer",
                    type: "Full-time",
                    salary_min: 15000000,
                    salary_max: 25000000,
                    companies: { company_name: "Tokopedia", logo_url: null }
                }
            },
            {
                id: 2,
                status: "Accepted",
                applied_at: getDateMonthsAgo(0, 5),
                jobs: {
                    title: "React Native Developer",
                    type: "Remote",
                    salary_min: 12000000,
                    salary_max: 18000000,
                    companies: { company_name: "Gojek", logo_url: null }
                }
            },
            {
                id: 3,
                status: "Rejected",
                applied_at: getDateMonthsAgo(1, 10),
                jobs: {
                    title: "UI/UX Designer",
                    type: "Contract",
                    salary_min: 8000000,
                    salary_max: 12000000,
                    companies: { company_name: "Traveloka", logo_url: null }
                }
            },
            {
                id: 4,
                status: "Pending",
                applied_at: getDateMonthsAgo(0, 1),
                jobs: {
                    title: "Backend Golang",
                    type: "Full-time",
                    salary_min: 20000000,
                    salary_max: 30000000,
                    companies: { company_name: "Shopee", logo_url: null }
                }
            },
            {
                id: 5,
                status: "Interview",
                applied_at: getDateMonthsAgo(1, 5),
                jobs: {
                    title: "Software Engineer Lead",
                    type: "Hybrid",
                    salary_min: 35000000,
                    salary_max: 50000000,
                    companies: { company_name: "Bank Jago", logo_url: null }
                }
            },
            {
                id: 6,
                status: "Rejected",
                applied_at: getDateMonthsAgo(2, 0),
                jobs: {
                    title: "System Analyst",
                    type: "Full-time",
                    salary_min: 10000000,
                    salary_max: 15000000,
                    companies: { company_name: "Telkom Indonesia", logo_url: null }
                }
            },
            {
                id: 7,
                status: "Pending",
                applied_at: getDateMonthsAgo(3, 0),
                jobs: {
                    title: "IT Support",
                    type: "On-site",
                    salary_min: 5000000,
                    salary_max: 7000000,
                    companies: { company_name: "BCA", logo_url: null }
                }
            },
            {
                id: 8,
                status: "Pending",
                applied_at: getDateMonthsAgo(0, 3),
                jobs: {
                    title: "Next.js Developer",
                    type: "Remote",
                    salary_min: 10000000,
                    salary_max: 15000000,
                    companies: { company_name: "Startup Indo", logo_url: null }
                }
            },
        ];

        setApplications(dummyData);

        setStats({
          total: dummyData.length,
          interview: dummyData.filter(a => a.status === 'Interview').length,
          accepted: dummyData.filter(a => a.status === 'Accepted').length,
          rejected: dummyData.filter(a => a.status === 'Rejected').length,
        });

        processMonthlyActivity(dummyData);

      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processMonthlyActivity = (apps: Application[]) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const today = new Date();
    const last6MonthsLabels = [];
    const activityCounts = new Array(6).fill(0);

    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      last6MonthsLabels.push(months[d.getMonth()]);
    }
    setMonthLabels(last6MonthsLabels);

    apps.forEach(app => {
      const appDate = new Date(app.applied_at);
      const diffMonth = (today.getFullYear() - appDate.getFullYear()) * 12 + (today.getMonth() - appDate.getMonth());
      if (diffMonth >= 0 && diffMonth < 6) {
        activityCounts[5 - diffMonth] += 1; 
      }
    });
    setMonthlyActivity(activityCounts);
  };

  // --- 2. CONFIG CHART ---
  
  // (UBAH DARI DONUT KE LINE CHART DATA)
  const lineStatusData = {
    labels: ["Menunggu", "Interview", "Diterima", "Ditolak"],
    datasets: [
      {
        label: "Jumlah Lamaran",
        data: [
          applications.length - (stats.interview + stats.accepted + stats.rejected), 
          stats.interview, 
          stats.accepted, 
          stats.rejected
        ],
        // Styling Garis
        borderColor: "#F59E0B", // Amber-500 (Warna Garis Utama)
        backgroundColor: "rgba(245, 158, 11, 0.1)", // Amber Fill Transparan
        borderWidth: 2,
        tension: 0.4, // Membuat garis melengkung halus
        fill: true, // Mengisi area di bawah garis
        // Styling Titik
        pointBackgroundColor: [
          "#FCD34D", // Kuning (Menunggu)
          "#F59E0B", // Amber (Interview)
          "#10B981", // Hijau (Diterima)
          "#78350F", // Coklat/Merah Tua (Ditolak)
        ],
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const lineStatusOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // Hide legend karena label sumbu X sudah jelas
      tooltip: {
        callbacks: {
           label: function(context: any) {
              return ` ${context.raw} Lamaran`;
           }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#f3f4f6" },
        ticks: { stepSize: 1 }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  const barData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Lamaran Terkirim",
        data: monthlyActivity,
        backgroundColor: "#FBBF24", // Amber-400
        borderRadius: 4,
        barThickness: 24,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: "#f3f4f6" }, ticks: { stepSize: 1 } },
      x: { grid: { display: false } },
    },
  };

  // Helpers
  const formatRupiah = (num: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
  const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : "CO";
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Interview": return <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-amber-200"><Calendar size={12}/> Interview</span>;
      case "Accepted": return <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-emerald-200"><CheckCircle size={12}/> Diterima</span>;
      case "Rejected": return <span className="flex items-center gap-1 bg-red-50 text-red-600 px-2.5 py-0.5 rounded-full text-xs font-bold border border-red-100"><XCircle size={12}/> Ditolak</span>;
      default: return <span className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-xs font-bold border border-gray-200"><Clock size={12}/> Terkirim</span>;
    }
  };

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-amber-500" /></div>;

  return (
    <div className="space-y-6">
      
      {/* --- ROW 1: KARTU RINGKASAN --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-amber-400 to-amber-500 p-4 rounded-xl text-white shadow-lg shadow-amber-200">
           <p className="text-amber-100 text-xs font-bold uppercase">Total Melamar</p>
           <h3 className="text-3xl font-bold mt-1">{stats.total}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
           <p className="text-gray-400 text-xs font-bold uppercase">Panggilan Interview</p>
           <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.interview}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
           <p className="text-gray-400 text-xs font-bold uppercase">Menunggu Respon</p>
           <h3 className="text-3xl font-bold text-gray-800 mt-1">{applications.length - (stats.interview + stats.accepted + stats.rejected)}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
           <p className="text-gray-400 text-xs font-bold uppercase">Ditolak</p>
           <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.rejected}</h3>
        </div>
      </div>

      {/* --- ROW 2: GRAFIK STATISTIK --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart Status (LINE CHART) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-80 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Status Lamaran Saya</h3>
          <div className="flex-1 relative w-full min-h-0">
             {applications.length > 0 ? (
                // GANTI DARI DOUGHNUT KE LINE
                <Line data={lineStatusData} options={lineStatusOptions} />
             ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">Belum ada data</div>
             )}
          </div>
        </div>

        {/* Chart Aktivitas (BAR CHART) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-80 flex flex-col">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold text-gray-800">Keaktifan Melamar</h3>
             <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">6 Bulan Terakhir</span>
          </div>
          <div className="flex-1 w-full min-h-0">
             <Bar data={barData} options={barOptions} />
          </div>
        </div>

      </div>

      {/* --- ROW 3: TABEL RIWAYAT LAMARAN --- */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Riwayat Lamaran Terbaru</h3>
          <button className="text-sm font-medium text-amber-600 hover:underline flex items-center gap-1">
              Lihat Semua <ArrowRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-amber-50/50 text-gray-500 text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">Posisi & Perusahaan</th>
                <th className="px-6 py-4">Tipe</th>
                <th className="px-6 py-4">Gaji</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {applications.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">Belum ada riwayat lamaran.</td></tr>
              ) : (
                applications.slice(0, 5).map((app) => (
                  <tr key={app.id} className="hover:bg-amber-50/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center p-1 overflow-hidden">
                           {app.jobs.companies.logo_url ? (
                             <Image width={32} height={32} src={app.jobs.companies.logo_url} alt="Logo" className="object-contain" />
                           ) : (
                             <span className="text-xs font-bold text-gray-400">{getInitials(app.jobs.companies.company_name)}</span>
                           )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{app.jobs.title}</p>
                            <p className="text-xs text-gray-500">{app.jobs.companies.company_name}</p>
                          </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                      <Briefcase size={14} className="text-gray-400"/> {app.jobs.type}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {formatRupiah(app.jobs.salary_min)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-amber-600 transition p-2 hover:bg-amber-50 rounded-lg">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}