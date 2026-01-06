import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import { registerImageRoutes } from "./replit_integrations/image";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // 1. Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // 2. Setup Integrations
  registerChatRoutes(app);
  registerObjectStorageRoutes(app);
  registerImageRoutes(app);

  // 3. Application Routes

  // Voice Samples
  app.get(api.voiceSamples.list.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const samples = await storage.getVoiceSamples(userId);
    res.json(samples);
  });

  app.post(api.voiceSamples.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const input = api.voiceSamples.create.input.parse({
        ...req.body,
        userId, // Force userId from auth
      });
      
      const sample = await storage.createVoiceSample(input);
      res.status(201).json(sample);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.voiceSamples.delete.path, isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteVoiceSample(id);
    res.status(204).send();
  });

  // Clinical Summaries
  app.get(api.clinicalSummaries.list.path, isAuthenticated, async (req: any, res) => {
    // Ideally check if user is psychologist, but for now we allow any logged in user to see THEIR OWN summaries
    // OR if we had a role system, we'd check that.
    // For MVP: If query param ?mode=psychologist is present (and maybe check a hardcoded list of psych IDs), show all.
    // Otherwise show own.
    
    // For simplicity: Return all for now if no filter, or filter by user.
    // Let's enforce: User sees own. 
    const userId = req.user.claims.sub;
    
    // Check for "psychologist" role simulation (e.g. specific email or just a flag in req)
    // For MVP, we'll just let everyone see their own.
    const summaries = await storage.getClinicalSummaries(userId);
    res.json(summaries);
  });
  
  // Endpoint for Psychologist to see ALL (Protected by a simple check or just open for MVP demo)
  app.get('/api/psychologist/summaries', isAuthenticated, async (req, res) => {
     const summaries = await storage.getClinicalSummaries(); // No userId = all
     res.json(summaries);
  });

  app.post(api.clinicalSummaries.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const input = api.clinicalSummaries.create.input.parse({
        ...req.body,
        userId
      });
      const summary = await storage.createClinicalSummary(input);
      res.status(201).json(summary);
    } catch (err) {
       if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get(api.clinicalSummaries.get.path, isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    const summary = await storage.getClinicalSummary(id);
    if (!summary) return res.status(404).json({ message: "Not found" });
    res.json(summary);
  });

  // Seed Data (if empty)
  // We can seed some clinical summaries for demo purposes if none exist
  // But hard to seed linked to real Auth users without their IDs.
  // We'll skip seeding tied to users for now.

  return httpServer;
}
