import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SeriesCard } from "@/components/series-card";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  ArrowLeft, 
  Home, 
  Pen, 
  Eye, 
  Star, 
  BookOpen, 
  Heart, 
  List, 
  ChevronRight, 
  MessageSquare, 
  Send, 
  Layers
} from "lucide-react";
import type { Series, Chapter, Comment } from "@shared/schema";

interface SeriesDetailPageProps {
  id: string;
}

export function SeriesDetailPage({ id }: SeriesDetailPageProps) {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [commentText, setCommentText] = useState("");

  const { data: series, isLoading: seriesLoading } = useQuery<Series>({
    queryKey: ["/api/series", id],
  });

  const { data: chapters = [] } = useQuery<Chapter[]>({
    queryKey: ["/api/series", id, "chapters"],
  });

  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: ["/api/series", id, "comments"],
  });

  const { data: allSeries = [] } = useQuery<Series[]>({
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

  const isLiked = userLikes.includes(id);
  const isFavorite = userFavorites.includes(id);

  const likeMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/series/${id}/like`, { userId: user?.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/likes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/series", id] });
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/series/${id}/favorite`, { userId: user?.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/favorites"] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: (text: string) =>
      apiRequest("POST", `/api/series/${id}/comments`, { 
        text, 
        userId: user?.id, 
        username: user?.username 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/series", id, "comments"] });
      setCommentText("");
      toast({ title: "Yorum eklendi!" });
    },
  });

  const handleLike = () => {
    if (!isAuthenticated) {
      toast({ title: "Giriş yapmalısınız", variant: "destructive" });
      return;
    }
    likeMutation.mutate();
  };

  const handleFavorite = () => {
    if (!isAuthenticated) {
      toast({ title: "Giriş yapmalısınız", variant: "destructive" });
      return;
    }
    favoriteMutation.mutate();
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    commentMutation.mutate(commentText);
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
                variant={isLiked ? "default" : "outline"}
                onClick={handleLike}
                disabled={likeMutation.isPending}
                data-testid="button-like"
              >
                <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                {isLiked ? "Beğenildi" : "Beğen"}
              </Button>
              <Button
                size="lg"
                variant={isFavorite ? "default" : "outline"}
                onClick={handleFavorite}
                disabled={favoriteMutation.isPending}
                data-testid="button-favorite"
              >
                <Star className={`h-4 w-4 mr-2 ${isFavorite ? "fill-yellow-500 text-yellow-500" : ""}`} />
                {isFavorite ? "Favoride" : "Favorilere Ekle"}
              </Button>
            </div>
          </div>
        </div>

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
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50 transition-colors"
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

        <Card className="mt-10 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Yorumlar ({comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isAuthenticated ? (
              <div className="flex gap-4">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-br from-primary to-pink-500 text-white">
                    {user?.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Textarea
                    placeholder="Yorumunuzu yazın..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="bg-muted/50 resize-none"
                    rows={3}
                    data-testid="textarea-comment"
                  />
                  <Button
                    onClick={handleComment}
                    disabled={commentMutation.isPending || !commentText.trim()}
                    className="bg-gradient-to-r from-primary to-pink-500 text-white"
                    data-testid="button-submit-comment"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Gönder
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Yorum yapmak için giriş yapmalısınız.
              </p>
            )}

            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Henüz yorum yapılmamış. İlk yorumu siz yapın!
                </p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex gap-4 p-4 rounded-xl bg-muted/30"
                    data-testid={`comment-${comment.id}`}
                  >
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-br from-primary/50 to-pink-500/50">
                        {comment.username?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{comment.username}</span>
                        <span className="text-xs text-muted-foreground">
                          {comment.createdAt}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{comment.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {similarSeries.length > 0 && (
          <section className="mt-10 animate-fade-in" style={{ animationDelay: "300ms" }}>
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
