"use client";

import { BookOpen, CalendarDays, HeartPulse } from "lucide-react";
import { wordForDate, words } from "@/data/daily-content";
import type { DayRecord } from "@/domain/types";
import { WordLibrary } from "./word-library";

export function HistoryView({ records, wordsOnly = false, onUpdateRecord }: { records: Record<string, DayRecord>; wordsOnly?: boolean; onUpdateRecord?: (date: string, patch: Partial<DayRecord>) => void }) {
  const entries = Object.values(records).sort((a, b) => b.date.localeCompare(a.date));
  return <div className="mx-auto max-w-[1000px] px-4 py-8 sm:px-8 lg:py-11">
    <p className="text-xs uppercase tracking-[.18em] text-white/30">Your archive</p>
    <h1 className="mt-3 text-3xl font-medium tracking-tight">{wordsOnly ? "Words you’ve met." : "A record, not a scoreboard."}</h1>
    <p className="mt-2 max-w-lg text-sm leading-6 text-white/40">{wordsOnly ? "A quiet collection of your daily vocabulary." : "Look back with curiosity. Missing days need no explanation."}</p>
    {wordsOnly ? <WordLibrary records={records} onUpdateRecord={onUpdateRecord}/> : entries.length ? <div className="mt-9 space-y-3">{entries.map(entry => {
      const word = words.find(item => item.id === entry.wordId) ?? wordForDate(new Date(`${entry.date}T12:00:00`));
      return <article key={entry.date} className="card grid gap-5 p-5 sm:grid-cols-[140px_1fr]">
        <div><CalendarDays size={16} className="text-[var(--mood-accent)]"/><time className="mt-3 block text-sm font-medium">{new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${entry.date}T12:00:00`))}</time><span className="mt-1 block text-[11px] text-white/25">{entry.completedAt ? "Day closed" : "In progress"}</span></div>
        <div className="grid gap-4 sm:grid-cols-2"><div><div className="flex items-center gap-2 text-xs text-white/30"><BookOpen size={13}/> Vocabulary</div><p className="mt-2 font-serif text-xl">{word.word}</p><p className="mt-1 text-xs text-white/35">{entry.familiarWord === undefined ? "Not marked" : entry.familiarWord ? "Familiar" : "New discovery"}</p></div><div><div className="flex items-center gap-2 text-xs text-white/30"><HeartPulse size={13}/> Check-in</div><p className="mt-2 text-sm capitalize text-white/65">{entry.mood?.mood ?? "Not logged"}</p>{entry.reflection?.tomorrow && <p className="mt-2 text-xs italic text-white/35">“{entry.reflection.tomorrow}”</p>}</div></div>
      </article>;
    })}</div> : <div className="mt-12 rounded-2xl border border-dashed border-white/10 py-16 text-center"><CalendarDays className="mx-auto text-white/20"/><p className="mt-4 text-sm text-white/40">Your days will collect here, gently.</p></div>}
  </div>;
}
