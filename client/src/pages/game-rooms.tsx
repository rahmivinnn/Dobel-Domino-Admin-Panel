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
import StatsCard from "@/components/ui/stats-card";
import { Gamepad2, Users, Trophy, Target, Settings, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function GameRooms() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: "",
    type: "training_single",
    description: "",
    minLevel: 1,
    entryFee: 0,
    entryFeeCurrency: "coins",
    maxPlayers: 2,
  });
  
  const { toast } = useToast();

  const { data: rooms, isLoading } = useQuery({
    queryKey: ["/api/game-rooms"],
  });

  const createRoomMutation = useMutation({
    mutationFn: async (roomData: any) => {
      return apiRequest("POST", "/api/game-rooms", roomData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/game-rooms"] });
      toast({
        title: "Room berhasil dibuat",
        description: "Room baru telah ditambahkan ke sistem.",
      });
      setShowCreateForm(false);
      setNewRoom({
        name: "",
        type: "training_single",
        description: "",
        minLevel: 1,
        entryFee: 0,
        entryFeeCurrency: "coins",
        maxPlayers: 2,
      });
    },
  });

  const toggleRoomMutation = useMutation({
    mutationFn: async ({ roomId, isActive }: { roomId: string; isActive: boolean }) => {
      return apiRequest("PATCH", `/api/game-rooms/${roomId}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/game-rooms"] });
      toast({
        title: "Status room diupdate",
        description: "Status room berhasil diubah.",
      });
    },
  });

  const handleCreateRoom = () => {
    createRoomMutation.mutate(newRoom);
  };

  const getRoomTypeLabel = (type: string) => {
    switch (type) {
      case "training_single": return "Training Single";
      case "training_double": return "Training Double";
      case "ranked": return "Ranked Match";
      case "tournament": return "Tournament";
      case "pairing": return "Pairing Service";
      default: return type;
    }
  };

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case "training_single": return "bg-green-100 text-green-800";
      case "training_double": return "bg-blue-100 text-blue-800";
      case "ranked": return "bg-purple-100 text-purple-800";
      case "tournament": return "bg-red-100 text-red-800";
      case "pairing": return "bg-yellow-100 text-yellow-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const totalRooms = rooms?.length || 0;
  const activeRooms = rooms?.filter((room: any) => room.isActive)?.length || 0;
  const trainingRooms = rooms?.filter((room: any) => room.type.includes('training'))?.length || 0;
  const rankedRooms = rooms?.filter((room: any) => room.type === 'ranked')?.length || 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Game Rooms - Dobel Domino</h1>
          <p className="text-slate-600 mt-1">Kelola ruang permainan untuk berbagai mode</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Buat Room Baru
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Rooms"
          value={totalRooms.toString()}
          icon={Gamepad2}
          iconBgColor="bg-blue-100"
        />
        <StatsCard
          title="Room Aktif"
          value={activeRooms.toString()}
          icon={Target}
          iconBgColor="bg-green-100"
        />
        <StatsCard
          title="Training Rooms"
          value={trainingRooms.toString()}
          icon={Users}
          iconBgColor="bg-purple-100"
        />
        <StatsCard
          title="Ranked Rooms"
          value={rankedRooms.toString()}
          icon={Trophy}
          iconBgColor="bg-amber-100"
        />
      </div>

      {/* Create Room Form */}
      {showCreateForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Buat Room Baru</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Nama Room</Label>
              <Input
                placeholder="Masukkan nama room"
                value={newRoom.name}
                onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Tipe Room</Label>
              <Select value={newRoom.type} onValueChange={(value) => setNewRoom({ ...newRoom, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe room" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="training_single">Training Single</SelectItem>
                  <SelectItem value="training_double">Training Double</SelectItem>
                  <SelectItem value="ranked">Ranked Match</SelectItem>
                  <SelectItem value="tournament">Tournament</SelectItem>
                  <SelectItem value="pairing">Pairing Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2">
              <Label className="text-sm font-medium text-slate-700 mb-2">Deskripsi</Label>
              <Input
                placeholder="Deskripsi room"
                value={newRoom.description}
                onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Level Minimum</Label>
              <Input
                type="number"
                placeholder="1"
                value={newRoom.minLevel}
                onChange={(e) => setNewRoom({ ...newRoom, minLevel: parseInt(e.target.value) || 1 })}
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Max Players</Label>
              <Input
                type="number"
                placeholder="2"
                value={newRoom.maxPlayers}
                onChange={(e) => setNewRoom({ ...newRoom, maxPlayers: parseInt(e.target.value) || 2 })}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setShowCreateForm(false)}
            >
              Batal
            </Button>
            <Button 
              onClick={handleCreateRoom}
              disabled={createRoomMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Buat Room
            </Button>
          </div>
        </div>
      )}

      {/* Rooms Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Daftar Game Rooms</h3>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Room</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Min Level</TableHead>
                  <TableHead>Max Players</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms?.map((room: any) => (
                  <TableRow key={room.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-slate-900">{room.name}</div>
                        <div className="text-sm text-slate-500">{room.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoomTypeColor(room.type)}>
                        {getRoomTypeLabel(room.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>Level {room.minLevel}</TableCell>
                    <TableCell>{room.maxPlayers} orang</TableCell>
                    <TableCell>
                      <Badge className={room.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {room.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleRoomMutation.mutate({ 
                            roomId: room.id, 
                            isActive: !room.isActive 
                          })}
                          disabled={toggleRoomMutation.isPending}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}