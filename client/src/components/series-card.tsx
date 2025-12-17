import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Eye, Star } from "lucide-react";
import type { Series } from "@shared/schema";

interface SeriesCardProps {
  series: Series;
}

export function SeriesCard({ series }: SeriesCardProps) {
  const statusConfig = {
    ongoing: { label: "Devam Ediyor", className: "bg-emerald-500/90" },
    completed: { label: "Tamamlandı", className: "bg-blue-500/90" },
    new: { label: "Yeni", className: "bg-amber-500/90" },
  };

  const statusInfo = statusConfig[series.status as keyof typeof statusConfig] || statusConfig.ongoing;

  return (
    <Link
      href={`/series/${series.id}`}
      className="group block"
      data-testid={`card-series-${series.id}`}
    >
      <div className="relative rounded-2xl overflow-hidden bg-card border border-border/50 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-primary/10 group-hover:border-primary/30">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={series.cover}
            alt={series.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute top-3 left-3">
            <Badge className={`${statusInfo.className} text-white text-xs font-semibold shadow-lg`}>
              {statusInfo.label}
            </Badge>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex items-center gap-4 text-white/90 text-sm">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {series.views?.toLocaleString() || 0}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400" />
                {series.rating || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {series.title}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <Badge variant="secondary" className="text-xs">
              {series.genre}
            </Badge>
            {series.author && (
              <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                {series.author}
              </span>
            )}
          </div>
        </div>

        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/50 transition-colors pointer-events-none" />
      </div>
    </Link>
  );
}
