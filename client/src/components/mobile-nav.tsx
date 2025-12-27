import { Link, useLocation } from "wouter";
import { Home, Search, Bookmark } from "lucide-react";

interface MobileNavProps {
  onSearchClick: () => void;
}

export function MobileNav({ onSearchClick }: MobileNavProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Ana Sayfa", testId: "nav-home" },
    { href: "#search", icon: Search, label: "Ara", testId: "nav-search", onClick: onSearchClick },
    { href: "/bookmarks", icon: Bookmark, label: "Yer İmleri", testId: "nav-bookmarks" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 w-full z-40 border-t border-border/50 bg-background/95 backdrop-blur-xl pb-safe">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const IconComponent = item.icon;

          if (item.onClick) {
            return (
              <button
                key={item.testId}
                onClick={item.onClick}
                className={`flex flex-col items-center py-2 px-4 transition-all active:scale-95 ${isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                data-testid={`button-${item.testId}`}
              >
                <IconComponent className="h-5 w-5 mb-1" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.testId}
              href={item.href}
              className={`flex flex-col items-center py-2 px-4 transition-all active:scale-95 ${isActive ? "text-primary" : "text-muted-foreground"
                }`}
              data-testid={`link-${item.testId}`}
            >
              <IconComponent className="h-5 w-5 mb-1" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
