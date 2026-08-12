export { auth as proxy } from "@/auth";

export const config = {
  matcher: ["/((?!api/auth|sign-in|sign-up|manifest.webmanifest|icon.*|apple-touch-icon.png|sw.js|_next/static|_next/image).*)"],
};
