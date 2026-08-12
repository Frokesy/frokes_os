"use client";

import { Check, ChevronLeft, ChevronRight, LoaderCircle, MapPin, Sparkles, X } from "lucide-react";
import { useState } from "react";
import type { UserProfile } from "@/domain/profile";
import { priorities, tones } from "@/lib/profile-validation";

const timezones = ["Africa/Lagos", "Africa/Accra", "Europe/London", "America/New_York", "America/Los_Angeles", "Asia/Dubai"];
const stepCopy = [
  { kicker: "Identity", title: "Make this space yours.", body: "How should Frokes OS know and address you?" },
  { kicker: "Direction", title: "What matters right now?", body: "Choose the areas you want the system to hold in view." },
  { kicker: "Relationship", title: "How should the system respond?", body: "Set the voice and boundaries for future personalization." },
];

export function ProfileModal({ initial, firstRun, onClose, onSaved, presentation = "modal" }: { initial: UserProfile; firstRun: boolean; onClose: () => void; onSaved: (profile: UserProfile) => void; presentation?: "modal" | "page" }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const copy = stepCopy[step];

  const togglePriority = (value: string) => setForm(current => ({ ...current, priorities: current.priorities.includes(value) ? current.priorities.filter(item => item !== value) : [...current.priorities, value] }));
  const detectTimezone = () => setForm(current => ({ ...current, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Lagos" }));
  const save = async () => {
    setSaving(true); setSaved(false); setError("");
    try {
      const response = await fetch("/api/profile", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...form, completeOnboarding: true }) });
      const result = await response.json() as { profile?: UserProfile; error?: string };
      if (!response.ok || !result.profile) throw new Error(result.error ?? "Could not save your profile.");
      onSaved(result.profile);
      setSaved(true);
      if (presentation === "modal") onClose();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not save your profile."); }
    finally { setSaving(false); }
  };

  const page = presentation === "page";
  return <div role={page ? undefined : "dialog"} aria-modal={page ? undefined : true} aria-labelledby="profile-title" className={page ? "w-full" : "fixed inset-0 z-[70] flex items-end justify-center bg-black/70 backdrop-blur-md sm:items-center sm:p-6"}>
    <div className={`relative flex w-full flex-col overflow-hidden border-white/[.08] bg-[#0d1116] ${page ? "min-h-[620px] rounded-[24px] border" : "max-h-dvh shadow-[0_35px_100px_rgba(0,0,0,.6)] sm:max-h-[min(760px,90dvh)] sm:max-w-[620px] sm:rounded-[28px] sm:border"}`}>
      <div className="h-1 bg-white/[.05]"><div className="h-full bg-[#b7f35b] transition-all duration-500" style={{ width: `${((step + 1) / 3) * 100}%` }}/></div>
      <header className="flex items-start justify-between px-6 pb-5 pt-6 sm:px-8 sm:pt-8"><div><p className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#b7f35b]">{firstRun ? `Set up · ${copy.kicker}` : `Profile · ${copy.kicker}`}</p><h2 id="profile-title" className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">{copy.title}</h2><p className="mt-2 text-sm text-white/35">{copy.body}</p></div>{!page && <button onClick={onClose} className="icon-button shrink-0" aria-label={firstRun ? "Finish later" : "Close settings"}><X size={17}/></button>}</header>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 sm:px-8">
        {step === 0 && <div className="space-y-5 pt-2"><label className="block"><span className="label">What should I call you?</span><input className="input" value={form.name} maxLength={60} onChange={event => setForm({ ...form, name: event.target.value })}/></label><label className="block"><span className="label">A little about you <span className="text-white/20">· optional</span></span><textarea className="input min-h-28 resize-none" maxLength={500} value={form.about} onChange={event => setForm({ ...form, about: event.target.value })} placeholder="What season of life are you in? What should this system understand?"/></label><label className="block"><span className="label">Your timezone</span><div className="flex gap-2"><select className="input" value={form.timezone} onChange={event => setForm({ ...form, timezone: event.target.value })}>{!timezones.includes(form.timezone) && <option>{form.timezone}</option>}{timezones.map(zone => <option key={zone} value={zone}>{zone.replaceAll("_", " ")}</option>)}</select><button onClick={detectTimezone} type="button" className="icon-button shrink-0" aria-label="Detect timezone" title="Use device timezone"><MapPin size={17}/></button></div></label></div>}
        {step === 1 && <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3">{priorities.map(item => { const active = form.priorities.includes(item); return <button type="button" key={item} onClick={() => togglePriority(item)} className={`relative min-h-24 rounded-2xl border p-4 text-left text-sm transition ${active ? "border-[#b7f35b]/45 bg-[#b7f35b]/10 text-white" : "border-white/[.07] bg-white/[.025] text-white/45 hover:bg-white/[.05]"}`}>{active && <Check size={14} className="absolute right-3 top-3 text-[#b7f35b]"/>}<span className="block max-w-[8rem] leading-5">{item}</span></button>})}</div>}
        {step === 2 && <div className="space-y-6 pt-2"><div><span className="label">Preferred tone</span><div className="grid grid-cols-2 gap-2">{tones.map(tone => <button type="button" key={tone} onClick={() => setForm({ ...form, tone })} className={`choice justify-center py-3 capitalize ${form.tone === tone ? "choice-active" : ""}`}>{tone}</button>)}</div></div><Toggle title="Personalized guidance" body="Allow Frokes OS to use your confirmed preferences and past entries to make future guidance more relevant." checked={form.personalizationEnabled} onChange={value => setForm({ ...form, personalizationEnabled: value })}/><Toggle title="Mood-responsive appearance" body="Allow subtle visual accents to respond to the mood you log. This will never change your app icon or notifications." checked={form.moodThemeEnabled} onChange={value => setForm({ ...form, moodThemeEnabled: value })}/><div className="rounded-2xl border border-white/[.07] bg-white/[.025] p-4"><div className="flex gap-3"><Sparkles size={16} className="mt-0.5 shrink-0 text-[#b7f35b]"/><p className="text-xs leading-6 text-white/35">You remain in control. Inferred memories will be shown for confirmation before they influence the system.</p></div></div></div>}
        {error && <p role="alert" className="mt-5 rounded-xl border border-red-300/15 bg-red-300/[.06] px-4 py-3 text-xs text-red-100/75">{error}</p>}
      </div>

      <footer className="flex items-center justify-between border-t border-white/[.07] bg-[#0b0f13] px-6 py-4 sm:px-8"><div>{step > 0 ? <button onClick={() => setStep(step - 1)} className="choice"><ChevronLeft size={14}/> Back</button> : firstRun ? <button onClick={onClose} className="text-xs text-white/30 hover:text-white/55">Finish later</button> : <span/>}</div>{step < 2 ? <button disabled={step === 0 && form.name.trim().length < 2} onClick={() => setStep(step + 1)} className="primary-button gap-2 disabled:opacity-30">Continue <ChevronRight size={14}/></button> : <button disabled={saving} onClick={save} className="primary-button min-w-32 gap-2 disabled:opacity-50">{saving ? <LoaderCircle size={15} className="animate-spin"/> : <Check size={15}/>} {saved ? "Changes saved" : "Save profile"}</button>}</footer>
    </div>
  </div>;
}

function Toggle({ title, body, checked, onChange }: { title: string; body: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <div className="flex items-start justify-between gap-5 border-t border-white/[.07] pt-5"><div><div className="text-sm text-white/75">{title}</div><p className="mt-1 max-w-md text-xs leading-5 text-white/30">{body}</p></div><button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={`relative mt-1 h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-[#b7f35b]" : "bg-white/10"}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-[#0b0e12] transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`}/></button></div>;
}
