"use client";

import { BookOpen, CalendarDays, LayoutGrid, Settings } from "lucide-react";
import { useState } from "react";
import { TodayView } from "@/components/today/today-view";
import { HistoryView } from "@/components/history/history-view";
import { useDailyRecords } from "@/hooks/use-daily-records";

const nav = [
  { id: "today", label: "Today", icon: LayoutGrid },
  { id: "history", label: "History", icon: CalendarDays },
  { id: "library", label: "Words", icon: BookOpen },
] as const;

export function AppShell() {
  const [view, setView] = useState<(typeof nav)[number]["id"]>("today");
  const store = useDailyRecords();
  return (
    <div className="min-h-dvh bg-[#080a0d] text-[#f4f5ef]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[244px] flex-col border-r border-white/[.07] bg-[#0b0e12] p-6 md:flex">
        <div className="mb-12 flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#b7f35b] font-black text-[#0a0d08]">F</div><div><div className="font-semibold tracking-tight">Frokes OS</div><div className="text-[10px] uppercase tracking-[.24em] text-white/35">Personal system</div></div></div>
        <nav className="space-y-1">{nav.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setView(id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${view === id ? "bg-white/[.07] text-white" : "text-white/45 hover:bg-white/[.04] hover:text-white/75"}`}><Icon size={18}/>{label}</button>)}</nav>
        <div className="mt-auto"><div className="mb-5 rounded-2xl border border-white/[.07] bg-white/[.025] p-4"><p className="text-xs leading-relaxed text-white/45">A quiet place to become more intentional, one day at a time.</p></div><button className="flex items-center gap-3 px-3 text-sm text-white/35"><Settings size={17}/> Settings</button></div>
      </aside>
      <main className="pb-24 md:ml-[244px] md:pb-8">{view === "today" ? <TodayView store={store}/> : <HistoryView records={store.records} wordsOnly={view === "library"}/>}</main>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-white/10 bg-[#0b0e12]/95 px-3 pb-[max(.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden">{nav.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setView(id)} className={`flex flex-1 flex-col items-center gap-1 py-1 text-[10px] ${view === id ? "text-[#b7f35b]" : "text-white/40"}`}><Icon size={20}/>{label}</button>)}</nav>
    </div>
  );
}
