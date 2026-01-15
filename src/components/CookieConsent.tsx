import { useState, useEffect } from "react";
import { X, Cookie, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    // Check if user has already made a choice
    const savedConsent = localStorage.getItem("cookieConsent");
    if (!savedConsent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      try {
        const parsed = JSON.parse(savedConsent);
        setPreferences(parsed);
        applyPreferences(parsed);
      } catch (error) {
        console.error("Error parsing cookie preferences:", error);
      }
    }
  }, []);

  const applyPreferences = (prefs: CookiePreferences) => {
    // Apply analytics preferences
    if (prefs.analytics && typeof window.gtag !== "undefined") {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      });
    } else if (typeof window.gtag !== "undefined") {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
      });
    }

    // Apply marketing preferences
    if (prefs.marketing && typeof window.gtag !== "undefined") {
      window.gtag("consent", "update", {
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      });
    } else if (typeof window.gtag !== "undefined") {
      window.gtag("consent", "update", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    }
  };

  const savePreferences = (prefs: CookiePreferences) => {
    const prefsToSave = {
      ...prefs,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("cookieConsent", JSON.stringify(prefsToSave));
    applyPreferences(prefsToSave);
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    savePreferences(prefs);
  };

  const rejectAll = () => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    savePreferences(prefs);
  };

  const saveCustomPreferences = () => {
    savePreferences(preferences);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 animate-in slide-in-from-bottom duration-500">
        <Card className="max-w-5xl mx-auto bg-background/95 backdrop-blur-lg border-2 shadow-2xl">
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Cookie className="h-8 w-8 text-primary" />
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    🍪 We Value Your Privacy
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We use cookies to enhance your browsing experience, analyze
                    site traffic, and personalize content. By clicking "Accept
                    All", you consent to our use of cookies. You can manage your
                    preferences at any time.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Learn more in our{" "}
                    <Link
                      to="/legal/cookies"
                      className="text-primary hover:underline font-medium"
                    >
                      Cookie Policy
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/legal/privacy"
                      className="text-primary hover:underline font-medium"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={acceptAll}
                    size="lg"
                    className="flex-1 sm:flex-initial"
                  >
                    Accept All
                  </Button>
                  <Button
                    onClick={rejectAll}
                    variant="outline"
                    size="lg"
                    className="flex-1 sm:flex-initial"
                  >
                    Reject All
                  </Button>
                  <Button
                    onClick={() => setShowSettings(true)}
                    variant="outline"
                    size="lg"
                    className="flex-1 sm:flex-initial"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Preferences
                  </Button>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowBanner(false)}
                className="flex-shrink-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Cookie Preferences</DialogTitle>
            <DialogDescription>
              Manage your cookie settings below. Essential cookies are required
              for the website to function and cannot be disabled.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Essential Cookies */}
            <div className="space-y-3 pb-6 border-b">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <h4 className="font-semibold text-lg">Essential Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Required for the website to function. These cannot be
                    disabled.
                  </p>
                </div>
                <Switch checked={true} disabled />
              </div>
              <p className="text-xs text-muted-foreground">
                Examples: Authentication, shopping cart, security, session
                management
              </p>
            </div>

            {/* Analytics Cookies */}
            <div className="space-y-3 pb-6 border-b">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <h4 className="font-semibold text-lg">Analytics Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Help us understand how visitors interact with our website by
                    collecting anonymous information.
                  </p>
                </div>
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, analytics: checked })
                  }
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Providers: Google Analytics, Firebase Analytics
              </p>
            </div>

            {/* Marketing Cookies */}
            <div className="space-y-3 pb-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <h4 className="font-semibold text-lg">Marketing Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Used to deliver personalized content, track advertising
                    performance, and integrate with social media.
                  </p>
                </div>
                <Switch
                  checked={preferences.marketing}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, marketing: checked })
                  }
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Providers: Facebook Pixel, Instagram, TikTok Pixel
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={saveCustomPreferences}
                size="lg"
                className="flex-1"
              >
                Save Preferences
              </Button>
              <Button
                onClick={acceptAll}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                Accept All
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              You can change your preferences at any time by visiting our{" "}
              <Link
                to="/legal/cookies"
                className="text-primary hover:underline"
                onClick={() => setShowSettings(false)}
              >
                Cookie Policy
              </Link>{" "}
              page.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
