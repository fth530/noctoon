// JSON tabanlı veri storage - Vercel deployment için
import type { Series, Chapter, User, Comment, Like, Favorite } from "../src/shared/schema";

// JSON verilerini doğrudan burada tanımlıyoruz (Vercel serverless için en güvenilir yöntem)
const seriesData: Series[] = [
  {
    id: "series-001",
    title: "Karanlığın Çocuğu",
    description: "Karanlık güçlerle dolu bir dünyada hayatta kalmaya çalışan genç bir kahramanın destansı hikayesi. Gizem, aksiyon ve beklenmedik dönüşlerle dolu.",
    genre: "Aksiyon",
    cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
    status: "ongoing",
    author: "Yuki Tanaka",
    views: 15420,
    rating: 92
  },
  {
    id: "series-002",
    title: "Gümüş Ay Efsanesi",
    description: "Antik bir kehanet, modern dünyada hayat buluyor. Ay ışığının gücünü taşıyan genç bir kadının kaderiyle yüzleşmesi.",
    genre: "Fantastik",
    cover: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop",
    status: "completed",
    author: "Luna Silver",
    views: 28750,
    rating: 95
  },
  {
    id: "series-003",
    title: "Yıldız Tozu",
    description: "Uzayın derinliklerinde geçen, aşk ve macera dolu bir bilim kurgu destanı. Galaksiler arası bir yolculuğa hazır olun.",
    genre: "Bilim Kurgu",
    cover: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=600&fit=crop",
    status: "new",
    author: "Cosmos Writer",
    views: 5230,
    rating: 88
  },
  {
    id: "series-004",
    title: "Demir Şövalye",
    description: "Onur, cesaret ve fedakarlık üzerine kurulu bir ortaçağ hikayesi. Krallığını korumak için savaşan bir şövalyenin destanı.",
    genre: "Tarihi",
    cover: "https://images.unsplash.com/photo-1531686264889-56fdcabd163f?w=400&h=600&fit=crop",
    status: "ongoing",
    author: "Arthur Knight",
    views: 12890,
    rating: 90
  },
  {
    id: "series-005",
    title: "Aşkın Melodisi",
    description: "Müzik dünyasında geçen romantik bir hikaye. İki rakip müzisyenin beklenmedik aşkı.",
    genre: "Romantik",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop",
    status: "completed",
    author: "Melody Rose",
    views: 45200,
    rating: 97
  },
  {
    id: "series-006",
    title: "Gölgelerin Efendisi",
    description: "Korku ve gerilim dolu bir atmosferde geçen, ürpertici bir gizem hikayesi.",
    genre: "Korku",
    cover: "https://images.unsplash.com/photo-1509248961925-b5837da318b0?w=400&h=600&fit=crop",
    status: "new",
    author: "Dark Shadow",
    views: 8900,
    rating: 85
  },
  {
    id: "series-007",
    title: "Komedi Kralı",
    description: "Hayatın zorluklarıyla komik bir şekilde başa çıkan bir gencin eğlenceli maceraları.",
    genre: "Komedi",
    cover: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=400&h=600&fit=crop",
    status: "ongoing",
    author: "Happy Writer",
    views: 22100,
    rating: 91
  },
  {
    id: "series-008",
    title: "Kader Oyunu",
    description: "Dramatik dönüşlerle dolu, derin karakterlere sahip etkileyici bir dram.",
    genre: "Dram",
    cover: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&h=600&fit=crop",
    status: "completed",
    author: "Drama Queen",
    views: 31500,
    rating: 94
  }
];

const chaptersData: Chapter[] = [
  // Series 001 - Karanlığın Çocuğu
  {
    id: "chapter-001-01",
    seriesId: "series-001",
    number: 1,
    title: "Başlangıç",
    pages: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531686264889-56fdcabd163f?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=1200&fit=crop&q=80"
    ]
  },
  {
    id: "chapter-001-02",
    seriesId: "series-001",
    number: 2,
    title: "Karanlık Güçler",
    pages: [
      "https://images.unsplash.com/photo-1509248961925-b5837da318b0?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop&q=80"
    ]
  },
  {
    id: "chapter-001-03",
    seriesId: "series-001",
    number: 3,
    title: "Savaş Başladı",
    pages: [
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531686264889-56fdcabd163f?w=800&h=1200&fit=crop&q=80"
    ]
  },
  // Series 002 - Gümüş Ay Efsanesi
  {
    id: "chapter-002-01",
    seriesId: "series-002",
    number: 1,
    title: "Ay Işığı",
    pages: [
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=1200&fit=crop&q=80"
    ]
  },
  {
    id: "chapter-002-02",
    seriesId: "series-002",
    number: 2,
    title: "Kehanet",
    pages: [
      "https://images.unsplash.com/photo-1509248961925-b5837da318b0?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&h=1200&fit=crop&q=80"
    ]
  },
  {
    id: "chapter-002-03",
    seriesId: "series-002",
    number: 3,
    title: "Gümüş Savaşçı",
    pages: [
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531686264889-56fdcabd163f?w=800&h=1200&fit=crop&q=80"
    ]
  },
  // Series 003 - Yıldız Tozu
  {
    id: "chapter-003-01",
    seriesId: "series-003",
    number: 1,
    title: "Uzaya Yolculuk",
    pages: [
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop&q=80"
    ]
  },
  {
    id: "chapter-003-02",
    seriesId: "series-003",
    number: 2,
    title: "Galaksi Savaşı",
    pages: [
      "https://images.unsplash.com/photo-1509248961925-b5837da318b0?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&h=1200&fit=crop&q=80"
    ]
  },
  // Series 004 - Demir Şövalye
  {
    id: "chapter-004-01",
    seriesId: "series-004",
    number: 1,
    title: "Şövalyenin Yemini",
    pages: [
      "https://images.unsplash.com/photo-1531686264889-56fdcabd163f?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=1200&fit=crop&q=80"
    ]
  },
  {
    id: "chapter-004-02",
    seriesId: "series-004",
    number: 2,
    title: "Krallık Tehlikede",
    pages: [
      "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509248961925-b5837da318b0?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531686264889-56fdcabd163f?w=800&h=1200&fit=crop&q=80"
    ]
  },
  // Series 005 - Aşkın Melodisi
  {
    id: "chapter-005-01",
    seriesId: "series-005",
    number: 1,
    title: "İlk Nota",
    pages: [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=1200&fit=crop&q=80"
    ]
  },
  {
    id: "chapter-005-02",
    seriesId: "series-005",
    number: 2,
    title: "Düet",
    pages: [
      "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&h=1200&fit=crop&q=80"
    ]
  },
  {
    id: "chapter-005-03",
    seriesId: "series-005",
    number: 3,
    title: "Konser Gecesi",
    pages: [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509248961925-b5837da318b0?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=1200&fit=crop&q=80"
    ]
  },
  // Series 006 - Gölgelerin Efendisi
  {
    id: "chapter-006-01",
    seriesId: "series-006",
    number: 1,
    title: "Karanlık Ev",
    pages: [
      "https://images.unsplash.com/photo-1509248961925-b5837da318b0?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop&q=80"
    ]
  },
  {
    id: "chapter-006-02",
    seriesId: "series-006",
    number: 2,
    title: "Gölgeler",
    pages: [
      "https://images.unsplash.com/photo-1509248961925-b5837da318b0?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&h=1200&fit=crop&q=80"
    ]
  },
  // Series 007 - Komedi Kralı
  {
    id: "chapter-007-01",
    seriesId: "series-007",
    number: 1,
    title: "Komik Başlangıç",
    pages: [
      "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=1200&fit=crop&q=80"
    ]
  },
  {
    id: "chapter-007-02",
    seriesId: "series-007",
    number: 2,
    title: "Gülme Krizi",
    pages: [
      "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&h=1200&fit=crop&q=80"
    ]
  },
  // Series 008 - Kader Oyunu
  {
    id: "chapter-008-01",
    seriesId: "series-008",
    number: 1,
    title: "Kader Çarkı",
    pages: [
      "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=1200&fit=crop&q=80"
    ]
  },
  {
    id: "chapter-008-02",
    seriesId: "series-008",
    number: 2,
    title: "Son Karar",
    pages: [
      "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509248961925-b5837da318b0?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531686264889-56fdcabd163f?w=800&h=1200&fit=crop&q=80"
    ]
  },
  {
    id: "chapter-008-03",
    seriesId: "series-008",
    number: 3,
    title: "Final",
    pages: [
      "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&h=1200&fit=crop&q=80"
    ]
  }
];

const usersData: User[] = [
  {
    id: "user-admin-001",
    username: "admin",
    password: "admin123",
    role: "admin",
    avatar: null
  }
];

// Helper function
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Storage objesi - JSON verilerinden başlatılıyor
interface StorageType {
  users: Map<string, User>;
  series: Map<string, Series>;
  chapters: Map<string, Chapter>;
  comments: Map<string, Comment>;
  likes: Map<string, Like>;
  favorites: Map<string, Favorite>;
}

// Global storage (Vercel cold start'lar arasında korunmaya çalışılır)
declare global {
  var __storage: StorageType | undefined;
}

function createStorage(): StorageType {
  const storage: StorageType = {
    users: new Map(),
    series: new Map(),
    chapters: new Map(),
    comments: new Map(),
    likes: new Map(),
    favorites: new Map()
  };

  // JSON verilerini Map'lere yükle
  seriesData.forEach(s => storage.series.set(s.id, s));
  chaptersData.forEach(c => storage.chapters.set(c.id, c));
  usersData.forEach(u => storage.users.set(u.id, u));

  return storage;
}

// Storage'ı başlat veya mevcut olanı kullan
const storage = global.__storage || createStorage();

if (!global.__storage) {
  global.__storage = storage;
}

// Veriyi yeniden yükle (cold start durumunda)
function initializeData() {
  // Eğer seriler boşsa, yeniden yükle
  if (storage.series.size === 0) {
    seriesData.forEach(s => storage.series.set(s.id, s));
    chaptersData.forEach(c => storage.chapters.set(c.id, c));
    usersData.forEach(u => storage.users.set(u.id, u));
    console.log("Data reloaded from JSON");
  }

  // Admin kullanıcısının var olduğundan emin ol
  const adminExists = Array.from(storage.users.values()).some(u => u.username === "admin");
  if (!adminExists) {
    usersData.forEach(u => storage.users.set(u.id, u));
  }
}

export { storage, generateId, initializeData };
