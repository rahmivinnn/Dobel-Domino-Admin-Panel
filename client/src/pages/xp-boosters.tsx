import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/ui/stats-card";
import { Zap, Clock, DollarSign, User, Calendar, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function XpBoosters() {
  const [selectedPlayer, setSelectedPlayer] = useState("");
  
  const { toast } = useToast();

  const { data: boosters, isLoading } = useQuery({
    queryKey: ["/api/xp-boosters"],
  });

  const { data: players } = useQuery({
    queryKey: ["/api/players"],
  });

  const createBoosterMutation = useMutation({
    mutationFn: async (playerId: string) => {
      return apiRequest("POST", "/api/xp-boosters", {
        playerId,
        multiplier: 2,
        duration: 7,
        price: 10000,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/xp-boosters"] });
      toast({
        title: "XP Booster diberikan",
        description: "XP Booster 7 hari berhasil diberikan kepada player.",
      });
      setSelectedPlayer("");
    },
  });

  const deactivateBoosterMutation = useMutation({
    mutationFn: async (boosterId: string) => {
      return apiRequest("PATCH", `/api/xp-boosters/${boosterId}`, { isActive: false });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/xp-boosters"] });
      toast({
        title: "XP Booster dinonaktifkan",
        description: "XP Booster berhasil dinonaktifkan.",
      });
    },
  });

  const handleGiveBooster = () => {
    if (selectedPlayer) {
      createBoosterMutation.mutate(selectedPlayer);
    }
  };

  const getPlayerName = (playerId: string) => {
    const player = players?.players?.find((p: any) => p.id === playerId);
    return player?.username || playerId;
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const getRemainingDays = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const totalBoosters = boosters?.length || 0;
  const activeBoosters = boosters?.filter((b: any) => b.isActive && !isExpired(b.expiresAt))?.length || 0;
  const expiredBoosters = boosters?.filter((b: any) => isExpired(b.expiresAt))?.length || 0;
  const totalRevenue = boosters?.reduce((sum: number, b: any) => sum + (b.price || 0), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">XP Booster</h1>
        <p className="text-slate-600 mt-1">Bonus XP 2x untuk pemain (Rp 10.000/7 hari)</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Boosters"
          value={totalBoosters.toString()}
          icon={Zap}
          iconBgColor="bg-blue-100"
        />
        <StatsCard
          title="Active Boosters"
          value={activeBoosters.toString()}
          icon={Clock}
          iconBgColor="bg-green-100"
        />
        <StatsCard
          title="Expired"
          value={expiredBoosters.toString()}
          icon={Calendar}
          iconBgColor="bg-red-100"
        />
        <StatsCard
          title="Total Revenue"
          value={`Rp ${totalRevenue.toLocaleString('id-ID')}`}
          icon={DollarSign}
          iconBgColor="bg-purple-100"
        />
      </div>

      {/* XP Booster Info */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Info XP Booster</h3>
            <p className="text-slate-600 mt-1">
              XP jadi 2x lipat untuk training dan ranked. Harga tetap 10 ribu untuk 7 hari.
              Bayar lewat gateway, gak pakai pulsa.
            </p>
            <div className="mt-3 flex items-center space-x-4 text-sm text-slate-500">
              <span>• XP 2x lipat</span>
              <span>• 7 hari</span>
              <span>• Rp 10.000</span>
              <span>• Training & Ranked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Give Booster Form */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Kasih XP Booster</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2">Pilih Player</Label>
            <select
              className="w-full h-10 px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value)}
            >
              <option value="">Pilih player...</option>
              {players?.players?.map((player: any) => (
                <option key={player.id} value={player.id}>
                  {player.username} (Level {player.level})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2">Detail Booster</Label>
            <div className="text-sm text-slate-600 bg-slate-50 rounded-md p-3">
              <div>2x XP Multiplier</div>
              <div>7 hari durasi</div>
              <div>Rp 10.000</div>
            </div>
          </div>
          
          <div>
            <Button 
              onClick={handleGiveBooster}
              disabled={!selectedPlayer || createBoosterMutation.isPending}
              className="bg-yellow-600 hover:bg-yellow-700 w-full"
            >
              <Gift className="w-4 h-4 mr-2" />
              Berikan Booster
            </Button>
          </div>
        </div>
      </div>

      {/* Boosters Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Daftar XP Boosters</h3>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player</TableHead>
                  <TableHead>Multiplier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sisa Hari</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Tanggal Beli</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {boosters?.map((booster: any) => {
                  const remainingDays = getRemainingDays(booster.expiresAt);
                  const expired = isExpired(booster.expiresAt);
                  
                  return (
                    <TableRow key={booster.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="font-medium">{getPlayerName(booster.playerId)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Zap className="w-4 h-4 text-yellow-500" />
                          <span>{booster.multiplier}x</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          expired ? "bg-red-100 text-red-800" :
                          booster.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }>
                          {expired ? "Expired" : booster.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {expired ? (
                            <span className="text-red-600">Expired</span>
                          ) : (
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4 text-blue-500" />
                              <span>{remainingDays} hari</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-green-600">
                          Rp {booster.price?.toLocaleString('id-ID') || 0}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-slate-600">
                          {new Date(booster.purchasedAt).toLocaleDateString('id-ID')}
                        </div>
                      </TableCell>
                      <TableCell>
                        {booster.isActive && !expired && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deactivateBoosterMutation.mutate(booster.id)}
                            disabled={deactivateBoosterMutation.isPending}
                            className="text-red-600 hover:bg-red-50"
                          >
                            Nonaktifkan
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}