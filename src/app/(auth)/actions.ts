"use server";

import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { signInSchema, signUpSchema } from "@/lib/auth-validation";

export type AuthState = { error?: string };

export async function login(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check your details." };
  try {
    await signIn("credentials", { ...parsed.data, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) return { error: "Email or password is incorrect." };
    throw error;
  }
  return {};
}

export async function register(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check your details." };

  const existing = await getDb().select({ id: users.id }).from(users).where(eq(users.email, parsed.data.email)).limit(1);
  if (existing.length) return { error: "An account with this email already exists." };

  const passwordHash = await hash(parsed.data.password, 12);
  try {
    await getDb().insert(users).values({ name: parsed.data.name, email: parsed.data.email, passwordHash });
  } catch (error) {
    // A concurrent request can pass the initial check; the unique constraint remains authoritative.
    if (typeof error === "object" && error && "code" in error && error.code === "23505") {
      return { error: "An account with this email already exists." };
    }
    throw error;
  }

  try {
    await signIn("credentials", { email: parsed.data.email, password: parsed.data.password, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) redirect("/sign-in?created=1");
    throw error;
  }
  return {};
}
