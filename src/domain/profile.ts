export type UserProfile = {
  name: string;
  about: string;
  timezone: string;
  tone: "calm" | "direct" | "reflective" | "encouraging";
  priorities: string[];
  personalizationEnabled: boolean;
  moodThemeEnabled: boolean;
  onboardingCompletedAt: string | Date | null;
};
