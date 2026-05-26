import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const playersTable = pgTable("players", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  coins: integer("coins").notNull().default(0),
  totalScore: integer("total_score").notNull().default(0),
  highestLevel: integer("highest_level").notNull().default(0),
  uniformColor: text("uniform_color").notNull().default('red'),
  hasATV: boolean("has_atv").notNull().default(false),
  hasHeatPack: boolean("has_heat_pack").notNull().default(false),
  hasSpeedBoost: boolean("has_speed_boost").notNull().default(false),
  hasShield: boolean("has_shield").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPlayerSchema = createInsertSchema(playersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof playersTable.$inferSelect;
