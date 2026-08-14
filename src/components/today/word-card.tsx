"use client";

import { BookOpen, Bookmark, Check, RotateCcw, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { DayRecord, Word } from "@/domain/types";

export function WordCard({ word, record, onPatch }: { word: Word; record: DayRecord; onPatch: (patch: Partial<DayRecord>) => void }) {
  const [note, setNote] = useState(record.wordNote ?? "");
  const hydrated = useRef(false);
  useEffect(() => { setNote(record.wordNote ?? ""); hydrated.current = true; }, [record.wordId, record.wordNote]);
  useEffect(() => {
    if (!hydrated.current || note === (record.wordNote ?? "")) return;
    const timer = window.setTimeout(() => onPatch({ wordNote: note }), 650);
    return () => window.clearTimeout(timer);
  }, [note, onPatch, record.wordNote]);
  const speak = () => { window.speechSynthesis?.cancel(); const utterance = new SpeechSynthesisUtterance(word.word); utterance.lang = "en-NG"; window.speechSynthesis?.speak(utterance); };
  return <section className="card group relative overflow-hidden p-5 sm:p-7">
    <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[var(--mood-accent-soft)] blur-3xl"/>
    <div className="mb-7 flex items-center justify-between"><div className="eyebrow"><BookOpen size={13}/> Word of the day</div><span className="text-xs text-white/30">01</span></div>
    <div className="flex items-start justify-between gap-4"><div><h2 className="font-serif text-[2.4rem] leading-none tracking-tight sm:text-5xl">{word.word}</h2><div className="mt-3 flex items-center gap-2 text-sm text-white/40"><em>{word.partOfSpeech}</em><span>·</span><span>{word.pronunciation}</span></div></div><button onClick={speak} aria-label={`Hear ${word.word}`} className="icon-button"><Volume2 size={18}/></button></div>
    <p className="mt-7 max-w-lg text-base leading-relaxed text-white/75">{word.definition}</p>
    <blockquote className="mt-5 border-l border-[var(--mood-accent-border)] pl-4 font-serif text-base italic leading-relaxed text-white/50">“{word.example}”</blockquote>
    <div className="mt-5 flex flex-wrap gap-2">{word.synonyms.map(item => <span key={item} className="rounded-full border border-white/[.08] px-3 py-1 text-xs text-white/40">{item}</span>)}</div>
    <div className="mt-7 border-t border-white/[.07] pt-5"><div className="flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-white/35">Was this word familiar?</span><div className="flex gap-2"><button onClick={() => onPatch({ familiarWord: false })} className={`choice ${record.familiarWord === false ? "choice-active" : ""}`}>New to me</button><button onClick={() => onPatch({ familiarWord: true })} className={`choice ${record.familiarWord === true ? "choice-active" : ""}`}>{record.familiarWord === true && <Check size={12}/>} I knew it</button></div></div>
      <div className="mt-3 flex flex-wrap gap-2"><button onClick={() => onPatch({ wordSaved: !record.wordSaved })} className={`choice ${record.wordSaved ? "choice-active" : ""}`}><Bookmark size={12} fill={record.wordSaved ? "currentColor" : "none"}/>{record.wordSaved ? "Saved" : "Save word"}</button><button onClick={() => onPatch({ wordReviewedAt: new Date().toISOString() })} className={`choice ${record.wordReviewedAt ? "choice-active" : ""}`}><RotateCcw size={12}/>{record.wordReviewedAt ? "Reviewed" : "Mark reviewed"}</button></div>
      <label className="mt-4 block text-[10px] uppercase tracking-[.13em] text-white/30" htmlFor={`word-note-${word.id}`}>Personal note · autosaves</label><textarea id={`word-note-${word.id}`} value={note} onChange={event => setNote(event.target.value)} maxLength={2000} rows={2} placeholder="A memory, sentence, or reason to keep this word…" className="input mt-2 resize-none"/>
    </div>
  </section>;
}
