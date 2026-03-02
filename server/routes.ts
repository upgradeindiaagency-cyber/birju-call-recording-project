import type { Express, Request, Response } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import { speechToText } from "./replit_integrations/audio/client";
import { openai } from "./replit_integrations/audio/client";

// Set up multer to keep file in memory
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB limit

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.calls.list.path, async (req, res) => {
    const records = await storage.getCallRecords();
    res.json(records);
  });

  app.get(api.calls.get.path, async (req, res) => {
    const record = await storage.getCallRecord(Number(req.params.id));
    if (!record) {
      return res.status(404).json({ message: "Call record not found" });
    }
    res.json(record);
  });

  app.post(api.calls.upload.path, upload.single("audio"), async (req: Request, res: Response) => {
    try {
      const { salespersonName, clientName } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "Audio file is required" });
      }

      if (!salespersonName || !clientName) {
        return res.status(400).json({ message: "Salesperson name and client name are required" });
      }

      const formatMatch = file.originalname.match(/\.([a-zA-Z0-9]+)$/);
      let format = "wav";
      if (formatMatch) {
        const ext = formatMatch[1].toLowerCase();
        if (ext === "mp3") format = "mp3";
        if (ext === "webm") format = "webm";
      }

      const transcript = await speechToText(file.buffer, format as any);

      const analysisPrompt = `
      Analyze this sales call transcript. The call may contain Hindi, English, and Gujarati languages mixed.

      Give response in JSON format exactly matching this structure:
      {
        "greetingScore": number (out of 10),
        "communicationScore": number (out of 10),
        "objectionHandlingScore": number (out of 10),
        "closingScore": number (out of 10),
        "overallScore": number (out of 10),
        "strengths": [array of strings],
        "weaknesses": [array of strings],
        "improvementSuggestions": [array of strings],
        "sentiment": string (Positive / Neutral / Negative),
        "clientInterestLevel": string (Low / Medium / High)
      }

      Transcript:
      ${transcript}
      `;

      const analysisResponse = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [{ role: "user", content: analysisPrompt }],
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      const analysisData = JSON.parse(analysisResponse.choices[0].message?.content || "{}");

      const newCall = await storage.createCallRecord({
        salespersonName,
        clientName,
        duration: "Analyzed",
        transcript,
        analysis: analysisData,
      });

      res.status(201).json(newCall);

    } catch (error: any) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Something went wrong during analysis." });
    }
  });

  return httpServer;
}
