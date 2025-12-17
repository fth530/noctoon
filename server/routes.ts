import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertCommentSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ================== AUTH ROUTES ==================
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      const user = await storage.getUserByUsername(username);

      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const { password: _, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const result = insertUserSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({ error: "Invalid input" });
      }

      const existingUser = await storage.getUserByUsername(result.data.username);
      if (existingUser) {
        return res.status(409).json({ error: "Username already exists" });
      }

      const user = await storage.createUser(result.data);
      const { password: _, ...safeUser } = user;
      res.status(201).json(safeUser);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ================== SERIES ROUTES ==================

  app.get("/api/series", async (req, res) => {
    try {
      const series = await storage.getAllSeries();
      res.json(series);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/series/:id", async (req, res) => {
    try {
      const series = await storage.getSeriesById(req.params.id);
      if (!series) {
        return res.status(404).json({ error: "Series not found" });
      }
      
      // Increment view count
      await storage.incrementViews(req.params.id);
      
      res.json(series);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ================== CHAPTERS ROUTES ==================

  app.get("/api/series/:id/chapters", async (req, res) => {
    try {
      const chapters = await storage.getChaptersBySeriesId(req.params.id);
      res.json(chapters);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/chapters/:id", async (req, res) => {
    try {
      const chapter = await storage.getChapterById(req.params.id);
      if (!chapter) {
        return res.status(404).json({ error: "Chapter not found" });
      }
      res.json(chapter);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ================== COMMENTS ROUTES ==================

  app.get("/api/series/:id/comments", async (req, res) => {
    try {
      const comments = await storage.getCommentsBySeriesId(req.params.id);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/series/:id/comments", async (req, res) => {
    try {
      const { text, userId, username } = req.body;

      if (!text || !userId || !username) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const comment = await storage.createComment({
        seriesId: req.params.id,
        userId,
        username,
        text,
        createdAt: new Date().toLocaleDateString("tr-TR"),
      });

      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ================== LIKES ROUTES ==================

  app.post("/api/series/:id/like", async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "User ID required" });
      }

      const liked = await storage.toggleLike(req.params.id, userId);
      res.json({ liked });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/user/likes", async (req, res) => {
    try {
      const userId = req.query.userId as string;

      if (!userId) {
        return res.json([]);
      }

      const likes = await storage.getLikesByUserId(userId);
      res.json(likes.map((l) => l.seriesId));
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ================== FAVORITES ROUTES ==================

  app.post("/api/series/:id/favorite", async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "User ID required" });
      }

      const favorited = await storage.toggleFavorite(req.params.id, userId);
      res.json({ favorited });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/user/favorites", async (req, res) => {
    try {
      const userId = req.query.userId as string;

      if (!userId) {
        return res.json([]);
      }

      const favorites = await storage.getFavoritesByUserId(userId);
      res.json(favorites.map((f) => f.seriesId));
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ================== ADMIN ROUTES ==================

  app.get("/api/admin/stats", async (req, res) => {
    try {
      const [series, users, comments, totalLikes, totalFavorites] = await Promise.all([
        storage.getAllSeries(),
        storage.getAllUsers(),
        storage.getAllComments(),
        storage.getTotalLikes(),
        storage.getTotalFavorites(),
      ]);

      res.json({
        totalSeries: series.length,
        totalUsers: users.length,
        totalComments: comments.length,
        totalLikes,
        totalFavorites,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/admin/recent-comments", async (req, res) => {
    try {
      const comments = await storage.getAllComments();
      res.json(comments.slice(0, 20));
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return httpServer;
}
