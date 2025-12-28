import "dotenv/config";
import { db } from "./server/db";
import { users, series, chapters } from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

async function seed() {
    console.log("🌱 Seeding database...");

    // Check if admin exists
    const existingAdmin = await db.select().from(users).limit(1);

    if (existingAdmin.length > 0) {
        console.log("✅ Database already seeded!");
        return;
    }

    // Seed admin user
    const adminId = randomUUID();
    const hashedAdminPassword = bcrypt.hashSync("admin123", 10);
    await db.insert(users).values({
        id: adminId,
        username: "admin",
        password: hashedAdminPassword,
        role: "admin",
        avatar: null,
    });
    console.log("✅ Admin user created");

    // Seed sample series
    const sampleSeries = [
        {
            title: "Karanlığın Çocuğu",
            description: "Karanlık güçlerle dolu bir dünyada hayatta kalmaya çalışan genç bir kahramanın destansı hikayesi.",
            genre: "Aksiyon",
            cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
            status: "ongoing",
            author: "Yuki Tanaka",
            views: 15420,
            rating: 92,
        },
        {
            title: "Gümüş Ay Efsanesi",
            description: "Antik bir kehanet, modern dünyada hayat buluyor.",
            genre: "Fantastik",
            cover: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop",
            status: "completed",
            author: "Luna Silver",
            views: 28750,
            rating: 95,
        },
        {
            title: "Yıldız Tozu",
            description: "Uzayın derinliklerinde geçen bilim kurgu destanı.",
            genre: "Bilim Kurgu",
            cover: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=600&fit=crop",
            status: "new",
            author: "Cosmos Writer",
            views: 5230,
            rating: 88,
        },
        {
            title: "Demir Şövalye",
            description: "Ortaçağ şövalye hikayesi.",
            genre: "Tarihi",
            cover: "https://images.unsplash.com/photo-1531686264889-56fdcabd163f?w=400&h=600&fit=crop",
            status: "ongoing",
            author: "Arthur Knight",
            views: 12890,
            rating: 90,
        },
        {
            title: "Aşkın Melodisi",
            description: "Müzik dünyasında romantik hikaye.",
            genre: "Romantik",
            cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop",
            status: "completed",
            author: "Melody Rose",
            views: 45200,
            rating: 97,
        },
        {
            title: "Gölgelerin Efendisi",
            description: "Korku ve gerilim dolu gizem.",
            genre: "Korku",
            cover: "https://images.unsplash.com/photo-1509248961925-b5837da318b0?w=400&h=600&fit=crop",
            status: "new",
            author: "Dark Shadow",
            views: 8900,
            rating: 85,
        },
        {
            title: "Komedi Kralı",
            description: "Eğlenceli maceralar.",
            genre: "Komedi",
            cover: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=400&h=600&fit=crop",
            status: "ongoing",
            author: "Happy Writer",
            views: 22100,
            rating: 91,
        },
        {
            title: "Kader Oyunu",
            description: "Dramatik dönüşlerle dolu hikaye.",
            genre: "Dram",
            cover: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400&h=600&fit=crop",
            status: "completed",
            author: "Drama Queen",
            views: 31500,
            rating: 94,
        },
    ];

    for (const s of sampleSeries) {
        const seriesId = randomUUID();
        await db.insert(series).values({
            ...s,
            id: seriesId,
            description: s.description ?? null,
            author: s.author ?? null,
        });

        // Add 5 chapters for each series
        for (let i = 1; i <= 5; i++) {
            const chapterId = randomUUID();
            await db.insert(chapters).values({
                id: chapterId,
                seriesId,
                number: i,
                title: `Bölüm ${i}`,
                pages: [
                    `https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop&q=80`,
                    `https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=1200&fit=crop&q=80`,
                    `https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=1200&fit=crop&q=80`,
                ],
            });
        }
    }

    console.log("✅ Seeded 8 series with chapters!");
    console.log("🎉 Database seeding complete!");
}

seed()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    });
