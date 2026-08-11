export type Mood = "great" | "good" | "okay" | "low" | "rough";

export type MoodEntry = {
  mood: Mood;
  energy: number;
  stress: number;
  note: string;
  factors: string[];
};

export type DailyReflection = {
  learned: string;
  intentionalSpending: "yes" | "mostly" | "no" | "";
  tomorrow: string;
};

export type DayRecord = {
  date: string;
  familiarWord?: boolean;
  mood?: MoodEntry;
  reflection?: DailyReflection;
  completedAt?: string;
};

export type Word = {
  word: string;
  partOfSpeech: string;
  pronunciation: string;
  definition: string;
  example: string;
  synonyms: string[];
};
