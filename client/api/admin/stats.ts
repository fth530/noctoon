import type { VercelRequest, VercelResponse } from "@vercel/node";
import { storage } from "../data";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const series = Array.from(storage.series.values());
    const users = Array.from(storage.users.values());
    const comments = Array.from(storage.comments.values());
    const likes = Array.from(storage.likes.values());
    const favorites = Array.from(storage.favorites.values());

    res.json({
      totalSeries: series.length,
      totalUsers: users.length,
      totalComments: comments.length,
      totalLikes: likes.length,
      totalFavorites: favorites.length,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

