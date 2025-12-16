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
  ArcElement,
  PointElement,
  LineElement,
  ChartOptions,
  Filler, // Import Filler untuk area fill di bawah garis
} from "chart.js";
import { Bar, Line } from "react-chartjs-2"; // Ubah Doughnut jadi Line
import { Briefcase, Clock, XCircle, TrendingUp, Calendar, Loader2 } from "lucide-react";

// Registrasi komponen Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler 
);

interface ApplicationData {
  id: number;
  status: string;
  applied_at: string;
  jobs: {
    title: string;
    companies: {
      company_name: string;
    };
  };
}

export default function DashboardComponent() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [statsCount, setStatsCount] = useState({
    total: 0,
    review: 0,
    interview: 0,
    rejected: 0,
  });
  const [weeklyActivity, setWeeklyActivity] = useState<number[]>(new Array(7).fill(0));

  const getDateDaysAgo = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
  };

  useEffect(() => {
    const loadDummyData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const dummyData: ApplicationData[] = [
        {
          id: 1,
          status: "Interview",
          applied_at: getDateDaysAgo(0),
          jobs: { title: "Frontend Developer", companies: { company_name: "Tokopedia" } },
        },
        {
          id: 2,
          status: "Pending",
          applied_at: getDateDaysAgo(0),
          jobs: { title: "React Native Engineer", companies: { company_name: "Gojek" } },
        },
        {
          id: 3,
          status: "Review",
          applied_at: getDateDaysAgo(1),
          jobs: { title: "UI/UX Designer", companies: { company_name: "Traveloka" } },
        },
        {
          id: 4,
          status: "Rejected",
          applied_at: getDateDaysAgo(2),
          jobs: { title: "Backend Golang", companies: { company_name: "Shopee" } },
        },
        {
          id: 5,
          status: "Interview",
          applied_at: getDateDaysAgo(2),
          jobs: { title: "Fullstack Dev", companies: { company_name: "Ruangguru" } },
        },
        {
          id: 6,
          status: "Accepted",
          applied_at: getDateDaysAgo(3),
          jobs: { title: "Software Engineer", companies: { company_name: "Bank Jago" } },
        },
        {
          id: 7,
          status: "Pending",
          applied_at: getDateDaysAgo(4),
          jobs: { title: "Frontend Lead", companies: { company_name: "Blibli" } },
        },
        {
          id: 8,
          status: "Rejected",
          applied_at: getDateDaysAgo(5),
          jobs: { title: "System Analyst", companies: { company_name: "Telkom" } },
        },
        {
          id: 9,
          status: "Rejected",
          applied_at: getDateDaysAgo(10),
          jobs: { title: "Internship IT", companies: { company_name: "Startup Indo" } },
        },
      ];

      setApplications(dummyData);
      processStats(dummyData);
      processWeeklyActivity(dummyData);
      setLoading(false);
    };

    loadDummyData();
  }, []);

  const processStats = (data: ApplicationData[]) => {
    const counts = {
      total: data.length,
      review: data.filter((app) => ["Pending", "Review"].includes(app.status)).length,
      interview: data.filter((app) => app.status === "Interview").length,
      rejected: data.filter((app) => app.status === "Rejected").length,
    };
    setStatsCount(counts);
  };

  const processWeeklyActivity = (data: ApplicationData[]) => {
    const activity = new Array(7).fill(0);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    data.forEach((app) => {
      const date = new Date(app.applied_at);
      if (date >= oneWeekAgo) {
        let dayIndex = date.getDay();
        const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
        if (adjustedIndex >= 0 && adjustedIndex < 7) {
          activity[adjustedIndex] += 1;
        }
      }
    });
    setWeeklyActivity(activity);
  };

  // --- CHART CONFIGURATION: BAR (Activity) ---
  const chartDataBar = {
    labels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
    datasets: [
      {
        label: "Lamaran",
        data: weeklyActivity,
        backgroundColor: "rgba(16, 185, 129, 0.7)",
        borderRadius: 6,
        hoverBackgroundColor: "rgba(16, 185, 129, 1)",
      },
    ],
  };

  const chartOptionsBar: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { 
        beginAtZero: true, 
        ticks: { stepSize: 1 },
        grid: { color: "#f3f4f6" }
      },
      x: { grid: { display: false } },
    },
  };

  // --- CHART CONFIGURATION: LINE (Status) ---
  const chartDataStatus = {
    labels: ["Pending", "Interview", "Diterima", "Ditolak"],
    datasets: [
      {
        label: "Jumlah",
        data: [
          statsCount.review,
          statsCount.interview,
          applications.filter((a) => a.status === "Accepted").length,
          statsCount.rejected,
        ],
        borderColor: "#3b82f6", // Garis Biru
        backgroundColor: "rgba(59, 130, 246, 0.1)", // Area Fill Transparan
        pointBackgroundColor: ["#f59e0b", "#10b981", "#3b82f6", "#ef4444"], // Warna titik sesuai status
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4, // Garis melengkung halus
        fill: true,
      },
    ],
  };

  const chartOptionsStatus: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // Hilangkan legend karena sudah jelas labelnya
      tooltip: {
        backgroundColor: "#1f2937",
        padding: 12,
        titleFont: { size: 13 },
        bodyFont: { size: 13 },
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { color: "#f3f4f6" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  const colorMap = {
    blue: { bg: "bg-blue-50", text: "text-blue-600" },
    amber: { bg: "bg-amber-50", text: "text-amber-600" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600" },
    red: { bg: "bg-red-50", text: "text-red-600" },
  };

  const statsCards = [
    { label: "Total Lamaran", value: statsCount.total, icon: Briefcase, color: "blue", trend: "Semua riwayat" },
    { label: "Proses Review", value: statsCount.review, icon: Clock, color: "amber", trend: "Menunggu HRD" },
    { label: "Interview", value: statsCount.interview, icon: Calendar, color: "emerald", trend: "Cek jadwalmu" },
    { label: "Belum Lolos", value: statsCount.rejected, icon: XCircle, color: "red", trend: "Tetap semangat!" },
  ];

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-3 text-gray-600 font-medium">Memuat data dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => {
            const colors = colorMap[stat.color as keyof typeof colorMap];
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">{stat.label}</p>
                    <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-lg ${colors.bg} ${colors.text}`}>
                    <stat.icon size={20} />
                  </div>
                </div>
                <div className="flex items-center text-xs font-medium text-gray-500">
                  {index === 2 && stat.value > 0 && (
                    <TrendingUp size={14} className="mr-1 text-emerald-500" />
                  )}
                  <span>{stat.trend}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Bar Chart (Activity) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900">Aktivitas 7 Hari Terakhir</h3>
              <p className="text-sm text-gray-500 mt-1">Jumlah lamaran yang kamu kirim</p>
            </div>
            <div className="h-64 w-full">
              <Bar options={chartOptionsBar} data={chartDataBar} />
            </div>
          </div>

          {/* Line Chart (Status) - Diganti dari Doughnut */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Status Lamaran</h3>
            {/* Height disesuaikan agar Line Chart terlihat bagus */}
            <div className="h-48 w-full flex justify-center items-center">
                <Line options={chartOptionsStatus} data={chartDataStatus} />
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              {statsCount.interview > 0 ? (
                <p className="text-sm text-gray-600">
                  Ada <span className="font-bold text-emerald-600">{statsCount.interview} Interview</span> yang perlu kamu persiapkan!
                </p>
              ) : (
                <p className="text-sm text-gray-600">Belum ada jadwal interview saat ini.</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Applications Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Lamaran Terbaru</h3>
            <p className="text-sm text-gray-500 mt-1">5 lamaran terakhir yang kamu kirim</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Posisi
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Perusahaan
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tanggal Lamar
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.length > 0 ? (
                  applications.slice(0, 5).map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">{app.jobs?.title || "Unknown Job"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700">{app.jobs?.companies?.company_name || "Unknown Company"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600 text-sm">
                          {new Date(app.applied_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            app.status === "Interview"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : app.status === "Rejected"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : app.status === "Accepted"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center text-gray-400">
                        <Briefcase size={40} className="mb-2 opacity-50" />
                        <p className="font-medium">Belum ada lamaran yang dikirim</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}