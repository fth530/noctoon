import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadToCloudinary } from "@/lib/upload";
import { Loader2, Plus, Trash2, Upload, CloudUpload } from "lucide-react";

interface AddChapterModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    seriesId: string;
    seriesTitle: string;
}

export function AddChapterModal({ open, onOpenChange, seriesId, seriesTitle }: AddChapterModalProps) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        number: 1,
        title: "",
        pages: [""]
    });

    const mutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const userStr = localStorage.getItem("noctoon-user");
            const user = userStr ? JSON.parse(userStr) : null;

            const response = await fetch(`/api/admin/series/${seriesId}/chapters`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": user?.id || ""
                },
                body: JSON.stringify({
                    ...data,
                    pages: data.pages.filter(p => p.trim() !== "")
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to create chapter");
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/series", seriesId, "chapters"] });
            onOpenChange(false);
            setFormData({ number: 1, title: "", pages: [""] });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validPages = formData.pages.filter(p => p.trim() !== "");
        if (!formData.title || validPages.length === 0) {
            alert("Başlık ve en az 1 sayfa URL'si zorunludur!");
            return;
        }
        mutation.mutate(formData);
    };

    const addPage = () => {
        setFormData({ ...formData, pages: [...formData.pages, ""] });
    };

    const removePage = (index: number) => {
        const newPages = formData.pages.filter((_, i) => i !== index);
        setFormData({ ...formData, pages: newPages.length > 0 ? newPages : [""] });
    };

    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const updatePage = (index: number, value: string) => {
        const newPages = [...formData.pages];
        newPages[index] = value;
        setFormData({ ...formData, pages: newPages });
    };

    const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        setUploadProgress(0);
        const uploadedUrls: string[] = [];
        const totalFiles = files.length;

        try {
            for (let i = 0; i < totalFiles; i++) {
                const url = await uploadToCloudinary(files[i]);
                uploadedUrls.push(url);
                setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
            }

            // Add uploaded URLs to pages, filtering out empty initial page if exists
            setFormData(prev => {
                const currentPages = prev.pages.filter(p => p.trim() !== "");
                return {
                    ...prev,
                    pages: [...currentPages, ...uploadedUrls]
                };
            });
        } catch (error) {
            console.error(error);
            alert("Bazı dosyalar yüklenirken hata oluştu!");
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Bölüm Ekle - {seriesTitle}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="number">Bölüm Numarası *</Label>
                            <Input
                                id="number"
                                type="number"
                                min="1"
                                value={formData.number}
                                onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) || 1 })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Bölüm Başlığı *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Örn: Uyanış"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Sayfa URL'leri *</Label>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="bulk-upload"
                                        className="hidden"
                                        multiple
                                        accept="image/*"
                                        onChange={handleBulkUpload}
                                        disabled={isUploading}
                                    />
                                    <Label
                                        htmlFor="bulk-upload"
                                        className={`flex items-center justify-center h-8 px-3 text-xs bg-green-600 text-white rounded-md cursor-pointer hover:bg-green-700 transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isUploading ? (
                                            <>
                                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                                %{uploadProgress}
                                            </>
                                        ) : (
                                            <>
                                                <CloudUpload className="h-3 w-3 mr-1" />
                                                Toplu Yükle
                                            </>
                                        )}
                                    </Label>
                                </div>
                                <Button type="button" variant="outline" size="sm" onClick={addPage} disabled={isUploading}>
                                    <Plus className="h-4 w-4 mr-1" />
                                    URL Ekle
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {formData.pages.map((page, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={page}
                                        onChange={(e) => updatePage(index, e.target.value)}
                                        placeholder={`Sayfa ${index + 1} URL'si`}
                                    />
                                    {formData.pages.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removePage(index)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Görselleri Imgur'a yükleyip URL'lerini buraya yapıştırın
                        </p>
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

                    {mutation.isError && (
                        <p className="text-sm text-destructive">{(mutation.error as Error).message}</p>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
}
