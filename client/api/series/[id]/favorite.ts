import type { VercelRequest, VercelResponse } from "@vercel/node";
import { storage, generateId } from "../../data";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID required" });
    }

    const favorites = Array.from(storage.favorites.values());
    const existing = favorites.find((f) => f.seriesId === id && f.userId === userId);

    if (existing) {
      storage.favorites.delete(existing.id);
      res.json({ favorited: false });
    } else {
      const favoriteId = generateId();
      storage.favorites.set(favoriteId, { id: favoriteId, seriesId: id as string, userId });
      res.json({ favorited: true });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

