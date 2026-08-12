import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppShell } from "@/components/shell/app-shell";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function Home() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");
  const [profile] = await getDb().select({
    name: users.name, about: users.about, timezone: users.timezone, tone: users.tone,
    priorities: users.priorities, personalizationEnabled: users.personalizationEnabled,
    moodThemeEnabled: users.moodThemeEnabled, onboardingCompletedAt: users.onboardingCompletedAt,
  }).from(users).where(eq(users.id, session.user.id)).limit(1);
  if (!profile) redirect("/sign-in");
  return <AppShell userId={session.user.id} initialProfile={profile}/>;
}
