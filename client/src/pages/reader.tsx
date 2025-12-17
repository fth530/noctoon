import { useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { X, ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, List, Home } from "lucide-react";
import type { Series, Chapter } from "@shared/schema";

interface ReaderPageProps {
  seriesId: string;
  chapterId: string;
  onProgressChange: (progress: number) => void;
  onReadingStateChange: (isReading: boolean) => void;
}

export function ReaderPage({
  seriesId,
  chapterId,
  onProgressChange,
  onReadingStateChange,
}: ReaderPageProps) {
  const [, setLocation] = useLocation();
  const [isControlsVisible, setIsControlsVisible] = useState(true);

  const { data: series } = useQuery<Series>({
    queryKey: ["/api/series", seriesId],
  });

  const { data: chapters = [] } = useQuery<Chapter[]>({
    queryKey: ["/api/series", seriesId, "chapters"],
  });

  const { data: chapter, isLoading } = useQuery<Chapter>({
    queryKey: ["/api/chapters", chapterId],
  });

  const currentIndex = chapters.findIndex((c) => c.id === chapterId);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    onProgressChange(Math.min(100, Math.max(0, progress)));
  }, [onProgressChange]);

  useEffect(() => {
    onReadingStateChange(true);
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      onReadingStateChange(false);
      onProgressChange(0);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, onProgressChange, onReadingStateChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLocation(`/series/${seriesId}`);
      } else if (e.key === "ArrowRight" && nextChapter) {
        setLocation(`/read/${seriesId}/${nextChapter.id}`);
      } else if (e.key === "ArrowLeft" && prevChapter) {
        setLocation(`/read/${seriesId}/${prevChapter.id}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [seriesId, nextChapter, prevChapter, setLocation]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleMouseMove = () => {
      setIsControlsVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsControlsVisible(false), 3000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    handleMouseMove();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 pb-10">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-full aspect-[3/4] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen pt-20 pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl font-bold text-primary mb-4">404</div>
          <p className="text-muted-foreground mb-6">Bölüm bulunamadı</p>
          <Button onClick={() => setLocation("/")} data-testid="button-go-home">
            <Home className="h-4 w-4 mr-2" />
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div
        className={`fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50 transition-all duration-300 ${
          isControlsVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation(`/series/${seriesId}`)}
              data-testid="button-close-reader"
            >
              <X className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-bold line-clamp-1">{series?.title}</h1>
              <p className="text-sm text-muted-foreground">
                Bölüm {chapter.number}: {chapter.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={!prevChapter}
              onClick={() => prevChapter && setLocation(`/read/${seriesId}/${prevChapter.id}`)}
              data-testid="button-prev-chapter"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              {currentIndex + 1} / {chapters.length}
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={!nextChapter}
              onClick={() => nextChapter && setLocation(`/read/${seriesId}/${nextChapter.id}`)}
              data-testid="button-next-chapter"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-20 pb-24 max-w-3xl mx-auto px-2 md:px-4">
        <div className="space-y-1">
          {chapter.pages?.map((page, index) => (
            <img
              key={index}
              src={page}
              alt={`Sayfa ${index + 1}`}
              className="w-full rounded-lg"
              loading="lazy"
              data-testid={`img-page-${index}`}
            />
          ))}
        </div>
      </div>

      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-t border-border/50 transition-all duration-300 ${
          isControlsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="outline"
            disabled={!prevChapter}
            onClick={() => prevChapter && setLocation(`/read/${seriesId}/${prevChapter.id}`)}
            data-testid="button-prev-chapter-bottom"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Önceki Bölüm
          </Button>

          <Link
            href={`/series/${seriesId}`}
            className="text-sm text-muted-foreground flex items-center gap-1"
            data-testid="link-back-to-series"
          >
            <List className="h-4 w-4" />
            Bölüm Listesi
          </Link>

          <Button
            disabled={!nextChapter}
            onClick={() => nextChapter && setLocation(`/read/${seriesId}/${nextChapter.id}`)}
            className="bg-gradient-to-r from-primary to-pink-500 text-white"
            data-testid="button-next-chapter-bottom"
          >
            Sonraki Bölüm
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
