import { useEffect, useState } from "react";

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
          <div className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-br from-primary to-pink-500 rounded-full blur-xl opacity-50 animate-pulse-glow" />
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center animate-bounce-slow">
            {/* Large Crescent Moon Logo */}
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 via-violet-500 to-indigo-600 shadow-2xl"></div>
              <div className="absolute top-2 left-4 w-16 h-16 rounded-full bg-background"></div>
              {/* Stars around crescent */}
              <div className="absolute -top-2 right-2 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
              <div className="absolute top-4 -right-2 w-1.5 h-1.5 bg-purple-300 rounded-full"></div>
              <div className="absolute bottom-2 -left-2 w-1 h-1 bg-blue-300 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-1 right-4 w-1 h-1 bg-pink-300 rounded-full"></div>
              <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full animate-pulse"></div>
            </div>
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
