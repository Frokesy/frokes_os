"use client";

import { BookOpen, CalendarDays, House, LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HistoryView } from "@/components/history/history-view";
import { HomeView } from "@/components/home/home-view";
import { InstallApp } from "@/components/pwa/install-app";
import { ProfileModal } from "@/components/profile/profile-modal";
import { TodayView } from "@/components/today/today-view";
import type { UserProfile } from "@/domain/profile";
import { useDailyRecords } from "@/hooks/use-daily-records";

const nav = [
  { id: "home", label: "Home", icon: House },
  { id: "history", label: "History", icon: CalendarDays },
  { id: "library", label: "Words", icon: BookOpen },
] as const;
type View = (typeof nav)[number]["id"];
type Transition = "idle" | "to-home" | "to-clock";

export function AppShell({ userId, initialProfile }: { userId: string; initialProfile: UserProfile }) {
  const [view, setView] = useState<View>("home");
  const [clockVisible, setClockVisible] = useState(true);
  const [transition, setTransition] = useState<Transition>("idle");
  const [profile, setProfile] = useState(initialProfile);
  const [profileOpen, setProfileOpen] = useState(false);
  const timer = useRef<number | null>(null);
  const store = useDailyRecords(userId, profile.timezone);

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  const beginToday = () => {
    setView("home");
    setTransition("to-home");
    timer.current = window.setTimeout(() => {
      setClockVisible(false);
      setTransition("idle");
      if (!profile.onboardingCompletedAt) setProfileOpen(true);
    }, 720);
  };

  const returnToClock = () => {
    setClockVisible(true);
    setTransition("to-clock");
    timer.current = window.setTimeout(() => setTransition("idle"), 720);
  };

  const shellMotion = clockVisible
    ? transition === "to-home" ? "app-scene-enter" : transition === "to-clock" ? "app-scene-exit" : "pointer-events-none opacity-0"
    : "opacity-100";

  return <div className="min-h-dvh bg-[#080a0d] text-[#f4f5ef]">
    <div className={shellMotion} aria-hidden={clockVisible && transition === "idle"}>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[244px] flex-col border-r border-white/[.07] bg-[#0b0e12] p-6 md:flex">
        <div className="mb-12 flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#b7f35b] font-black text-[#0a0d08]">F</div><div><div className="font-semibold tracking-tight">Frokes OS</div><div className="text-[10px] uppercase tracking-[.24em] text-white/35">Personal system</div></div></div>
        <nav className="space-y-1">{nav.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setView(id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${view === id ? "bg-white/[.07] text-white" : "text-white/45 hover:bg-white/[.04] hover:text-white/75"}`}><Icon size={18}/>{label}</button>)}</nav>
        <div className="mt-auto"><div className="mb-5 rounded-2xl border border-white/[.07] bg-white/[.025] p-4"><p className="text-xs leading-relaxed text-white/45">A quiet place to become more intentional, one day at a time.</p></div><InstallApp/><Link href="/settings" className="flex items-center gap-3 px-3 py-3 text-sm text-white/35 transition hover:text-white/70"><Settings size={17}/> Settings</Link><button onClick={() => signOut({ callbackUrl: "/sign-in" })} className="flex items-center gap-3 px-3 py-3 text-sm text-white/35 transition hover:text-white/70"><LogOut size={17}/> Sign out</button></div>
      </aside>
      <main className="pb-24 md:ml-[244px] md:pb-8">{view === "home" ? <TodayView store={store} userName={profile.name} timeZone={profile.timezone} onReturnToClock={returnToClock}/> : <HistoryView records={store.records} wordsOnly={view === "library"}/>}</main>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-white/10 bg-[#0b0e12]/95 px-3 pb-[max(.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden">{nav.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setView(id)} className={`flex flex-1 flex-col items-center gap-1 py-1 text-[10px] ${view === id ? "text-[#b7f35b]" : "text-white/40"}`}><Icon size={20}/>{label}</button>)}<Link href="/settings" className="flex flex-1 flex-col items-center gap-1 py-1 text-[10px] text-white/40"><Settings size={20}/>Settings</Link><InstallApp mobile/></nav>
    </div>

    {clockVisible && <div className={`fixed inset-0 z-50 bg-[#080a0d] ${transition === "to-home" ? "arrival-scene-exit pointer-events-none" : transition === "to-clock" ? "arrival-scene-enter" : ""}`}>
      <HomeView userName={profile.name} userId={userId} timeZone={profile.timezone} onProceed={beginToday}/>
    </div>}
    {profileOpen && (
      <ProfileModal initial={profile} firstRun={!profile.onboardingCompletedAt} onClose={() => setProfileOpen(false)} onSaved={setProfile}/>
    )}
  </div>;
}
