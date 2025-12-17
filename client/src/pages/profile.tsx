import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth";
import { Home, Shield, User, LogOut, Star, Heart, Lock } from "lucide-react";
import type { Series } from "@shared/schema";

export function ProfilePage() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

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

  const likedSeries = allSeries.filter((s) => userLikes.includes(s.id));
  const favoriteSeries = allSeries.filter((s) => userFavorites.includes(s.id));

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-20 pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <Lock className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Giriş Yapmalısınız</h2>
          <p className="text-muted-foreground mb-6">
            Profilinizi görmek için lütfen giriş yapın.
          </p>
          <Button
            onClick={() => setLocation("/")}
            className="bg-gradient-to-r from-primary to-pink-500 text-white"
            data-testid="button-go-home"
          >
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
        <div className="mb-10 animate-fade-in">
          <Card className="bg-gradient-to-br from-primary/10 to-pink-500/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-pink-500 text-white text-3xl font-bold">
                    {user?.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-1">{user?.username}</h1>
                  <p className="text-muted-foreground mb-4">
                    {user?.role === "admin" ? (
                      <span className="flex items-center gap-2 justify-center md:justify-start">
                        <Shield className="h-4 w-4 text-primary" />
                        Yönetici
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 justify-center md:justify-start">
                        <User className="h-4 w-4" />
                        Üye
                      </span>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{userLikes.length}</div>
                      <div className="text-sm text-muted-foreground">Beğeni</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-500">{userFavorites.length}</div>
                      <div className="text-sm text-muted-foreground">Favori</div>
                    </div>
                  </div>
                </div>
                <div className="md:ml-auto">
                  <Button
                    variant="outline"
                    onClick={logout}
                    data-testid="button-logout"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Çıkış Yap
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-10">
          <section className="animate-fade-in" style={{ animationDelay: "100ms" }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Favorilerim ({favoriteSeries.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favoriteSeries.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                      <Star className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">Henüz favori eklememişsiniz.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {favoriteSeries.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => setLocation(`/series/${s.id}`)}
                        className="cursor-pointer group"
                        data-testid={`card-favorite-${s.id}`}
                      >
                        <div className="relative rounded-xl overflow-hidden">
                          <img
                            src={s.cover}
                            alt={s.title}
                            className="w-full aspect-[2/3] object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <h3 className="mt-2 font-medium line-clamp-1 group-hover:text-primary transition-colors">
                          {s.title}
                        </h3>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          <section className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Beğendiklerim ({likedSeries.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {likedSeries.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                      <Heart className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">Henüz beğeni yapmamışsınız.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {likedSeries.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => setLocation(`/series/${s.id}`)}
                        className="cursor-pointer group"
                        data-testid={`card-liked-${s.id}`}
                      >
                        <div className="relative rounded-xl overflow-hidden">
                          <img
                            src={s.cover}
                            alt={s.title}
                            className="w-full aspect-[2/3] object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <h3 className="mt-2 font-medium line-clamp-1 group-hover:text-primary transition-colors">
                          {s.title}
                        </h3>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
