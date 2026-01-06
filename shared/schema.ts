import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Re-export Auth & Chat models so they are available globally
export * from "./models/auth";
export * from "./models/chat";

import { users } from "./models/auth";
import { conversations } from "./models/chat";

// === VOICE SAMPLES ===
export const voiceSamples = pgTable("voice_samples", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // References auth.users.id
  name: text("name").notNull(),
  fileUrl: text("file_url").notNull(),
  status: text("status").default("processing").notNull(), // processing, ready, failed
  createdAt: timestamp("created_at").defaultNow(),
});

// === CLINICAL SUMMARIES ===
export const clinicalSummaries = pgTable("clinical_summaries", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // The patient
  conversationId: integer("conversation_id").references(() => conversations.id),
  content: text("content").notNull(), // The AI generated summary
  riskLevel: text("risk_level").default("low"), // low, medium, high
  reviewedBy: text("reviewed_by"), // Psychologist ID (optional)
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===
export const voiceSamplesRelations = relations(voiceSamples, ({ one }) => ({
  user: one(users, {
    fields: [voiceSamples.userId],
    references: [users.id],
  }),
}));

export const clinicalSummariesRelations = relations(clinicalSummaries, ({ one }) => ({
  user: one(users, {
    fields: [clinicalSummaries.userId],
    references: [users.id],
  }),
  conversation: one(conversations, {
    fields: [clinicalSummaries.conversationId],
    references: [conversations.id],
  }),
}));

// === ZOD SCHEMAS ===
export const insertVoiceSampleSchema = createInsertSchema(voiceSamples).omit({ id: true, createdAt: true });
export const insertClinicalSummarySchema = createInsertSchema(clinicalSummaries).omit({ id: true, createdAt: true });

// === TYPES ===
export type VoiceSample = typeof voiceSamples.$inferSelect;
export type InsertVoiceSample = z.infer<typeof insertVoiceSampleSchema>;

export type ClinicalSummary = typeof clinicalSummaries.$inferSelect;
export type InsertClinicalSummary = z.infer<typeof insertClinicalSummarySchema>;
