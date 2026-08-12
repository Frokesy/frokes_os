import { Activity, Check } from "lucide-react";
import { useState } from "react";
import type { Mood, MoodEntry } from "@/domain/types";

const moods: { id: Mood; face: string; label: string }[] = [{ id: "great", face: "●‿●", label: "Great" }, { id: "good", face: "◕‿◕", label: "Good" }, { id: "okay", face: "●_●", label: "Okay" }, { id: "low", face: "◕︵◕", label: "Low" }, { id: "rough", face: "●︵●", label: "Rough" }];
const factors = ["Work", "School", "Money", "Relationships", "Family", "Health", "Football", "Personal"];

export function MoodCard({ value, onSave }: { value?: MoodEntry; onSave: (mood: MoodEntry) => void }) {
  const [open, setOpen] = useState(false);
  const [mood, setMood] = useState<Mood>(value?.mood ?? "okay");
  const [energy, setEnergy] = useState(value?.energy ?? 3);
  const [stress, setStress] = useState(value?.stress ?? 3);
  const [note, setNote] = useState(value?.note ?? "");
  const [selected, setSelected] = useState<string[]>(value?.factors ?? []);
  const save = () => { onSave({ mood, energy, stress, note, factors: selected }); setOpen(false); };
  return <section className="card p-5 sm:p-7"><div className="mb-6 flex items-center justify-between"><div className="eyebrow"><Activity size={13}/> Check in</div>{value && <span className="flex items-center gap-1 text-xs text-[var(--mood-accent)]"><Check size={13}/> Logged</span>}</div>
    <h2 className="text-xl font-medium">How are you, really?</h2><p className="mt-2 text-sm text-white/40">No fixing. Just notice what is here.</p>
    <div className="mt-6 grid grid-cols-5 gap-2">{moods.map((item) => <button key={item.id} onClick={() => { setMood(item.id); setOpen(true); }} className={`rounded-xl border py-3 transition ${mood === item.id && (open || value?.mood === item.id) ? "border-[var(--mood-accent-border)] bg-[var(--mood-accent-soft)]" : "border-white/[.07] bg-white/[.025] hover:bg-white/[.05]"}`}><span className="block text-sm text-white/65">{item.face}</span><span className="mt-1 block text-[10px] text-white/35">{item.label}</span></button>)}</div>
    {!open && <button onClick={() => setOpen(true)} className="mt-5 w-full rounded-xl border border-white/[.08] py-3 text-sm text-white/55 transition hover:bg-white/[.04]">{value ? "Update check-in" : "Add a little more"}</button>}
    {open && <div className="mt-6 space-y-5 border-t border-white/[.07] pt-5">
      <Scale label="Energy" value={energy} setValue={setEnergy}/><Scale label="Stress" value={stress} setValue={setStress}/>
      <div><label className="label">What’s affecting you?</label><div className="flex flex-wrap gap-2">{factors.map(f => <button key={f} onClick={() => setSelected(s => s.includes(f) ? s.filter(x => x !== f) : [...s, f])} className={`choice ${selected.includes(f) ? "choice-active" : ""}`}>{f}</button>)}</div></div>
      <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Optional note…" className="input resize-none"/><button onClick={save} className="primary-button w-full">Save check-in</button>
    </div>}
  </section>;
}

function Scale({ label, value, setValue }: { label: string; value: number; setValue: (n: number) => void }) { return <div><div className="mb-2 flex justify-between"><span className="label mb-0">{label}</span><span className="text-xs text-white/35">{value}/5</span></div><div className="grid grid-cols-5 gap-2">{[1,2,3,4,5].map(n => <button aria-label={`${label} ${n}`} key={n} onClick={() => setValue(n)} className={`h-2 rounded-full ${n <= value ? "bg-[var(--mood-accent)]" : "bg-white/10"}`}/>)}</div></div> }
