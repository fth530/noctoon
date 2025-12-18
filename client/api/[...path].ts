import type { VercelRequest, VercelResponse } from "@vercel/node";
import { storage, generateId, initializeData } from "./data";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Ensure data is initialized (in case of cold start)
  if (storage.series.size === 0) {
    initializeData();
  }

  // Vercel catch-all route: path comes from req.query.path as an array
  const pathArray = (req.query.path as string[]) || [];
  const fullPath = pathArray.length > 0 ? "/api/" + pathArray.join("/") : "/api";
  const pathParts = pathArray.length > 0 ? ["api", ...pathArray] : ["api"];

  try {
    // AUTH ROUTES
    if (fullPath === "/api/auth/login" && req.method === "POST") {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      const users = Array.from(storage.users.values());
      const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase());

      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const { password: _, ...safeUser } = user;
      return res.json(safeUser);
    }

    if (fullPath === "/api/auth/register" && req.method === "POST") {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Invalid input" });
      }

      const users = Array.from(storage.users.values());
      const existingUser = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
      
      if (existingUser) {
        return res.status(409).json({ error: "Username already exists" });
      }

      const id = generateId();
      const user = {
        id,
        username,
        password,
        role: "user" as const,
        avatar: null,
      };
      
      storage.users.set(id, user);
      const { password: _, ...safeUser } = user;
      return res.status(201).json(safeUser);
    }

    // SERIES ROUTES
    if (fullPath === "/api/series" && req.method === "GET") {
      const series = Array.from(storage.series.values());
      return res.json(series);
    }

    if (pathParts.length === 3 && pathParts[0] === "api" && pathParts[1] === "series" && req.method === "GET") {
      const seriesId = pathParts[2];
      const series = storage.series.get(seriesId);
      
      if (!series) {
        return res.status(404).json({ error: "Series not found" });
      }

      // Increment views
      series.views = (series.views || 0) + 1;
      storage.series.set(seriesId, series);

      return res.json(series);
    }

    if (pathParts.length === 4 && pathParts[0] === "api" && pathParts[1] === "series") {
      const seriesId = pathParts[2];
      const action = pathParts[3];

      // GET /api/series/:id/chapters
      if (action === "chapters" && req.method === "GET") {
        const chapters = Array.from(storage.chapters.values())
          .filter((c) => c.seriesId === seriesId)
          .sort((a, b) => a.number - b.number);
        
        return res.json(chapters);
      }

      // GET/POST /api/series/:id/comments
      if (action === "comments") {
        if (req.method === "GET") {
          const comments = Array.from(storage.comments.values())
            .filter((c) => c.seriesId === seriesId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          
          return res.json(comments);
        } else if (req.method === "POST") {
          const { text, userId, username } = req.body;

          if (!text || !userId || !username) {
            return res.status(400).json({ error: "Missing required fields" });
          }

          const commentId = generateId();
          const comment = {
            id: commentId,
            seriesId: seriesId!,
            userId,
            username,
            text,
            createdAt: new Date().toLocaleDateString("tr-TR"),
          };
          
          storage.comments.set(commentId, comment);
          return res.status(201).json(comment);
        }
      }

      // POST /api/series/:id/like
      if (action === "like" && req.method === "POST") {
        const { userId } = req.body;

        if (!userId) {
          return res.status(400).json({ error: "User ID required" });
        }

        const likes = Array.from(storage.likes.values());
        const existing = likes.find((l) => l.seriesId === seriesId && l.userId === userId);

        if (existing) {
          storage.likes.delete(existing.id);
          return res.json({ liked: false });
        } else {
          const likeId = generateId();
          storage.likes.set(likeId, { id: likeId, seriesId: seriesId!, userId });
          return res.json({ liked: true });
        }
      }

      // POST /api/series/:id/favorite
      if (action === "favorite" && req.method === "POST") {
        const { userId } = req.body;

        if (!userId) {
          return res.status(400).json({ error: "User ID required" });
        }

        const favorites = Array.from(storage.favorites.values());
        const existing = favorites.find((f) => f.seriesId === seriesId && f.userId === userId);

        if (existing) {
          storage.favorites.delete(existing.id);
          return res.json({ favorited: false });
        } else {
          const favoriteId = generateId();
          storage.favorites.set(favoriteId, { id: favoriteId, seriesId: seriesId!, userId });
          return res.json({ favorited: true });
        }
      }
    }

    // USER ROUTES
    if (pathParts.length === 3 && pathParts[0] === "api" && pathParts[1] === "user" && req.method === "GET") {
      const action = pathParts[2];

      if (action === "likes") {
        const userId = req.query.userId as string;

        if (!userId) {
          return res.json([]);
        }

        const likes = Array.from(storage.likes.values())
          .filter((l) => l.userId === userId);
        
        return res.json(likes.map((l) => l.seriesId));
      }

      if (action === "favorites") {
        const userId = req.query.userId as string;

        if (!userId) {
          return res.json([]);
        }

        const favorites = Array.from(storage.favorites.values())
          .filter((f) => f.userId === userId);
        
        return res.json(favorites.map((f) => f.seriesId));
      }
    }

    // ADMIN ROUTES
    if (pathParts.length === 3 && pathParts[0] === "api" && pathParts[1] === "admin" && req.method === "GET") {
      const action = pathParts[2];

      if (action === "stats") {
        const series = Array.from(storage.series.values());
        const users = Array.from(storage.users.values());
        const comments = Array.from(storage.comments.values());
        const likes = Array.from(storage.likes.values());
        const favorites = Array.from(storage.favorites.values());

        return res.json({
          totalSeries: series.length,
          totalUsers: users.length,
          totalComments: comments.length,
          totalLikes: likes.length,
          totalFavorites: favorites.length,
        });
      }

      if (action === "recent-comments") {
        const comments = Array.from(storage.comments.values())
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 20);
        
        return res.json(comments);
      }
    }

    return res.status(404).json({ error: "Not found" });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

