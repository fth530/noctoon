import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { GENRES, STATUS_OPTIONS, type Status, type Series } from "@shared/schema";
import { Loader2 } from "lucide-react";

interface EditSeriesModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    series: Series;
}

export function EditSeriesModal({ open, onOpenChange, series }: EditSeriesModalProps) {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        title: series.title,
        description: series.description || "",
        genre: series.genre,
        cover: series.cover,
        author: series.author || "",
        status: series.status as Status
    });

    // Update form when series changes
    useEffect(() => {
        setFormData({
            title: series.title,
            description: series.description || "",
            genre: series.genre,
            cover: series.cover,
            author: series.author || "",
            status: series.status as Status
        });
    }, [series]);

    const mutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const userStr = localStorage.getItem("noctoon-user");
            const user = userStr ? JSON.parse(userStr) : null;

            const response = await fetch(`/api/admin/series/${series.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": user?.id || ""
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to update series");
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/series"] });
            queryClient.invalidateQueries({ queryKey: ["/api/series", series.id] });
            onOpenChange(false);
            toast({
                title: "Başarılı",
                description: "Seri başarıyla güncellendi.",
            });
        },
        onError: (error) => {
            toast({
                title: "Hata",
                description: error.message || "Seri güncellenirken bir hata oluştu.",
                variant: "destructive",
            });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.genre || !formData.cover) {
            toast({
                title: "Eksik Bilgi",
                description: "Lütfen başlık, tür ve kapak görselini eksiksiz doldurun.",
                variant: "destructive",
            });
            return;
        }
        mutation.mutate(formData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Seriyi Düzenle</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Seri Başlığı *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Açıklama</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="genre">Tür *</Label>
                            <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
                                <SelectTrigger>
                                    <SelectValue />
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
                            <Select value={formData.status} onValueChange={(value: Status) => setFormData({ ...formData, status: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUS_OPTIONS.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status === "ongoing" ? "Devam Ediyor" :
                                                status === "completed" ? "Tamamlandı" :
                                                    status === "new" ? "Yeni" : status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cover">Kapak URL *</Label>
                        <Input
                            id="cover"
                            type="url"
                            value={formData.cover}
                            onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="author">Yazar</Label>
                        <Input
                            id="author"
                            value={formData.author}
                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            İptal
                        </Button>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Kaydet
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
