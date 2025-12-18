// Mock data storage for Vercel deployment
import type { Series, Chapter, User, Comment, Like, Favorite } from "../src/shared/schema";

// Simple in-memory storage (will reset on each serverless function invocation)
// For production, you should use a database like Vercel Postgres, MongoDB, etc.

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Seed data
const seedSeries: Omit<Series, "id">[] = [
  {
    title: "Karanlığın Çocuğu",
    description: "Karanlık güçlerle dolu bir dünyada hayatta kalmaya çalışan genç bir kahramanın destansı hikayesi. Gizem, aksiyon ve beklenmedik dönüşlerle dolu.",
    genre: "Aksiyon",
    cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
    status: "ongoing",
    author: "Yuki Tanaka",
    views: 15420,
    rating: 92,
  },
  {
    title: "Gümüş Ay Efsanesi",
    description: "Antik bir kehanet, modern dünyada hayat buluyor. Ay ışığının gücünü taşıyan genç bir kadının kaderiyle yüzleşmesi.",
    genre: "Fantastik",
    cover: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop",
    status: "completed",
    author: "Luna Silver",
    views: 28750,
    rating: 95,
  },
  {
    title: "Yıldız Tozu",
    description: "Uzayın derinliklerinde geçen, aşk ve macera dolu bir bilim kurgu destanı. Galaksiler arası bir yolculuğa hazır olun.",
    genre: "Bilim Kurgu",
    cover: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=600&fit=crop",
    status: "new",
    author: "Cosmos Writer",
    views: 5230,
    rating: 88,
  },
  {
    title: "Demir Şövalye",
    description: "Onur, cesaret ve fedakarlık üzerine kurulu bir ortaçağ hikayesi. Krallığını korumak için savaşan bir şövalyenin destanı.",
    genre: "Tarihi",
    cover: "https://images.unsplash.com/photo-1531686264889-56fdcabd163f?w=400&h=600&fit=crop",
    status: "ongoing",
    author: "Arthur Knight",
    views: 12890,
    rating: 90,
  },
  {
    title: "Aşkın Melodisi",
    description: "Müzik dünyasında geçen romantik bir hikaye. İki rakip müzisyenin beklenmedik aşkı.",
    genre: "Romantik",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop",
    status: "completed",
    author: "Melody Rose",
    views: 45200,
    rating: 97,
  },
  {
    title: "Gölgelerin Efendisi",
    description: "Korku ve gerilim dolu bir atmosferde geçen, ürpertici bir gizem hikayesi.",
    genre: "Korku",
    cover: "https://images.unsplash.com/photo-1509248961925-b5837da318b0?w=400&h=600&fit=crop",
    status: "new",
    author: "Dark Shadow",
    views: 8900,
    rating: 85,
  },
  {
    title: "Komedi Kralı",
    description: "Hayatın zorluklarıyla komik bir şekilde başa çıkan bir gencin eğlenceli maceraları.",
    genre: "Komedi",
    cover: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=400&h=600&fit=crop",
    status: "ongoing",
    author: "Happy Writer",
    views: 22100,
    rating: 91,
  },
  {
    title: "Kader Oyunu",
    description: "Dramatik dönüşlerle dolu, derin karakterlere sahip etkileyici bir dram.",
    genre: "Dram",
    cover: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400&h=600&fit=crop",
    status: "completed",
    author: "Drama Queen",
    views: 31500,
    rating: 94,
  },
];

// Use global storage to persist data across serverless function invocations
declare global {
  var __storage: {
    users: Map<string, User>;
    series: Map<string, Series>;
    chapters: Map<string, Chapter>;
    comments: Map<string, Comment>;
    likes: Map<string, Like>;
    favorites: Map<string, Favorite>;
  } | undefined;
}

// Initialize storage (reuse if exists in global scope)
const storage = global.__storage || {
  users: new Map<string, User>(),
  series: new Map<string, Series>(),
  chapters: new Map<string, Chapter>(),
  comments: new Map<string, Comment>(),
  likes: new Map<string, Like>(),
  favorites: new Map<string, Favorite>(),
};

if (!global.__storage) {
  global.__storage = storage;
}

// Initialize seed data
function initData() {
  // Only seed if storage is empty
  if (storage.series.size > 0) {
    return;
  }

  // Admin user
  const adminId = generateId();
  storage.users.set(adminId, {
    id: adminId,
    username: "admin",
    password: "admin123",
    role: "admin",
    avatar: null,
  });

  // Seed series
  seedSeries.forEach((s) => {
    const id = generateId();
    storage.series.set(id, { ...s, id });

    // Add chapters for each series
    for (let i = 1; i <= 5; i++) {
      const chapterId = generateId();
      storage.chapters.set(chapterId, {
        id: chapterId,
        seriesId: id,
        number: i,
        title: `Bölüm ${i}`,
        pages: [
          `https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop&q=80`,
          `https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=1200&fit=crop&q=80`,
          `https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=1200&fit=crop&q=80`,
          `https://images.unsplash.com/photo-1531686264889-56fdcabd163f?w=800&h=1200&fit=crop&q=80`,
          `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=1200&fit=crop&q=80`,
        ],
      });
    }
  });
}

// Initialize on module load (will be called on first import)
initData();

// Export initData for manual initialization if needed
export function initializeData() {
  initData();
}

export { storage, generateId };

