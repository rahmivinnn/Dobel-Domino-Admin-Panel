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
import { Plus, Edit, Trash2, Gift, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Rewards() {
  const [newEvent, setNewEvent] = useState({
    name: "",
    type: "",
    multiplier: "1",
    description: "",
    startTime: "",
    endTime: "",
  });
  const { toast } = useToast();

  const { data: dailyRewards, isLoading: dailyLoading } = useQuery({
    queryKey: ["/api/rewards/daily"],
  });

  const { data: levelRewards, isLoading: levelLoading } = useQuery({
    queryKey: ["/api/rewards/level"],
  });

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["/api/events"],
  });

  const createEventMutation = useMutation({
    mutationFn: async (eventData: any) => {
      return apiRequest("POST", "/api/events", {
        ...eventData,
        multiplier: parseInt(eventData.multiplier) || 1,
        startTime: new Date(eventData.startTime),
        endTime: new Date(eventData.endTime),
        isActive: new Date(eventData.startTime) <= new Date() && new Date() <= new Date(eventData.endTime),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "Event berhasil dibuat",
        description: "Event baru telah ditambahkan ke sistem.",
      });
      setNewEvent({
        name: "",
        type: "",
        multiplier: "1",
        description: "",
        startTime: "",
        endTime: "",
      });
    },
    onError: () => {
      toast({
        title: "Gagal membuat event",
        description: "Terjadi kesalahan saat membuat event.",
        variant: "destructive",
      });
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return apiRequest("PUT", `/api/events/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "Event berhasil diperbarui",
        description: "Status event telah diubah.",
      });
    },
  });

  const handleCreateEvent = () => {
    if (!newEvent.name || !newEvent.type || !newEvent.startTime || !newEvent.endTime) {
      toast({
        title: "Form tidak lengkap",
        description: "Harap lengkapi semua field yang diperlukan.",
        variant: "destructive",
      });
      return;
    }

    createEventMutation.mutate(newEvent);
  };

  const getEventTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "multiplier_xp": return "bg-blue-100 text-blue-800";
      case "bonus_coins": return "bg-amber-100 text-amber-800";
      case "free_gems": return "bg-purple-100 text-purple-800";
      case "special_reward": return "bg-green-100 text-green-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const formatEventType = (type: string) => {
    switch (type?.toLowerCase()) {
      case "multiplier_xp": return "Double XP";
      case "bonus_coins": return "Bonus Koin";
      case "free_gems": return "Free Permata";
      case "special_reward": return "Special Reward";
      default: return type;
    }
  };

  if (dailyLoading || levelLoading || eventsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Daily Rewards */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Reward Harian</h3>
          
          <div className="space-y-3">
            {dailyRewards?.map((reward: any, index: number) => (
              <div
                key={reward.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  reward.day === 7 ? "bg-green-50 border border-green-200" : "bg-slate-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                    reward.day === 7 ? "bg-green-500" : "bg-blue-500"
                  }`}>
                    {reward.day}
                  </div>
                  <span className="text-sm font-medium">Hari ke-{reward.day}</span>
                </div>
                <div className="text-sm">
                  {reward.coinReward > 0 && (
                    <span className="text-slate-600">{reward.coinReward} Koin</span>
                  )}
                  {reward.gemReward > 0 && (
                    <span className={`font-medium ${reward.day === 7 ? "text-green-600" : "text-slate-600"}`}>
                      {reward.coinReward > 0 ? " + " : ""}{reward.gemReward} Permata
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
            Edit Reward Harian
          </Button>
        </div>

        {/* Level Rewards */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Reward Level</h3>
          
          <div className="space-y-3">
            {levelRewards?.slice(0, 4).map((reward: any) => (
              <div
                key={reward.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  reward.gemReward > 0 ? "bg-purple-50 border border-purple-200" : "bg-slate-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                    reward.gemReward > 0 ? "bg-purple-500" : "bg-amber-500"
                  }`}>
                    {reward.level}
                  </div>
                  <span className="text-sm font-medium">Level {reward.level}</span>
                </div>
                <div className="text-sm">
                  <span className="text-slate-600">
                    {reward.coinReward} Koin
                    {reward.gemReward > 0 && ` + ${reward.gemReward} Permata`}
                    {reward.itemUnlock && ` + ${reward.itemUnlock}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
            Edit Reward Level
          </Button>
        </div>
      </div>

      {/* Special Events */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Event Khusus</h3>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Buat Event
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {events?.events?.slice(0, 2).map((event: any) => {
            const isActive = event.isActive;
            const startDate = new Date(event.startTime);
            const endDate = new Date(event.endTime);
            const now = new Date();
            
            return (
              <div
                key={event.id}
                className={`p-4 border rounded-lg ${
                  isActive ? "border-green-200 bg-green-50" : "border-blue-200 bg-blue-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-semibold ${isActive ? "text-green-900" : "text-blue-900"}`}>
                    {event.name}
                  </h4>
                  <Badge className={isActive ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                    {isActive ? "Aktif" : "Terjadwal"}
                  </Badge>
                </div>
                <p className={`text-sm mb-3 ${isActive ? "text-green-700" : "text-blue-700"}`}>
                  {event.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className={isActive ? "text-green-600" : "text-blue-600"}>
                    {isActive ? "Berakhir dalam:" : "Dimulai dalam:"}
                  </span>
                  <span className={`font-medium ${isActive ? "text-green-800" : "text-blue-800"}`}>
                    {isActive ? "1 hari 14 jam" : "3 hari"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Event Creation Form */}
        <div className="border-t pt-6">
          <h4 className="text-md font-semibold text-slate-900 mb-3">Buat Event Baru</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Nama Event</Label>
              <Input
                placeholder="Contoh: Triple Coin Day"
                value={newEvent.name}
                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Tipe Event</Label>
              <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiplier_xp">Multiplier XP</SelectItem>
                  <SelectItem value="bonus_coins">Bonus Koin</SelectItem>
                  <SelectItem value="free_gems">Free Permata</SelectItem>
                  <SelectItem value="special_reward">Special Reward</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Multiplier</Label>
              <Input
                type="number"
                placeholder="2"
                value={newEvent.multiplier}
                onChange={(e) => setNewEvent({ ...newEvent, multiplier: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Deskripsi</Label>
              <Input
                placeholder="Deskripsi event"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Waktu Mulai</Label>
              <Input
                type="datetime-local"
                value={newEvent.startTime}
                onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Waktu Berakhir</Label>
              <Input
                type="datetime-local"
                value={newEvent.endTime}
                onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
              />
            </div>
          </div>
          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={handleCreateEvent}
            disabled={createEventMutation.isPending}
          >
            <Plus className="w-4 h-4 mr-2" />
            Buat Event
          </Button>
        </div>

        {/* Events Table */}
        <div className="border-t pt-6">
          <h4 className="text-md font-semibold text-slate-900 mb-3">Semua Event</h4>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Event</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Multiplier</TableHead>
                  <TableHead>Waktu Mulai</TableHead>
                  <TableHead>Waktu Berakhir</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events?.events?.map((event: any) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.name}</TableCell>
                    <TableCell>
                      <Badge className={getEventTypeColor(event.type)}>
                        {formatEventType(event.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>{event.multiplier}x</TableCell>
                    <TableCell>
                      {new Date(event.startTime).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell>
                      {new Date(event.endTime).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell>
                      <Badge className={event.isActive ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-800"}>
                        {event.isActive ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateEventMutation.mutate({ id: event.id, isActive: !event.isActive })}
                          disabled={updateEventMutation.isPending}
                        >
                          {event.isActive ? "Nonaktifkan" : "Aktifkan"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {(!events?.events || events.events.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      Belum ada event yang dibuat
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
