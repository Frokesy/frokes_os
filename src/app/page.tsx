import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppShell } from "@/components/shell/app-shell";

export default async function Home() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");
  return <AppShell userName={session.user.name ?? "Frokes"}/>;
}
