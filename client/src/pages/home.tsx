import { useQuery } from "@tanstack/react-query";
import { SeriesGrid } from "@/components/series-grid";
import { PopularMangaSection } from "@/components/popular-manga-section";
import type { Series } from "@shared/schema";
import type { SearchFilters } from "@/components/search-modal";

interface HomePageProps {
  searchQuery: string;
  filters: SearchFilters;
}

export function HomePage({ searchQuery, filters }: HomePageProps) {
  const { data: allSeries = [], isLoading } = useQuery<Series[]>({
    queryKey: ["/api/series"],
  });

  const filteredSeries = allSeries.filter((series) => {
    const matchesQuery =
      !searchQuery ||
      series.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      series.author?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre =
      filters.genres.length === 0 || filters.genres.includes(series.genre);

    const matchesStatus =
      filters.status === "all" || series.status === filters.status;

    return matchesQuery && matchesGenre && matchesStatus;
  });

  const newSeries = allSeries.filter((s) => s.status === "new").slice(0, 5);
  const popularSeries = [...allSeries]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  const hasActiveFilters =
    searchQuery || filters.genres.length > 0 || filters.status !== "all";

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-10">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {hasActiveFilters ? (
          <div className="animate-fade-in">
            <SeriesGrid
              series={filteredSeries}
              isLoading={isLoading}
              title={`Arama Sonuçları (${filteredSeries.length})`}
              iconType="search"
              emptyMessage="Aramanızla eşleşen seri bulunamadı."
            />
          </div>
        ) : (
          <>
            {newSeries.length > 0 && (
              <section className="animate-fade-in" style={{ animationDelay: "0ms" }}>
                <SeriesGrid
                  series={newSeries}
                  isLoading={isLoading}
                  title="Yeni Eklenenler"
                  iconType="sparkles"
                />
              </section>
            )}

            <PopularMangaSection />

            {popularSeries.length > 0 && (
              <section className="animate-fade-in" style={{ animationDelay: "100ms" }}>
                <SeriesGrid
                  series={popularSeries}
                  isLoading={isLoading}
                  title="En Popüler"
                  iconType="flame"
                />
              </section>
            )}

            <section className="animate-fade-in" style={{ animationDelay: "200ms" }}>
              <SeriesGrid
                series={allSeries}
                isLoading={isLoading}
                title="Tüm Seriler"
                iconType="book"
              />
            </section>
          </>
        )}
      </div>
    </div>
  );
}
