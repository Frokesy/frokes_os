import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { profileSchema } from "@/lib/profile-validation";

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let input: unknown;
  try { input = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid profile" }, { status: 400 });
  const { completeOnboarding, ...profile } = parsed.data;
  const [updated] = await getDb().update(users).set({
    ...profile,
    onboardingCompletedAt: completeOnboarding ? new Date() : undefined,
    updatedAt: new Date(),
  }).where(eq(users.id, session.user.id)).returning({
    name: users.name, about: users.about, timezone: users.timezone, tone: users.tone,
    priorities: users.priorities, personalizationEnabled: users.personalizationEnabled,
    moodThemeEnabled: users.moodThemeEnabled, onboardingCompletedAt: users.onboardingCompletedAt,
  });
  return NextResponse.json({ profile: updated });
}
