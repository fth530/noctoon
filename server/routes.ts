import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { insertUserSchema, insertCommentSchema } from "@shared/schema";
import { sanitizeComment, sanitizeUsername } from "./sanitize";

// Helper function to verify admin authorization
async function verifyAdmin(req: Request): Promise<{ isAdmin: boolean; error?: string }> {
  const authHeader = req.headers.authorization;
  const userId = req.headers["x-user-id"] as string || req.query.userId as string;

  if (!userId) {
    return { isAdmin: false, error: "Authentication required" };
  }

  const user = await storage.getUser(userId);

  if (!user) {
    return { isAdmin: false, error: "User not found" };
  }

  if (user.role !== "admin") {
    return { isAdmin: false, error: "Admin access required" };
  }

  return { isAdmin: true };
}

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

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Use bcrypt to compare passwords securely
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
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

      // Hash password with bcrypt before storing
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(result.data.password, saltRounds);

      const user = await storage.createUser({
        ...result.data,
        password: hashedPassword,
      });
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

      // Sanitize user input to prevent XSS attacks
      const sanitizedText = sanitizeComment(text);
      const sanitizedUsername = sanitizeUsername(username);

      if (!sanitizedText || !sanitizedUsername) {
        return res.status(400).json({ error: "Invalid input" });
      }

      const comment = await storage.createComment({
        seriesId: req.params.id,
        userId,
        username: sanitizedUsername,
        text: sanitizedText,
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

      await storage.toggleLike({ seriesId: req.params.id, userId });
      res.json({ success: true });
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
      res.json(likes); // Already returns string[] of seriesIds
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

      await storage.toggleFavorite({ seriesId: req.params.id, userId });
      res.json({ success: true });
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
      res.json(favorites); // Already returns string[] of seriesIds
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ================== ADMIN ROUTES ==================

  app.get("/api/admin/stats", async (req, res) => {
    try {
      // Verify admin authorization
      const authResult = await verifyAdmin(req);
      if (!authResult.isAdmin) {
        return res.status(authResult.error === "Authentication required" ? 401 : 403)
          .json({ error: authResult.error });
      }

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
      // Verify admin authorization
      const authResult = await verifyAdmin(req);
      if (!authResult.isAdmin) {
        return res.status(authResult.error === "Authentication required" ? 401 : 403)
          .json({ error: authResult.error });
      }

      const comments = await storage.getAllComments();
      res.json(comments.slice(0, 20));
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return httpServer;
}
