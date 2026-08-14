"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DayRecord } from "@/domain/types";
import { dateKey } from "@/lib/date";

const LEGACY_KEY = "frokes-os:daily-records:v1";
const LEGACY_CLAIM_KEY = "frokes-os:legacy-records-claimed-by:v1";
const storageKey = (userId: string) => `frokes-os:${userId}:daily-records:v2`;
const queueKey = (userId: string) => `frokes-os:${userId}:sync-queue:v1`;
const migratedKey = (userId: string) => `frokes-os:${userId}:legacy-migrated:v1`;
const backupKey = (userId: string) => `frokes-os:${userId}:legacy-backup:v1`;

type RecordPatch = Partial<DayRecord>;
type Mutation = { id: string; date: string; patch: RecordPatch; createdAt: string };
export type SyncStatus = "loading" | "synced" | "syncing" | "offline" | "error";

const read = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) ?? "") as T; } catch { return fallback; }
};
const merge = (base: Record<string, DayRecord>, overlays: Mutation[]) => overlays.reduce((result, item) => ({
  ...result,
  [item.date]: { ...result[item.date], ...item.patch, date: item.date },
}), base);

export function useDailyRecords(userId: string, timeZone: string) {
  const [records, setRecords] = useState<Record<string, DayRecord>>({});
  const [ready, setReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("loading");
  const [pendingCount, setPendingCount] = useState(0);
  const syncing = useRef(false);
  const mounted = useRef(true);
  const today = dateKey(new Date(), timeZone);

  const sync = useCallback(async () => {
    if (syncing.current || !navigator.onLine) {
      if (!navigator.onLine) setSyncStatus("offline");
      return;
    }
    syncing.current = true;
    setSyncStatus("syncing");
    const sent = read<Mutation[]>(queueKey(userId), []);
    try {
      const response = await fetch("/api/sync", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mutations: sent }),
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`Sync failed (${response.status})`);
      const body = await response.json() as { records: Record<string, DayRecord>; acknowledged: string[] };

      // Include edits created while this request was in flight.
      const latestQueue = read<Mutation[]>(queueKey(userId), []);
      const acknowledged = new Set(body.acknowledged);
      const remaining = latestQueue.filter(item => !acknowledged.has(item.id));
      const reconciled = merge(body.records, remaining);
      localStorage.setItem(queueKey(userId), JSON.stringify(remaining));
      localStorage.setItem(storageKey(userId), JSON.stringify(reconciled));
      if (mounted.current) {
        setRecords(reconciled);
        setPendingCount(remaining.length);
        setSyncStatus(remaining.length ? "syncing" : "synced");
      }
    } catch {
      if (mounted.current) setSyncStatus(navigator.onLine ? "error" : "offline");
    } finally {
      syncing.current = false;
    }
  }, [userId]);

  useEffect(() => {
    mounted.current = true;
    let local = read<Record<string, DayRecord>>(storageKey(userId), {});
    let queue = read<Mutation[]>(queueKey(userId), []);

    // One-time, non-destructive import of records created before accounts existed.
    if (!localStorage.getItem(migratedKey(userId))) {
      const legacy = read<Record<string, DayRecord>>(LEGACY_KEY, {});
      const claimedBy = localStorage.getItem(LEGACY_CLAIM_KEY);
      if (Object.keys(legacy).length && (!claimedBy || claimedBy === userId)) {
        // Claim before queueing so another account on this browser cannot import
        // the same private history if the user signs out while offline.
        localStorage.setItem(LEGACY_CLAIM_KEY, userId);
        localStorage.setItem(backupKey(userId), JSON.stringify(legacy));
        local = { ...legacy, ...local };
        const existingDates = new Set(queue.map(item => item.date));
        const imports = Object.values(legacy).filter(item => !existingDates.has(item.date)).map(record => ({
          id: crypto.randomUUID(), date: record.date, patch: record, createdAt: new Date().toISOString(),
        }));
        queue = [...queue, ...imports];
      }
      localStorage.setItem(migratedKey(userId), new Date().toISOString());
      localStorage.setItem(storageKey(userId), JSON.stringify(local));
      localStorage.setItem(queueKey(userId), JSON.stringify(queue));
    }

    setRecords(local);
    setPendingCount(queue.length);
    setReady(true);
    setSyncStatus(navigator.onLine ? "syncing" : "offline");
    void sync();

    const onOnline = () => void sync();
    const onOffline = () => setSyncStatus("offline");
    const onVisibility = () => { if (document.visibilityState === "visible") void sync(); };
    const interval = window.setInterval(() => { if (document.visibilityState === "visible") void sync(); }, 60_000);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      mounted.current = false;
      window.clearInterval(interval);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [sync, userId]);

  const updateRecord = (recordDate: string, patch: RecordPatch) => {
    const mutation: Mutation = { id: crypto.randomUUID(), date: recordDate, patch, createdAt: new Date().toISOString() };
    setRecords(current => {
      const next = { ...current, [recordDate]: { ...current[recordDate], ...patch, date: recordDate } };
      localStorage.setItem(storageKey(userId), JSON.stringify(next));
      return next;
    });
    const queue = [...read<Mutation[]>(queueKey(userId), []), mutation];
    localStorage.setItem(queueKey(userId), JSON.stringify(queue));
    setPendingCount(queue.length);
    setSyncStatus(navigator.onLine ? "syncing" : "offline");
    window.setTimeout(() => void sync(), 0);
  };

  const updateToday = (patch: RecordPatch) => updateRecord(today, patch);

  return { records, today: records[today] ?? { date: today }, updateToday, updateRecord, ready, syncStatus, pendingCount, sync };
}
