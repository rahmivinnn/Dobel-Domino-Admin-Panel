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
import { Plus, Calendar, Trophy, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Tournaments() {
  const [newTournament, setNewTournament] = useState({
    name: "",
    type: "",
    entryFee: "",
    entryFeeCurrency: "coins",
    maxParticipants: "",
    duration: "",
  });
  const { toast } = useToast();

  const { data: tournaments, isLoading } = useQuery({
    queryKey: ["/api/tournaments"],
    queryFn: async () => {
      const response = await fetch("/api/tournaments");
      return response.json();
    },
  });

  const createTournamentMutation = useMutation({
    mutationFn: async (tournamentData: any) => {
      return apiRequest("POST", "/api/tournaments", {
        ...tournamentData,
        entryFee: parseInt(tournamentData.entryFee) || 0,
        maxParticipants: parseInt(tournamentData.maxParticipants),
        duration: parseInt(tournamentData.duration),
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        prizePool: { total: parseInt(tournamentData.entryFee) * parseInt(tournamentData.maxParticipants) * 0.8 },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      toast({
        title: "Turnamen berhasil dibuat",
        description: "Turnamen baru telah ditambahkan ke sistem.",
      });
      setNewTournament({
        name: "",
        type: "",
        entryFee: "",
        entryFeeCurrency: "coins",
        maxParticipants: "",
        duration: "",
      });
    },
    onError: () => {
      toast({
        title: "Gagal membuat turnamen",
        description: "Terjadi kesalahan saat membuat turnamen.",
        variant: "destructive",
      });
    },
  });

  const handleCreateTournament = () => {
    if (!newTournament.name || !newTournament.type || !newTournament.maxParticipants || !newTournament.duration) {
      toast({
        title: "Form tidak lengkap",
        description: "Harap lengkapi semua field yang diperlukan.",
        variant: "destructive",
      });
      return;
    }

    createTournamentMutation.mutate(newTournament);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active": return "bg-green-100 text-green-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-slate-100 text-slate-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "regular": return "bg-blue-100 text-blue-800";
      case "elite": return "bg-purple-100 text-purple-800";
      case "special": return "bg-green-100 text-green-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  // Mock active tournaments data
  const activeTournaments = [
    {
      name: "Turnamen Mingguan Elite",
      type: "elite",
      status: "active",
      participants: "156/200",
      entryFee: "50 Permata",
      prizePool: "10,000 Permata",
      timeLeft: "2 hari"
    },
    {
      name: "Turnamen Harian Reguler", 
      type: "regular",
      status: "scheduled",
      participants: "89/100",
      entryFee: "1,000 Koin",
      prizePool: "50,000 Koin",
      timeLeft: "6 jam"
    }
  ];

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Active Tournament */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Turnamen Aktif</h3>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Buat Turnamen
            </Button>
          </div>
          
          <div className="space-y-4">
            {activeTournaments.map((tournament, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg ${
                  tournament.status === "active" 
                    ? "border-green-200 bg-green-50" 
                    : "border-blue-200 bg-blue-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-semibold ${
                    tournament.status === "active" ? "text-green-900" : "text-blue-900"
                  }`}>
                    {tournament.name}
                  </h4>
                  <Badge className={getStatusColor(tournament.status)}>
                    {tournament.status === "active" ? "Berlangsung" : "Mendaftar"}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className={tournament.status === "active" ? "text-green-700" : "text-blue-700"}>
                      Peserta:
                    </span>
                    <span className={`font-medium ml-1 ${
                      tournament.status === "active" ? "text-green-900" : "text-blue-900"
                    }`}>
                      {tournament.participants}
                    </span>
                  </div>
                  <div>
                    <span className={tournament.status === "active" ? "text-green-700" : "text-blue-700"}>
                      Entry Fee:
                    </span>
                    <span className={`font-medium ml-1 ${
                      tournament.status === "active" ? "text-green-900" : "text-blue-900"
                    }`}>
                      {tournament.entryFee}
                    </span>
                  </div>
                  <div>
                    <span className={tournament.status === "active" ? "text-green-700" : "text-blue-700"}>
                      Prize Pool:
                    </span>
                    <span className={`font-medium ml-1 ${
                      tournament.status === "active" ? "text-green-900" : "text-blue-900"
                    }`}>
                      {tournament.prizePool}
                    </span>
                  </div>
                  <div>
                    <span className={tournament.status === "active" ? "text-green-700" : "text-blue-700"}>
                      {tournament.status === "active" ? "Berakhir:" : "Mulai:"}
                    </span>
                    <span className={`font-medium ml-1 ${
                      tournament.status === "active" ? "text-green-900" : "text-blue-900"
                    }`}>
                      {tournament.timeLeft}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tournament Creation */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Buat Turnamen Baru</h3>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Nama Turnamen</Label>
              <Input
                placeholder="Contoh: Turnamen Weekend"
                value={newTournament.name}
                onChange={(e) => setNewTournament({ ...newTournament, name: e.target.value })}
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Tipe</Label>
              <Select value={newTournament.type} onValueChange={(value) => setNewTournament({ ...newTournament, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Reguler (Koin)</SelectItem>
                  <SelectItem value="elite">Elite (Permata)</SelectItem>
                  <SelectItem value="special">Special Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Entry Fee</Label>
              <Input
                type="number"
                placeholder="1000"
                value={newTournament.entryFee}
                onChange={(e) => setNewTournament({ ...newTournament, entryFee: e.target.value })}
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Max Peserta</Label>
              <Input
                type="number"
                placeholder="100"
                value={newTournament.maxParticipants}
                onChange={(e) => setNewTournament({ ...newTournament, maxParticipants: e.target.value })}
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Durasi (jam)</Label>
              <Input
                type="number"
                placeholder="24"
                value={newTournament.duration}
                onChange={(e) => setNewTournament({ ...newTournament, duration: e.target.value })}
              />
            </div>
            
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleCreateTournament}
              disabled={createTournamentMutation.isPending}
            >
              <Plus className="w-4 h-4 mr-2" />
              Buat Turnamen
            </Button>
          </div>
        </div>
      </div>

      {/* Tournament History */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Riwayat Turnamen</h3>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Turnamen</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Peserta</TableHead>
                  <TableHead>Prize Pool</TableHead>
                  <TableHead>Juara</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tournaments?.tournaments?.map((tournament: any) => (
                  <TableRow key={tournament.id}>
                    <TableCell className="font-medium">{tournament.name}</TableCell>
                    <TableCell>
                      {new Date(tournament.startTime).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell>{tournament.currentParticipants}/{tournament.maxParticipants}</TableCell>
                    <TableCell>
                      {typeof tournament.prizePool === 'object' 
                        ? tournament.prizePool.total?.toLocaleString() || "0"
                        : tournament.prizePool
                      } {tournament.entryFeeCurrency === "coins" ? "Koin" : "Permata"}
                    </TableCell>
                    <TableCell>{tournament.winner || "-"}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(tournament.status)}>
                        {tournament.status === "completed" ? "Selesai" : 
                         tournament.status === "active" ? "Berlangsung" : 
                         tournament.status === "scheduled" ? "Terjadwal" : "Dibatalkan"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {(!tournaments?.tournaments || tournaments.tournaments.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      Belum ada data turnamen
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
