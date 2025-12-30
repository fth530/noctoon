import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"), // "user" | "admin"
  avatar: text("avatar"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Series table
export const series = pgTable("series", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  genre: text("genre").notNull(),
  cover: text("cover").notNull(),
  status: text("status").notNull().default("ongoing"), // "ongoing" | "completed" | "new"
  author: text("author"),
  views: integer("views").notNull().default(0),
  rating: integer("rating").notNull().default(0),
});

export const insertSeriesSchema = createInsertSchema(series).omit({ id: true });
export type InsertSeries = z.infer<typeof insertSeriesSchema>;
export type Series = typeof series.$inferSelect;

// Chapters table
export const chapters = pgTable("chapters", {
  id: varchar("id", { length: 36 }).primaryKey(),
  seriesId: varchar("series_id", { length: 36 }).notNull(),
  number: integer("number").notNull(),
  title: text("title").notNull(),
  pages: text("pages").array().notNull(), // Array of image URLs
  publishAt: timestamp("publish_at"),
});

export const insertChapterSchema = createInsertSchema(chapters).omit({ id: true });
export type InsertChapter = z.infer<typeof insertChapterSchema>;
export type Chapter = typeof chapters.$inferSelect;

// Comments table
export const comments = pgTable("comments", {
  id: varchar("id", { length: 36 }).primaryKey(),
  seriesId: varchar("series_id", { length: 36 }).notNull(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  username: text("username").notNull(),
  text: text("text").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertCommentSchema = createInsertSchema(comments).omit({ id: true });
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

// Likes table
export const likes = pgTable("likes", {
  id: varchar("id", { length: 36 }).primaryKey(),
  seriesId: varchar("series_id", { length: 36 }).notNull(),
  userId: varchar("user_id", { length: 36 }).notNull(),
});

export const insertLikeSchema = createInsertSchema(likes).omit({ id: true });
export type InsertLike = z.infer<typeof insertLikeSchema>;
export type Like = typeof likes.$inferSelect;

// Favorites table
export const favorites = pgTable("favorites", {
  id: varchar("id", { length: 36 }).primaryKey(),
  seriesId: varchar("series_id", { length: 36 }).notNull(),
  userId: varchar("user_id", { length: 36 }).notNull(),
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({ id: true });
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

// Reading Progress table
export const readingProgress = pgTable("reading_progress", {
  id: varchar("id", { length: 36 }).primaryKey(),
  seriesId: varchar("series_id", { length: 36 }).notNull(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  chapterId: varchar("chapter_id", { length: 36 }).notNull(),
  progress: integer("progress").notNull().default(0), // 0-100 percentage
});

export const insertReadingProgressSchema = createInsertSchema(readingProgress).omit({ id: true });
export type InsertReadingProgress = z.infer<typeof insertReadingProgressSchema>;
export type ReadingProgress = typeof readingProgress.$inferSelect;

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
