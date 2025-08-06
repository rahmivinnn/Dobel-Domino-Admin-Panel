import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { ShieldCheck, AlertTriangle, Ban, Clock, Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Monitoring() {
  const [quickAction, setQuickAction] = useState({
    playerId: "",
    reason: "",
    duration: "1",
  });
  const [filters, setFilters] = useState({
    riskLevel: "",
    status: "",
  });
  const { toast } = useToast();

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: logs, isLoading } = useQuery({
    queryKey: ["/api/anticheat/logs", filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: "20",
        ...(filters.riskLevel && filters.riskLevel !== "all" && { riskLevel: filters.riskLevel }),
        ...(filters.status && filters.status !== "all" && { status: filters.status }),
      });
      const response = await fetch(`/api/anticheat/logs?${params}`);
      return response.json();
    },
  });

  const banPlayerMutation = useMutation({
    mutationFn: async (data: { playerId: string; reason: string; duration: number }) => {
      return apiRequest("POST", `/api/players/${data.playerId}/ban`, {
        reason: data.reason,
        duration: data.duration,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/anticheat/logs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      toast({
        title: "Pemain berhasil dibanned",
        description: "Tindakan anti-cheat telah dijalankan.",
      });
      setQuickAction({ playerId: "", reason: "", duration: "1" });
    },
    onError: () => {
      toast({
        title: "Gagal ban pemain",
        description: "Terjadi kesalahan saat memproses tindakan.",
        variant: "destructive",
      });
    },
  });

  const updateLogMutation = useMutation({
    mutationFn: async ({ id, status, action }: { id: string; status: string; action?: string }) => {
      return apiRequest("PUT", `/api/anticheat/logs/${id}`, { status, action });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/anticheat/logs"] });
      toast({
        title: "Log berhasil diperbarui",
        description: "Status deteksi telah diubah.",
      });
    },
  });

  const handleBanPlayer = () => {
    if (!quickAction.playerId || !quickAction.reason) {
      toast({
        title: "Form tidak lengkap",
        description: "Harap lengkapi Player ID dan alasan.",
        variant: "destructive",
      });
      return;
    }

    banPlayerMutation.mutate({
      playerId: quickAction.playerId,
      reason: quickAction.reason,
      duration: parseInt(quickAction.duration),
    });
  };

  const handleWarningPlayer = () => {
    if (!quickAction.playerId || !quickAction.reason) {
      toast({
        title: "Form tidak lengkap",
        description: "Harap lengkapi Player ID dan alasan.",
        variant: "destructive",
      });
      return;
    }

    // Create anti-cheat log for warning
    apiRequest("POST", "/api/anticheat/logs", {
      playerId: quickAction.playerId,
      detectionType: "manual_review",
      riskLevel: "low",
      status: "resolved",
      action: "warning",
      details: { reason: quickAction.reason, adminAction: true },
    }).then(() => {
      queryClient.invalidateQueries({ queryKey: ["/api/anticheat/logs"] });
      toast({
        title: "Warning berhasil dikirim",
        description: "Peringatan telah diberikan kepada pemain.",
      });
      setQuickAction({ playerId: "", reason: "", duration: "1" });
    });
  };

  const getRiskLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-orange-100 text-orange-800";
      case "low": return "bg-yellow-100 text-yellow-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "under_review": return "bg-yellow-100 text-yellow-800";
      case "resolved": return "bg-green-100 text-green-800";
      case "ignored": return "bg-slate-100 text-slate-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const formatDetectionType = (type: string) => {
    switch (type?.toLowerCase()) {
      case "afk": return "AFK Detection";
      case "suspicious_pattern": return "Suspicious Pattern";
      case "team_abuse": return "Team Abuse";
      case "manual_review": return "Manual Review";
      default: return type;
    }
  };

  const formatStatus = (status: string) => {
    switch (status?.toLowerCase()) {
      case "under_review": return "Under Review";
      case "resolved": return "Resolved";
      case "ignored": return "Ignored";
      default: return status;
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Anti-Cheat Statistics */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Statistik Anti-Cheat</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {stats?.cleanGamesPercentage || "99.2"}%
              </div>
              <div className="text-sm text-slate-600">Clean Games</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {stats?.todayDetections || "24"}
              </div>
              <div className="text-sm text-slate-600">Deteksi Hari Ini</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {stats?.totalBanned || "7"}
              </div>
              <div className="text-sm text-slate-600">Banned Hari Ini</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {logs?.total || "156"}
              </div>
              <div className="text-sm text-slate-600">Under Review</div>
            </div>
          </div>
          
          {/* Detection Types */}
          <h4 className="text-md font-semibold text-slate-900 mb-3">Jenis Deteksi</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium">AFK Detection</span>
              </div>
              <span className="text-sm text-slate-600">45% dari total deteksi</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm font-medium">Suspicious Pattern</span>
              </div>
              <span className="text-sm text-slate-600">32% dari total deteksi</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium">Team Abuse</span>
              </div>
              <span className="text-sm text-slate-600">23% dari total deteksi</span>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Aksi Cepat</h3>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Player ID</Label>
              <Input
                placeholder="Masukkan Player ID"
                value={quickAction.playerId}
                onChange={(e) => setQuickAction({ ...quickAction, playerId: e.target.value })}
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Alasan</Label>
              <Select value={quickAction.reason} onValueChange={(value) => setQuickAction({ ...quickAction, reason: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih alasan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cheating">Cheating</SelectItem>
                  <SelectItem value="AFK Abuse">AFK Abuse</SelectItem>
                  <SelectItem value="Team Abuse">Team Abuse</SelectItem>
                  <SelectItem value="Inappropriate Behavior">Inappropriate Behavior</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Durasi Ban (hari)</Label>
              <Input
                type="number"
                placeholder="1"
                value={quickAction.duration}
                onChange={(e) => setQuickAction({ ...quickAction, duration: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Button
                className="w-full bg-yellow-600 hover:bg-yellow-700"
                onClick={handleWarningPlayer}
                disabled={banPlayerMutation.isPending}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Warning
              </Button>
              <Button
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={handleBanPlayer}
                disabled={banPlayerMutation.isPending}
              >
                <Ban className="w-4 h-4 mr-2" />
                Ban Player
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Detections */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Deteksi Terbaru</h3>
          <div className="flex space-x-3">
            <Select value={filters.riskLevel} onValueChange={(value) => setFilters({ ...filters, riskLevel: value })}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Semua Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Deteksi</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="ignored">Ignored</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Export Log
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs?.logs?.map((log: any) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {new Date(log.createdAt).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell className="font-medium">{log.playerId}</TableCell>
                    <TableCell>{formatDetectionType(log.detectionType)}</TableCell>
                    <TableCell>
                      <Badge className={getRiskLevelColor(log.riskLevel)}>
                        {log.riskLevel?.charAt(0)?.toUpperCase() + log.riskLevel?.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(log.status)}>
                        {formatStatus(log.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {log.status === "under_review" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateLogMutation.mutate({ id: log.id, status: "resolved", action: "reviewed" })}
                              disabled={updateLogMutation.isPending}
                            >
                              <Eye className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateLogMutation.mutate({ id: log.id, status: "resolved", action: "banned" })}
                              disabled={updateLogMutation.isPending}
                            >
                              <Ban className="w-4 h-4 text-red-600" />
                            </Button>
                          </>
                        )}
                        {log.status === "resolved" && (
                          <span className="text-slate-400 text-sm">
                            {log.action === "banned" ? "Banned" : "Reviewed"}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {(!logs?.logs || logs.logs.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      Belum ada deteksi anti-cheat
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
