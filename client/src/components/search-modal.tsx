import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { GENRES } from "@shared/schema";
import { Filter, Search, RotateCcw, X, Check } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
}

export interface SearchFilters {
  query: string;
  genres: string[];
  status: string;
}

export function SearchModal({
  isOpen,
  onClose,
  onApply,
  initialFilters,
}: SearchModalProps) {
  const [query, setQuery] = useState(initialFilters?.query || "");
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    initialFilters?.genres || []
  );
  const [status, setStatus] = useState(initialFilters?.status || "all");

  const statusOptions = [
    { value: "all", label: "Tümü" },
    { value: "ongoing", label: "Devam Ediyor" },
    { value: "completed", label: "Tamamlandı" },
    { value: "new", label: "Yeni" },
  ];

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  };

  const handleApply = () => {
    onApply({ query, genres: selectedGenres, status });
    onClose();
  };

  const handleReset = () => {
    setQuery("");
    setSelectedGenres([]);
    setStatus("all");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-card/95 backdrop-blur-xl border-border/50 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-pink-500 rounded-xl flex items-center justify-center">
              <Filter className="h-5 w-5 text-white" />
            </div>
            Detaylı Arama
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
              Arama
            </label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Seri adı, yazar..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 bg-muted/50"
                data-testid="input-filter-search"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
              Türler
            </label>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((genre) => (
                <Badge
                  key={genre}
                  variant={selectedGenres.includes(genre) ? "default" : "outline"}
                  className={`cursor-pointer transition-all px-4 py-2 text-sm ${
                    selectedGenres.includes(genre)
                      ? "bg-gradient-to-r from-primary to-pink-500 text-white border-transparent"
                      : "border-border"
                  }`}
                  onClick={() => toggleGenre(genre)}
                  data-testid={`badge-genre-${genre}`}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
              Yayın Durumu
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatus(option.value)}
                  className={`text-center py-3 rounded-xl font-medium text-sm transition-all ${
                    status === option.value
                      ? "bg-gradient-to-r from-primary to-pink-500 text-white shadow-lg"
                      : "bg-muted/50 text-muted-foreground border border-border"
                  }`}
                  data-testid={`button-status-${option.value}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border">
          <Button
            variant="ghost"
            onClick={handleReset}
            data-testid="button-reset-filters"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Sıfırla
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            data-testid="button-cancel-search"
          >
            Vazgeç
          </Button>
          <Button
            onClick={handleApply}
            className="bg-gradient-to-r from-primary to-pink-500 text-white shadow-lg shadow-primary/30"
            data-testid="button-apply-filters"
          >
            <Check className="h-4 w-4 mr-2" />
            Sonuçları Göster
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
