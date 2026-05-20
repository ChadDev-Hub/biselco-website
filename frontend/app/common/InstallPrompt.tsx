"use client";
import { useEffect, useState } from "react";


interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
}

const InstallPrompt = () => {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
    
  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      console.log("PWA installed");
    }

    setDeferredPrompt(null);
  };

  useEffect(() => {
    queueMicrotask(() =>
      setIsIOS(
        /iPad|iPhone|iPod/.test(navigator.userAgent) &&
          !(window as Window & { MSStream?: unknown}).MSStream,
      ),
    );

    queueMicrotask(() =>
      setIsStandalone(window.matchMedia("(display-mode: standalone)").matches),
    );
  }, []);

  if (isStandalone) return null;
  return (
    <div className="p-4 rounded-xl">
      <h3 className="font-bold mb-2">Install App</h3>
      <button onClick={handleInstall} type="button" className="btn btn-sm btn-primary">
        Add to Home Screen
      </button>

      {isIOS && (
        <p className="text-sm mt-3">
          {`To install this app on your iPhone/iPad,
          tap Share ⎋ then "Add to Home Screen" ➕`}
        </p>
      )}
    </div>
  );
};

export default InstallPrompt;
