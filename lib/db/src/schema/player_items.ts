import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const playerItemsTable = pgTable("player_items", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").notNull().references(() => require('./player').playersTable.id),
  itemId: integer("item_id").notNull().references(() => require('./shop_items').shopItemsTable.id),
  quantity: integer("quantity").notNull().default(1),
  purchasedAt: timestamp("purchased_at").notNull().defaultNow(),
});

export const insertPlayerItemSchema = createInsertSchema(playerItemsTable).omit({
  id: true,
  purchasedAt: true
});
export type InsertPlayerItem = z.infer<typeof insertPlayerItemSchema>;
export type PlayerItem = typeof playerItemsTable.$inferSelect;
