import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthScreen } from "@/components/auth/auth-screen";
import { login } from "../actions";

export default async function SignInPage() {
  if (await auth()) redirect("/");
  return <AuthScreen mode="sign-in" action={login}/>;
}
