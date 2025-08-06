import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const players = pgTable("players", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull(),
  level: integer("level").default(1),
  xp: integer("xp").default(0),
  coins: integer("coins").default(0),
  gems: integer("gems").default(0),
  rankedPoints: integer("ranked_points").default(0),
  tier: text("tier").default("Bronze"),
  totalWins: integer("total_wins").default(0),
  totalLosses: integer("total_losses").default(0),
  status: text("status").default("active"), // active, banned, suspended
  lastActive: timestamp("last_active").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tournaments = pgTable("tournaments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // regular, elite, special
  entryFee: integer("entry_fee").default(0),
  entryFeeCurrency: text("entry_fee_currency").default("coins"), // coins, gems
  maxParticipants: integer("max_participants").notNull(),
  currentParticipants: integer("current_participants").default(0),
  prizePool: jsonb("prize_pool").notNull(),
  status: text("status").default("scheduled"), // scheduled, active, completed, cancelled
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  duration: integer("duration").notNull(), // in hours
  winner: text("winner"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const currencyTransactions = pgTable("currency_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: text("player_id").notNull(),
  type: text("type").notNull(), // coins, gems
  amount: integer("amount").notNull(),
  reason: text("reason").notNull(),
  adminId: text("admin_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const seasonConfig = pgTable("season_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(false),
  rewards: jsonb("rewards").notNull(),
});

export const levelRewards = pgTable("level_rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  level: integer("level").notNull().unique(),
  xpRequired: integer("xp_required").notNull(),
  coinReward: integer("coin_reward").default(0),
  gemReward: integer("gem_reward").default(0),
  itemUnlock: text("item_unlock"),
});

export const antiCheatLogs = pgTable("anti_cheat_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: text("player_id").notNull(),
  detectionType: text("detection_type").notNull(), // afk, suspicious_pattern, team_abuse
  riskLevel: text("risk_level").notNull(), // low, medium, high
  status: text("status").default("under_review"), // under_review, resolved, ignored
  action: text("action"), // warning, ban, none
  details: jsonb("details"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dailyRewards = pgTable("daily_rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  day: integer("day").notNull().unique(),
  coinReward: integer("coin_reward").default(0),
  gemReward: integer("gem_reward").default(0),
  itemReward: text("item_reward"),
});

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // multiplier_xp, bonus_coins, free_gems, special_reward
  multiplier: integer("multiplier").default(1),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
  createdAt: true,
  lastActive: true,
});

export const insertTournamentSchema = createInsertSchema(tournaments).omit({
  id: true,
  createdAt: true,
  currentParticipants: true,
});

export const insertCurrencyTransactionSchema = createInsertSchema(currencyTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertSeasonConfigSchema = createInsertSchema(seasonConfig).omit({
  id: true,
});

export const insertLevelRewardSchema = createInsertSchema(levelRewards).omit({
  id: true,
});

export const insertAntiCheatLogSchema = createInsertSchema(antiCheatLogs).omit({
  id: true,
  createdAt: true,
});

export const insertDailyRewardSchema = createInsertSchema(dailyRewards).omit({
  id: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Player = typeof players.$inferSelect;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Tournament = typeof tournaments.$inferSelect;
export type InsertTournament = z.infer<typeof insertTournamentSchema>;
export type CurrencyTransaction = typeof currencyTransactions.$inferSelect;
export type InsertCurrencyTransaction = z.infer<typeof insertCurrencyTransactionSchema>;
export type SeasonConfig = typeof seasonConfig.$inferSelect;
export type InsertSeasonConfig = z.infer<typeof insertSeasonConfigSchema>;
export type LevelReward = typeof levelRewards.$inferSelect;
export type InsertLevelReward = z.infer<typeof insertLevelRewardSchema>;
export type AntiCheatLog = typeof antiCheatLogs.$inferSelect;
export type InsertAntiCheatLog = z.infer<typeof insertAntiCheatLogSchema>;
export type DailyReward = typeof dailyRewards.$inferSelect;
export type InsertDailyReward = z.infer<typeof insertDailyRewardSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
