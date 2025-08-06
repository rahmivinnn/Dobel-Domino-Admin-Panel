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
import {
  Badge,
} from "@/components/ui/badge";
import { Coins, Gem, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Currency() {
  const [coinsForm, setCoinsForm] = useState({
    playerId: "",
    amount: "",
    reason: "",
  });
  const [gemsForm, setGemsForm] = useState({
    playerId: "",
    amount: "",
    reason: "",
  });
  const { toast } = useToast();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["/api/currency/transactions"],
    queryFn: async () => {
      const response = await fetch("/api/currency/transactions?limit=10");
      return response.json();
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const addCurrencyMutation = useMutation({
    mutationFn: async (data: {
      playerId: string;
      type: string;
      amount: number;
      reason: string;
    }) => {
      return apiRequest("POST", "/api/currency/transactions", {
        ...data,
        adminId: "admin", // Mock admin ID
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/currency/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Berhasil mengubah mata uang",
        description: "Transaksi telah berhasil diproses.",
      });
      // Reset forms
      setCoinsForm({ playerId: "", amount: "", reason: "" });
      setGemsForm({ playerId: "", amount: "", reason: "" });
    },
    onError: () => {
      toast({
        title: "Gagal mengubah mata uang",
        description: "Terjadi kesalahan saat memproses transaksi.",
        variant: "destructive",
      });
    },
  });

  const handleAddCoins = (isPositive: boolean) => {
    if (!coinsForm.playerId || !coinsForm.amount || !coinsForm.reason) {
      toast({
        title: "Form tidak lengkap",
        description: "Harap lengkapi semua field yang diperlukan.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseInt(coinsForm.amount) * (isPositive ? 1 : -1);
    addCurrencyMutation.mutate({
      playerId: coinsForm.playerId,
      type: "coins",
      amount,
      reason: coinsForm.reason,
    });
  };

  const handleAddGems = (isPositive: boolean) => {
    if (!gemsForm.playerId || !gemsForm.amount || !gemsForm.reason) {
      toast({
        title: "Form tidak lengkap",
        description: "Harap lengkapi semua field yang diperlukan.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseInt(gemsForm.amount) * (isPositive ? 1 : -1);
    addCurrencyMutation.mutate({
      playerId: gemsForm.playerId,
      type: "gems",
      amount,
      reason: gemsForm.reason,
    });
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Koin Management */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Manajemen Koin</h3>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Coins className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Player ID</Label>
              <Input
                placeholder="Masukkan Player ID"
                value={coinsForm.playerId}
                onChange={(e) => setCoinsForm({ ...coinsForm, playerId: e.target.value })}
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Jumlah Koin</Label>
              <Input
                type="number"
                placeholder="0"
                value={coinsForm.amount}
                onChange={(e) => setCoinsForm({ ...coinsForm, amount: e.target.value })}
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Alasan</Label>
              <Select value={coinsForm.reason} onValueChange={(value) => setCoinsForm({ ...coinsForm, reason: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih alasan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bonus Event">Bonus Event</SelectItem>
                  <SelectItem value="Kompensasi Bug">Kompensasi Bug</SelectItem>
                  <SelectItem value="Reward Khusus">Reward Khusus</SelectItem>
                  <SelectItem value="Lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => handleAddCoins(true)}
                disabled={addCurrencyMutation.isPending}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Koin
              </Button>
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={() => handleAddCoins(false)}
                disabled={addCurrencyMutation.isPending}
              >
                <Minus className="w-4 h-4 mr-2" />
                Kurangi Koin
              </Button>
            </div>
          </div>
        </div>

        {/* Permata Management */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Manajemen Permata</h3>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Gem className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Player ID</Label>
              <Input
                placeholder="Masukkan Player ID"
                value={gemsForm.playerId}
                onChange={(e) => setGemsForm({ ...gemsForm, playerId: e.target.value })}
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Jumlah Permata</Label>
              <Input
                type="number"
                placeholder="0"
                value={gemsForm.amount}
                onChange={(e) => setGemsForm({ ...gemsForm, amount: e.target.value })}
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Alasan</Label>
              <Select value={gemsForm.reason} onValueChange={(value) => setGemsForm({ ...gemsForm, reason: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih alasan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Top Up Bonus">Top Up Bonus</SelectItem>
                  <SelectItem value="Tournament Reward">Tournament Reward</SelectItem>
                  <SelectItem value="Special Event">Special Event</SelectItem>
                  <SelectItem value="Compensation">Compensation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => handleAddGems(true)}
                disabled={addCurrencyMutation.isPending}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Permata
              </Button>
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={() => handleAddGems(false)}
                disabled={addCurrencyMutation.isPending}
              >
                <Minus className="w-4 h-4 mr-2" />
                Kurangi Permata
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Currency Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Statistik Mata Uang</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <div className="text-2xl font-bold text-amber-600">
              {((stats?.totalCoins || 0) / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-slate-600">Total Koin Beredar</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {((stats?.totalGems || 0) / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-slate-600">Total Permata Beredar</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">1:250</div>
            <div className="text-sm text-slate-600">Rasio Permata:Koin</div>
          </div>
        </div>

        {/* Transaction History */}
        <h4 className="text-md font-semibold text-slate-900 mb-3">Riwayat Transaksi Terbaru</h4>
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
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Alasan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions?.transactions?.map((transaction: any) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {new Date(transaction.createdAt).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell>{transaction.playerId}</TableCell>
                    <TableCell>
                      <Badge className={transaction.type === "coins" ? "bg-amber-100 text-amber-800" : "bg-purple-100 text-purple-800"}>
                        {transaction.type === "coins" ? "Koin" : "Permata"}
                      </Badge>
                    </TableCell>
                    <TableCell className={transaction.amount > 0 ? "text-green-600" : "text-red-600"}>
                      {transaction.amount > 0 ? "+" : ""}{transaction.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-slate-600">{transaction.reason}</TableCell>
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
