import { db } from "./db";
import { callRecords, type InsertCallRecord, type CallRecord } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getCallRecords(): Promise<CallRecord[]>;
  getCallRecord(id: number): Promise<CallRecord | undefined>;
  createCallRecord(record: InsertCallRecord): Promise<CallRecord>;
}

export class DatabaseStorage implements IStorage {
  async getCallRecords(): Promise<CallRecord[]> {
    return await db.select().from(callRecords).orderBy(desc(callRecords.createdAt));
  }

  async getCallRecord(id: number): Promise<CallRecord | undefined> {
    const [record] = await db.select().from(callRecords).where(eq(callRecords.id, id));
    return record;
  }

  async createCallRecord(record: InsertCallRecord): Promise<CallRecord> {
    const [newRecord] = await db.insert(callRecords).values(record).returning();
    return newRecord;
  }
}

export const storage = new DatabaseStorage();
