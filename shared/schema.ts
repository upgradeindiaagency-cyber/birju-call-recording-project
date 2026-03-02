import { pgTable, text, serial, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const callRecords = pgTable("call_records", {
  id: serial("id").primaryKey(),
  salespersonName: text("salesperson_name").notNull(),
  clientName: text("client_name").notNull(),
  duration: text("duration").default("Auto detect").notNull(),
  transcript: text("transcript").notNull(),
  analysis: jsonb("analysis").$type<{
    greetingScore: number;
    communicationScore: number;
    objectionHandlingScore: number;
    closingScore: number;
    overallScore: number;
    strengths: string[];
    weaknesses: string[];
    improvementSuggestions: string[];
    sentiment: string;
    clientInterestLevel: string;
  }>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCallRecordSchema = createInsertSchema(callRecords).omit({ 
  id: true, 
  createdAt: true 
});

export type CallRecord = typeof callRecords.$inferSelect;
export type InsertCallRecord = z.infer<typeof insertCallRecordSchema>;
