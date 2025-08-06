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
import { CreditCard, CheckCircle, XCircle, Clock, Gem, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PaymentGateway() {
  const [filters, setFilters] = useState({
    status: "all",
    paymentMethod: "all",
  });
  
  const { toast } = useToast();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["/api/payment-transactions", filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: "50",
        ...(filters.status && filters.status !== "all" && { status: filters.status }),
        ...(filters.paymentMethod && filters.paymentMethod !== "all" && { paymentMethod: filters.paymentMethod }),
      });
      const response = await fetch(`/api/payment-transactions?${params}`);
      return response.json();
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/payment-stats"],
  });

  const approvePaymentMutation = useMutation({
    mutationFn: async (transactionId: string) => {
      return apiRequest("POST", `/api/payment-transactions/${transactionId}/approve`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/payment-stats"] });
      toast({
        title: "Pembayaran disetujui",
        description: "Transaksi berhasil disetujui dan permata telah ditambahkan.",
      });
    },
  });

  const rejectPaymentMutation = useMutation({
    mutationFn: async ({ transactionId, reason }: { transactionId: string; reason: string }) => {
      return apiRequest("POST", `/api/payment-transactions/${transactionId}/reject`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-transactions"] });
      toast({
        title: "Pembayaran ditolak",
        description: "Transaksi telah ditolak dan status diupdate.",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle;
      case "pending": return Clock;
      case "failed": return XCircle;
      case "cancelled": return XCircle;
      default: return Clock;
    }
  };

  const totalTransactions = transactions?.transactions?.length || 0;
  const pendingTransactions = transactions?.transactions?.filter((t: any) => t.status === 'pending')?.length || 0;
  const completedTransactions = transactions?.transactions?.filter((t: any) => t.status === 'completed')?.length || 0;
  const totalRevenue = transactions?.transactions
    ?.filter((t: any) => t.status === 'completed')
    ?.reduce((sum: number, t: any) => sum + (t.amount || 0), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pembayaran</h1>
        <p className="text-slate-600 mt-1">Transaksi dan top up permata pemain</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Transaksi"
          value={totalTransactions.toString()}
          icon={CreditCard}
          iconBgColor="bg-blue-100"
        />
        <StatsCard
          title="Menunggu Persetujuan"
          value={pendingTransactions.toString()}
          icon={Clock}
          iconBgColor="bg-yellow-100"
        />
        <StatsCard
          title="Transaksi Selesai"
          value={completedTransactions.toString()}
          icon={CheckCircle}
          iconBgColor="bg-green-100"
        />
        <StatsCard
          title="Total Revenue"
          value={`Rp ${totalRevenue.toLocaleString('id-ID')}`}
          icon={DollarSign}
          iconBgColor="bg-purple-100"
        />
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Info Pembayaran</h3>
            <p className="text-slate-600 mt-1">
              Transaksi khusus untuk top up permata dan XP booster. Harga XP booster tetap Rp 10.000 untuk 7 hari.
              Semua pembayaran tercatat otomatis untuk laporan.
            </p>
            <div className="mt-3 flex items-center space-x-4 text-sm text-slate-500">
              <span>• Gateway aktif</span>
              <span>• Laporan otomatis</span>
              <span>• XP Booster: 10rb/7 hari</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2">Status</Label>
            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2">Payment Method</Label>
            <Select value={filters.paymentMethod} onValueChange={(value) => setFilters({ ...filters, paymentMethod: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Method</SelectItem>
                <SelectItem value="payment_gateway">Payment Gateway</SelectItem>
                <SelectItem value="manual_topup">Manual Top Up</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Riwayat Transaksi</h3>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Permata</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions?.transactions?.map((transaction: any) => {
                  const StatusIcon = getStatusIcon(transaction.status);
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="font-mono text-sm">{transaction.transactionId}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{transaction.playerId}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-green-600">
                          Rp {transaction.amount?.toLocaleString('id-ID') || 0}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Gem className="w-4 h-4 text-purple-500" />
                          <span>{transaction.gemsReceived || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-600">{transaction.paymentMethod}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(transaction.status)}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-slate-600">
                          {new Date(transaction.createdAt).toLocaleDateString('id-ID')}
                        </div>
                      </TableCell>
                      <TableCell>
                        {transaction.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => approvePaymentMutation.mutate(transaction.id)}
                              disabled={approvePaymentMutation.isPending}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Setuju
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => rejectPaymentMutation.mutate({ 
                                transactionId: transaction.id, 
                                reason: "Manual rejection by admin" 
                              })}
                              disabled={rejectPaymentMutation.isPending}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Tolak
                            </Button>
                          </div>
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