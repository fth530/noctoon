import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SeriesCard } from "@/components/series-card";
import { useToast } from "@/hooks/use-toast";
import { AddChapterModal } from "@/components/add-chapter-modal";
import { EditSeriesModal } from "@/components/edit-series-modal";
import { BulkChapterUploadModal } from "@/components/bulk-chapter-upload-modal";
import { useAuth } from "@/lib/auth";
import { getReadingProgress, type ReadingProgress } from "@/lib/reading-progress";
import {
  ArrowLeft,
  Home,
  Pen,
  Eye,
  Star,
  BookOpen,
  Bookmark,
  List,
  ChevronRight,
  Layers,
  PlayCircle,
  Plus
} from "lucide-react";
import type { Series, Chapter } from "@shared/schema";

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

// Save bookmarks to localStorage
function saveBookmarks(bookmarks: string[]) {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}

interface SeriesDetailPageProps {
  id: string;
}

export function SeriesDetailPage({ id }: SeriesDetailPageProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showAddChapterModal, setShowAddChapterModal] = useState(false);
  const [showEditSeriesModal, setShowEditSeriesModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);

  // Check bookmark status on mount
  useEffect(() => {
    const bookmarks = getBookmarks();
    setIsBookmarked(bookmarks.includes(id));
  }, [id]);

  // Get reading progress
  const [readingProgress, setReadingProgress] = useState<ReadingProgress | null>(null);
  useEffect(() => {
    setReadingProgress(getReadingProgress(id));
  }, [id]);

  const { data: series, isLoading: seriesLoading } = useQuery<Series>({
    queryKey: ["/api/series", id],
  });

  const { data: chapters = [] } = useQuery<Chapter[]>({
    queryKey: ["/api/series", id, "chapters"],
  });

  const { data: allSeries = [] } = useQuery<Series[]>({
    queryKey: ["/api/series"],
  });

  const handleBookmark = () => {
    const bookmarks = getBookmarks();

    if (isBookmarked) {
      // Remove from bookmarks
      const updated = bookmarks.filter(b => b !== id);
      saveBookmarks(updated);
      setIsBookmarked(false);
      toast({ title: "Yer imlerinden kaldırıldı" });
    } else {
      // Add to bookmarks
      const updated = [...bookmarks, id];
      saveBookmarks(updated);
      setIsBookmarked(true);
      toast({ title: "Yer imlerine eklendi" });
    }
  };

  const similarSeries = allSeries
    .filter((s) => s.genre === series?.genre && s.id !== id)
    .slice(0, 4);

  if (seriesLoading) {
    return (
      <div className="min-h-screen pt-20 pb-24 md:pb-10">
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="flex flex-col md:flex-row gap-8">
            <Skeleton className="w-60 h-80 rounded-2xl shrink-0" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-3">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="min-h-screen pt-20 pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl font-bold text-primary mb-4">404</div>
          <p className="text-muted-foreground mb-6">Seri bulunamadı</p>
          <Button onClick={() => setLocation("/")} data-testid="button-go-home">
            <Home className="h-4 w-4 mr-2" />
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri
        </Button>

        <div className="flex flex-col md:flex-row gap-8 animate-fade-in">
          <div className="shrink-0">
            <div className="relative w-60 mx-auto md:mx-0">
              <img
                src={series.cover}
                alt={series.title}
                className="w-full aspect-[2/3] object-cover rounded-2xl shadow-2xl shadow-primary/20"
              />
              <div className="absolute -inset-1 bg-gradient-to-br from-primary to-pink-500 rounded-2xl -z-10 blur-lg opacity-30" />
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{series.title}</h1>
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="bg-gradient-to-r from-primary to-pink-500 text-white">
                  {series.genre}
                </Badge>
                <Badge variant="secondary">
                  {series.status === "ongoing"
                    ? "Devam Ediyor"
                    : series.status === "completed"
                      ? "Tamamlandı"
                      : "Yeni"}
                </Badge>
                {series.author && (
                  <span className="text-muted-foreground text-sm flex items-center gap-1">
                    <Pen className="h-3 w-3" />
                    {series.author}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6 text-muted-foreground">
              <span className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {series.views?.toLocaleString() || 0} görüntülenme
              </span>
              <span className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                {series.rating || 0} puan
              </span>
            </div>

            {series.description && (
              <p className="text-muted-foreground leading-relaxed">
                {series.description}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              {readingProgress && (
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                  onClick={() => setLocation(`/read/${id}/${readingProgress.chapterId}`)}
                  data-testid="button-continue"
                >
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Devam Et (Bölüm {readingProgress.chapterNumber})
                </Button>
              )}
              {chapters.length > 0 && (
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-pink-500 text-white shadow-lg shadow-primary/30"
                  onClick={() => setLocation(`/read/${id}/${chapters[0]?.id}`)}
                  data-testid="button-read"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Okumaya Başla
                </Button>
              )}
              <Button
                size="lg"
                variant={isBookmarked ? "default" : "outline"}
                onClick={handleBookmark}
                data-testid="button-bookmark"
              >
                <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? "fill-current" : ""}`} />
                {isBookmarked ? "Yer İminde" : "Yer İmlerine Ekle"}
              </Button>

              {user?.role === "admin" && (
                <>
                  <Button variant="outline" onClick={() => setShowEditSeriesModal(true)}>
                    <Pen className="h-4 w-4 mr-2" />
                    Düzenle
                  </Button>
                  <Button onClick={() => setShowAddChapterModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Bölüm Ekle
                  </Button>
                  <Button variant="secondary" onClick={() => setShowBulkUploadModal(true)}>
                    <Layers className="h-4 w-4 mr-2" />
                    Toplu Bölüm Yükle
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <AddChapterModal
          open={showAddChapterModal}
          onOpenChange={setShowAddChapterModal}
          seriesId={id}
          seriesTitle={series.title}
        />

        <EditSeriesModal
          open={showEditSeriesModal}
          onOpenChange={setShowEditSeriesModal}
          series={series}
        />

        <BulkChapterUploadModal
          open={showBulkUploadModal}
          onOpenChange={setShowBulkUploadModal}
          seriesId={id}
          seriesTitle={series.title}
        />

        {chapters.length > 0 && (
          <Card className="mt-10 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5 text-primary" />
                Bölümler ({chapters.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {chapters.map((chapter) => (
                  <Link
                    key={chapter.id}
                    href={`/read/${id}/${chapter.id}`}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    data-testid={`link-chapter-${chapter.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="font-bold text-primary">{chapter.number}</span>
                      </div>
                      <span className="font-medium">{chapter.title}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {similarSeries.length > 0 && (
          <section className="mt-10 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Benzer Seriler
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarSeries.map((s) => (
                <SeriesCard key={s.id} series={s} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
