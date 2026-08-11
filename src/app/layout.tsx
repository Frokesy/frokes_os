import type { Metadata, Viewport } from "next"; import "./globals.css"; import { ServiceWorker } from "@/components/pwa/service-worker";
export const metadata: Metadata = { title: "Frokes OS", description: "Learn something. Check in. Be intentional.", applicationName: "Frokes OS", manifest: "/manifest.webmanifest", appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Frokes OS" } };
export const viewport: Viewport = { themeColor: "#080a0d", colorScheme: "dark", width: "device-width", initialScale: 1, viewportFit: "cover" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}<ServiceWorker/></body></html>; }
