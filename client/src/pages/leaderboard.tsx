import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Trophy, Medal, Award, Crown, Star, Gem } from "lucide-react";

export default function Leaderboard() {
  const [filters, setFilters] = useState({
    period: "current_season",
    tier: "",
  });

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["/api/leaderboard", filters],
  });

  const getTierIcon = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case "bronze": return Award;
      case "silver": return Medal;
      case "gold": return Medal;
      case "platinum": return Trophy;
      case "diamond": return Gem;
      case "master": return Crown;
      case "legend": return Star;
      default: return Award;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case "bronze": return "text-amber-600";
      case "silver": return "text-slate-400";
      case "gold": return "text-yellow-500";
      case "platinum": return "text-blue-500";
      case "diamond": return "text-indigo-500";
      case "master": return "text-purple-500";
      case "legend": return "text-red-500";
      default: return "text-slate-400";
    }
  };

  const getBadgeColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case "bronze": return "bg-amber-100 text-amber-800";
      case "silver": return "bg-slate-100 text-slate-800";
      case "gold": return "bg-yellow-100 text-yellow-800";
      case "platinum": return "bg-blue-100 text-blue-800";
      case "diamond": return "bg-indigo-100 text-indigo-800";
      case "master": return "bg-purple-100 text-purple-800";
      case "legend": return "bg-red-100 text-red-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return rank.toString();
    }
  };

  const getRankBgColor = (rank: number) => {
    switch (rank) {
      case 1: return "bg-yellow-500";
      case 2: return "bg-slate-400";
      case 3: return "bg-amber-500";
      default: return "bg-slate-600";
    }
  };

  // Get top 3 players for podium
  const topThree = leaderboard?.slice(0, 3) || [];
  const restOfLeaderboard = leaderboard?.slice(3) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Leaderboard Global</h3>
        <div className="flex space-x-3">
          <Select value={filters.period} onValueChange={(value) => setFilters({ ...filters, period: value })}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current_season">Season Saat Ini</SelectItem>
              <SelectItem value="last_season">Season Lalu</SelectItem>
              <SelectItem value="this_month">Bulan Ini</SelectItem>
              <SelectItem value="this_week">Minggu Ini</SelectItem>
              <SelectItem value="all_time">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.tier} onValueChange={(value) => setFilters({ ...filters, tier: value })}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Semua Tier</SelectItem>
              <SelectItem value="Diamond+">Diamond+</SelectItem>
              <SelectItem value="Platinum+">Platinum+</SelectItem>
              <SelectItem value="Gold+">Gold+</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Top 3 Podium */}
      {topThree.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-slate-900 mb-6 text-center">Top 3 Pemain</h3>
          <div className="flex justify-center items-end space-x-8">
            {/* 2nd Place */}
            {topThree[1] && (
              <div className="text-center">
                <div className="relative mb-3">
                  <div className="w-16 h-16 bg-slate-400 rounded-full mx-auto flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-white text-lg font-bold">
                      {topThree[1].username?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                  </div>
                  <div className="absolute -top-2 -right-2 bg-slate-400 rounded-full h-8 w-8 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                </div>
                <h4 className="font-medium text-slate-900">{topThree[1].username}</h4>
                <p className="text-sm text-slate-500">{(topThree[1].rankedPoints || 0).toLocaleString()} RP</p>
                <div className="mt-2 bg-slate-200 h-16 rounded"></div>
              </div>
            )}
            
            {/* 1st Place */}
            {topThree[0] && (
              <div className="text-center">
                <div className="relative mb-3">
                  <div className="w-20 h-20 bg-yellow-500 rounded-full mx-auto flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-white text-xl font-bold">
                      {topThree[0].username?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                  </div>
                  <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full h-8 w-8 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Crown className="text-yellow-500 w-6 h-6" />
                  </div>
                </div>
                <h4 className="font-medium text-slate-900">{topThree[0].username}</h4>
                <p className="text-sm text-slate-500">{(topThree[0].rankedPoints || 0).toLocaleString()} RP</p>
                <div className="mt-2 bg-yellow-500 h-20 rounded"></div>
              </div>
            )}
            
            {/* 3rd Place */}
            {topThree[2] && (
              <div className="text-center">
                <div className="relative mb-3">
                  <div className="w-16 h-16 bg-amber-500 rounded-full mx-auto flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-white text-lg font-bold">
                      {topThree[2].username?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                  </div>
                  <div className="absolute -top-2 -right-2 bg-amber-500 rounded-full h-8 w-8 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                </div>
                <h4 className="font-medium text-slate-900">{topThree[2].username}</h4>
                <p className="text-sm text-slate-500">{(topThree[2].rankedPoints || 0).toLocaleString()} RP</p>
                <div className="mt-2 bg-amber-500 h-12 rounded"></div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Full Leaderboard Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Pemain</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Menang</TableHead>
              <TableHead>Main</TableHead>
              <TableHead>Win Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard?.map((player: any, index: number) => {
              const rank = index + 1;
              const TierIcon = getTierIcon(player.tier);
              const winRate = player.totalWins && (player.totalWins + player.totalLosses) > 0 
                ? ((player.totalWins / (player.totalWins + player.totalLosses)) * 100).toFixed(1)
                : "0.0";
              
              return (
                <TableRow key={player.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div className="flex items-center">
                      <span className={`w-8 h-8 ${getRankBgColor(rank)} text-white rounded-full flex items-center justify-center text-sm font-bold mr-2`}>
                        {rank <= 3 ? getRankIcon(rank) : rank}
                      </span>
                      {rank <= 3 && <TierIcon className={`w-5 h-5 ${getTierColor(player.tier)}`} />}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {player.username?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{player.username || "Unknown"}</div>
                        <div className="text-sm text-slate-500">Level {player.level || 1}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getBadgeColor(player.tier)}>
                      <TierIcon className="w-3 h-3 mr-1" />
                      {player.tier || "Bronze"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-slate-900">
                    {(player.rankedPoints || 0).toLocaleString()}
                  </TableCell>
                  <TableCell>{(player.totalWins || 0).toLocaleString()}</TableCell>
                  <TableCell>{((player.totalWins || 0) + (player.totalLosses || 0)).toLocaleString()}</TableCell>
                  <TableCell className="text-green-600 font-medium">{winRate}%</TableCell>
                </TableRow>
              );
            })}
            {(!leaderboard || leaderboard.length === 0) && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                  Belum ada data leaderboard
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {leaderboard && leaderboard.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-slate-700">
            Menampilkan <span className="font-medium">1</span> hingga{" "}
            <span className="font-medium">{Math.min(10, leaderboard.length)}</span> dari{" "}
            <span className="font-medium">{leaderboard.length}</span> pemain top
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="bg-blue-600 text-white">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
