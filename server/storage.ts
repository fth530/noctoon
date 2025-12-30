import { eq, and } from "drizzle-orm";
import { db } from "./db";
import {
  users,
  series,
  chapters,
  comments,
  likes,
  favorites,
  readingProgress,
  type User,
  type Series,
  type Chapter,
  type Comment,
  type InsertUser,
  type InsertSeries,
  type InsertChapter,
  type InsertComment,
  type InsertLike,
  type InsertFavorite,
  type InsertReadingProgress,
} from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>; // Alias for getUserById
  getUserById(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Series
  getAllSeries(): Promise<Series[]>;
  getSeriesById(id: string): Promise<Series | undefined>;
  createSeries(series: InsertSeries): Promise<Series>;
  updateSeries(id: string, updates: Partial<InsertSeries>): Promise<Series | undefined>;
  deleteSeries(id: string): Promise<void>;
  incrementViews(id: string): Promise<void>;

  // Chapters
  getChaptersBySeriesId(seriesId: string): Promise<Chapter[]>;
  getChapterById(id: string): Promise<Chapter | undefined>;
  createChapter(chapter: InsertChapter): Promise<Chapter>;
  updateChapter(id: string, updates: Partial<InsertChapter>): Promise<Chapter | undefined>;
  deleteChapter(id: string): Promise<void>;

  // Comments
  getCommentsBySeriesId(seriesId: string): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  getAllComments(): Promise<Comment[]>;

  // Likes
  getLikesByUserId(userId: string): Promise<string[]>;
  toggleLike(like: InsertLike): Promise<void>;
  getTotalLikes(): Promise<number>;

  // Favorites
  getFavoritesByUserId(userId: string): Promise<string[]>;
  toggleFavorite(favorite: InsertFavorite): Promise<void>;
  getTotalFavorites(): Promise<number>;

  // Reading Progress
  getReadingProgress(userId: string, seriesId: string): Promise<number>;
  updateReadingProgress(progress: InsertReadingProgress): Promise<void>;
}

class DatabaseStorage implements IStorage {
  constructor() {
    this.seedData();
  }

  private async seedData() {
    // Check if admin already exists
    const existingAdmin = await db.select().from(users).where(eq(users.username, "admin")).limit(1);

    if (existingAdmin.length === 0) {
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

      for (const s of sampleSeries) {
        const seriesId = randomUUID();
        await db.insert(series).values({
          ...s,
          id: seriesId,
          description: s.description ?? null,
          author: s.author ?? null,
        });

        // Add sample chapters for each series
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
              `https://images.unsplash.com/photo-1531686264889-56fdcabd163f?w=800&h=1200&fit=crop&q=80`,
              `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=1200&fit=crop&q=80`,
            ],
          });
        }
      }
    }
  }

  // Users
  async getUserById(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      username: insertUser.username,
      password: insertUser.password,
      role: "user",
      avatar: null,
    };
    await db.insert(users).values(user);
    return user;
  }

  // Alias for getUserById (backward compatibility)
  async getUser(id: string): Promise<User | undefined> {
    return this.getUserById(id);
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Series
  async getAllSeries(): Promise<Series[]> {
    return await db.select().from(series);
  }

  async getSeriesById(id: string): Promise<Series | undefined> {
    const result = await db.select().from(series).where(eq(series.id, id)).limit(1);
    return result[0];
  }

  async createSeries(insertSeries: InsertSeries): Promise<Series> {
    const id = randomUUID();
    const newSeries: Series = {
      ...insertSeries,
      id,
      description: insertSeries.description ?? null,
      author: insertSeries.author ?? null,
      status: insertSeries.status || "ongoing",
      views: insertSeries.views || 0,
      rating: insertSeries.rating || 0,
    };
    await db.insert(series).values(newSeries);
    return newSeries;
  }

  async updateSeries(id: string, updates: Partial<InsertSeries>): Promise<Series | undefined> {
    await db.update(series).set(updates).where(eq(series.id, id));
    return this.getSeriesById(id);
  }

  async deleteSeries(id: string): Promise<void> {
    await db.delete(series).where(eq(series.id, id));
  }

  async incrementViews(id: string): Promise<void> {
    const currentSeries = await this.getSeriesById(id);
    if (currentSeries) {
      await db.update(series).set({ views: currentSeries.views + 1 }).where(eq(series.id, id));
    }
  }

  // Chapters
  async getChaptersBySeriesId(seriesId: string): Promise<Chapter[]> {
    return await db.select().from(chapters).where(eq(chapters.seriesId, seriesId));
  }

  async getChapterById(id: string): Promise<Chapter | undefined> {
    const result = await db.select().from(chapters).where(eq(chapters.id, id)).limit(1);
    return result[0];
  }

  async createChapter(insertChapter: InsertChapter): Promise<Chapter> {
    const id = randomUUID();
    const chapter: Chapter = {
      ...insertChapter,
      id,
      publishAt: insertChapter.publishAt ?? null,
    };
    await db.insert(chapters).values(chapter);
    return chapter;
  }

  async updateChapter(id: string, updates: Partial<InsertChapter>): Promise<Chapter | undefined> {
    await db.update(chapters).set(updates).where(eq(chapters.id, id));
    return this.getChapterById(id);
  }

  async deleteChapter(id: string): Promise<void> {
    await db.delete(chapters).where(eq(chapters.id, id));
  }

  // Comments
  async getCommentsBySeriesId(seriesId: string): Promise<Comment[]> {
    return await db.select().from(comments).where(eq(comments.seriesId, seriesId));
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = randomUUID();
    const comment: Comment = {
      ...insertComment,
      id,
    };
    await db.insert(comments).values(comment);
    return comment;
  }

  async getAllComments(): Promise<Comment[]> {
    return await db.select().from(comments);
  }

  // Likes
  async getLikesByUserId(userId: string): Promise<string[]> {
    const userLikes = await db.select().from(likes).where(eq(likes.userId, userId));
    return userLikes.map((like) => like.seriesId);
  }

  async toggleLike(insertLike: InsertLike): Promise<void> {
    const existing = await db
      .select()
      .from(likes)
      .where(and(eq(likes.userId, insertLike.userId), eq(likes.seriesId, insertLike.seriesId)))
      .limit(1);

    if (existing.length > 0) {
      await db.delete(likes).where(eq(likes.id, existing[0].id));
    } else {
      const id = randomUUID();
      await db.insert(likes).values({ ...insertLike, id });
    }
  }

  async getTotalLikes(): Promise<number> {
    const result = await db.select().from(likes);
    return result.length;
  }

  // Favorites
  async getFavoritesByUserId(userId: string): Promise<string[]> {
    const userFavorites = await db.select().from(favorites).where(eq(favorites.userId, userId));
    return userFavorites.map((fav) => fav.seriesId);
  }

  async toggleFavorite(insertFavorite: InsertFavorite): Promise<void> {
    const existing = await db
      .select()
      .from(favorites)
      .where(
        and(eq(favorites.userId, insertFavorite.userId), eq(favorites.seriesId, insertFavorite.seriesId))
      )
      .limit(1);

    if (existing.length > 0) {
      await db.delete(favorites).where(eq(favorites.id, existing[0].id));
    } else {
      const id = randomUUID();
      await db.insert(favorites).values({ ...insertFavorite, id });
    }
  }

  async getTotalFavorites(): Promise<number> {
    const result = await db.select().from(favorites);
    return result.length;
  }

  // Reading Progress
  async getReadingProgress(userId: string, seriesId: string): Promise<number> {
    const result = await db
      .select()
      .from(readingProgress)
      .where(and(eq(readingProgress.userId, userId), eq(readingProgress.seriesId, seriesId)))
      .limit(1);

    return result[0]?.chapterId ? parseInt(result[0].chapterId) : 0;
  }

  async updateReadingProgress(progress: InsertReadingProgress): Promise<void> {
    const existing = await db
      .select()
      .from(readingProgress)
      .where(
        and(eq(readingProgress.userId, progress.userId), eq(readingProgress.seriesId, progress.seriesId))
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(readingProgress)
        .set({ chapterId: progress.chapterId })
        .where(eq(readingProgress.id, existing[0].id));
    } else {
      const id = randomUUID();
      await db.insert(readingProgress).values({ ...progress, id });
    }
  }
}

export const storage = new DatabaseStorage();
