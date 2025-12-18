import type { VercelRequest, VercelResponse } from "@vercel/node";
import { storage } from "../data";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;
    const series = storage.series.get(id as string);
    
    if (!series) {
      return res.status(404).json({ error: "Series not found" });
    }

    // Increment views
    series.views = (series.views || 0) + 1;
    storage.series.set(id as string, series);

    res.json(series);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

