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
import { Newspaper, Eye, Edit, Trash2, Plus, Image, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function News() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNews, setNewNews] = useState({
    title: "",
    content: "",
    imageUrl: "",
    priority: 0,
  });
  
  const { toast } = useToast();

  const { data: news, isLoading } = useQuery({
    queryKey: ["/api/news"],
  });

  const createNewsMutation = useMutation({
    mutationFn: async (newsData: any) => {
      return apiRequest("POST", "/api/news", newsData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      toast({
        title: "Berita berhasil dibuat",
        description: "Berita baru telah ditambahkan ke slider.",
      });
      setShowCreateForm(false);
      setNewNews({
        title: "",
        content: "",
        imageUrl: "",
        priority: 0,
      });
    },
  });

  const toggleNewsMutation = useMutation({
    mutationFn: async ({ newsId, isActive }: { newsId: string; isActive: boolean }) => {
      return apiRequest("PATCH", `/api/news/${newsId}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      toast({
        title: "Status berita diupdate",
        description: "Status berita berhasil diubah.",
      });
    },
  });

  const deleteNewsMutation = useMutation({
    mutationFn: async (newsId: string) => {
      return apiRequest("DELETE", `/api/news/${newsId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      toast({
        title: "Berita dihapus",
        description: "Berita berhasil dihapus dari sistem.",
      });
    },
  });

  const handleCreateNews = () => {
    createNewsMutation.mutate(newNews);
  };

  const totalNews = news?.length || 0;
  const activeNews = news?.filter((item: any) => item.isActive)?.length || 0;
  const highPriorityNews = news?.filter((item: any) => item.priority >= 3)?.length || 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">News & Berita - Dobel Domino</h1>
          <p className="text-slate-600 mt-1">Kelola berita dan pengumuman untuk slider di game</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Buat Berita Baru
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Berita"
          value={totalNews.toString()}
          icon={Newspaper}
          iconBgColor="bg-blue-100"
        />
        <StatsCard
          title="Berita Aktif"
          value={activeNews.toString()}
          icon={Eye}
          iconBgColor="bg-green-100"
        />
        <StatsCard
          title="High Priority"
          value={highPriorityNews.toString()}
          icon={TrendingUp}
          iconBgColor="bg-red-100"
        />
        <StatsCard
          title="Slider Ready"
          value={activeNews.toString()}
          icon={Image}
          iconBgColor="bg-purple-100"
        />
      </div>

      {/* News Slider Info */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
            <Newspaper className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Slider Berita</h3>
            <p className="text-slate-600 mt-1">
              Berita akan ditampilkan di slider sebelah kiri dalam game. Sesuaikan prioritas untuk mengatur urutan tampilan.
              Gunakan gambar dengan rasio 16:9 untuk hasil terbaik.
            </p>
            <div className="mt-3 flex items-center space-x-4 text-sm text-slate-500">
              <span>• Posisi: Sebelah kiri game</span>
              <span>• Auto-scroll: Enabled</span>
              <span>• Recommended: 4-6 berita aktif</span>
            </div>
          </div>
        </div>
      </div>

      {/* Create News Form */}
      {showCreateForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Buat Berita Baru</h3>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Judul Berita</Label>
              <Input
                placeholder="Masukkan judul berita"
                value={newNews.title}
                onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Konten</Label>
              <textarea
                className="w-full h-24 px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                placeholder="Tulis konten berita..."
                value={newNews.content}
                onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-slate-700 mb-2">URL Gambar</Label>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={newNews.imageUrl}
                  onChange={(e) => setNewNews({ ...newNews, imageUrl: e.target.value })}
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-slate-700 mb-2">Prioritas (1-5)</Label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  placeholder="1"
                  value={newNews.priority}
                  onChange={(e) => setNewNews({ ...newNews, priority: parseInt(e.target.value) || 0 })}
                />
              </div>
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
              onClick={handleCreateNews}
              disabled={createNewsMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Buat Berita
            </Button>
          </div>
        </div>
      )}

      {/* News Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Daftar Berita</h3>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Prioritas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {news?.map((newsItem: any) => (
                  <TableRow key={newsItem.id}>
                    <TableCell>
                      <div className="flex items-start space-x-3">
                        {newsItem.imageUrl && (
                          <img 
                            src={newsItem.imageUrl} 
                            alt={newsItem.title}
                            className="w-12 h-8 object-cover rounded"
                          />
                        )}
                        <div>
                          <div className="font-medium text-slate-900">{newsItem.title}</div>
                          <div className="text-sm text-slate-500 line-clamp-2">{newsItem.content}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={newsItem.priority >= 3 ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}>
                        Priority {newsItem.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={newsItem.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {newsItem.isActive ? "Aktif" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-slate-600">
                        {new Date(newsItem.createdAt).toLocaleDateString('id-ID')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleNewsMutation.mutate({ 
                            newsId: newsItem.id, 
                            isActive: !newsItem.isActive 
                          })}
                          disabled={toggleNewsMutation.isPending}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteNewsMutation.mutate(newsItem.id)}
                          disabled={deleteNewsMutation.isPending}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
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