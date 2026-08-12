import { and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { dailyRecords, syncMutations } from "@/db/schema";
import type { DayRecord } from "@/domain/types";
import { syncRequestSchema } from "@/lib/record-validation";

export const dynamic = "force-dynamic";

async function currentRecords(userId: string) {
  const rows = await getDb().select({ record: dailyRecords.record }).from(dailyRecords).where(eq(dailyRecords.userId, userId));
  return Object.fromEntries(rows.map(({ record }) => [record.date, record]));
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ records: await currentRecords(session.user.id), serverTime: new Date().toISOString() });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let input: unknown;
  try { input = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = syncRequestSchema.safeParse(input);
  if (!parsed.success) return NextResponse.json({ error: "Invalid sync payload" }, { status: 400 });

  const userId = session.user.id;
  const acknowledged: string[] = [];
  await getDb().transaction(async (tx) => {
    for (const mutation of parsed.data.mutations) {
      const inserted = await tx.insert(syncMutations).values({ userId, mutationId: mutation.id }).onConflictDoNothing().returning({ id: syncMutations.mutationId });
      if (inserted.length) {
        const record = { ...mutation.patch, date: mutation.date } as DayRecord;
        await tx.insert(dailyRecords).values({ userId, date: mutation.date, record }).onConflictDoUpdate({
          target: [dailyRecords.userId, dailyRecords.date],
          set: {
            // PostgreSQL's JSONB concatenation merges top-level ritual sections.
            record: sql`${dailyRecords.record} || ${JSON.stringify(record)}::jsonb`,
            updatedAt: new Date(),
          },
          setWhere: and(eq(dailyRecords.userId, userId), eq(dailyRecords.date, mutation.date)),
        });
      }
      // Existing mutation IDs are also acknowledged; they already reached cloud.
      acknowledged.push(mutation.id);
    }
  });

  return NextResponse.json({ records: await currentRecords(userId), acknowledged, serverTime: new Date().toISOString() });
}
