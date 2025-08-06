import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trophy, Crown, Medal, Gem, Award, Star, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const tierData = [
  { name: "Bronze", range: "0 - 499 poin", color: "bg-amber-600", icon: Tag },
  { name: "Silver", range: "500 - 999 poin", color: "bg-slate-400", icon: Medal },
  { name: "Gold", range: "1000 - 1499 poin", color: "bg-yellow-500", icon: Medal },
  { name: "Platinum", range: "1500 - 1999 poin", color: "bg-blue-500", icon: Trophy },
  { name: "Diamond", range: "2000 - 2499 poin", color: "bg-indigo-500", icon: Gem },
  { name: "Master", range: "2500 - 2999 poin", color: "bg-purple-500", icon: Crown },
  { name: "Legend", range: "3000+ poin", color: "bg-red-500", icon: Star },
];

export default function Ranking() {
  const [pointAdjustment, setPointAdjustment] = useState({
    playerId: "",
    points: "",
  });
  const { toast } = useToast();

  const { data: activeSeason, isLoading: seasonLoading } = useQuery({
    queryKey: ["/api/seasons/active"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const adjustPointsMutation = useMutation({
    mutationFn: async (data: { playerId: string; points: number }) => {
      const player = await fetch(`/api/players/${data.playerId}`).then(res => res.json());
      if (!player) throw new Error("Player not found");
      
      return apiRequest("PUT", `/api/players/${data.playerId}`, {
        rankedPoints: (player.rankedPoints || 0) + data.points,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      toast({
        title: "Poin berhasil disesuaikan",
        description: "Poin ranking pemain telah diperbarui.",
      });
      setPointAdjustment({ playerId: "", points: "" });
    },
    onError: () => {
      toast({
        title: "Gagal menyesuaikan poin",
        description: "Terjadi kesalahan saat memproses permintaan.",
        variant: "destructive",
      });
    },
  });

  const handlePointAdjustment = () => {
    if (!pointAdjustment.playerId || !pointAdjustment.points) {
      toast({
        title: "Form tidak lengkap",
        description: "Harap lengkapi Player ID dan jumlah poin.",
        variant: "destructive",
      });
      return;
    }

    adjustPointsMutation.mutate({
      playerId: pointAdjustment.playerId,
      points: parseInt(pointAdjustment.points),
    });
  };

  // Mock distribution data
  const mockDistribution = [
    { tier: "Bronze", count: 6855, percentage: 45 },
    { tier: "Silver", count: 4570, percentage: 30 },
    { tier: "Gold", count: 2285, percentage: 15 },
    { tier: "Platinum", count: 914, percentage: 6 },
    { tier: "Diamond", count: 457, percentage: 3 },
    { tier: "Master", count: 91, percentage: 0.6 },
    { tier: "Legend", count: 62, percentage: 0.4 },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Tier Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Konfigurasi Tier</h3>
          
          <div className="space-y-4">
            {tierData.map((tier) => {
              const Icon = tier.icon;
              return (
                <div key={tier.name} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon className="w-5 h-5" style={{ color: tier.color.replace('bg-', '').replace('-500', '') === 'slate' ? '#64748b' : undefined }} />
                      <span className="font-medium text-slate-900">{tier.name}</span>
                    </div>
                    <span className="text-sm text-slate-600">{tier.range}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className={`${tier.color} h-2 rounded-full`} style={{ width: "100%" }}></div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
            Edit Konfigurasi Tier
          </Button>
        </div>

        {/* Season Management */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Manajemen Season</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-blue-900">Season Saat Ini</span>
                <Badge className="bg-blue-100 text-blue-800">Aktif</Badge>
              </div>
              <p className="text-sm text-blue-700 mb-2">Season 12 - Februari 2024</p>
              <div className="flex items-center justify-between text-sm text-blue-600">
                <span>Berakhir dalam: 15 hari</span>
                <span>{stats?.activePlayers || 0} pemain aktif</span>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Nama Season Baru</Label>
              <Input placeholder="Season 13 - Maret 2024" />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Durasi (hari)</Label>
              <Input type="number" defaultValue="30" />
            </div>
            
            <div className="flex space-x-3">
              <Button className="flex-1 bg-green-600 hover:bg-green-700">
                Reset Season
              </Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                Schedule Season
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Ranking Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Distribusi Ranking</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          {mockDistribution.map((item) => (
            <div key={item.tier} className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-xl font-bold text-slate-900">{item.count.toLocaleString()}</div>
              <div className="text-xs text-slate-600">{item.tier}</div>
              <div className="text-xs text-slate-500">{item.percentage}%</div>
            </div>
          ))}
        </div>

        {/* Point Adjustment */}
        <div className="border-t pt-6">
          <h4 className="text-md font-semibold text-slate-900 mb-3">Penyesuaian Poin Ranking</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Player ID</Label>
              <Input
                placeholder="Masukkan Player ID"
                value={pointAdjustment.playerId}
                onChange={(e) => setPointAdjustment({ ...pointAdjustment, playerId: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Poin</Label>
              <Input
                type="number"
                placeholder="±50"
                value={pointAdjustment.points}
                onChange={(e) => setPointAdjustment({ ...pointAdjustment, points: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={handlePointAdjustment}
                disabled={adjustPointsMutation.isPending}
              >
                Sesuaikan Poin
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
