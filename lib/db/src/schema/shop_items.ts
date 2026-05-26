import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const shopItemsTable = pgTable("shop_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  type: text("type").notNull(), // 'consumable', 'upgrade', 'cosmetic'
  effect: text("effect").notNull(), // 'health_boost', 'energy_boost', 'speed_boost', 'shield', etc.
  value: integer("value").notNull(), // effect strength
  icon: text("icon").notNull(), // emoji or icon name
});

export const insertShopItemSchema = createInsertSchema(shopItemsTable).omit({ id: true });
export type InsertShopItem = z.infer<typeof insertShopItemSchema>;
export type ShopItem = typeof shopItemsTable.$inferSelect;
