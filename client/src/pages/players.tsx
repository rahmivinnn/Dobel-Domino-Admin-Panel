import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Badge,
} from "@/components/ui/badge";
import { Plus, Search, Edit, Ban, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Players() {
  const [filters, setFilters] = useState({
    search: "",
    tier: "",
    status: "",
  });
  const [page, setPage] = useState(0);
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ["/api/players", filters, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: "10",
        offset: (page * 10).toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.tier && { tier: filters.tier }),
        ...(filters.status && { status: filters.status }),
      });
      const response = await fetch(`/api/players?${params}`);
      return response.json();
    },
  });

  const banPlayerMutation = useMutation({
    mutationFn: async (playerId: string) => {
      return apiRequest("POST", `/api/players/${playerId}/ban`, {
        reason: "Admin action",
        duration: 7,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      toast({
        title: "Pemain berhasil dibanned",
        description: "Aksi telah berhasil dilakukan.",
      });
    },
    onError: () => {
      toast({
        title: "Gagal ban pemain",
        description: "Terjadi kesalahan saat memproses permintaan.",
        variant: "destructive",
      });
    },
  });

  const unbanPlayerMutation = useMutation({
    mutationFn: async (playerId: string) => {
      return apiRequest("POST", `/api/players/${playerId}/unban`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      toast({
        title: "Pemain berhasil di-unban",
        description: "Aksi telah berhasil dilakukan.",
      });
    },
    onError: () => {
      toast({
        title: "Gagal unban pemain",
        description: "Terjadi kesalahan saat memproses permintaan.",
        variant: "destructive",
      });
    },
  });

  const getTierColor = (tier: string) => {
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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active": return "bg-green-100 text-green-800";
      case "banned": return "bg-red-100 text-red-800";
      case "suspended": return "bg-yellow-100 text-yellow-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Manajemen Pemain</h3>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Pemain
          </Button>
        </div>
        
        {/* Search and Filters */}
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Cari pemain..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
          <Select value={filters.tier} onValueChange={(value) => setFilters({ ...filters, tier: value })}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Semua Tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Semua Tier</SelectItem>
              <SelectItem value="Bronze">Bronze</SelectItem>
              <SelectItem value="Silver">Silver</SelectItem>
              <SelectItem value="Gold">Gold</SelectItem>
              <SelectItem value="Platinum">Platinum</SelectItem>
              <SelectItem value="Diamond">Diamond</SelectItem>
              <SelectItem value="Master">Master</SelectItem>
              <SelectItem value="Legend">Legend</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Semua Status</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Players Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pemain</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>XP</TableHead>
              <TableHead>Koin</TableHead>
              <TableHead>Permata</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.players?.map((player: any) => (
              <TableRow key={player.id}>
                <TableCell>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {player.username?.charAt(0)?.toUpperCase() || "?"}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-slate-900">{player.username || "Unknown"}</div>
                      <div className="text-sm text-slate-500">{player.email || "No email"}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{player.level || 1}</TableCell>
                <TableCell>
                  <Badge className={getTierColor(player.tier)}>
                    {player.tier || "Bronze"}
                  </Badge>
                </TableCell>
                <TableCell>{(player.xp || 0).toLocaleString()}</TableCell>
                <TableCell>{(player.coins || 0).toLocaleString()}</TableCell>
                <TableCell>{(player.gems || 0).toLocaleString()}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(player.status)}>
                    {player.status || "active"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    {player.status === "banned" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => unbanPlayerMutation.mutate(player.id)}
                        disabled={unbanPlayerMutation.isPending}
                      >
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => banPlayerMutation.mutate(player.id)}
                        disabled={banPlayerMutation.isPending}
                      >
                        <Ban className="w-4 h-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      <div className="bg-white px-6 py-3 border-t border-slate-200 flex items-center justify-between">
        <div className="text-sm text-slate-700">
          Menampilkan <span className="font-medium">{page * 10 + 1}</span> hingga{" "}
          <span className="font-medium">{Math.min((page + 1) * 10, data?.total || 0)}</span> dari{" "}
          <span className="font-medium">{data?.total || 0}</span> pemain
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={!data?.players || data.players.length < 10}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
