/**
 * PWA Install Prompt Component
 *
 * Part 7 - Section 35: PWA & Mobile Optimization
 * Prompts users to install the PWA with platform-specific instructions
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Share } from "lucide-react";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    // Check if dismissed recently
    const dismissed = localStorage.getItem("pwa-prompt-dismissed");
    if (dismissed) {
      const dismissedTime = new Date(dismissed).getTime();
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        // 7 days
        return;
      }
    }

    // Check for iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      // Show iOS instructions after delay
      setTimeout(() => setShowPrompt(true), 5000);
      return;
    }

    // Listen for install prompt (Chrome, Edge, etc.)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-prompt-dismissed", new Date().toISOString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-5">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border dark:border-gray-700 p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold dark:text-white">
                Install GRATIS App
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isIOS ? "Add to your home screen" : "Get quick access"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {isIOS ? (
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4">
            <p className="flex items-center gap-2">
              1. Tap the <Share className="w-4 h-4 inline" /> share button
            </p>
            <p>2. Scroll down and tap "Add to Home Screen"</p>
            <p>3. Tap "Add" to confirm</p>
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Install our app for quick access and offline support. No app store
            required!
          </p>
        )}

        {!isIOS && (
          <div className="flex gap-2">
            <Button onClick={handleInstall} className="flex-1">
              Install App
            </Button>
            <Button variant="outline" onClick={handleDismiss}>
              Not Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
