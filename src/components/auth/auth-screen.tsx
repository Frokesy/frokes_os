import { Brain, LockKeyhole, Sparkles } from "lucide-react";
import type { AuthState } from "@/app/(auth)/actions";
import { AuthForm } from "./auth-form";

export function AuthScreen({ mode, action }: { mode: "sign-in" | "sign-up"; action: (state: AuthState, data: FormData) => Promise<AuthState> }) {
  const signingUp = mode === "sign-up";
  return <main className="relative grid min-h-dvh overflow-hidden bg-[#080a0d] text-[#f4f5ef] lg:grid-cols-[1.05fr_.95fr]">
    <div className="pointer-events-none absolute left-1/4 top-0 h-80 w-80 rounded-full bg-[#b7f35b]/[.05] blur-[100px]"/>
    <section className="relative hidden flex-col justify-between border-r border-white/[.07] p-12 lg:flex">
      <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#b7f35b] font-black text-[#0a0d08]">F</div><div><div className="font-semibold">Frokes OS</div><div className="text-[10px] uppercase tracking-[.22em] text-white/30">Personal system</div></div></div>
      <div className="max-w-xl"><p className="eyebrow"><Sparkles size={13}/> A space that grows with you</p><h1 className="mt-6 font-serif text-6xl leading-[1.03] tracking-tight">Remember with permission. Guide without judgment.</h1><p className="mt-6 max-w-lg text-base leading-7 text-white/40">Your daily reflections belong to you. An account gives them a durable home and prepares Frokes OS to learn from the context you choose to share.</p></div>
      <div className="flex gap-8 text-xs text-white/30"><span className="flex items-center gap-2"><LockKeyhole size={14}/> Private by design</span><span className="flex items-center gap-2"><Brain size={14}/> Memory with control</span></div>
    </section>
    <section className="relative flex items-center justify-center px-5 py-12 sm:px-10"><div className="w-full max-w-[420px]"><div className="mb-12 flex items-center gap-3 lg:hidden"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#b7f35b] font-black text-[#0a0d08]">F</div><span className="font-semibold">Frokes OS</span></div><p className="text-xs uppercase tracking-[.18em] text-[#b7f35b]">{signingUp ? "Begin gently" : "Welcome back"}</p><h2 className="mt-4 text-3xl font-medium tracking-tight">{signingUp ? "Create your personal space." : "Return to yourself."}</h2><p className="mt-3 text-sm leading-6 text-white/40">{signingUp ? "Your first step toward a system that remembers what matters to you." : "Your daily space and reflections are waiting."}</p><AuthForm mode={mode} action={action}/>{signingUp && <p className="mt-6 text-center text-[10px] leading-5 text-white/25">By continuing, you agree to keep this early version for personal use. Formal privacy terms will be added before public release.</p>}</div></section>
  </main>;
}
