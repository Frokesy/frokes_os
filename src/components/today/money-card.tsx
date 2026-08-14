import { ArrowUpRight, Info, WalletCards } from "lucide-react";
import type { MoneyTip } from "@/domain/types";

type Feedback = "useful" | "not_relevant" | "already_know" | "less_like_this";
const choices: { value: Feedback; label: string }[] = [
  { value: "useful", label: "Useful" },
  { value: "not_relevant", label: "Not relevant" },
  { value: "already_know", label: "Already know" },
  { value: "less_like_this", label: "Less like this" },
];

export function MoneyCard({ tip, reason, feedback, onFeedback }: { tip: MoneyTip; reason: string; feedback?: Feedback; onFeedback: (feedback: Feedback) => void }) {
  return <section className="card flex flex-col p-5 sm:p-7">
    <div className="mb-7 flex items-center justify-between"><div className="eyebrow"><WalletCards size={13}/> Money thought</div><span className="text-xs text-white/30">03</span></div>
    <span className="text-xs font-medium text-[var(--mood-accent)]">{tip.eyebrow}</span>
    <h2 className="mt-3 max-w-md text-2xl font-medium leading-tight">{tip.title}</h2>
    <p className="mt-4 max-w-lg text-sm leading-7 text-white/50">{tip.body}</p>
    <div className="mt-auto pt-7">
      <div className="flex items-center justify-between rounded-xl border border-[var(--mood-accent-border)] bg-[var(--mood-accent-soft)] px-4 py-3"><span className="text-xs text-white/55">{tip.action}</span><ArrowUpRight size={15} className="text-[var(--mood-accent)]"/></div>
      <p className="mt-3 flex items-start gap-1.5 text-[10px] leading-relaxed text-white/35"><Info size={11} className="mt-0.5 shrink-0 text-[var(--mood-accent)]"/> {reason}</p>
      <div className="mt-4 flex flex-wrap gap-2">{choices.map(choice => <button key={choice.value} onClick={() => onFeedback(choice.value)} className={`choice ${feedback === choice.value ? "choice-active" : ""}`}>{choice.label}</button>)}</div>
      <p className="mt-3 text-[10px] leading-relaxed text-white/25">For awareness only, not a promise of financial outcomes.</p>
    </div>
  </section>;
}
