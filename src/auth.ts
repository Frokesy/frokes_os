import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { signInSchema } from "@/lib/auth-validation";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/sign-in" },
  providers: [Credentials({
    credentials: { email: {}, password: {} },
    authorize: async (credentials) => {
      const parsed = signInSchema.safeParse(credentials);
      if (!parsed.success) return null;
      const [user] = await getDb().select().from(users).where(eq(users.email, parsed.data.email)).limit(1);
      if (!user || !(await compare(parsed.data.password, user.passwordHash))) return null;
      return { id: user.id, name: user.name, email: user.email };
    },
  })],
  callbacks: {
    jwt({ token, user }) { if (user?.id) token.id = user.id; return token; },
    session({ session, token }) { if (session.user) session.user.id = token.id as string; return session; },
  },
});
