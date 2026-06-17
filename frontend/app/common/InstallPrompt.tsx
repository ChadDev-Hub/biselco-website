"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

const InstallPrompt = () => {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Detect iOS
    queueMicrotask(() => {
      setIsIOS(
        /iPad|iPhone|iPod/.test(navigator.userAgent) &&
          !(window as Window & { MSStream?: unknown }).MSStream,
      );

      // Detect standalone mode
      setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
    });

    //
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setIsStandalone(true);
    }

    setDeferredPrompt(null);
  };
  if (isStandalone) return null;

  return (
    <>
      {deferredPrompt && <div className="p-4 rounded-xl">
        <h3 className="font-bold mb-2">Install App</h3>

        {/* Only show button when install is available */}
        {!isIOS && deferredPrompt && (
          <button
            onClick={handleInstall}
            type="button"
            className="btn btn-sm btn-primary"
          >
            Install App
          </button>
        )}

        {isIOS && (
          <p className="text-sm mt-3">
            {`
          To install this app on iPhone/iPad, tap Share ⎋ then
          "Add to Home Screen" ➕`}
          </p>
        )}
      </div>}
    </>
  );
};

export default InstallPrompt;
