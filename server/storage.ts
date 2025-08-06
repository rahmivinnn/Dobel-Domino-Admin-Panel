import { 
  type User, 
  type InsertUser, 
  type Player, 
  type InsertPlayer,
  type Tournament,
  type InsertTournament,
  type CurrencyTransaction,
  type InsertCurrencyTransaction,
  type SeasonConfig,
  type InsertSeasonConfig,
  type LevelReward,
  type InsertLevelReward,
  type AntiCheatLog,
  type InsertAntiCheatLog,
  type DailyReward,
  type InsertDailyReward,
  type Event,
  type InsertEvent
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Players
  getPlayer(id: string): Promise<Player | undefined>;
  getPlayerByUsername(username: string): Promise<Player | undefined>;
  getAllPlayers(filters?: {
    tier?: string;
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ players: Player[]; total: number }>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: string, updates: Partial<Player>): Promise<Player>;

  // Tournaments
  getTournament(id: string): Promise<Tournament | undefined>;
  getAllTournaments(filters?: {
    status?: string;
    type?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ tournaments: Tournament[]; total: number }>;
  createTournament(tournament: InsertTournament): Promise<Tournament>;
  updateTournament(id: string, updates: Partial<Tournament>): Promise<Tournament>;

  // Currency Transactions
  getCurrencyTransaction(id: string): Promise<CurrencyTransaction | undefined>;
  getAllCurrencyTransactions(filters?: {
    playerId?: string;
    type?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ transactions: CurrencyTransaction[]; total: number }>;
  createCurrencyTransaction(transaction: InsertCurrencyTransaction): Promise<CurrencyTransaction>;

  // Season Config
  getActiveSeasonConfig(): Promise<SeasonConfig | undefined>;
  getAllSeasonConfigs(): Promise<SeasonConfig[]>;
  createSeasonConfig(config: InsertSeasonConfig): Promise<SeasonConfig>;
  updateSeasonConfig(id: string, updates: Partial<SeasonConfig>): Promise<SeasonConfig>;

  // Level Rewards
  getLevelReward(level: number): Promise<LevelReward | undefined>;
  getAllLevelRewards(): Promise<LevelReward[]>;
  createLevelReward(reward: InsertLevelReward): Promise<LevelReward>;
  updateLevelReward(id: string, updates: Partial<LevelReward>): Promise<LevelReward>;

  // Anti-Cheat Logs
  getAntiCheatLog(id: string): Promise<AntiCheatLog | undefined>;
  getAllAntiCheatLogs(filters?: {
    playerId?: string;
    detectionType?: string;
    riskLevel?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ logs: AntiCheatLog[]; total: number }>;
  createAntiCheatLog(log: InsertAntiCheatLog): Promise<AntiCheatLog>;
  updateAntiCheatLog(id: string, updates: Partial<AntiCheatLog>): Promise<AntiCheatLog>;

  // Daily Rewards
  getDailyReward(day: number): Promise<DailyReward | undefined>;
  getAllDailyRewards(): Promise<DailyReward[]>;
  createDailyReward(reward: InsertDailyReward): Promise<DailyReward>;
  updateDailyReward(id: string, updates: Partial<DailyReward>): Promise<DailyReward>;

  // Events
  getEvent(id: string): Promise<Event | undefined>;
  getAllEvents(filters?: {
    isActive?: boolean;
    type?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ events: Event[]; total: number }>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, updates: Partial<Event>): Promise<Event>;

  // Statistics
  getDashboardStats(): Promise<{
    totalPlayers: number;
    activePlayers: number;
    totalCoins: number;
    totalGems: number;
    cleanGamesPercentage: number;
    todayDetections: number;
    totalBanned: number;
    avgResponseTime: string;
  }>;
  
  // Game Rooms
  getGameRooms(): Promise<any[]>;
  createGameRoom(data: any): Promise<any>;
  updateGameRoom(id: string, data: any): Promise<any>;
  deleteGameRoom(id: string): Promise<void>;
  
  // Payment Transactions
  getPaymentTransactions(params: any): Promise<any>;
  createPaymentTransaction(data: any): Promise<any>;
  updatePaymentTransaction(id: string, data: any): Promise<any>;
  
  // XP Boosters
  getXpBoosters(): Promise<any[]>;
  createXpBooster(data: any): Promise<any>;
  updateXpBooster(id: string, data: any): Promise<any>;
  
  // News
  getNews(): Promise<any[]>;
  createNews(data: any): Promise<any>;
  updateNews(id: string, data: any): Promise<any>;
  deleteNews(id: string): Promise<void>;
  
  // Pairing Services
  getPairingServices(): Promise<any[]>;
  createPairingService(data: any): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private players: Map<string, Player>;
  private tournaments: Map<string, Tournament>;
  private currencyTransactions: Map<string, CurrencyTransaction>;
  private seasonConfigs: Map<string, SeasonConfig>;
  private levelRewards: Map<string, LevelReward>;
  private antiCheatLogs: Map<string, AntiCheatLog>;
  private dailyRewards: Map<string, DailyReward>;
  private events: Map<string, Event>;
  private gameRooms: Map<string, any>;
  private paymentTransactions: Map<string, any>;
  private xpBoosters: Map<string, any>;
  private news: Map<string, any>;
  private pairingServices: Map<string, any>;

  constructor() {
    this.users = new Map();
    this.players = new Map();
    this.tournaments = new Map();
    this.currencyTransactions = new Map();
    this.seasonConfigs = new Map();
    this.levelRewards = new Map();
    this.antiCheatLogs = new Map();
    this.dailyRewards = new Map();
    this.events = new Map();
    this.gameRooms = new Map();
    this.paymentTransactions = new Map();
    this.xpBoosters = new Map();
    this.news = new Map();
    this.pairingServices = new Map();

    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize default level rewards
    const defaultLevelRewards = [
      { level: 5, xpRequired: 5500, coinReward: 500, gemReward: 5, itemUnlock: "Avatar Basic" },
      { level: 10, xpRequired: 10500, coinReward: 1000, gemReward: 10, itemUnlock: "Card Skin Blue" },
      { level: 15, xpRequired: 15500, coinReward: 1500, gemReward: 15, itemUnlock: "Table Theme Green" },
      { level: 25, xpRequired: 25500, coinReward: 2500, gemReward: 25, itemUnlock: "Frame Gold" },
      { level: 50, xpRequired: 50500, coinReward: 5000, gemReward: 50, itemUnlock: "E-Member Card" },
    ];

    defaultLevelRewards.forEach(reward => {
      const id = randomUUID();
      this.levelRewards.set(id, { ...reward, id });
    });

    // Initialize default daily rewards
    const defaultDailyRewards = [
      { day: 1, coinReward: 100, gemReward: 0, itemReward: null },
      { day: 2, coinReward: 150, gemReward: 0, itemReward: null },
      { day: 3, coinReward: 200, gemReward: 0, itemReward: null },
      { day: 4, coinReward: 250, gemReward: 0, itemReward: null },
      { day: 5, coinReward: 300, gemReward: 0, itemReward: null },
      { day: 6, coinReward: 400, gemReward: 0, itemReward: null },
      { day: 7, coinReward: 500, gemReward: 5, itemReward: "Weekly Bonus" },
    ];

    defaultDailyRewards.forEach(reward => {
      const id = randomUUID();
      this.dailyRewards.set(id, { ...reward, id });
    });

    // Initialize sample players - kosongkan koin dan gems
    const samplePlayers = [
      { username: "PlayerOne", email: "player1@example.com", level: 15, xp: 12450, coins: 0, gems: 0, rankedPoints: 1250, tier: "Gold", totalWins: 85, totalLosses: 45, status: "active", unityPlayerId: "unity_001", minLevelForRanked: 5 },
      { username: "DominoMaster", email: "master@example.com", level: 28, xp: 28750, coins: 0, gems: 0, rankedPoints: 2150, tier: "Platinum", totalWins: 156, totalLosses: 34, status: "active", unityPlayerId: "unity_002", minLevelForRanked: 5 },
      { username: "CardShark", email: "shark@example.com", level: 35, xp: 41250, coins: 0, gems: 0, rankedPoints: 2850, tier: "Master", totalWins: 234, totalLosses: 56, status: "active", unityPlayerId: "unity_003", minLevelForRanked: 5 },
      { username: "GameLegend", email: "legend@example.com", level: 42, xp: 58900, coins: 0, gems: 0, rankedPoints: 3250, tier: "Legend", totalWins: 389, totalLosses: 34, status: "active", unityPlayerId: "unity_004", minLevelForRanked: 5 },
      { username: "Beginner123", email: "beginner@example.com", level: 3, xp: 650, coins: 0, gems: 0, rankedPoints: 150, tier: "Bronze", totalWins: 12, totalLosses: 18, status: "active", unityPlayerId: "unity_005", minLevelForRanked: 5 },
    ];

    samplePlayers.forEach(player => {
      const id = randomUUID();
      this.players.set(id, { 
        ...player, 
        id,
        createdAt: new Date(),
        lastActive: new Date()
      });
    });

    // Initialize sample events
    const sampleEvents = [
      {
        name: "Double XP Weekend",
        type: "multiplier_xp",
        multiplier: 2,
        description: "Dapatkan 2x XP untuk semua permainan",
        startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        name: "Bonus Coin Event",
        type: "bonus_coins",
        multiplier: 3,
        description: "Dapatkan 3x koin dari semua kemenangan",
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 72 * 60 * 60 * 1000),
        isActive: false,
      },
    ];

    sampleEvents.forEach(event => {
      const id = randomUUID();
      this.events.set(id, { 
        ...event, 
        id,
        createdAt: new Date()
      });
    });

    // Initialize sample currency transactions
    const players = Array.from(this.players.values());
    if (players.length > 0) {
      const sampleTransactions = [
        { playerId: players[0].id, type: "coins", amount: 1000, reason: "Daily Login Bonus", adminId: "system" },
        { playerId: players[1].id, type: "gems", amount: 50, reason: "Tournament Reward", adminId: "admin" },
        { playerId: players[2].id, type: "coins", amount: -500, reason: "Tournament Entry Fee", adminId: "system" },
        { playerId: players[3].id, type: "gems", amount: 100, reason: "Level Up Bonus", adminId: "system" },
      ];

      sampleTransactions.forEach(transaction => {
        const id = randomUUID();
        this.currencyTransactions.set(id, { 
          ...transaction, 
          id,
          createdAt: new Date()
        });
      });
    }

    // Initialize sample anti-cheat logs
    if (players.length > 0) {
      const sampleLogs = [
        { playerId: players[0].id, detectionType: "afk", riskLevel: "low", status: "resolved", action: "warning", details: { reason: "Multiple AFK detections" } },
        { playerId: players[1].id, detectionType: "suspicious_pattern", riskLevel: "medium", status: "under_review", action: null, details: { pattern: "unusual win rate" } },
        { playerId: players[4].id, detectionType: "team_abuse", riskLevel: "high", status: "under_review", action: null, details: { suspected_collaboration: true } },
      ];

      sampleLogs.forEach(log => {
        const id = randomUUID();
        this.antiCheatLogs.set(id, { 
          ...log, 
          id,
          createdAt: new Date()
        });
      });
    }

    // Initialize Game Rooms
    const sampleGameRooms = [
      { name: "Training Single", type: "training_single", description: "Ruang latihan untuk pemain tunggal", minLevel: 1, entryFee: 0, entryFeeCurrency: "coins", maxPlayers: 1, isActive: true },
      { name: "Training Double", type: "training_double", description: "Ruang latihan untuk pemain berpasangan", minLevel: 1, entryFee: 0, entryFeeCurrency: "coins", maxPlayers: 2, isActive: true },
      { name: "Ranked Match", type: "ranked", description: "Pertandingan berperingkat untuk naik tier", minLevel: 5, entryFee: 100, entryFeeCurrency: "coins", maxPlayers: 2, isActive: true },
      { name: "Tournament Room", type: "tournament", description: "Ruang khusus turnamen", minLevel: 10, entryFee: 500, entryFeeCurrency: "gems", maxPlayers: 8, isActive: true },
      { name: "Pairing Service", type: "pairing", description: "Layanan pairing dengan izin Kemensos", minLevel: 1, entryFee: 0, entryFeeCurrency: "coins", maxPlayers: 2, isActive: true },
    ];

    sampleGameRooms.forEach(room => {
      const id = randomUUID();
      this.gameRooms.set(id, { ...room, id, createdAt: new Date() });
    });

    // Initialize News/Berita
    const sampleNews = [
      { title: "Selamat Datang di Dobel Domino!", content: "Game domino terbaru dengan fitur lengkap dan grafik memukau.", imageUrl: "/assets/news1.jpg", priority: 1, isActive: true },
      { title: "Event Double XP Weekend", content: "Dapatkan XP berlipat ganda setiap akhir pekan!", imageUrl: "/assets/news2.jpg", priority: 2, isActive: true },
      { title: "Tournament Bulanan Dimulai", content: "Daftarkan diri Anda dalam turnamen bulanan dengan hadiah menarik.", imageUrl: "/assets/news3.jpg", priority: 3, isActive: true },
      { title: "Update Fitur Baru", content: "Nikmati fitur-fitur baru dalam update terbaru Dobel Domino.", imageUrl: "/assets/news4.jpg", priority: 4, isActive: true },
    ];

    sampleNews.forEach(newsItem => {
      const id = randomUUID();
      this.news.set(id, { ...newsItem, id, createdAt: new Date() });
    });

    // Initialize XP Boosters
    const sampleXpBoosters = [
      { playerId: players[0].id, multiplier: 2, duration: 7, price: 10000, isActive: true, purchasedAt: new Date(), expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      { playerId: players[1].id, multiplier: 2, duration: 7, price: 10000, isActive: false, purchasedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    ];

    sampleXpBoosters.forEach(booster => {
      const id = randomUUID();
      this.xpBoosters.set(id, { ...booster, id });
    });

    // Initialize Pairing Services
    const samplePairingServices = [
      { serviceName: "Pairing Service Official", description: "Layanan pairing resmi dengan izin lengkap", licenseCert: "CERT-2024-001", isVerified: true, contactInfo: { email: "official@dobeldomino.com", phone: "021-12345678" } },
    ];

    samplePairingServices.forEach(service => {
      const id = randomUUID();
      this.pairingServices.set(id, { ...service, id, createdAt: new Date() });
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Players
  async getPlayer(id: string): Promise<Player | undefined> {
    return this.players.get(id);
  }

  async getPlayerByUsername(username: string): Promise<Player | undefined> {
    return Array.from(this.players.values()).find(
      (player) => player.username === username,
    );
  }

  async getAllPlayers(filters?: {
    tier?: string;
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ players: Player[]; total: number }> {
    let players = Array.from(this.players.values());

    if (filters?.tier) {
      players = players.filter(p => p.tier === filters.tier);
    }

    if (filters?.status) {
      players = players.filter(p => p.status === filters.status);
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      players = players.filter(p => 
        p.username.toLowerCase().includes(search) ||
        p.email.toLowerCase().includes(search)
      );
    }

    const total = players.length;
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 50;
    
    players = players.slice(offset, offset + limit);

    return { players, total };
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const id = randomUUID();
    const player: Player = { 
      ...insertPlayer, 
      id,
      createdAt: new Date(),
      lastActive: new Date()
    };
    this.players.set(id, player);
    return player;
  }

  async updatePlayer(id: string, updates: Partial<Player>): Promise<Player> {
    const existing = this.players.get(id);
    if (!existing) {
      throw new Error("Player not found");
    }
    const updated = { ...existing, ...updates };
    this.players.set(id, updated);
    return updated;
  }

  // Tournaments
  async getTournament(id: string): Promise<Tournament | undefined> {
    return this.tournaments.get(id);
  }

  async getAllTournaments(filters?: {
    status?: string;
    type?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ tournaments: Tournament[]; total: number }> {
    let tournaments = Array.from(this.tournaments.values());

    if (filters?.status) {
      tournaments = tournaments.filter(t => t.status === filters.status);
    }

    if (filters?.type) {
      tournaments = tournaments.filter(t => t.type === filters.type);
    }

    const total = tournaments.length;
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 50;
    
    tournaments = tournaments.slice(offset, offset + limit);

    return { tournaments, total };
  }

  async createTournament(insertTournament: InsertTournament): Promise<Tournament> {
    const id = randomUUID();
    const tournament: Tournament = { 
      ...insertTournament, 
      id,
      createdAt: new Date(),
      currentParticipants: 0
    };
    this.tournaments.set(id, tournament);
    return tournament;
  }

  async updateTournament(id: string, updates: Partial<Tournament>): Promise<Tournament> {
    const existing = this.tournaments.get(id);
    if (!existing) {
      throw new Error("Tournament not found");
    }
    const updated = { ...existing, ...updates };
    this.tournaments.set(id, updated);
    return updated;
  }

  // Currency Transactions
  async getCurrencyTransaction(id: string): Promise<CurrencyTransaction | undefined> {
    return this.currencyTransactions.get(id);
  }

  async getAllCurrencyTransactions(filters?: {
    playerId?: string;
    type?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ transactions: CurrencyTransaction[]; total: number }> {
    let transactions = Array.from(this.currencyTransactions.values());

    if (filters?.playerId) {
      transactions = transactions.filter(t => t.playerId === filters.playerId);
    }

    if (filters?.type) {
      transactions = transactions.filter(t => t.type === filters.type);
    }

    const total = transactions.length;
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 50;
    
    transactions = transactions.slice(offset, offset + limit);

    return { transactions, total };
  }

  async createCurrencyTransaction(insertTransaction: InsertCurrencyTransaction): Promise<CurrencyTransaction> {
    const id = randomUUID();
    const transaction: CurrencyTransaction = { 
      ...insertTransaction, 
      id,
      createdAt: new Date()
    };
    this.currencyTransactions.set(id, transaction);
    return transaction;
  }

  // Season Config
  async getActiveSeasonConfig(): Promise<SeasonConfig | undefined> {
    return Array.from(this.seasonConfigs.values()).find(config => config.isActive);
  }

  async getAllSeasonConfigs(): Promise<SeasonConfig[]> {
    return Array.from(this.seasonConfigs.values());
  }

  async createSeasonConfig(insertConfig: InsertSeasonConfig): Promise<SeasonConfig> {
    const id = randomUUID();
    const config: SeasonConfig = { ...insertConfig, id };
    this.seasonConfigs.set(id, config);
    return config;
  }

  async updateSeasonConfig(id: string, updates: Partial<SeasonConfig>): Promise<SeasonConfig> {
    const existing = this.seasonConfigs.get(id);
    if (!existing) {
      throw new Error("Season config not found");
    }
    const updated = { ...existing, ...updates };
    this.seasonConfigs.set(id, updated);
    return updated;
  }

  // Level Rewards
  async getLevelReward(level: number): Promise<LevelReward | undefined> {
    return Array.from(this.levelRewards.values()).find(reward => reward.level === level);
  }

  async getAllLevelRewards(): Promise<LevelReward[]> {
    return Array.from(this.levelRewards.values()).sort((a, b) => a.level - b.level);
  }

  async createLevelReward(insertReward: InsertLevelReward): Promise<LevelReward> {
    const id = randomUUID();
    const reward: LevelReward = { ...insertReward, id };
    this.levelRewards.set(id, reward);
    return reward;
  }

  async updateLevelReward(id: string, updates: Partial<LevelReward>): Promise<LevelReward> {
    const existing = this.levelRewards.get(id);
    if (!existing) {
      throw new Error("Level reward not found");
    }
    const updated = { ...existing, ...updates };
    this.levelRewards.set(id, updated);
    return updated;
  }

  // Anti-Cheat Logs
  async getAntiCheatLog(id: string): Promise<AntiCheatLog | undefined> {
    return this.antiCheatLogs.get(id);
  }

  async getAllAntiCheatLogs(filters?: {
    playerId?: string;
    detectionType?: string;
    riskLevel?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ logs: AntiCheatLog[]; total: number }> {
    let logs = Array.from(this.antiCheatLogs.values());

    if (filters?.playerId) {
      logs = logs.filter(l => l.playerId === filters.playerId);
    }

    if (filters?.detectionType) {
      logs = logs.filter(l => l.detectionType === filters.detectionType);
    }

    if (filters?.riskLevel) {
      logs = logs.filter(l => l.riskLevel === filters.riskLevel);
    }

    if (filters?.status) {
      logs = logs.filter(l => l.status === filters.status);
    }

    const total = logs.length;
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 50;
    
    logs = logs.slice(offset, offset + limit);

    return { logs, total };
  }

  async createAntiCheatLog(insertLog: InsertAntiCheatLog): Promise<AntiCheatLog> {
    const id = randomUUID();
    const log: AntiCheatLog = { 
      ...insertLog, 
      id,
      createdAt: new Date()
    };
    this.antiCheatLogs.set(id, log);
    return log;
  }

  async updateAntiCheatLog(id: string, updates: Partial<AntiCheatLog>): Promise<AntiCheatLog> {
    const existing = this.antiCheatLogs.get(id);
    if (!existing) {
      throw new Error("Anti-cheat log not found");
    }
    const updated = { ...existing, ...updates };
    this.antiCheatLogs.set(id, updated);
    return updated;
  }

  // Daily Rewards
  async getDailyReward(day: number): Promise<DailyReward | undefined> {
    return Array.from(this.dailyRewards.values()).find(reward => reward.day === day);
  }

  async getAllDailyRewards(): Promise<DailyReward[]> {
    return Array.from(this.dailyRewards.values()).sort((a, b) => a.day - b.day);
  }

  async createDailyReward(insertReward: InsertDailyReward): Promise<DailyReward> {
    const id = randomUUID();
    const reward: DailyReward = { ...insertReward, id };
    this.dailyRewards.set(id, reward);
    return reward;
  }

  async updateDailyReward(id: string, updates: Partial<DailyReward>): Promise<DailyReward> {
    const existing = this.dailyRewards.get(id);
    if (!existing) {
      throw new Error("Daily reward not found");
    }
    const updated = { ...existing, ...updates };
    this.dailyRewards.set(id, updated);
    return updated;
  }

  // Events
  async getEvent(id: string): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getAllEvents(filters?: {
    isActive?: boolean;
    type?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ events: Event[]; total: number }> {
    let events = Array.from(this.events.values());

    if (filters?.isActive !== undefined) {
      events = events.filter(e => e.isActive === filters.isActive);
    }

    if (filters?.type) {
      events = events.filter(e => e.type === filters.type);
    }

    const total = events.length;
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 50;
    
    events = events.slice(offset, offset + limit);

    return { events, total };
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const event: Event = { 
      ...insertEvent, 
      id,
      createdAt: new Date()
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event> {
    const existing = this.events.get(id);
    if (!existing) {
      throw new Error("Event not found");
    }
    const updated = { ...existing, ...updates };
    this.events.set(id, updated);
    return updated;
  }

  // Statistics
  async getDashboardStats(): Promise<{
    totalPlayers: number;
    activePlayers: number;
    totalCoins: number;
    totalGems: number;
    cleanGamesPercentage: number;
    todayDetections: number;
    totalBanned: number;
    avgResponseTime: string;
  }> {
    const totalPlayers = this.players.size;
    const activePlayers = Array.from(this.players.values()).filter(p => p.status === 'active').length;
    const totalCoins = Array.from(this.players.values()).reduce((sum, p) => sum + (p.coins || 0), 0);
    const totalGems = Array.from(this.players.values()).reduce((sum, p) => sum + (p.gems || 0), 0);
    
    const totalBanned = Array.from(this.players.values()).filter(p => p.status === 'banned').length;
    const todayDetections = Array.from(this.antiCheatLogs.values()).filter(log => {
      const today = new Date();
      const logDate = new Date(log.createdAt || '');
      return logDate.toDateString() === today.toDateString();
    }).length;
    
    const cleanGamesPercentage = 99.2; // Mock percentage
    const avgResponseTime = "0.3s"; // Mock response time

    return {
      totalPlayers,
      activePlayers,
      totalCoins,
      totalGems,
      cleanGamesPercentage,
      todayDetections,
      totalBanned,
      avgResponseTime
    };
  }

  // Game Rooms
  async getGameRooms(): Promise<any[]> {
    return Array.from(this.gameRooms.values()).sort((a, b) => a.priority - b.priority);
  }

  async createGameRoom(data: any): Promise<any> {
    const id = randomUUID();
    const room = { ...data, id, createdAt: new Date() };
    this.gameRooms.set(id, room);
    return room;
  }

  async updateGameRoom(id: string, data: any): Promise<any> {
    const existing = this.gameRooms.get(id);
    if (!existing) {
      throw new Error("Game room not found");
    }
    const updated = { ...existing, ...data };
    this.gameRooms.set(id, updated);
    return updated;
  }

  async deleteGameRoom(id: string): Promise<void> {
    this.gameRooms.delete(id);
  }

  // Payment Transactions
  async getPaymentTransactions(params: any): Promise<any> {
    let transactions = Array.from(this.paymentTransactions.values());
    
    if (params.status && params.status !== 'all') {
      transactions = transactions.filter(t => t.status === params.status);
    }
    
    if (params.paymentMethod && params.paymentMethod !== 'all') {
      transactions = transactions.filter(t => t.paymentMethod === params.paymentMethod);
    }

    const total = transactions.length;
    const limit = parseInt(params.limit) || 50;
    const offset = parseInt(params.offset) || 0;
    
    transactions = transactions.slice(offset, offset + limit);

    return { transactions, total };
  }

  async createPaymentTransaction(data: any): Promise<any> {
    const id = randomUUID();
    const transaction = { 
      ...data, 
      id, 
      transactionId: `TXN-${Date.now()}`,
      createdAt: new Date() 
    };
    this.paymentTransactions.set(id, transaction);
    return transaction;
  }

  async updatePaymentTransaction(id: string, data: any): Promise<any> {
    const existing = this.paymentTransactions.get(id);
    if (!existing) {
      throw new Error("Payment transaction not found");
    }
    const updated = { ...existing, ...data };
    if (data.status === 'completed') {
      updated.completedAt = new Date();
    }
    this.paymentTransactions.set(id, updated);
    return updated;
  }

  // XP Boosters
  async getXpBoosters(): Promise<any[]> {
    return Array.from(this.xpBoosters.values()).sort((a, b) => 
      new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime()
    );
  }

  async createXpBooster(data: any): Promise<any> {
    const id = randomUUID();
    const booster = { 
      ...data, 
      id, 
      purchasedAt: new Date(),
      expiresAt: new Date(Date.now() + (data.duration || 7) * 24 * 60 * 60 * 1000)
    };
    this.xpBoosters.set(id, booster);
    return booster;
  }

  async updateXpBooster(id: string, data: any): Promise<any> {
    const existing = this.xpBoosters.get(id);
    if (!existing) {
      throw new Error("XP booster not found");
    }
    const updated = { ...existing, ...data };
    this.xpBoosters.set(id, updated);
    return updated;
  }

  // News
  async getNews(): Promise<any[]> {
    return Array.from(this.news.values()).sort((a, b) => b.priority - a.priority);
  }

  async createNews(data: any): Promise<any> {
    const id = randomUUID();
    const newsItem = { ...data, id, createdAt: new Date() };
    this.news.set(id, newsItem);
    return newsItem;
  }

  async updateNews(id: string, data: any): Promise<any> {
    const existing = this.news.get(id);
    if (!existing) {
      throw new Error("News not found");
    }
    const updated = { ...existing, ...data };
    this.news.set(id, updated);
    return updated;
  }

  async deleteNews(id: string): Promise<void> {
    this.news.delete(id);
  }

  // Pairing Services
  async getPairingServices(): Promise<any[]> {
    return Array.from(this.pairingServices.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createPairingService(data: any): Promise<any> {
    const id = randomUUID();
    const service = { ...data, id, createdAt: new Date() };
    this.pairingServices.set(id, service);
    return service;
  }
}

export const storage = new MemStorage();
