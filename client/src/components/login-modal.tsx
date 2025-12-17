import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { User, UserPlus, LogIn, Loader2 } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast({
        title: "Hata",
        description: "Lütfen tüm alanları doldurun.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = isRegister
        ? await register(username, password)
        : await login(username, password);

      if (success) {
        toast({
          title: isRegister ? "Kayıt Başarılı" : "Giriş Başarılı",
          description: `Hoş geldin, ${username}!`,
        });
        setUsername("");
        setPassword("");
        onClose();
      } else {
        toast({
          title: "Hata",
          description: isRegister
            ? "Kayıt oluşturulamadı. Bu kullanıcı adı alınmış olabilir."
            : "Kullanıcı adı veya şifre hatalı.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Hata",
        description: "Bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-pink-500 rounded-xl flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            {isRegister ? "Kayıt Ol" : "Giriş Yap"}
          </DialogTitle>
          <DialogDescription>
            {isRegister
              ? "Yeni hesap oluşturarak Noctoon'a katıl"
              : "Hesabına giriş yaparak devam et"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="username">Kullanıcı Adı</Label>
            <Input
              id="username"
              type="text"
              placeholder="kullanici_adi"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-muted/50"
              data-testid="input-username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Şifre</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-muted/50"
              data-testid="input-password"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary to-pink-500 text-white font-semibold shadow-lg shadow-primary/30"
            data-testid="button-submit-login"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : isRegister ? (
              <UserPlus className="h-4 w-4 mr-2" />
            ) : (
              <LogIn className="h-4 w-4 mr-2" />
            )}
            {isRegister ? "Kayıt Ol" : "Giriş Yap"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">veya</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => setIsRegister(!isRegister)}
            className="w-full"
            data-testid="button-toggle-mode"
          >
            {isRegister ? (
              <>Zaten hesabın var mı? <span className="text-primary ml-1">Giriş Yap</span></>
            ) : (
              <>Hesabın yok mu? <span className="text-primary ml-1">Kayıt Ol</span></>
            )}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Demo: <span className="font-mono">admin / admin123</span> ile yönetici girişi yapabilirsiniz
        </p>
      </DialogContent>
    </Dialog>
  );
}
