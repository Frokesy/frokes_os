"use client";

import { ArrowRight, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import type { AuthState } from "@/app/(auth)/actions";

export function AuthForm({ mode, action }: { mode: "sign-in" | "sign-up"; action: (state: AuthState, data: FormData) => Promise<AuthState> }) {
  const [state, formAction, pending] = useActionState(action, {});
  const signingUp = mode === "sign-up";
  return <form action={formAction} className="mt-8 space-y-4">
    {signingUp && <label className="block"><span className="label">Your name</span><input name="name" autoComplete="name" required minLength={2} maxLength={60} className="input" placeholder="What should Frokes OS call you?"/></label>}
    <label className="block"><span className="label">Email</span><input name="email" type="email" inputMode="email" autoComplete="email" required className="input" placeholder="you@example.com"/></label>
    <label className="block"><span className="label">Password</span><input name="password" type="password" autoComplete={signingUp ? "new-password" : "current-password"} required minLength={8} maxLength={128} className="input" placeholder="At least 8 characters"/></label>
    {state.error && <p role="alert" className="rounded-xl border border-red-300/15 bg-red-300/[.06] px-4 py-3 text-xs leading-5 text-red-100/75">{state.error}</p>}
    <button disabled={pending} className="primary-button h-12 w-full gap-2 disabled:cursor-wait disabled:opacity-60">{pending ? <LoaderCircle className="animate-spin" size={16}/> : <>{signingUp ? "Create my space" : "Enter Frokes OS"}<ArrowRight size={15}/></>}</button>
    <p className="pt-2 text-center text-xs text-white/35">{signingUp ? "Already have your space?" : "New to Frokes OS?"} <Link className="font-medium text-[#b7f35b] hover:underline" href={signingUp ? "/sign-in" : "/sign-up"}>{signingUp ? "Sign in" : "Create an account"}</Link></p>
  </form>;
}
