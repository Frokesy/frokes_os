"use client";

import { Download, Share, X } from "lucide-react";
import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallApp({ mobile = false }: { mobile?: boolean }) {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [installed, setInstalled] = useState(true);
  const [showIOSHelp, setShowIOSHelp] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    setInstalled(standalone);
    setIsIOS(/iphone|ipad|ipod/i.test(navigator.userAgent));

    const capturePrompt = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPromptEvent);
      setInstalled(false);
    };
    const markInstalled = () => { setInstalled(true); setPrompt(null); };
    window.addEventListener("beforeinstallprompt", capturePrompt);
    window.addEventListener("appinstalled", markInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", capturePrompt);
      window.removeEventListener("appinstalled", markInstalled);
    };
  }, []);

  if (installed || (!prompt && !isIOS)) return null;

  const install = async () => {
    if (isIOS && !prompt) { setShowIOSHelp(true); return; }
    if (!prompt) return;
    await prompt.prompt();
    await prompt.userChoice;
    setPrompt(null);
  };

  return <>
    <button onClick={install} className={mobile ? "flex flex-col items-center gap-1 py-1 text-[10px] text-white/40" : "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#b7f35b] transition hover:bg-white/[.04]"}>
      <Download size={mobile ? 20 : 18}/><span>Install</span>
    </button>
    {showIOSHelp && <div role="dialog" aria-modal="true" aria-labelledby="install-title" className="fixed inset-0 z-50 grid place-items-end bg-black/65 p-4 backdrop-blur-sm sm:place-items-center">
      <div className="card relative w-full max-w-sm p-6">
        <button onClick={() => setShowIOSHelp(false)} aria-label="Close install instructions" className="icon-button absolute right-4 top-4"><X size={17}/></button>
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#b7f35b]/10 text-[#b7f35b]"><Download size={20}/></div>
        <h2 id="install-title" className="mt-5 text-xl font-medium">Install Frokes OS</h2>
        <p className="mt-2 text-sm leading-6 text-white/45">In Safari, tap the Share button, then choose <strong className="font-medium text-white/75">Add to Home Screen</strong>.</p>
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/[.08] bg-white/[.03] p-4 text-sm text-white/60"><Share size={18} className="text-[#b7f35b]"/> Share → Add to Home Screen</div>
      </div>
    </div>}
  </>;
}
