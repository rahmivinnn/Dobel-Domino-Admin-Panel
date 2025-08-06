import { useQuery } from "@tanstack/react-query";
import StatsCard from "@/components/stats-card";
import { Users, TrendingUp, Gem, Coins } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center p-8">
        <p className="text-slate-600">Tidak dapat memuat data statistik</p>
      </div>
    );
  }

  return (
    <div>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Pemain"
          value={(stats?.totalPlayers || 0).toLocaleString()}
          icon={Users}
          iconBgColor="bg-blue-100"
          trend={{ value: "+12% dari bulan lalu", isPositive: true }}
        />
        <StatsCard
          title="Pemain Aktif Hari Ini"
          value={(stats?.activePlayers || 0).toLocaleString()}
          icon={TrendingUp}
          iconBgColor="bg-green-100"
          trend={{ value: "+8% dari kemarin", isPositive: true }}
        />
        <StatsCard
          title="Total Permata"
          value={`${((stats?.totalGems || 0) / 1000000).toFixed(1)}M`}
          icon={Gem}
          iconBgColor="bg-purple-100"
          subtitle="Premium currency"
        />
        <StatsCard
          title="Total Koin"
          value={`${((stats?.totalCoins || 0) / 1000000).toFixed(1)}M`}
          icon={Coins}
          iconBgColor="bg-amber-100"
          subtitle="Basic currency"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Aktivitas Pemain Mingguan</h3>
          <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
            <p className="text-slate-500">Grafik akan ditampilkan di sini</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Distribusi Ranking</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Bronze</span>
              <span className="text-sm text-slate-600">45%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-amber-600 h-2 rounded-full" style={{ width: "45%" }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Silver</span>
              <span className="text-sm text-slate-600">30%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-slate-400 h-2 rounded-full" style={{ width: "30%" }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Gold</span>
              <span className="text-sm text-slate-600">15%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "15%" }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Platinum+</span>
              <span className="text-sm text-slate-600">10%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: "10%" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Aktivitas Terbaru</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">5 pemain baru mendaftar</p>
              <p className="text-xs text-slate-500">2 menit yang lalu</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">Turnamen Mingguan dimulai</p>
              <p className="text-xs text-slate-500">15 menit yang lalu</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <Coins className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">250,000 koin didistribusikan sebagai reward harian</p>
              <p className="text-xs text-slate-500">1 jam yang lalu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
