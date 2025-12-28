import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

interface AddSeriesModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const GENRES = [
    "Aksiyon", "Fantastik", "Bilim Kurgu", "Romantik", "Komedi",
    "Dram", "Korku", "Tarihi", "Spor", "Okul", "Doğaüstü", "Macera"
];

export function AddSeriesModal({ open, onOpenChange }: AddSeriesModalProps) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        genre: "",
        cover: "",
        author: "",
        status: "ongoing" as "ongoing" | "completed" | "new"
    });

    const mutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const userStr = localStorage.getItem("noctoon-user");
            const user = userStr ? JSON.parse(userStr) : null;

            const response = await fetch("/api/admin/series", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": user?.id || ""
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to create series");
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/series"] });
            queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
            onOpenChange(false);
            setFormData({
                title: "",
                description: "",
                genre: "",
                cover: "",
                author: "",
                status: "ongoing"
            });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.genre || !formData.cover) {
            alert("Başlık, Tür ve Kapak URL'si zorunludur!");
            return;
        }
        mutation.mutate(formData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Yeni Seri Ekle</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Seri Başlığı *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Örn: Solo Leveling"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Açıklama</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Hikaye özeti..."
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="genre">Tür *</Label>
                            <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tür Seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    {GENRES.map((genre) => (
                                        <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Durum</Label>
                            <Select value={formData.status} onValueChange={(value: "ongoing" | "completed" | "new") => setFormData({ ...formData, status: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ongoing">Devam Ediyor</SelectItem>
                                    <SelectItem value="completed">Tamamlandı</SelectItem>
                                    <SelectItem value="new">Yeni</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cover">Kapak Resmi URL *</Label>
                        <Input
                            id="cover"
                            type="url"
                            value={formData.cover}
                            onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                            placeholder="https://i.imgur.com/..."
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="author">Yazar</Label>
                        <Input
                            id="author"
                            value={formData.author}
                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            placeholder="Yazar adı"
                        />
                    </div>

                    {formData.cover && (
                        <div className="flex justify-center">
                            <img
                                src={formData.cover}
                                alt="Kapak önizleme"
                                className="w-24 h-36 object-cover rounded-lg border"
                                onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            İptal
                        </Button>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Kaydet
                        </Button>
                    </div>

                    {mutation.isError && (
                        <p className="text-sm text-destructive">{(mutation.error as Error).message}</p>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
}
