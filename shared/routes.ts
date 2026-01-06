import { z } from 'zod';
import { insertVoiceSampleSchema, insertClinicalSummarySchema, voiceSamples, clinicalSummaries, conversations, messages } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  voiceSamples: {
    list: {
      method: 'GET' as const,
      path: '/api/voice-samples',
      responses: {
        200: z.array(z.custom<typeof voiceSamples.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/voice-samples',
      input: insertVoiceSampleSchema,
      responses: {
        201: z.custom<typeof voiceSamples.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/voice-samples/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  clinicalSummaries: {
    list: {
      method: 'GET' as const,
      path: '/api/clinical-summaries',
      responses: {
        200: z.array(z.custom<typeof clinicalSummaries.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/clinical-summaries/:id',
      responses: {
        200: z.custom<typeof clinicalSummaries.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/clinical-summaries',
      input: insertClinicalSummarySchema,
      responses: {
        201: z.custom<typeof clinicalSummaries.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  // We also need to expose the chat endpoints defined in the integration via this contract for type safety in frontend
  // logic, although the integration registers them manually.
  chat: {
    conversations: {
      list: {
        method: 'GET' as const,
        path: '/api/conversations',
        responses: { 200: z.array(z.custom<typeof conversations.$inferSelect>()) }
      },
      create: {
        method: 'POST' as const,
        path: '/api/conversations',
        input: z.object({ title: z.string() }),
        responses: { 201: z.custom<typeof conversations.$inferSelect>() }
      },
      get: {
        method: 'GET' as const,
        path: '/api/conversations/:id',
        responses: { 200: z.custom<typeof conversations.$inferSelect & { messages: typeof messages.$inferSelect[] }>() }
      }
    }
  }
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
