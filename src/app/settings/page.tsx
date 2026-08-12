import { ArrowLeft, Bell, Brain, Database, LockKeyhole, UserRound } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { SettingsProfile } from "@/components/profile/settings-profile";
import { getDb } from "@/db";
import { users } from "@/db/schema";

const futureSections = [
  { icon: Bell, label: "Reminders", note: "Coming next" },
  { icon: Brain, label: "Memory", note: "Planned" },
  { icon: LockKeyhole, label: "Privacy", note: "Planned" },
  { icon: Database, label: "Data & export", note: "Planned" },
];

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  const [profile] = await getDb().select({
    name: users.name, about: users.about, timezone: users.timezone, tone: users.tone,
    priorities: users.priorities, personalizationEnabled: users.personalizationEnabled,
    moodThemeEnabled: users.moodThemeEnabled, onboardingCompletedAt: users.onboardingCompletedAt,
  }).from(users).where(eq(users.id, session.user.id)).limit(1);
  if (!profile) redirect("/sign-in");

  return <main className="min-h-dvh bg-[#080a0d] px-4 py-6 text-[#f4f5ef] sm:px-8 lg:px-12 lg:py-10">
    <div className="mx-auto max-w-[1120px]">
      <Link href="/" className="inline-flex items-center gap-2 text-xs text-white/35 transition hover:text-white/70"><ArrowLeft size={15}/> Back to Frokes OS</Link>
      <header className="mb-9 mt-8"><p className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#b7f35b]">System preferences</p><h1 className="mt-3 text-4xl font-medium tracking-tight">Settings</h1><p className="mt-3 max-w-xl text-sm leading-6 text-white/35">Shape how your personal system knows you, speaks to you, and handles your information.</p></header>
      <div className="grid items-start gap-5 lg:grid-cols-[220px_1fr]">
        <aside className="card p-3"><div className="flex items-center gap-3 rounded-xl bg-white/[.06] px-3 py-3 text-sm"><UserRound size={17} className="text-[#b7f35b]"/> Profile & identity</div>{futureSections.map(({ icon: Icon, label, note }) => <div key={label} className="mt-1 flex items-center justify-between rounded-xl px-3 py-3 text-sm text-white/25"><span className="flex items-center gap-3"><Icon size={16}/>{label}</span><span className="text-[8px] uppercase tracking-wider">{note}</span></div>)}</aside>
        <SettingsProfile initial={profile}/>
      </div>
    </div>
  </main>;
}
