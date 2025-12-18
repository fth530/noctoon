import type { VercelRequest, VercelResponse } from "@vercel/node";
import { storage } from "../../data";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;
    const chapters = Array.from(storage.chapters.values())
      .filter((c) => c.seriesId === id)
      .sort((a, b) => a.number - b.number);
    
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

