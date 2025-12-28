import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogIn, Home } from "lucide-react";

export function LoginPage() {
    const [, setLocation] = useLocation();
    const { login, isAuthenticated } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // If already logged in, redirect
    if (isAuthenticated) {
        return (
            <div className="min-h-screen pt-20 pb-24 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Zaten giriş yaptınız!</h2>
                    <Button onClick={() => setLocation("/")} className="bg-gradient-to-r from-primary to-pink-500">
                        <Home className="h-4 w-4 mr-2" />
                        Ana Sayfaya Dön
                    </Button>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const success = await login(username, password);
            if (success) {
                setLocation("/");
            } else {
                setError("Kullanıcı adı veya şifre hatalı!");
            }
        } catch {
            setError("Giriş yapılırken bir hata oluştu.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-24 flex items-center justify-center px-4">
            <Card className="w-full max-w-md animate-fade-in">
                <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center">
                        <LogIn className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl">Giriş Yap</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Kullanıcı Adı</Label>
                            <Input
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Kullanıcı adınız"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Şifre</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Şifreniz"
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-destructive text-center">{error}</p>
                        )}

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Giriş Yap
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <Button variant="ghost" onClick={() => setLocation("/")}>
                            Ana Sayfaya Dön
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
