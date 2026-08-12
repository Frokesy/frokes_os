import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppShell } from "@/components/shell/app-shell";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function Home() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");
  const [profile] = await getDb().select({ timezone: users.timezone }).from(users).where(eq(users.id, session.user.id)).limit(1);
  return <AppShell userName={session.user.name ?? "Frokes"} userId={session.user.id} timeZone={profile?.timezone ?? "Africa/Lagos"}/>;
}
