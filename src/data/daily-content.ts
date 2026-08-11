import type { Word } from "@/domain/types";

export const words: Word[] = [
  { word: "Deliberate", partOfSpeech: "adjective", pronunciation: "/dɪˈlɪbərət/", definition: "Done consciously and intentionally.", example: "She made a deliberate choice to protect her quiet morning.", synonyms: ["intentional", "considered", "purposeful"] },
  { word: "Equanimity", partOfSpeech: "noun", pronunciation: "/ˌekwəˈnɪməti/", definition: "Calmness and composure, especially in a difficult situation.", example: "He received the unexpected news with equanimity.", synonyms: ["composure", "calm", "poise"] },
  { word: "Pragmatic", partOfSpeech: "adjective", pronunciation: "/præɡˈmætɪk/", definition: "Dealing with problems in a practical, realistic way.", example: "A pragmatic budget leaves room for real life.", synonyms: ["practical", "realistic", "sensible"] },
  { word: "Sonder", partOfSpeech: "noun", pronunciation: "/ˈsɒndər/", definition: "The realization that every passerby has a life as vivid as your own.", example: "Watching the busy street filled him with sonder.", synonyms: ["awareness", "perspective", "empathy"] },
];

export const moneyTips = [
  { eyebrow: "Pause before purchase", title: "Give wants a little breathing room.", body: "For a non-essential purchase, wait 24 hours. The pause is not punishment—it simply helps you tell a real want from a passing impulse.", action: "Notice one purchase you can pause today" },
  { eyebrow: "Small money, clear picture", title: "Tiny expenses deserve visibility.", body: "Transfers, data, snacks and rides can quietly become a large category. Track them for one week before deciding what—if anything—to change.", action: "Write down your next small expense" },
  { eyebrow: "Plan for reality", title: "A useful budget has breathing room.", body: "Prices change. Unexpected costs happen. A small buffer makes a plan more honest and reduces the pressure to get every naira perfectly allocated.", action: "Add a realistic buffer to your next plan" },
  { eyebrow: "Opportunity cost", title: "Every yes quietly says no elsewhere.", body: "Before spending, ask what else this money could support. There is no universally right answer—only a more intentional one.", action: "Name the trade-off behind one choice" },
];

export function dailyIndex(length: number, date = new Date()) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const day = Math.floor((Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - start) / 86400000);
  return day % length;
}
