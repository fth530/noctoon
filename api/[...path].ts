import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// HTML entities for XSS protection
const htmlEntities: Record<string, string> = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;',
  "'": '&#x27;', '/': '&#x2F;', '`': '&#x60;', '=': '&#x3D;'
};

function escapeHtml(text: string): string {
  if (typeof text !== 'string') return '';
  return text.replace(/[&<>"'`=\/]/g, (char) => htmlEntities[char] || char);
}

function sanitizeComment(text: string): string {
  if (typeof text !== 'string') return '';
  return escapeHtml(text.trim().substring(0, 2000).replace(/\0/g, ''));
}

function sanitizeUsername(username: string): string {
  if (typeof username !== 'string') return '';
  return username.trim().substring(0, 50).replace(/[^a-zA-Z0-9_-]/g, '');
}

// ==================== DATA ====================

interface Series {
  id: string;
  title: string;
  description: string | null;
  genre: string;
  cover: string;
  status: "ongoing" | "completed" | "new";
  author: string | null;
  views: number;
  rating: number;
}

interface Chapter {
  id: string;
  seriesId: string;
  number: number;
  title: string;
  pages: string[];
}

interface User {
  id: string;
  username: string;
  password: string;
  role: string;
  avatar: string | null;
}

interface Comment {
  id: string;
  seriesId: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
}

interface Like {
  id: string;
  seriesId: string;
  userId: string;
}

interface Favorite {
  id: string;
  seriesId: string;
  userId: string;
}

const seriesData: Series[] = [
  {
    id: "series-001",
    title: "Karanlığın Çocuğu",
    description: "Karanlık güçlerle dolu bir dünyada hayatta kalmaya çalışan genç bir kahramanın destansı hikayesi.",
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
    description: "Antik bir kehanet, modern dünyada hayat buluyor.",
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
    description: "Uzayın derinliklerinde geçen, aşk ve macera dolu bir bilim kurgu destanı.",
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
    description: "Onur, cesaret ve fedakarlık üzerine kurulu bir ortaçağ hikayesi.",
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
    description: "Müzik dünyasında geçen romantik bir hikaye.",
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
    cover: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400&h=600&fit=crop",
    status: "completed",
    author: "Drama Queen",
    views: 31500,
    rating: 94
  }
];

const chaptersData: Chapter[] = [
  { id: "chapter-001-01", seriesId: "series-001", number: 1, title: "Başlangıç", pages: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop", "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=1200&fit=crop", "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=1200&fit=crop"] },
  { id: "chapter-001-02", seriesId: "series-001", number: 2, title: "Karanlık Güçler", pages: ["https://images.unsplash.com/photo-1509248961925-b5837da318b0?w=800&h=1200&fit=crop", "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&h=1200&fit=crop"] },
  { id: "chapter-001-03", seriesId: "series-001", number: 3, title: "Savaş Başladı", pages: ["https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=1200&fit=crop", "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=1200&fit=crop"] },
  { id: "chapter-002-01", seriesId: "series-002", number: 1, title: "Ay Işığı", pages: ["https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=1200&fit=crop", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop"] },
  { id: "chapter-002-02", seriesId: "series-002", number: 2, title: "Kehanet", pages: ["https://images.unsplash.com/photo-1509248961925-b5837da318b0?w=800&h=1200&fit=crop", "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&h=1200&fit=crop"] },
  { id: "chapter-003-01", seriesId: "series-003", number: 1, title: "Uzaya Yolculuk", pages: ["https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=1200&fit=crop", "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=1200&fit=crop"] },
  { id: "chapter-004-01", seriesId: "series-004", number: 1, title: "Şövalyenin Yemini", pages: ["https://images.unsplash.com/photo-1531686264889-56fdcabd163f?w=800&h=1200&fit=crop", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop"] },
  { id: "chapter-005-01", seriesId: "series-005", number: 1, title: "İlk Nota", pages: ["https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=1200&fit=crop", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop"] },
  { id: "chapter-005-02", seriesId: "series-005", number: 2, title: "Düet", pages: ["https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&h=1200&fit=crop", "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=1200&fit=crop"] },
  { id: "chapter-006-01", seriesId: "series-006", number: 1, title: "Karanlık Ev", pages: ["https://images.unsplash.com/photo-1509248961925-b5837da318b0?w=800&h=1200&fit=crop", "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&h=1200&fit=crop"] },
  { id: "chapter-007-01", seriesId: "series-007", number: 1, title: "Komik Başlangıç", pages: ["https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&h=1200&fit=crop", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop"] },
  { id: "chapter-008-01", seriesId: "series-008", number: 1, title: "Kader Çarkı", pages: ["https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&h=1200&fit=crop", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop"] },
  { id: "chapter-008-02", seriesId: "series-008", number: 2, title: "Final", pages: ["https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&h=1200&fit=crop", "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=1200&fit=crop"] }
];

const usersData: User[] = [
  // Password is 'admin123' hashed with bcrypt (10 salt rounds)
  { id: "user-admin-001", username: "admin", password: bcrypt.hashSync("admin123", 10), role: "admin", avatar: null }
];

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Storage
const storage = {
  users: new Map<string, User>(),
  series: new Map<string, Series>(),
  chapters: new Map<string, Chapter>(),
  comments: new Map<string, Comment>(),
  likes: new Map<string, Like>(),
  favorites: new Map<string, Favorite>()
};

function initializeData() {
  if (storage.series.size === 0) {
    seriesData.forEach(s => storage.series.set(s.id, s));
    chaptersData.forEach(c => storage.chapters.set(c.id, c));
    usersData.forEach(u => storage.users.set(u.id, u));
  }
  const users = Array.from(storage.users.values());
  if (!users.some((u: User) => u.username === "admin")) {
    usersData.forEach(u => storage.users.set(u.id, u));
  }
}

// ==================== HANDLER ====================

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Configuration - restrict to allowed origins in production
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:5000", "http://localhost:3000"];

  const origin = req.headers.origin as string;

  if (process.env.NODE_ENV !== "production") {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  } else if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-User-Id");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  initializeData();

  let pathArray: string[] = [];
  let fullPath = "/api";

  if (req.url) {
    const urlPath = req.url.split("?")[0];
    if (urlPath.startsWith("/api/")) {
      pathArray = urlPath.slice(5).split("/").filter(Boolean);
      fullPath = urlPath;
    }
  }

  if (pathArray.length === 0 && req.query.path) {
    if (Array.isArray(req.query.path)) {
      pathArray = req.query.path;
    } else if (typeof req.query.path === "string") {
      pathArray = [req.query.path];
    }
    if (pathArray.length > 0) {
      fullPath = "/api/" + pathArray.join("/");
    }
  }

  const pathParts = pathArray.length > 0 ? ["api", ...pathArray] : ["api"];

  try {
    // AUTH: LOGIN
    if ((fullPath === "/api/auth/login" || pathParts.join("/") === "api/auth/login") && req.method === "POST") {
      let body = req.body;
      if (typeof body === "string") {
        try { body = JSON.parse(body); } catch { return res.status(400).json({ error: "Invalid JSON" }); }
      }

      const { username, password } = body || {};
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      const users = Array.from(storage.users.values());
      const user = users.find((u: User) => u.username.toLowerCase() === username.toLowerCase());

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Use bcrypt to compare passwords securely
      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const { password: _, ...safeUser } = user;
      return res.json(safeUser);
    }

    // AUTH: REGISTER
    if (fullPath === "/api/auth/register" && req.method === "POST") {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Invalid input" });
      }

      const users = Array.from(storage.users.values());
      if (users.find((u: User) => u.username.toLowerCase() === username.toLowerCase())) {
        return res.status(409).json({ error: "Username already exists" });
      }

      // Hash password with bcrypt before storing
      const id = generateId();
      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = { id, username, password: hashedPassword, role: "user", avatar: null };
      storage.users.set(id, user);
      const { password: _, ...safeUser } = user;
      return res.status(201).json(safeUser);
    }

    // SERIES: GET ALL
    if ((fullPath === "/api/series" || pathParts.join("/") === "api/series") && req.method === "GET") {
      const series = Array.from(storage.series.values());
      return res.json(series);
    }

    // SERIES: GET ONE
    if (pathParts.length === 3 && pathParts[1] === "series" && req.method === "GET") {
      const seriesId = pathParts[2];
      const series = storage.series.get(seriesId);
      if (!series) return res.status(404).json({ error: "Series not found" });
      series.views = (series.views || 0) + 1;
      return res.json(series);
    }

    // SERIES: CHAPTERS, COMMENTS, LIKE, FAVORITE
    if (pathParts.length === 4 && pathParts[1] === "series") {
      const seriesId = pathParts[2];
      const action = pathParts[3];

      if (action === "chapters" && req.method === "GET") {
        const chapters = Array.from(storage.chapters.values())
          .filter((c: Chapter) => c.seriesId === seriesId)
          .sort((a: Chapter, b: Chapter) => a.number - b.number);
        return res.json(chapters);
      }

      if (action === "comments") {
        if (req.method === "GET") {
          const comments = Array.from(storage.comments.values())
            .filter((c: Comment) => c.seriesId === seriesId);
          return res.json(comments);
        }
        if (req.method === "POST") {
          const { text, userId, username } = req.body;
          if (!text || !userId || !username) {
            return res.status(400).json({ error: "Missing required fields" });
          }
          // Sanitize user input to prevent XSS attacks
          const sanitizedText = sanitizeComment(text);
          const sanitizedUsername = sanitizeUsername(username);
          if (!sanitizedText || !sanitizedUsername) {
            return res.status(400).json({ error: "Invalid input" });
          }
          const commentId = generateId();
          const comment = { id: commentId, seriesId, userId, username: sanitizedUsername, text: sanitizedText, createdAt: new Date().toLocaleDateString("tr-TR") };
          storage.comments.set(commentId, comment);
          return res.status(201).json(comment);
        }
      }

      if (action === "like" && req.method === "POST") {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ error: "User ID required" });
        const likes = Array.from(storage.likes.values());
        const existing = likes.find((l: Like) => l.seriesId === seriesId && l.userId === userId);
        if (existing) {
          storage.likes.delete(existing.id);
          return res.json({ liked: false });
        }
        const likeId = generateId();
        storage.likes.set(likeId, { id: likeId, seriesId, userId });
        return res.json({ liked: true });
      }

      if (action === "favorite" && req.method === "POST") {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ error: "User ID required" });
        const favorites = Array.from(storage.favorites.values());
        const existing = favorites.find((f: Favorite) => f.seriesId === seriesId && f.userId === userId);
        if (existing) {
          storage.favorites.delete(existing.id);
          return res.json({ favorited: false });
        }
        const favoriteId = generateId();
        storage.favorites.set(favoriteId, { id: favoriteId, seriesId, userId });
        return res.json({ favorited: true });
      }
    }

    // CHAPTERS: GET ONE
    if (pathParts.length === 3 && pathParts[1] === "chapters" && req.method === "GET") {
      const chapterId = pathParts[2];
      const chapter = storage.chapters.get(chapterId);
      if (!chapter) return res.status(404).json({ error: "Chapter not found" });
      return res.json(chapter);
    }

    // USER: LIKES & FAVORITES
    if (pathParts.length === 3 && pathParts[1] === "user" && req.method === "GET") {
      const action = pathParts[2];
      const userId = req.query.userId as string;
      if (!userId) return res.json([]);

      if (action === "likes") {
        const likes = Array.from(storage.likes.values()).filter((l: Like) => l.userId === userId);
        return res.json(likes.map((l: Like) => l.seriesId));
      }
      if (action === "favorites") {
        const favorites = Array.from(storage.favorites.values()).filter((f: Favorite) => f.userId === userId);
        return res.json(favorites.map((f: Favorite) => f.seriesId));
      }
    }

    // ADMIN: STATS
    if (pathParts.length === 3 && pathParts[1] === "admin" && req.method === "GET") {
      // Verify admin authorization
      const userId = req.headers["x-user-id"] as string || req.query.userId as string;

      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const user = storage.users.get(userId) || Array.from(storage.users.values()).find((u: User) => u.id === userId);

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      if (user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }

      const action = pathParts[2];
      if (action === "stats") {
        return res.json({
          totalSeries: storage.series.size,
          totalUsers: storage.users.size,
          totalComments: storage.comments.size,
          totalLikes: storage.likes.size,
          totalFavorites: storage.favorites.size,
        });
      }
      if (action === "recent-comments") {
        const comments = Array.from(storage.comments.values()).slice(0, 20);
        return res.json(comments);
      }

      if (action === "cloudinary-sign") {
        try {
          const timestamp = Math.round(new Date().getTime() / 1000);
          const signature = cloudinary.utils.api_sign_request(
            {
              timestamp: timestamp,
              folder: "noctoon",
            },
            process.env.CLOUDINARY_API_SECRET!
          );

          return res.json({
            signature,
            timestamp,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY
          });
        } catch (error) {
          console.error("Cloudinary sign error:", error);
          return res.status(500).json({ error: "Failed to sign upload request" });
        }
      }
    }

    // ADMIN: CREATE SERIES
    if ((fullPath === "/api/admin/series" || pathParts.join("/") === "api/admin/series") && req.method === "POST") {
      const userId = req.headers["x-user-id"] as string || req.query.userId as string;
      if (!userId) return res.status(401).json({ error: "Authentication required" });

      const user = storage.users.get(userId) || Array.from(storage.users.values()).find((u: User) => u.id === userId);
      if (!user || user.role !== "admin") return res.status(403).json({ error: "Admin access required" });

      const { title, description, genre, cover, author, status } = req.body;
      if (!title || !genre || !cover) {
        return res.status(400).json({ error: "Title, genre, and cover are required" });
      }

      const id = generateId();
      const newSeries: Series = {
        id,
        title: escapeHtml(title),
        description: description ? escapeHtml(description) : null,
        genre: escapeHtml(genre),
        cover,
        author: author ? escapeHtml(author) : null,
        status: status || "ongoing",
        views: 0,
        rating: 85
      };
      storage.series.set(id, newSeries);
      return res.status(201).json(newSeries);
    }

    // ADMIN: DELETE SERIES
    if (pathParts.length === 4 && pathParts[1] === "admin" && pathParts[2] === "series" && req.method === "DELETE") {
      const userId = req.headers["x-user-id"] as string || req.query.userId as string;
      if (!userId) return res.status(401).json({ error: "Authentication required" });

      const user = storage.users.get(userId) || Array.from(storage.users.values()).find((u: User) => u.id === userId);
      if (!user || user.role !== "admin") return res.status(403).json({ error: "Admin access required" });

      const seriesId = pathParts[3];
      if (!storage.series.has(seriesId)) {
        return res.status(404).json({ error: "Series not found" });
      }

      // Delete series and its chapters
      storage.series.delete(seriesId);
      Array.from(storage.chapters.entries()).forEach(([chapterId, chapter]) => {
        if (chapter.seriesId === seriesId) storage.chapters.delete(chapterId);
      });
      return res.json({ success: true });
    }

    // ADMIN: ADD CHAPTER TO SERIES
    if (pathParts.length === 5 && pathParts[1] === "admin" && pathParts[2] === "series" && pathParts[4] === "chapters" && req.method === "POST") {
      const userId = req.headers["x-user-id"] as string || req.query.userId as string;
      if (!userId) return res.status(401).json({ error: "Authentication required" });

      const user = storage.users.get(userId) || Array.from(storage.users.values()).find((u: User) => u.id === userId);
      if (!user || user.role !== "admin") return res.status(403).json({ error: "Admin access required" });

      const seriesId = pathParts[3];
      if (!storage.series.has(seriesId)) {
        return res.status(404).json({ error: "Series not found" });
      }

      const { number, title, pages } = req.body;
      if (!number || !title || !pages || !Array.isArray(pages)) {
        return res.status(400).json({ error: "Number, title, and pages array are required" });
      }

      const id = generateId();
      const newChapter: Chapter = {
        id,
        seriesId,
        number: parseInt(number),
        title: escapeHtml(title),
        pages
      };
      storage.chapters.set(id, newChapter);
      return res.status(201).json(newChapter);
    }

    // ADMIN: DELETE CHAPTER
    if (pathParts.length === 4 && pathParts[1] === "admin" && pathParts[2] === "chapters" && req.method === "DELETE") {
      const userId = req.headers["x-user-id"] as string || req.query.userId as string;
      if (!userId) return res.status(401).json({ error: "Authentication required" });

      const user = storage.users.get(userId) || Array.from(storage.users.values()).find((u: User) => u.id === userId);
      if (!user || user.role !== "admin") return res.status(403).json({ error: "Admin access required" });

      const chapterId = pathParts[3];
      if (!storage.chapters.has(chapterId)) {
        return res.status(404).json({ error: "Chapter not found" });
      }

      storage.chapters.delete(chapterId);
      return res.json({ success: true });
    }

    return res.status(404).json({ error: "Not found" });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
