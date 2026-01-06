import {
  voiceSamples,
  clinicalSummaries,
  type VoiceSample,
  type InsertVoiceSample,
  type ClinicalSummary,
  type InsertClinicalSummary,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Voice Samples
  createVoiceSample(sample: InsertVoiceSample): Promise<VoiceSample>;
  getVoiceSamples(userId: string): Promise<VoiceSample[]>;
  deleteVoiceSample(id: number): Promise<void>;
  
  // Clinical Summaries
  createClinicalSummary(summary: InsertClinicalSummary): Promise<ClinicalSummary>;
  getClinicalSummaries(userId?: string): Promise<ClinicalSummary[]>; // If userId provided, filter by it
  getClinicalSummary(id: number): Promise<ClinicalSummary | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Voice Samples
  async createVoiceSample(sample: InsertVoiceSample): Promise<VoiceSample> {
    const [newSample] = await db.insert(voiceSamples).values(sample).returning();
    return newSample;
  }

  async getVoiceSamples(userId: string): Promise<VoiceSample[]> {
    return db
      .select()
      .from(voiceSamples)
      .where(eq(voiceSamples.userId, userId))
      .orderBy(desc(voiceSamples.createdAt));
  }

  async deleteVoiceSample(id: number): Promise<void> {
    await db.delete(voiceSamples).where(eq(voiceSamples.id, id));
  }

  // Clinical Summaries
  async createClinicalSummary(summary: InsertClinicalSummary): Promise<ClinicalSummary> {
    const [newSummary] = await db.insert(clinicalSummaries).values(summary).returning();
    return newSummary;
  }

  async getClinicalSummaries(userId?: string): Promise<ClinicalSummary[]> {
    if (userId) {
      return db
        .select()
        .from(clinicalSummaries)
        .where(eq(clinicalSummaries.userId, userId))
        .orderBy(desc(clinicalSummaries.createdAt));
    }
    // Psychologist view (all summaries)
    return db.select().from(clinicalSummaries).orderBy(desc(clinicalSummaries.createdAt));
  }

  async getClinicalSummary(id: number): Promise<ClinicalSummary | undefined> {
    const [summary] = await db.select().from(clinicalSummaries).where(eq(clinicalSummaries.id, id));
    return summary;
  }
}

export const storage = new DatabaseStorage();
