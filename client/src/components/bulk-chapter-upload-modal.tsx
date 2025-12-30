import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { uploadToCloudinary } from "@/lib/upload";
import { Loader2, FileArchive, CheckCircle2, AlertCircle, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import JSZip from "jszip";

interface BulkChapterUploadModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    seriesId: string;
    seriesTitle: string;
}

interface FileStatus {
    name: string;
    status: "pending" | "processing" | "uploading" | "creating" | "completed" | "error";
    progress: number;
    error?: string;
    chapterNumber?: number;
}

export function BulkChapterUploadModal({ open, onOpenChange, seriesId, seriesTitle }: BulkChapterUploadModalProps) {
    const queryClient = useQueryClient();
    const [files, setFiles] = useState<FileStatus[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentFileIndex, setCurrentFileIndex] = useState(-1);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []).filter(f => f.name.endsWith('.zip'));
        if (selectedFiles.length === 0) return;

        const newFiles = selectedFiles.map(file => {
            // Try to extract number from filename (e.g. "25.zip" -> 25, "Chapter-26.zip" -> 26)
            const match = file.name.match(/(\d+)/);
            const chapterNumber = match ? parseInt(match[0]) : undefined;

            return {
                file,
                name: file.name,
                status: "pending" as const,
                progress: 0,
                chapterNumber
            };
        });

        // Sort by chapter number if possible
        newFiles.sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0));

        setFiles(newFiles);
    };

    const processQueue = async () => {
        setIsProcessing(true);
        // We need to keep track of the files array in a ref or just iterate carefully
        // Since state updates are async, we'll use a local copy for logic

        const fileInput = document.getElementById('bulk-series-upload') as HTMLInputElement;
        const actualFiles = Array.from(fileInput.files || []).filter(f => f.name.endsWith('.zip'));

        // Sort actual files to match our state
        actualFiles.sort((a, b) => {
            const numA = parseInt(a.name.match(/(\d+)/)?.[0] || "0");
            const numB = parseInt(b.name.match(/(\d+)/)?.[0] || "0");
            return numA - numB;
        });

        for (let i = 0; i < actualFiles.length; i++) {
            setCurrentFileIndex(i);
            const file = actualFiles[i];

            // Extract chapter number
            const match = file.name.match(/(\d+)/);
            if (!match) {
                updateFileStatus(i, "error", 0, "Dosya isminde bölüm numarası bulunamadı (Örn: 25.zip olmalı)");
                continue;
            }
            const chapterNumber = parseInt(match[0]);

            updateFileStatus(i, "processing", 0);

            try {
                // 1. Extract Zip
                const zip = new JSZip();
                const zipContent = await zip.loadAsync(file);
                const imageFiles: { name: string, data: Blob }[] = [];

                for (const [relativePath, zipEntry] of Object.entries(zipContent.files)) {
                    if (!zipEntry.dir && (relativePath.match(/\.(jpg|jpeg|png|webp)$/i))) {
                        const blob = await zipEntry.async("blob");
                        imageFiles.push({ name: relativePath, data: blob });
                    }
                }

                if (imageFiles.length === 0) {
                    updateFileStatus(i, "error", 0, "ZIP boş veya resim bulunamadı");
                    continue;
                }

                // Sort images
                imageFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

                // 2. Upload to Cloudinary
                updateFileStatus(i, "uploading", 10);
                const uploadedUrls: string[] = [];

                for (let j = 0; j < imageFiles.length; j++) {
                    const imageFile = new File([imageFiles[j].data], imageFiles[j].name, { type: imageFiles[j].data.type });
                    const url = await uploadToCloudinary(imageFile);
                    uploadedUrls.push(url);

                    const progress = 10 + Math.round(((j + 1) / imageFiles.length) * 80); // 10% to 90%
                    updateFileStatus(i, "uploading", progress);
                }

                // 3. Create Chapter
                updateFileStatus(i, "creating", 90);

                const userStr = localStorage.getItem("noctoon-user");
                const user = userStr ? JSON.parse(userStr) : null;

                const response = await fetch(`/api/admin/series/${seriesId}/chapters`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-user-id": user?.id || ""
                    },
                    body: JSON.stringify({
                        number: chapterNumber,
                        title: `Bölüm ${chapterNumber}`,
                        pages: uploadedUrls,
                        publishAt: null
                    })
                });

                if (!response.ok) {
                    throw new Error("Sunucu hatası");
                }

                updateFileStatus(i, "completed", 100);

            } catch (error) {
                console.error(error);
                updateFileStatus(i, "error", 0, "Hata oluştu");
            }
        }

        setIsProcessing(false);
        queryClient.invalidateQueries({ queryKey: ["/api/series", seriesId, "chapters"] });
    };

    const updateFileStatus = (index: number, status: FileStatus['status'], progress: number, error?: string) => {
        setFiles(prev => {
            const newFiles = [...prev];
            newFiles[index] = { ...newFiles[index], status, progress, error };
            return newFiles;
        });
    };

    const reset = () => {
        setFiles([]);
        setCurrentFileIndex(-1);
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (!isProcessing) {
                onOpenChange(val);
                if (!val) reset();
            }
        }}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Toplu Bölüm Yükle - {seriesTitle}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {!isProcessing && files.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-muted/50">
                            <FileArchive className="h-10 w-10 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">ZIP Dosyalarını Seçin</h3>
                            <p className="text-sm text-muted-foreground text-center mb-4">
                                Bölüm numarası dosya isminden alınır.<br />
                                Örn: "25.zip", "Bolum-26.zip"
                            </p>
                            <div className="relative">
                                <input
                                    type="file"
                                    id="bulk-series-upload"
                                    className="hidden"
                                    multiple
                                    accept=".zip"
                                    onChange={handleFileSelect}
                                />
                                <Label
                                    htmlFor="bulk-series-upload"
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90"
                                >
                                    Dosyaları Seç
                                </Label>
                            </div>
                        </div>
                    )}

                    {files.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex justify-between items-center bg-muted p-2 rounded-md">
                                <span className="text-sm font-medium">{files.length} dosya seçildi</span>
                                {!isProcessing && (
                                    <Button variant="ghost" size="sm" onClick={reset}>
                                        <X className="h-4 w-4 mr-2" /> Temizle
                                    </Button>
                                )}
                            </div>

                            <div className="max-h-[300px] overflow-y-auto space-y-2">
                                {files.map((file, idx) => (
                                    <div key={idx} className="p-3 border rounded-md">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium truncate max-w-[200px]">{file.name}</span>
                                            <div className="flex items-center gap-2">
                                                {file.status === "completed" && <span className="text-xs text-green-500 flex items-center"><CheckCircle2 className="h-3 w-3 mr-1" /> Tamamlandı</span>}
                                                {file.status === "error" && <span className="text-xs text-destructive flex items-center"><AlertCircle className="h-3 w-3 mr-1" /> {file.error}</span>}
                                                {file.status === "uploading" && <span className="text-xs text-blue-500">Yükleniyor...</span>}
                                                {file.status === "processing" && <span className="text-xs text-yellow-500">Hazırlanıyor...</span>}
                                                <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                                                    Bölüm {file.chapterNumber ?? "?"}
                                                </span>
                                            </div>
                                        </div>
                                        <Progress value={file.progress} className="h-2" />
                                    </div>
                                ))}
                            </div>

                            {!isProcessing && (
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="outline" onClick={() => onOpenChange(false)}>İptal</Button>
                                    <Button onClick={processQueue} disabled={files.length === 0}>
                                        Yüklemeyi Başlat
                                    </Button>
                                </div>
                            )}

                            {isProcessing && (
                                <div className="flex items-center justify-center p-4">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                                    <span>İşleniyor... Lütfen sayfayı kapatmayın.</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
