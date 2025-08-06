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
  // Dashboard Stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Players
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

  const httpServer = createServer(app);

  return httpServer;
}
