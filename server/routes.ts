import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertPlayerSchema,
  insertTournamentSchema,
  insertCurrencyTransactionSchema,
  insertSeasonConfigSchema,
  insertLevelRewardSchema,
  insertAntiCheatLogSchema,
  insertDailyRewardSchema,
  insertEventSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  app.get("/api/players", async (req, res) => {
    try {
      const { tier, status, search, limit = "50", offset = "0" } = req.query;
      const result = await storage.getAllPlayers({
        tier: tier as string,
        status: status as string,
        search: search as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch players" });
    }
  });

  app.get("/api/players/:id", async (req, res) => {
    try {
      const player = await storage.getPlayer(req.params.id);
      if (!player) {
        return res.status(404).json({ error: "Player not found" });
      }
      res.json(player);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch player" });
    }
  });

  app.post("/api/players", async (req, res) => {
    try {
      const validatedData = insertPlayerSchema.parse(req.body);
      const player = await storage.createPlayer(validatedData);
      res.status(201).json(player);
    } catch (error) {
      res.status(400).json({ error: "Invalid player data" });
    }
  });

  app.put("/api/players/:id", async (req, res) => {
    try {
      const player = await storage.updatePlayer(req.params.id, req.body);
      res.json(player);
    } catch (error) {
      res.status(400).json({ error: "Failed to update player" });
    }
  });

  // Tournaments
  app.get("/api/tournaments", async (req, res) => {
    try {
      const { status, type, limit = "50", offset = "0" } = req.query;
      const result = await storage.getAllTournaments({
        status: status as string,
        type: type as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tournaments" });
    }
  });

  app.post("/api/tournaments", async (req, res) => {
    try {
      const validatedData = insertTournamentSchema.parse(req.body);
      const tournament = await storage.createTournament(validatedData);
      res.status(201).json(tournament);
    } catch (error) {
      res.status(400).json({ error: "Invalid tournament data" });
    }
  });

  app.put("/api/tournaments/:id", async (req, res) => {
    try {
      const tournament = await storage.updateTournament(req.params.id, req.body);
      res.json(tournament);
    } catch (error) {
      res.status(400).json({ error: "Failed to update tournament" });
    }
  });

  // Currency Transactions
  app.get("/api/currency/transactions", async (req, res) => {
    try {
      const { playerId, type, limit = "50", offset = "0" } = req.query;
      const result = await storage.getAllCurrencyTransactions({
        playerId: playerId as string,
        type: type as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.post("/api/currency/transactions", async (req, res) => {
    try {
      const validatedData = insertCurrencyTransactionSchema.parse(req.body);
      const transaction = await storage.createCurrencyTransaction(validatedData);
      
      // Update player's currency
      const player = await storage.getPlayer(validatedData.playerId);
      if (player) {
        const updates: any = {};
        if (validatedData.type === "coins") {
          updates.coins = (player.coins || 0) + validatedData.amount;
        } else if (validatedData.type === "gems") {
          updates.gems = (player.gems || 0) + validatedData.amount;
        }
        await storage.updatePlayer(validatedData.playerId, updates);
      }
      
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ error: "Invalid transaction data" });
    }
  });

  // Season Config
  app.get("/api/seasons", async (req, res) => {
    try {
      const seasons = await storage.getAllSeasonConfigs();
      res.json(seasons);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch seasons" });
    }
  });

  app.get("/api/seasons/active", async (req, res) => {
    try {
      const activeSeason = await storage.getActiveSeasonConfig();
      res.json(activeSeason);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active season" });
    }
  });

  app.post("/api/seasons", async (req, res) => {
    try {
      const validatedData = insertSeasonConfigSchema.parse(req.body);
      const season = await storage.createSeasonConfig(validatedData);
      res.status(201).json(season);
    } catch (error) {
      res.status(400).json({ error: "Invalid season data" });
    }
  });

  app.put("/api/seasons/:id", async (req, res) => {
    try {
      const season = await storage.updateSeasonConfig(req.params.id, req.body);
      res.json(season);
    } catch (error) {
      res.status(400).json({ error: "Failed to update season" });
    }
  });

  // Level Rewards
  app.get("/api/rewards/level", async (req, res) => {
    try {
      const rewards = await storage.getAllLevelRewards();
      res.json(rewards);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch level rewards" });
    }
  });

  app.post("/api/rewards/level", async (req, res) => {
    try {
      const validatedData = insertLevelRewardSchema.parse(req.body);
      const reward = await storage.createLevelReward(validatedData);
      res.status(201).json(reward);
    } catch (error) {
      res.status(400).json({ error: "Invalid level reward data" });
    }
  });

  app.put("/api/rewards/level/:id", async (req, res) => {
    try {
      const reward = await storage.updateLevelReward(req.params.id, req.body);
      res.json(reward);
    } catch (error) {
      res.status(400).json({ error: "Failed to update level reward" });
    }
  });

  // Daily Rewards
  app.get("/api/rewards/daily", async (req, res) => {
    try {
      const rewards = await storage.getAllDailyRewards();
      res.json(rewards);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch daily rewards" });
    }
  });

  app.post("/api/rewards/daily", async (req, res) => {
    try {
      const validatedData = insertDailyRewardSchema.parse(req.body);
      const reward = await storage.createDailyReward(validatedData);
      res.status(201).json(reward);
    } catch (error) {
      res.status(400).json({ error: "Invalid daily reward data" });
    }
  });

  app.put("/api/rewards/daily/:id", async (req, res) => {
    try {
      const reward = await storage.updateDailyReward(req.params.id, req.body);
      res.json(reward);
    } catch (error) {
      res.status(400).json({ error: "Failed to update daily reward" });
    }
  });

  // Events
  app.get("/api/events", async (req, res) => {
    try {
      const { isActive, type, limit = "50", offset = "0" } = req.query;
      const result = await storage.getAllEvents({
        isActive: isActive === "true" ? true : isActive === "false" ? false : undefined,
        type: type as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ error: "Invalid event data" });
    }
  });

  app.put("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.updateEvent(req.params.id, req.body);
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: "Failed to update event" });
    }
  });

  // Anti-Cheat Logs
  app.get("/api/anticheat/logs", async (req, res) => {
    try {
      const { playerId, detectionType, riskLevel, status, limit = "50", offset = "0" } = req.query;
      const result = await storage.getAllAntiCheatLogs({
        playerId: playerId as string,
        detectionType: detectionType as string,
        riskLevel: riskLevel as string,
        status: status as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch anti-cheat logs" });
    }
  });

  app.post("/api/anticheat/logs", async (req, res) => {
    try {
      const validatedData = insertAntiCheatLogSchema.parse(req.body);
      const log = await storage.createAntiCheatLog(validatedData);
      res.status(201).json(log);
    } catch (error) {
      res.status(400).json({ error: "Invalid anti-cheat log data" });
    }
  });

  app.put("/api/anticheat/logs/:id", async (req, res) => {
    try {
      const log = await storage.updateAntiCheatLog(req.params.id, req.body);
      res.json(log);
    } catch (error) {
      res.status(400).json({ error: "Failed to update anti-cheat log" });
    }
  });

  // Player Actions (Ban, Unban, etc.)
  app.post("/api/players/:id/ban", async (req, res) => {
    try {
      const { reason, duration } = req.body;
      await storage.updatePlayer(req.params.id, { status: "banned" });
      res.json({ message: "Player banned successfully" });
    } catch (error) {
      res.status(400).json({ error: "Failed to ban player" });
    }
  });

  app.post("/api/players/:id/unban", async (req, res) => {
    try {
      await storage.updatePlayer(req.params.id, { status: "active" });
      res.json({ message: "Player unbanned successfully" });
    } catch (error) {
      res.status(400).json({ error: "Failed to unban player" });
    }
  });

  // Leaderboard
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const { players } = await storage.getAllPlayers({ limit: 100 });
      const leaderboard = players
        .filter(p => p.status === "active")
        .sort((a, b) => (b.rankedPoints || 0) - (a.rankedPoints || 0))
        .slice(0, 100);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  // Game Rooms API
  app.get("/api/game-rooms", async (req, res) => {
    try {
      const rooms = await storage.getGameRooms();
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch game rooms" });
    }
  });

  app.post("/api/game-rooms", async (req, res) => {
    try {
      const room = await storage.createGameRoom(req.body);
      res.status(201).json(room);
    } catch (error) {
      res.status(400).json({ error: "Failed to create game room" });
    }
  });

  app.patch("/api/game-rooms/:id", async (req, res) => {
    try {
      const room = await storage.updateGameRoom(req.params.id, req.body);
      res.json(room);
    } catch (error) {
      res.status(400).json({ error: "Failed to update game room" });
    }
  });

  // Payment Transactions API
  app.get("/api/payment-transactions", async (req, res) => {
    try {
      const result = await storage.getPaymentTransactions(req.query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payment transactions" });
    }
  });

  app.post("/api/payment-transactions", async (req, res) => {
    try {
      const transaction = await storage.createPaymentTransaction(req.body);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ error: "Failed to create payment transaction" });
    }
  });

  app.post("/api/payment-transactions/:id/approve", async (req, res) => {
    try {
      const transaction = await storage.updatePaymentTransaction(req.params.id, { 
        status: 'completed',
        completedAt: new Date() 
      });
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ error: "Failed to approve payment" });
    }
  });

  app.post("/api/payment-transactions/:id/reject", async (req, res) => {
    try {
      const transaction = await storage.updatePaymentTransaction(req.params.id, { 
        status: 'failed',
        adminNotes: req.body.reason || 'Rejected by admin'
      });
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ error: "Failed to reject payment" });
    }
  });

  app.get("/api/payment-stats", async (req, res) => {
    try {
      const transactions = await storage.getPaymentTransactions({});
      const stats = {
        total: transactions.total,
        pending: transactions.transactions?.filter((t: any) => t.status === 'pending').length || 0,
        completed: transactions.transactions?.filter((t: any) => t.status === 'completed').length || 0,
        revenue: transactions.transactions?.filter((t: any) => t.status === 'completed')
          ?.reduce((sum: number, t: any) => sum + (t.amount || 0), 0) || 0
      };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payment stats" });
    }
  });

  // XP Boosters API
  app.get("/api/xp-boosters", async (req, res) => {
    try {
      const boosters = await storage.getXpBoosters();
      res.json(boosters);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch XP boosters" });
    }
  });

  app.post("/api/xp-boosters", async (req, res) => {
    try {
      const booster = await storage.createXpBooster(req.body);
      res.status(201).json(booster);
    } catch (error) {
      res.status(400).json({ error: "Failed to create XP booster" });
    }
  });

  app.patch("/api/xp-boosters/:id", async (req, res) => {
    try {
      const booster = await storage.updateXpBooster(req.params.id, req.body);
      res.json(booster);
    } catch (error) {
      res.status(400).json({ error: "Failed to update XP booster" });
    }
  });

  // News API
  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  app.post("/api/news", async (req, res) => {
    try {
      const newsItem = await storage.createNews(req.body);
      res.status(201).json(newsItem);
    } catch (error) {
      res.status(400).json({ error: "Failed to create news" });
    }
  });

  app.patch("/api/news/:id", async (req, res) => {
    try {
      const newsItem = await storage.updateNews(req.params.id, req.body);
      res.json(newsItem);
    } catch (error) {
      res.status(400).json({ error: "Failed to update news" });
    }
  });

  app.delete("/api/news/:id", async (req, res) => {
    try {
      await storage.deleteNews(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: "Failed to delete news" });
    }
  });

  // Pairing Services API
  app.get("/api/pairing-services", async (req, res) => {
    try {
      const services = await storage.getPairingServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pairing services" });
    }
  });

  app.post("/api/pairing-services", async (req, res) => {
    try {
      const service = await storage.createPairingService(req.body);
      res.status(201).json(service);
    } catch (error) {
      res.status(400).json({ error: "Failed to create pairing service" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
