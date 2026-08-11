"use client";

import { useEffect, useState } from "react";
import type { DayRecord } from "@/domain/types";
import { dateKey } from "@/lib/date";

const STORAGE_KEY = "frokes-os:daily-records:v1";

export function useDailyRecords() {
  const [records, setRecords] = useState<Record<string, DayRecord>>({});
  const [ready, setReady] = useState(false);
  const today = dateKey();

  useEffect(() => {
    try { setRecords(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}")); } catch { setRecords({}); }
    setReady(true);
  }, []);

  const updateToday = (patch: Partial<DayRecord>) => setRecords((current) => {
    const next = { ...current, [today]: { ...current[today], ...patch, date: today } };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  });

  return { records, today: records[today] ?? { date: today }, updateToday, ready };
}
