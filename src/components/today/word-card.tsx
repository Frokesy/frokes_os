import { BookOpen, Check, Volume2 } from "lucide-react";
import type { Word } from "@/domain/types";

export function WordCard({ word, familiar, onFamiliar }: { word: Word; familiar?: boolean; onFamiliar: (value: boolean) => void }) {
  const speak = () => window.speechSynthesis?.speak(new SpeechSynthesisUtterance(word.word));
  return <section className="card group relative overflow-hidden p-5 sm:p-7">
    <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[#b7f35b]/[.06] blur-3xl" />
    <div className="mb-7 flex items-center justify-between"><div className="eyebrow"><BookOpen size={13}/> Word of the day</div><span className="text-xs text-white/30">01</span></div>
    <div className="flex items-start justify-between gap-4"><div><h2 className="font-serif text-[2.4rem] leading-none tracking-tight sm:text-5xl">{word.word}</h2><div className="mt-3 flex items-center gap-2 text-sm text-white/40"><em>{word.partOfSpeech}</em><span>·</span><span>{word.pronunciation}</span></div></div><button onClick={speak} aria-label={`Hear ${word.word}`} className="icon-button"><Volume2 size={18}/></button></div>
    <p className="mt-7 max-w-lg text-base leading-relaxed text-white/75">{word.definition}</p>
    <blockquote className="mt-5 border-l border-[#b7f35b]/50 pl-4 font-serif text-base italic leading-relaxed text-white/50">“{word.example}”</blockquote>
    <div className="mt-5 flex flex-wrap gap-2">{word.synonyms.map((item) => <span key={item} className="rounded-full border border-white/[.08] px-3 py-1 text-xs text-white/40">{item}</span>)}</div>
    <div className="mt-7 flex items-center justify-between border-t border-white/[.07] pt-5"><span className="text-xs text-white/35">Was this word familiar?</span><div className="flex gap-2"><button onClick={() => onFamiliar(false)} className={`choice ${familiar === false ? "choice-active" : ""}`}>New to me</button><button onClick={() => onFamiliar(true)} className={`choice ${familiar === true ? "choice-active" : ""}`}>{familiar === true && <Check size={12}/>} I knew it</button></div></div>
  </section>;
}
