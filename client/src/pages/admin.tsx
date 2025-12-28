import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { AddSeriesModal } from "@/components/add-series-modal";
import { AddChapterModal } from "@/components/add-chapter-modal";
import {
  Shield,
  Lock,
  Home,
  BookOpen,
  Users,
  MessageSquare,
  Heart,
  Star,
  Eye,
  PlusCircle,
  UserCog,
  MessageCircle,
  BarChart3,
  TrendingUp,
  Trash2,
  Plus
} from "lucide-react";
import type { Series, Comment } from "@shared/schema";

interface AdminStats {
  totalSeries: number;
  totalUsers: number;
  totalComments: number;
  totalLikes: number;
  totalFavorites: number;
}

export function AdminPage() {
  const [, setLocation] = useLocation();
  const { isAdmin, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const [showAddSeriesModal, setShowAddSeriesModal] = useState(false);
  const [showAddChapterModal, setShowAddChapterModal] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);

  const { data: stats } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    enabled: isAdmin,
  });

  const { data: series = [] } = useQuery<Series[]>({
    queryKey: ["/api/series"],
    enabled: isAdmin,
  });

  const { data: recentComments = [] } = useQuery<Comment[]>({
    queryKey: ["/api/admin/recent-comments"],
    enabled: isAdmin,
  });

  const deleteSeriesMutation = useMutation({
    mutationFn: async (seriesId: string) => {
      const userStr = localStorage.getItem("noctoon-user");
      const user = userStr ? JSON.parse(userStr) : null;

      const response = await fetch(`/api/admin/series/${seriesId}`, {
        method: "DELETE",
        headers: { "x-user-id": user?.id || "" }
      });

      if (!response.ok) throw new Error("Failed to delete series");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/series"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    }
  });

  const handleDeleteSeries = (s: Series) => {
    if (confirm(`"${s.title}" serisini silmek istediğinize emin misiniz?`)) {
      deleteSeriesMutation.mutate(s.id);
    }
  };

  const handleAddChapter = (s: Series) => {
    setSelectedSeries(s);
    setShowAddChapterModal(true);
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen pt-20 pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
            <Lock className="h-10 w-10 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Erişim Engellendi</h2>
          <p className="text-muted-foreground mb-6">
            Bu sayfayı görüntülemek için yönetici yetkisi gereklidir.
          </p>
          <Button
            onClick={() => setLocation("/")}
            className="bg-gradient-to-r from-primary to-pink-500 text-white"
            data-testid="button-go-home"
          >
            <Home className="h-4 w-4 mr-2" />
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Toplam Seri",
      value: stats?.totalSeries || series.length,
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Toplam Kullanıcı",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Toplam Yorum",
      value: stats?.totalComments || 0,
      icon: MessageSquare,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Toplam Beğeni",
      value: stats?.totalLikes || 0,
      icon: Heart,
      color: "from-red-500 to-orange-500",
    },
    {
      title: "Toplam Favori",
      value: stats?.totalFavorites || 0,
      icon: Star,
      color: "from-yellow-500 to-amber-500",
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            Admin Paneli
          </h1>
          <p className="text-muted-foreground mt-2">
            Platform istatistiklerini ve içerikleri yönetin.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {statCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card
                key={stat.title}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.title}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Seriler ({series.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {series.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
                  >
                    <img
                      src={s.cover}
                      alt={s.title}
                      className="w-12 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{s.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {s.genre} - {s.views || 0} görüntülenme
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setLocation(`/series/${s.id}`)}
                      data-testid={`button-view-series-${s.id}`}
                      title="Görüntüle"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAddChapter(s)}
                      title="Bölüm Ekle"
                    >
                      <Plus className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSeries(s)}
                      title="Sil"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: "300ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Son Yorumlar
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentComments.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Henüz yorum yapılmamış.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {recentComments.slice(0, 10).map((comment) => (
                    <div
                      key={comment.id}
                      className="p-3 rounded-xl bg-muted/50"
                      data-testid={`admin-comment-${comment.id}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{comment.username}</span>
                        <span className="text-xs text-muted-foreground">
                          {comment.createdAt}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {comment.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Hızlı İşlemler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col gap-2"
                data-testid="button-add-series"
                onClick={() => setShowAddSeriesModal(true)}
              >
                <PlusCircle className="h-8 w-8 text-primary" />
                <span>Yeni Seri Ekle</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col gap-2"
                data-testid="button-manage-users"
              >
                <UserCog className="h-8 w-8 text-green-500" />
                <span>Kullanıcı Yönetimi</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col gap-2"
                data-testid="button-manage-comments"
              >
                <MessageCircle className="h-8 w-8 text-orange-500" />
                <span>Yorum Moderasyonu</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col gap-2"
                data-testid="button-analytics"
              >
                <BarChart3 className="h-8 w-8 text-blue-500" />
                <span>Analitikler</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddSeriesModal
        open={showAddSeriesModal}
        onOpenChange={setShowAddSeriesModal}
      />

      {selectedSeries && (
        <AddChapterModal
          open={showAddChapterModal}
          onOpenChange={setShowAddChapterModal}
          seriesId={selectedSeries.id}
          seriesTitle={selectedSeries.title}
        />
      )}
    </div>
  );
}
