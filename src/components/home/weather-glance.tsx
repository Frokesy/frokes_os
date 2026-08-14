"use client";

import { Cloud, CloudFog, CloudLightning, CloudRain, LocateFixed, Snowflake, Sun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Weather = { current: { temperature_2m: number; apparent_temperature: number; is_day: number; weather_code: number }; daily: { time: string[]; weather_code: number[]; temperature_2m_max: number[]; temperature_2m_min: number[]; precipitation_probability_max: number[] } };
const description = (code: number) => code === 0 ? "Clear" : code <= 3 ? "Partly cloudy" : code <= 48 ? "Misty" : code <= 67 || code >= 80 && code <= 82 ? "Rain" : code <= 77 || code >= 85 && code <= 86 ? "Snow" : code >= 95 ? "Thunderstorms" : "Cloudy";
const Icon = ({ code, size = 18 }: { code: number; size?: number }) => { const C = code === 0 ? Sun : code <= 3 ? Cloud : code <= 48 ? CloudFog : code <= 67 || code >= 80 && code <= 82 ? CloudRain : code <= 77 || code >= 85 && code <= 86 ? Snowflake : code >= 95 ? CloudLightning : Cloud; return <C size={size}/>; };

export function WeatherGlance({ userId, onWeather }: { userId: string; onWeather: (weather: "clear" | "cloud" | "rain" | "storm", isDay: boolean) => void }) {
  const [weather, setWeather] = useState<Weather>();
  const [place, setPlace] = useState("Lagos");
  const [loading, setLoading] = useState(true);
  const load = useCallback(async (lat: number, lon: number, label: string) => {
    setLoading(true);
    try { const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`); if (!response.ok) throw new Error(); const data = await response.json() as Weather; setWeather(data); setPlace(label); const code = data.current.weather_code; onWeather(code >= 95 ? "storm" : code >= 51 ? "rain" : code > 0 ? "cloud" : "clear", data.current.is_day === 1); } catch { setWeather(undefined); } finally { setLoading(false); }
  }, [onWeather]);
  useEffect(() => { let parsed = { lat: 6.5244, lon: 3.3792, label: "Lagos" }; try { const saved = localStorage.getItem(`frokes-os:${userId}:weather-location`); if (saved) parsed = JSON.parse(saved) as typeof parsed; } catch { localStorage.removeItem(`frokes-os:${userId}:weather-location`); } void load(parsed.lat, parsed.lon, parsed.label); }, [load, userId]);
  const locate = () => navigator.geolocation?.getCurrentPosition(position => { const value = { lat: position.coords.latitude, lon: position.coords.longitude, label: "Your location" }; localStorage.setItem(`frokes-os:${userId}:weather-location`, JSON.stringify(value)); void load(value.lat, value.lon, value.label); });
  if (loading) return <div className="h-[92px] animate-pulse rounded-2xl border border-white/10 bg-white/[.035]"/>;
  if (!weather) return <button onClick={() => void load(6.5244, 3.3792, "Lagos")} className="text-xs text-white/35 hover:text-white/60">Weather unavailable · tap to retry</button>;
  return <div className="weather-panel mx-auto flex w-full max-w-2xl items-center gap-4 rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-left backdrop-blur-md">
    <div className="flex min-w-[110px] items-center gap-3"><span className="text-[var(--mood-accent)]"><Icon code={weather.current.weather_code} size={25}/></span><div><div className="text-xl font-medium">{Math.round(weather.current.temperature_2m)}°</div><div className="text-[10px] text-white/40">{description(weather.current.weather_code)} · {place}</div></div></div>
    <div className="hidden flex-1 grid-cols-3 gap-2 sm:grid">{weather.daily.time.map((day, index) => <div key={day} className="rounded-xl bg-white/[.035] px-3 py-2"><div className="flex items-center justify-between text-[10px] text-white/35"><span>{index ? new Intl.DateTimeFormat("en", { weekday: "short" }).format(new Date(`${day}T12:00:00`)) : "Today"}</span><Icon code={weather.daily.weather_code[index]} size={13}/></div><div className="mt-1 text-xs">{Math.round(weather.daily.temperature_2m_max[index])}° <span className="text-white/30">{Math.round(weather.daily.temperature_2m_min[index])}°</span></div></div>)}</div>
    <button onClick={locate} title="Use my location" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 text-white/40 transition hover:bg-white/10 hover:text-white"><LocateFixed size={15}/></button>
  </div>;
}
