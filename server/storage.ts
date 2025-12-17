import {
  type User,
  type InsertUser,
  type Series,
  type InsertSeries,
  type Chapter,
  type InsertChapter,
  type Comment,
  type InsertComment,
  type Like,
  type InsertLike,
  type Favorite,
  type InsertFavorite,
  type ReadingProgress,
  type InsertReadingProgress,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Series
  getAllSeries(): Promise<Series[]>;
  getSeriesById(id: string): Promise<Series | undefined>;
  createSeries(series: InsertSeries): Promise<Series>;
  updateSeries(id: string, series: Partial<InsertSeries>): Promise<Series | undefined>;
  deleteSeries(id: string): Promise<boolean>;
  incrementViews(id: string): Promise<void>;

  // Chapters
  getChaptersBySeriesId(seriesId: string): Promise<Chapter[]>;
  getChapterById(id: string): Promise<Chapter | undefined>;
  createChapter(chapter: InsertChapter): Promise<Chapter>;

  // Comments
  getCommentsBySeriesId(seriesId: string): Promise<Comment[]>;
  getAllComments(): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  deleteComment(id: string): Promise<boolean>;

  // Likes
  getLikesByUserId(userId: string): Promise<Like[]>;
  getLikesBySeriesId(seriesId: string): Promise<Like[]>;
  toggleLike(seriesId: string, userId: string): Promise<boolean>;
  getTotalLikes(): Promise<number>;

  // Favorites
  getFavoritesByUserId(userId: string): Promise<Favorite[]>;
  toggleFavorite(seriesId: string, userId: string): Promise<boolean>;
  getTotalFavorites(): Promise<number>;

  // Reading Progress
  getReadingProgress(userId: string, seriesId: string): Promise<ReadingProgress | undefined>;
  updateReadingProgress(progress: InsertReadingProgress): Promise<ReadingProgress>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private series: Map<string, Series>;
  private chapters: Map<string, Chapter>;
  private comments: Map<string, Comment>;
  private likes: Map<string, Like>;
  private favorites: Map<string, Favorite>;
  private readingProgress: Map<string, ReadingProgress>;

  constructor() {
    this.users = new Map();
    this.series = new Map();
    this.chapters = new Map();
    this.comments = new Map();
    this.likes = new Map();
    this.favorites = new Map();
    this.readingProgress = new Map();

    this.seedData();
  }

  private seedData() {
    // Seed admin user
    const adminId = randomUUID();
    this.users.set(adminId, {
      id: adminId,
      username: "admin",
      password: "admin123",
      role: "admin",
      avatar: null,
    });

    // Seed sample series
    const sampleSeries: Omit<Series, "id">[] = [
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

    sampleSeries.forEach((s) => {
      const id = randomUUID();
      this.series.set(id, { ...s, id });

      // Add sample chapters for each series
      for (let i = 1; i <= 5; i++) {
        const chapterId = randomUUID();
        this.chapters.set(chapterId, {
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

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      role: "user",
      avatar: null,
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Series
  async getAllSeries(): Promise<Series[]> {
    return Array.from(this.series.values());
  }

  async getSeriesById(id: string): Promise<Series | undefined> {
    return this.series.get(id);
  }

  async createSeries(insertSeries: InsertSeries): Promise<Series> {
    const id = randomUUID();
    const series: Series = { ...insertSeries, id };
    this.series.set(id, series);
    return series;
  }

  async updateSeries(id: string, updates: Partial<InsertSeries>): Promise<Series | undefined> {
    const series = this.series.get(id);
    if (!series) return undefined;
    const updated = { ...series, ...updates };
    this.series.set(id, updated);
    return updated;
  }

  async deleteSeries(id: string): Promise<boolean> {
    return this.series.delete(id);
  }

  async incrementViews(id: string): Promise<void> {
    const series = this.series.get(id);
    if (series) {
      series.views = (series.views || 0) + 1;
      this.series.set(id, series);
    }
  }

  // Chapters
  async getChaptersBySeriesId(seriesId: string): Promise<Chapter[]> {
    return Array.from(this.chapters.values())
      .filter((c) => c.seriesId === seriesId)
      .sort((a, b) => a.number - b.number);
  }

  async getChapterById(id: string): Promise<Chapter | undefined> {
    return this.chapters.get(id);
  }

  async createChapter(insertChapter: InsertChapter): Promise<Chapter> {
    const id = randomUUID();
    const chapter: Chapter = { ...insertChapter, id };
    this.chapters.set(id, chapter);
    return chapter;
  }

  // Comments
  async getCommentsBySeriesId(seriesId: string): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter((c) => c.seriesId === seriesId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getAllComments(): Promise<Comment[]> {
    return Array.from(this.comments.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = randomUUID();
    const comment: Comment = { ...insertComment, id };
    this.comments.set(id, comment);
    return comment;
  }

  async deleteComment(id: string): Promise<boolean> {
    return this.comments.delete(id);
  }

  // Likes
  async getLikesByUserId(userId: string): Promise<Like[]> {
    return Array.from(this.likes.values()).filter((l) => l.userId === userId);
  }

  async getLikesBySeriesId(seriesId: string): Promise<Like[]> {
    return Array.from(this.likes.values()).filter((l) => l.seriesId === seriesId);
  }

  async toggleLike(seriesId: string, userId: string): Promise<boolean> {
    const existing = Array.from(this.likes.values()).find(
      (l) => l.seriesId === seriesId && l.userId === userId
    );

    if (existing) {
      this.likes.delete(existing.id);
      return false;
    } else {
      const id = randomUUID();
      this.likes.set(id, { id, seriesId, userId });
      return true;
    }
  }

  async getTotalLikes(): Promise<number> {
    return this.likes.size;
  }

  // Favorites
  async getFavoritesByUserId(userId: string): Promise<Favorite[]> {
    return Array.from(this.favorites.values()).filter((f) => f.userId === userId);
  }

  async toggleFavorite(seriesId: string, userId: string): Promise<boolean> {
    const existing = Array.from(this.favorites.values()).find(
      (f) => f.seriesId === seriesId && f.userId === userId
    );

    if (existing) {
      this.favorites.delete(existing.id);
      return false;
    } else {
      const id = randomUUID();
      this.favorites.set(id, { id, seriesId, userId });
      return true;
    }
  }

  async getTotalFavorites(): Promise<number> {
    return this.favorites.size;
  }

  // Reading Progress
  async getReadingProgress(
    userId: string,
    seriesId: string
  ): Promise<ReadingProgress | undefined> {
    return Array.from(this.readingProgress.values()).find(
      (rp) => rp.userId === userId && rp.seriesId === seriesId
    );
  }

  async updateReadingProgress(
    insertProgress: InsertReadingProgress
  ): Promise<ReadingProgress> {
    const existing = await this.getReadingProgress(
      insertProgress.userId,
      insertProgress.seriesId
    );

    if (existing) {
      const updated = { ...existing, ...insertProgress };
      this.readingProgress.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const progress: ReadingProgress = { ...insertProgress, id };
      this.readingProgress.set(id, progress);
      return progress;
    }
  }
}

export const storage = new MemStorage();
