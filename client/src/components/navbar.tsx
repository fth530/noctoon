import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import { 
  Search, 
  SlidersHorizontal, 
  Moon, 
  Sun, 
  ChevronDown, 
  User, 
  Star, 
  Shield, 
  LogOut,
  LogIn,
  BookOpen
} from "lucide-react";

interface NavbarProps {
  onLoginClick: () => void;
  onSearchClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  readingProgress?: number;
  isReading?: boolean;
}

export function Navbar({
  onLoginClick,
  onSearchClick,
  searchQuery,
  onSearchChange,
  readingProgress = 0,
  isReading = false,
}: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [location, setLocation] = useLocation();

  return (
    <nav className="fixed top-0 w-full z-50 h-16 transition-colors duration-300 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-3 cursor-pointer group shrink-0"
          data-testid="link-home"
        >
          <div className="relative w-10 h-10 flex items-center justify-center">
            <img 
              src="/noctoon-logo.svg" 
              alt="Noctoon Logo" 
              className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-xl font-black tracking-tighter leading-none">
              NOCTOON
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500">
                .
              </span>
            </span>
            <span className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase">
              Webtoon
            </span>
          </div>
        </Link>

        <div className="hidden md:flex flex-1 max-w-md relative group">
          <Input
            type="text"
            placeholder="Seri ara..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-full py-2.5 pl-11 pr-12 bg-muted/50 border-transparent focus:bg-background focus:border-primary transition-all"
            data-testid="input-search"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Button
            variant="ghost"
            size="icon"
            onClick={onSearchClick}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
            data-testid="button-advanced-search"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
            data-testid="button-theme-toggle"
          >
            {theme === "dark" ? (
              <Moon className="h-5 w-5 text-yellow-400" />
            ) : (
              <Sun className="h-5 w-5 text-amber-500" />
            )}
          </Button>

          <div className="h-6 w-px bg-border hidden sm:block" />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 rounded-full px-2"
                  data-testid="button-user-menu"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-pink-500 text-white text-sm font-bold">
                      {user?.username?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block font-medium text-sm">
                    {user?.username}
                  </span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => setLocation("/profile")}
                  data-testid="menu-item-profile"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLocation("/favorites")}
                  data-testid="menu-item-favorites"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Favorilerim
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setLocation("/admin")}
                      data-testid="menu-item-admin"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Paneli
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-destructive"
                  data-testid="menu-item-logout"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={onLoginClick}
              className="bg-gradient-to-r from-primary to-pink-500 text-white rounded-full px-6 font-semibold shadow-lg shadow-primary/30"
              data-testid="button-login"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Giriş
            </Button>
          )}
        </div>
      </div>

      {isReading && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-muted">
          <div
            className="h-full bg-gradient-to-r from-primary to-pink-500 transition-all duration-100"
            style={{ width: `${readingProgress}%` }}
            data-testid="progress-reading"
          />
        </div>
      )}
    </nav>
  );
}
