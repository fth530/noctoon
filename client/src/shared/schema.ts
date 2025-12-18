import { z } from "zod";

// Type definitions (client-side only, no database dependencies)

// Series type
export type Series = {
  id: string;
  title: string;
  description: string | null;
  genre: string;
  cover: string;
  status: "ongoing" | "completed" | "new";
  author: string | null;
  views: number;
  rating: number;
};

// Chapter type
export type Chapter = {
  id: string;
  seriesId: string;
  number: number;
  title: string;
  pages: string[];
};

// Comment type
export type Comment = {
  id: string;
  seriesId: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
};

// User type
export type User = {
  id: string;
  username: string;
  password: string;
  role: string;
  avatar: string | null;
};

// Like type
export type Like = {
  id: string;
  seriesId: string;
  userId: string;
};

// Favorite type
export type Favorite = {
  id: string;
  seriesId: string;
  userId: string;
};

// Reading Progress type
export type ReadingProgress = {
  id: string;
  seriesId: string;
  userId: string;
  chapterId: string;
  progress: number;
};

// Genre options
export const GENRES = [
  "Aksiyon",
  "Romantik", 
  "Fantastik",
  "Dram",
  "Komedi",
  "Korku",
  "Bilim Kurgu",
  "Gerilim",
  "Tarihi",
  "Macera",
  "Gizem",
  "Spor"
] as const;

export type Genre = typeof GENRES[number];

// Status options
export const STATUS_OPTIONS = ["ongoing", "completed", "new"] as const;
export type Status = typeof STATUS_OPTIONS[number];

