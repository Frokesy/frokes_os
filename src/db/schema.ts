import { boolean, index, jsonb, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { DayRecord } from "@/domain/types";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  timezone: text("timezone").notNull().default("Africa/Lagos"),
  about: text("about").notNull().default(""),
  tone: text("tone").$type<"calm" | "direct" | "reflective" | "encouraging">().notNull().default("calm"),
  priorities: jsonb("priorities").$type<string[]>().notNull().default([]),
  personalizationEnabled: boolean("personalization_enabled").notNull().default(false),
  moodThemeEnabled: boolean("mood_theme_enabled").notNull().default(true),
  onboardingCompletedAt: timestamp("onboarding_completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// This becomes the cloud synchronization target in the next account milestone.
export const dailyRecords = pgTable("daily_records", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  record: jsonb("record").$type<DayRecord>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  primaryKey({ columns: [table.userId, table.date] }),
  index("daily_records_user_updated_idx").on(table.userId, table.updatedAt),
]);

// Mutation IDs make offline retries safe: a queued edit is applied at most once.
export const syncMutations = pgTable("sync_mutations", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  mutationId: text("mutation_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  primaryKey({ columns: [table.userId, table.mutationId] }),
  index("sync_mutations_created_idx").on(table.createdAt),
]);
