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

    const likes = Array.from(storage.likes.values());
    const existing = likes.find((l) => l.seriesId === id && l.userId === userId);

    if (existing) {
      storage.likes.delete(existing.id);
      res.json({ liked: false });
    } else {
      const likeId = generateId();
      storage.likes.set(likeId, { id: likeId, seriesId: id as string, userId });
      res.json({ liked: true });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

