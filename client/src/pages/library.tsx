import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { SeriesGrid } from "@/components/series-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark, LayoutGrid, Play, CheckCircle } from "lucide-react";
import type { Series } from "@shared/schema";

// LocalStorage key for bookmarks
const BOOKMARKS_KEY = "noctoon-bookmarks";

// Get bookmarks from localStorage
function getBookmarks(): string[] {
  try {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function LibraryPage() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // Load bookmarks on mount
  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  const { data: allSeries = [], isLoading } = useQuery<Series[]>({
    queryKey: ["/api/series"],
  });

  const bookmarkedSeries = allSeries.filter((s) => bookmarks.includes(s.id));
  const ongoingSeries = allSeries.filter((s) => s.status === "ongoing");
  const completedSeries = allSeries.filter((s) => s.status === "completed");

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center">
              <Bookmark className="h-6 w-6 text-white" />
            </div>
            Kütüphane
          </h1>
          <p className="text-muted-foreground mt-2">
            Tüm serileri keşfedin ve yer imleminizi yönetin.
          </p>
        </div>

        <Tabs defaultValue="bookmarks" className="animate-fade-in">
          <TabsList className="mb-6 bg-muted/50 p-1 rounded-xl flex-wrap h-auto gap-1">
            <TabsTrigger
              value="bookmarks"
              className="rounded-lg data-[state=active]:bg-background"
              data-testid="tab-bookmarks"
            >
              <Bookmark className="h-4 w-4 mr-2 text-primary" />
              Yer İmleri ({bookmarkedSeries.length})
            </TabsTrigger>
            <TabsTrigger
              value="all"
              className="rounded-lg data-[state=active]:bg-background"
              data-testid="tab-all"
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Tümü ({allSeries.length})
            </TabsTrigger>
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

          <TabsContent value="bookmarks">
            <SeriesGrid
              series={bookmarkedSeries}
              isLoading={isLoading}
              emptyMessage="Henüz yer imi eklememişsiniz. Beğendiğiniz serileri yer imlerine ekleyin!"
            />
          </TabsContent>

          <TabsContent value="all">
            <SeriesGrid
              series={allSeries}
              isLoading={isLoading}
              emptyMessage="Henüz seri eklenmemiş."
            />
          </TabsContent>

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
