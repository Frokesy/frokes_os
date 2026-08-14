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
  wordId?: string;
  familiarWord?: boolean;
  wordSaved?: boolean;
  wordReviewedAt?: string;
  wordNote?: string;
  moneyTipId?: string;
  moneyFeedback?: "useful" | "not_relevant" | "already_know" | "less_like_this";
  mood?: MoodEntry;
  reflection?: DailyReflection;
  completedAt?: string;
};

export type Word = {
  id: string;
  availableFrom?: string;
  word: string;
  partOfSpeech: string;
  pronunciation: string;
  definition: string;
  example: string;
  synonyms: string[];
};

export type MoneyTip = {
  id: string;
  availableFrom?: string;
  categories: string[];
  eyebrow: string;
  title: string;
  body: string;
  action: string;
};
