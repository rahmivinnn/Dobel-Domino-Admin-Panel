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
  status: text("status").default("active"),
  unityPlayerId: text("unity_player_id"),
  minLevelForRanked: integer("min_level_for_ranked").default(5),
  lastActive: timestamp("last_active").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tournaments = pgTable("tournaments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(),
  entryFee: integer("entry_fee").default(0),
  entryFeeCurrency: text("entry_fee_currency").default("coins"),
  maxParticipants: integer("max_participants").notNull(),
  currentParticipants: integer("current_participants").default(0),
  prizePool: jsonb("prize_pool").notNull(),
  status: text("status").default("scheduled"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  duration: integer("duration").notNull(),
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

// Game Rooms
export const gameRooms = pgTable("game_rooms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // training_single, training_double, ranked, tournament, pairing
  description: text("description"),
  minLevel: integer("min_level").default(1),
  entryFee: integer("entry_fee").default(0),
  entryFeeCurrency: text("entry_fee_currency").default("coins"), // coins, gems
  maxPlayers: integer("max_players").default(2),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Payment Gateway Transactions
export const paymentTransactions = pgTable("payment_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: text("player_id").notNull(),
  transactionId: text("transaction_id").notNull(),
  paymentMethod: text("payment_method").notNull(), // payment_gateway, manual_topup
  amount: integer("amount").notNull(), // dalam rupiah
  gemsReceived: integer("gems_received").notNull(),
  status: text("status").default("pending"), // pending, completed, failed, cancelled
  paymentProof: text("payment_proof"), // URL bukti transfer
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// XP Boosters
export const xpBoosters = pgTable("xp_boosters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: text("player_id").notNull(),
  multiplier: integer("multiplier").default(2), // 2x XP
  duration: integer("duration").default(7), // dalam hari
  price: integer("price").default(10000), // harga dalam rupiah
  isActive: boolean("is_active").default(true),
  purchasedAt: timestamp("purchased_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

// News/Berita
export const news = pgTable("news", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  priority: integer("priority").default(0), // untuk urutan slider
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Pairing Services (Izin Kemensos)
export const pairingServices = pgTable("pairing_services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceName: text("service_name").notNull(),
  description: text("description"),
  licenseCert: text("license_cert"), // Sertifikat izin Kemensos
  isVerified: boolean("is_verified").default(false),
  contactInfo: jsonb("contact_info"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas untuk tabel baru
export const insertGameRoomSchema = createInsertSchema(gameRooms).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentTransactionSchema = createInsertSchema(paymentTransactions).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertXpBoosterSchema = createInsertSchema(xpBoosters).omit({
  id: true,
  purchasedAt: true,
  expiresAt: true,
});

export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
  createdAt: true,
});

export const insertPairingServiceSchema = createInsertSchema(pairingServices).omit({
  id: true,
  createdAt: true,
});

// Types untuk tabel baru
export type GameRoom = typeof gameRooms.$inferSelect;
export type InsertGameRoom = z.infer<typeof insertGameRoomSchema>;
export type PaymentTransaction = typeof paymentTransactions.$inferSelect;
export type InsertPaymentTransaction = z.infer<typeof insertPaymentTransactionSchema>;
export type XpBooster = typeof xpBoosters.$inferSelect;
export type InsertXpBooster = z.infer<typeof insertXpBoosterSchema>;
export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type PairingService = typeof pairingServices.$inferSelect;
export type InsertPairingService = z.infer<typeof insertPairingServiceSchema>;
