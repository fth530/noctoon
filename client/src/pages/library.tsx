import { useQuery } from "@tanstack/react-query";
import { SeriesGrid } from "@/components/series-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { BookOpen, LayoutGrid, Star, Heart, Play, CheckCircle } from "lucide-react";
import type { Series } from "@shared/schema";

export function LibraryPage() {
  const { isAuthenticated } = useAuth();

  const { data: allSeries = [], isLoading } = useQuery<Series[]>({
    queryKey: ["/api/series"],
  });

  const { data: userLikes = [] } = useQuery<string[]>({
    queryKey: ["/api/user/likes"],
    enabled: isAuthenticated,
  });

  const { data: userFavorites = [] } = useQuery<string[]>({
    queryKey: ["/api/user/favorites"],
    enabled: isAuthenticated,
  });

  const favoriteSeries = allSeries.filter((s) => userFavorites.includes(s.id));
  const likedSeries = allSeries.filter((s) => userLikes.includes(s.id));
  const ongoingSeries = allSeries.filter((s) => s.status === "ongoing");
  const completedSeries = allSeries.filter((s) => s.status === "completed");

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            Kütüphane
          </h1>
          <p className="text-muted-foreground mt-2">
            Tüm serileri keşfedin ve koleksiyonunuzu yönetin.
          </p>
        </div>

        <Tabs defaultValue="all" className="animate-fade-in">
          <TabsList className="mb-6 bg-muted/50 p-1 rounded-xl flex-wrap h-auto gap-1">
            <TabsTrigger
              value="all"
              className="rounded-lg data-[state=active]:bg-background"
              data-testid="tab-all"
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Tümü ({allSeries.length})
            </TabsTrigger>
            {isAuthenticated && (
              <>
                <TabsTrigger
                  value="favorites"
                  className="rounded-lg data-[state=active]:bg-background"
                  data-testid="tab-favorites"
                >
                  <Star className="h-4 w-4 mr-2 text-yellow-500" />
                  Favoriler ({favoriteSeries.length})
                </TabsTrigger>
                <TabsTrigger
                  value="liked"
                  className="rounded-lg data-[state=active]:bg-background"
                  data-testid="tab-liked"
                >
                  <Heart className="h-4 w-4 mr-2 text-red-500" />
                  Beğeniler ({likedSeries.length})
                </TabsTrigger>
              </>
            )}
            <TabsTrigger
              value="ongoing"
              className="rounded-lg data-[state=active]:bg-background"
              data-testid="tab-ongoing"
            >
              <Play className="h-4 w-4 mr-2 text-green-500" />
              Devam Eden ({ongoingSeries.length})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="rounded-lg data-[state=active]:bg-background"
              data-testid="tab-completed"
            >
              <CheckCircle className="h-4 w-4 mr-2 text-blue-500" />
              Tamamlanan ({completedSeries.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <SeriesGrid
              series={allSeries}
              isLoading={isLoading}
              emptyMessage="Henüz seri eklenmemiş."
            />
          </TabsContent>

          {isAuthenticated && (
            <>
              <TabsContent value="favorites">
                <SeriesGrid
                  series={favoriteSeries}
                  isLoading={isLoading}
                  emptyMessage="Henüz favori eklememişsiniz."
                />
              </TabsContent>

              <TabsContent value="liked">
                <SeriesGrid
                  series={likedSeries}
                  isLoading={isLoading}
                  emptyMessage="Henüz beğeni yapmamışsınız."
                />
              </TabsContent>
            </>
          )}

          <TabsContent value="ongoing">
            <SeriesGrid
              series={ongoingSeries}
              isLoading={isLoading}
              emptyMessage="Devam eden seri bulunamadı."
            />
          </TabsContent>

          <TabsContent value="completed">
            <SeriesGrid
              series={completedSeries}
              isLoading={isLoading}
              emptyMessage="Tamamlanan seri bulunamadı."
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
