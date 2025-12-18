import type { VercelRequest, VercelResponse } from "@vercel/node";
import { storage, generateId } from "../../data";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    try {
      const { id } = req.query;
      const comments = Array.from(storage.comments.values())
        .filter((c) => c.seriesId === id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "POST") {
    try {
      const { id } = req.query;
      const { text, userId, username } = req.body;

      if (!text || !userId || !username) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const commentId = generateId();
      const comment = {
        id: commentId,
        seriesId: id as string,
        userId,
        username,
        text,
        createdAt: new Date().toLocaleDateString("tr-TR"),
      };
      
      storage.comments.set(commentId, comment);
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

