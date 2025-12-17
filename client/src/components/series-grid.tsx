import { SeriesCard } from "./series-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Sparkles, Flame, BookOpen } from "lucide-react";
import type { Series } from "@shared/schema";

interface SeriesGridProps {
  series: Series[];
  isLoading?: boolean;
  title?: string;
  iconType?: "search" | "sparkles" | "flame" | "book";
  emptyMessage?: string;
}

const iconMap = {
  search: Search,
  sparkles: Sparkles,
  flame: Flame,
  book: BookOpen,
};

export function SeriesGrid({
  series,
  isLoading = false,
  title,
  iconType,
  emptyMessage = "Henüz seri bulunamadı.",
}: SeriesGridProps) {
  const IconComponent = iconType ? iconMap[iconType] : null;

  if (isLoading) {
    return (
      <div className="space-y-6">
        {title && (
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-6 w-48" />
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[2/3] rounded-2xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {title && (
        <div className="flex items-center gap-3">
          {IconComponent && (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center">
              <IconComponent className="h-5 w-5 text-white" />
            </div>
          )}
          <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        </div>
      )}

      {series.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {series.map((s) => (
            <SeriesCard key={s.id} series={s} />
          ))}
        </div>
      )}
    </div>
  );
}
