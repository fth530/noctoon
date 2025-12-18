import type { VercelRequest, VercelResponse } from "@vercel/node";
import { storage } from "../data";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const userId = req.query.userId as string;

    if (!userId) {
      return res.json([]);
    }

    const favorites = Array.from(storage.favorites.values())
      .filter((f) => f.userId === userId);
    
    res.json(favorites.map((f) => f.seriesId));
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

