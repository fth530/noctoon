
// Helper for client-side Cloudinary uploads
// 1. Gets signature from backend
// 2. Uploads file directly to Cloudinary
// 3. Returns the secure URL

interface CloudinarySignature {
    signature: string;
    timestamp: number;
    cloudName: string;
    apiKey: string;
}

export async function uploadToCloudinary(file: File): Promise<string> {
    try {
        // 1. Get signature from backend
        const signRes = await fetch("/api/admin/cloudinary-sign");
        if (!signRes.ok) throw new Error("İmza alınamadı");

        const { signature, timestamp, cloudName, apiKey } = await signRes.json() as CloudinarySignature;

        // 2. Upload to Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp.toString());
        formData.append("signature", signature);
        formData.append("folder", "noctoon");

        const uploadRes = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        if (!uploadRes.ok) {
            const error = await uploadRes.json();
            throw new Error(error.message || "Yükleme başarısız");
        }

        const data = await uploadRes.json();
        return data.secure_url;
    } catch (error) {
        console.error("Upload error:", error);
        throw error;
    }
}
