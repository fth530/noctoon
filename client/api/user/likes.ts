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

    const likes = Array.from(storage.likes.values())
      .filter((l) => l.userId === userId);
    
    res.json(likes.map((l) => l.seriesId));
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

