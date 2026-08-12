"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { UserProfile } from "@/domain/profile";
import { ProfileModal } from "./profile-modal";

export function SettingsProfile({ initial }: { initial: UserProfile }) {
  const router = useRouter();
  const [profile, setProfile] = useState(initial);
  return <ProfileModal presentation="page" initial={profile} firstRun={false} onClose={() => router.push("/")} onSaved={setProfile}/>;
}
