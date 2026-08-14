"use client";

import { ArrowRight, BookOpen, Heart, WalletCards } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { dateKey, friendlyDate, greetingForHour, hourInTimeZone } from "@/lib/date";
import { WeatherGlance } from "./weather-glance";

const entryLanguage = [
  { button: "Begin today", note: "A moment to arrive before you begin." },
  { button: "Continue your day", note: "Welcome back. Your day is still here." },
  { button: "Pick up where you left off", note: "Return gently. There is nothing to catch up on." },
  { button: "Step back into today", note: "Another small pause can still be useful." },
] as const;

export function HomeView({ userName, userId, timeZone, onProceed }: { userName: string; userId: string; timeZone: string; onProceed: () => void }) {
  const [now, setNow] = useState<Date | null>(null);
  const [entryCount, setEntryCount] = useState(0);
  const [weatherScene, setWeatherScene] = useState("cloud-day");
  const handleWeather = useCallback((weather: "clear" | "cloud" | "rain" | "storm", isDay: boolean) => setWeatherScene(`${weather}-${isDay ? "day" : "night"}`), []);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const key = `frokes-os:${userId}:entries:${dateKey(new Date(), timeZone)}`;
    const stored = Number(localStorage.getItem(key) ?? "0");
    setEntryCount(Number.isFinite(stored) && stored > 0 ? stored : 0);
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [timeZone, userId]);

  const greeting = now ? greetingForHour(hourInTimeZone(now, timeZone)) : "Welcome";
  const time = now ? new Intl.DateTimeFormat("en-GB", {
    timeZone, hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).format(now) : "--:--:--";
  const date = now ? friendlyDate(now, timeZone) : "Your day, in your time";
  const language = entryLanguage[Math.min(entryCount, entryLanguage.length - 1)];

  const proceed = () => {
    const key = `frokes-os:${userId}:entries:${dateKey(new Date(), timeZone)}`;
    const next = entryCount + 1;
    localStorage.setItem(key, String(next));
    setEntryCount(next);
    onProceed();
  };

  return <div className="weather-scene relative flex min-h-dvh items-center justify-center overflow-hidden bg-[var(--mood-bg)] px-5 py-8 text-[#f4f5ef] transition-colors duration-700 md:px-10" data-weather={weatherScene}>
    <div className="pointer-events-none absolute left-[12%] top-[10%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,var(--mood-glow),var(--mood-glow-secondary)_48%,transparent_70%)] blur-2xl"/>
    <div className="weather-orb pointer-events-none absolute -right-[8%] top-[18%] h-[34rem] w-[34rem] rounded-full blur-2xl"/>
    <div className="pointer-events-none absolute bottom-[-22%] left-[36%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,var(--mood-glow-secondary),transparent_70%)] blur-3xl"/>
    <div className="pointer-events-none absolute left-1/2 top-[47%] h-[min(80vw,760px)] w-[min(80vw,760px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--mood-accent-border)] bg-[radial-gradient(circle,var(--mood-glow),transparent_62%)] opacity-30 shadow-[0_0_100px_var(--mood-glow)]"/>
    <div className="pointer-events-none absolute left-1/2 top-[47%] h-[min(62vw,570px)] w-[min(62vw,570px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[.035]"/>
    <section className="relative w-full max-w-4xl text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[.25em] text-[var(--mood-accent)] transition-colors duration-700">Frokes OS · online</p>
      <h1 className="mt-7 text-4xl font-medium tracking-[-.04em] sm:text-6xl">{greeting}, {userName}.</h1>
      <p className="mt-4 text-sm text-white/35">{date} · {timeZone.replace("_", " ")}</p>

      <div aria-label={`Current time ${time}`} className="mb-7 mt-8 font-mono text-[clamp(3.4rem,13vw,8.5rem)] font-medium leading-none tracking-[-.07em] tabular-nums text-white">
        {time}
      </div>

      <WeatherGlance userId={userId} onWeather={handleWeather}/>

      <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-white/40">{language.note} Learn something, check in with yourself, and move through today intentionally.</p>
      <button onClick={proceed} className="group mx-auto mt-7 inline-flex items-center gap-3 rounded-2xl bg-[var(--mood-accent)] px-6 py-4 text-sm font-semibold text-[#11170a] shadow-[0_12px_40px_var(--mood-glow)] transition hover:brightness-110 active:scale-[.98]">
        {language.button} <ArrowRight size={17} className="transition-transform group-hover:translate-x-1"/>
      </button>

      <div className="mx-auto mt-9 flex max-w-sm items-center justify-center gap-7 border-t border-white/[.06] pt-5 text-[10px] uppercase tracking-[.13em] text-white/20">
        <span className="flex items-center gap-2"><BookOpen size={13}/> Learn</span>
        <span className="flex items-center gap-2"><Heart size={13}/> Check in</span>
        <span className="flex items-center gap-2"><WalletCards size={13}/> Intention</span>
      </div>
    </section>
  </div>;
}
