import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function serveStatic(app: Express) {
  // Try multiple possible paths for the dist directory
  const possiblePaths = [
    path.resolve(__dirname, "../dist/public"),
    path.resolve(__dirname, "public"),
    path.resolve(process.cwd(), "dist/public"),
    path.resolve(process.cwd(), "Site-Builder/dist/public"),
  ];

  let distPath: string | null = null;
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      distPath = possiblePath;
      break;
    }
  }

  if (!distPath) {
    console.warn(
      `Could not find the build directory. Tried: ${possiblePaths.join(", ")}`
    );
    // Don't throw error, just log warning - Netlify will handle static files
    return;
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    const indexPath = path.resolve(distPath!, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });
}
