import { z } from "zod";

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const mood = z.object({
  mood: z.enum(["great", "good", "okay", "low", "rough"]),
  energy: z.number().int().min(1).max(5),
  stress: z.number().int().min(1).max(5),
  note: z.string().max(5000),
  factors: z.array(z.string().min(1).max(80)).max(30),
});
const reflection = z.object({
  learned: z.string().max(5000),
  intentionalSpending: z.enum(["yes", "mostly", "no", ""]),
  tomorrow: z.string().max(5000),
});

export const recordPatchSchema = z.object({
  date: date.optional(),
  familiarWord: z.boolean().optional(),
  mood: mood.optional(),
  reflection: reflection.optional(),
  completedAt: z.string().datetime().optional(),
}).strict();

export const syncRequestSchema = z.object({
  mutations: z.array(z.object({
    id: z.string().uuid(),
    date,
    patch: recordPatchSchema,
    createdAt: z.string().datetime(),
  })).max(250),
});
