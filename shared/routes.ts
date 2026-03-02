import { z } from "zod";
import { insertCallRecordSchema, callRecords } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
};

export const api = {
  calls: {
    list: {
      method: "GET" as const,
      path: "/api/calls" as const,
      responses: {
        200: z.array(z.custom<typeof callRecords.$inferSelect>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/calls/:id" as const,
      responses: {
        200: z.custom<typeof callRecords.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    upload: {
      method: "POST" as const,
      path: "/api/calls/upload" as const,
      responses: {
        201: z.custom<typeof callRecords.$inferSelect>(),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
