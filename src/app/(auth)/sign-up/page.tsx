import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthScreen } from "@/components/auth/auth-screen";
import { register } from "../actions";

export default async function SignUpPage() {
  if (await auth()) redirect("/");
  return <AuthScreen mode="sign-up" action={register}/>;
}
