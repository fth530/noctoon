import { useState } from "react";
import { cn } from "@/lib/utils";

interface MangaItem {
  id: number;
  title: string;
  genres: string[];
  image: string;
  rank: number;
}

const popularMangaData: MangaItem[] = [
  {
    id: 1,
    title: "The Unbeatable Dungeons Lazy Boss Monster",
    genres: ["Doğaüstü", "Fantastik", "Komedi", "Manhwa", "Shounen", "Webtoon"],
    image: "/api/placeholder/120/160",
    rank: 1,
  },
  {
    id: 2,
    title: "Reincarnation Path of The Underworld",
    genres: ["Aksiyon", "Doğaüstü", "Dram", "Fantastik", "Korku", "Macera", "Manhwa"],
    image: "/api/placeholder/120/160",
    rank: 2,
  },
  {
    id: 3,
    title: "Player Who Cant Level Up",
    genres: ["Aksiyon", "Fantastik", "Macera", "Manhwa", "Shounen", "Webtoon"],
    image: "/api/placeholder/120/160",
    rank: 3,
  },
  {
    id: 4,
    title: "Return of the Iron-Blooded Hound",
    genres: ["Aksiyon", "Dram", "Fantastik", "Harem", "Manhwa", "Seinen", "Webtoon"],
    image: "/api/placeholder/120/160",
    rank: 4,
  },
];

type FilterType = "Haftalık" | "Aylık" | "Tüm Zamanlar";

export function PopularMangaSection() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("Haftalık");

  const filters: FilterType[] = ["Haftalık", "Aylık", "Tüm Zamanlar"];

  return (
    <section className="animate-fade-in" style={{ animationDelay: "150ms" }}>
      <div className="bg-gradient-to-r from-purple-600 to-violet-700 rounded-t-lg p-4">
        <h2 className="text-xl font-bold text-white">Popüler Mangalar</h2>
      </div>
      
      <div className="bg-gray-900 rounded-b-lg overflow-hidden">
        <div className="flex border-b border-gray-700">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-6 py-3 text-sm font-medium transition-colors",
                activeFilter === filter
                  ? "bg-purple-600 text-white"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-4">
          {popularMangaData.map((manga) => (
            <div
              key={manga.id}
              className="flex items-center gap-4 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer group"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-gray-700 rounded border border-gray-600 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-300">{manga.rank}</span>
              </div>

              <div className="flex-shrink-0 w-16 h-20 rounded overflow-hidden">
                <img
                  src={manga.image}
                  alt={manga.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium text-sm mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                  {manga.title}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {manga.genres.slice(0, 6).map((genre, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded"
                    >
                      {genre}
                    </span>
                  ))}
                  {manga.genres.length > 6 && (
                    <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">
                      +{manga.genres.length - 6}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}