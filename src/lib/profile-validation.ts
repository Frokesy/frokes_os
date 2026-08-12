import { z } from "zod";

export const priorities = ["Learning", "Emotional awareness", "Money", "Work", "Family", "Health", "Football", "Relationships", "Personal growth"] as const;
export const tones = ["calm", "direct", "reflective", "encouraging"] as const;

export const profileSchema = z.object({
  name: z.string().trim().min(2).max(60),
  about: z.string().trim().max(500),
  timezone: z.string().min(1).max(100).refine(value => {
    try { new Intl.DateTimeFormat("en", { timeZone: value }).format(); return true; } catch { return false; }
  }, "Choose a valid timezone."),
  tone: z.enum(tones),
  priorities: z.array(z.enum(priorities)).max(priorities.length),
  personalizationEnabled: z.boolean(),
  moodThemeEnabled: z.boolean(),
  completeOnboarding: z.boolean().optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
