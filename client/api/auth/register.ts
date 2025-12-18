import type { VercelRequest, VercelResponse } from "@vercel/node";
import { storage, generateId } from "../data";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
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
    res.status(201).json(safeUser);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

