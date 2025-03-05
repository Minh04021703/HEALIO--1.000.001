import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { getHealthAdvice } from "./ai-service";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.get("/api/health-records/:userId", async (req, res) => {
    const records = await storage.getHealthRecords(parseInt(req.params.userId));
    res.json(records);
  });

  app.post("/api/health-records", async (req, res) => {
    const record = await storage.createHealthRecord(req.body);
    res.json(record);
  });

  app.get("/api/appointments/:userId", async (req, res) => {
    const appointments = await storage.getAppointments(parseInt(req.params.userId));
    res.json(appointments);
  });

  app.post("/api/appointments", async (req, res) => {
    const appointment = await storage.createAppointment(req.body);
    res.json(appointment);
  });

  app.post("/api/ai-assistant", async (req, res) => {
    try {
      if (!req.body.symptoms || typeof req.body.symptoms !== 'string') {
        return res.status(400).json({ 
          error: "Please describe your symptoms"
        });
      }

      const advice = await getHealthAdvice(req.body.symptoms);
      res.json(advice);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Please try again later"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}