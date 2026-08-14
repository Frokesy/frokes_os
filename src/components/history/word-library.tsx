"use client";

import { Bookmark, BookOpen, Check, Search, Volume2 } from "lucide-react";
import { useMemo, useState } from "react";
import { words } from "@/data/daily-content";
import type { DayRecord } from "@/domain/types";

type Filter = "all" | "met" | "saved" | "review" | "reviewed";
const filters: { id: Filter; label: string }[] = [{ id: "all", label: "All" }, { id: "met", label: "Met" }, { id: "saved", label: "Saved" }, { id: "review", label: "To review" }, { id: "reviewed", label: "Reviewed" }];

export function WordLibrary({ records, onUpdateRecord }: { records: Record<string, DayRecord>; onUpdateRecord?: (date: string, patch: Partial<DayRecord>) => void }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const wordRecords = useMemo(() => Object.values(records).filter(record => record.wordId).sort((a, b) => b.date.localeCompare(a.date)).reduce<Record<string, DayRecord>>((result, record) => { if (record.wordId && !result[record.wordId]) result[record.wordId] = record; return result; }, {}), [records]);
  const visible = words.filter(word => {
    const record = wordRecords[word.id];
    const text = `${word.word} ${word.definition} ${word.synonyms.join(" ")} ${record?.wordNote ?? ""}`.toLowerCase();
    const matchesQuery = text.includes(query.trim().toLowerCase());
    const matchesFilter = filter === "all" || filter === "met" && !!record || filter === "saved" && !!record?.wordSaved || filter === "reviewed" && !!record?.wordReviewedAt || filter === "review" && !!record && (!record.familiarWord || record.wordSaved) && !record.wordReviewedAt;
    return matchesQuery && matchesFilter;
  });
  const speak = (word: string) => { window.speechSynthesis?.cancel(); const utterance = new SpeechSynthesisUtterance(word); utterance.lang = "en-NG"; window.speechSynthesis?.speak(utterance); };
  return <>
    <div className="mt-7 rounded-2xl border border-[var(--mood-accent-border)] bg-[var(--mood-accent-soft)] p-3 sm:flex sm:items-center sm:justify-between sm:gap-4">
      <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-black/20 px-3"><Search size={15} className="text-white/30"/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search words, meanings, synonyms, or notes" className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/25"/></label>
      <div className="mt-3 flex gap-2 overflow-x-auto sm:mt-0">{filters.map(item => <button key={item.id} onClick={() => setFilter(item.id)} className={`choice shrink-0 ${filter === item.id ? "choice-active" : ""}`}>{item.label}</button>)}</div>
    </div>
    <p className="mt-4 text-xs text-white/30">{visible.length} {visible.length === 1 ? "word" : "words"} · {Object.keys(wordRecords).length} encountered</p>
    {visible.length ? <div className="mt-5 grid gap-3 sm:grid-cols-2">{visible.map((word, index) => { const record = wordRecords[word.id]; return <article key={word.id} className="card p-5">
      <div className="flex items-center justify-between"><div className="flex items-center gap-2"><BookOpen size={15} className="text-[var(--mood-accent)]"/>{record && <span className="rounded-full bg-[var(--mood-accent-soft)] px-2 py-1 text-[9px] uppercase tracking-wider text-[var(--mood-accent)]">Met</span>}</div><button onClick={() => speak(word.word)} className="icon-button h-8 w-8" aria-label={`Hear ${word.word}`}><Volume2 size={14}/></button></div>
      <h2 className="mt-5 font-serif text-2xl">{word.word}</h2><p className="mt-2 text-xs italic text-white/35">{word.partOfSpeech} · {word.pronunciation}</p><p className="mt-4 text-sm leading-6 text-white/55">{word.definition}</p>
      {record?.wordNote && <p className="mt-4 rounded-xl border border-white/[.07] bg-white/[.025] p-3 text-xs italic leading-5 text-white/45">“{record.wordNote}”</p>}
      <div className="mt-5 flex flex-wrap gap-2 border-t border-white/[.06] pt-4"><button disabled={!record} title={record ? "Save this word" : "This becomes available after you meet the word"} onClick={() => record && onUpdateRecord?.(record.date, { wordSaved: !record.wordSaved })} className={`choice disabled:cursor-not-allowed disabled:opacity-30 ${record?.wordSaved ? "choice-active" : ""}`}><Bookmark size={12} fill={record?.wordSaved ? "currentColor" : "none"}/>Saved</button><button disabled={!record} onClick={() => record && onUpdateRecord?.(record.date, { wordReviewedAt: new Date().toISOString() })} className={`choice disabled:cursor-not-allowed disabled:opacity-30 ${record?.wordReviewedAt ? "choice-active" : ""}`}><Check size={12}/>{record?.wordReviewedAt ? "Reviewed" : "Mark reviewed"}</button><span className="ml-auto self-center text-[9px] text-white/20">{String(index + 1).padStart(2, "0")}</span></div>
    </article>; })}</div> : <div className="mt-8 rounded-2xl border border-dashed border-white/10 py-14 text-center"><Search className="mx-auto text-white/20"/><p className="mt-3 text-sm text-white/40">No words match this view.</p></div>}
  </>;
}
