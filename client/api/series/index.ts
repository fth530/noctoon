import type { VercelRequest, VercelResponse } from "@vercel/node";
import { storage } from "../data";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const series = Array.from(storage.series.values());
    res.json(series);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

