import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center pt-20 pb-24">
      <div className="text-center px-4 animate-fade-in">
        <div className="relative inline-block mb-8">
          <div className="text-[150px] md:text-[200px] font-black leading-none bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
            404
          </div>
          <div className="absolute inset-0 text-[150px] md:text-[200px] font-black leading-none bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent blur-2xl opacity-30">
            404
          </div>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          Sayfa Bulunamadı
        </h1>
        
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir. 
          Ana sayfaya dönerek keşfetmeye devam edebilirsiniz.
        </p>

        <Link href="/">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-pink-500 text-white shadow-lg shadow-primary/30"
            data-testid="button-go-home"
          >
            <i className="fas fa-home mr-2" />
            Ana Sayfaya Dön
          </Button>
        </Link>
      </div>
    </div>
  );
}
