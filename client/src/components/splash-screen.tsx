import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHiding(true);
      setTimeout(onComplete, 500);
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-all duration-500 ${
        isHiding ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      data-testid="splash-screen"
    >
      <div className="text-center">
        <div className="relative mx-auto mb-6">
          <div className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-br from-primary to-pink-500 rounded-2xl blur-xl opacity-50 animate-pulse-glow" />
          <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-primary to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl animate-bounce-slow">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-2">
          <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
            NOCTOON
          </span>
        </h1>
        <p className="text-muted-foreground text-sm font-medium animate-pulse">
          Webtoon & Manga Platformu
        </p>
        <div className="mt-8 flex justify-center gap-1">
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
