/**
 * Notification Preferences Page
 *
 * Allows users to configure their notification preferences.
 * Part 5 - Section 22: Notification System
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, Smartphone, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

interface NotificationPreferences {
  email: {
    orders: boolean;
    donations: boolean;
    events: boolean;
    tribe: boolean;
    projects: boolean;
    referrals: boolean;
    marketing: boolean;
  };
  push: {
    orders: boolean;
    donations: boolean;
    events: boolean;
    tribe: boolean;
    projects: boolean;
    referrals: boolean;
  };
  inApp: {
    orders: boolean;
    donations: boolean;
    events: boolean;
    tribe: boolean;
    projects: boolean;
    referrals: boolean;
    system: boolean;
  };
}

const defaultPreferences: NotificationPreferences = {
  email: {
    orders: true,
    donations: true,
    events: true,
    tribe: true,
    projects: true,
    referrals: true,
    marketing: false,
  },
  push: {
    orders: true,
    donations: true,
    events: true,
    tribe: true,
    projects: true,
    referrals: true,
  },
  inApp: {
    orders: true,
    donations: true,
    events: true,
    tribe: true,
    projects: true,
    referrals: true,
    system: true,
  },
};

export default function NotificationSettings() {
  const { user } = useAuth();
  const [preferences, setPreferences] =
    useState<NotificationPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load preferences
  useEffect(() => {
    if (!user) return;

    const loadPreferences = async () => {
      try {
        const docRef = doc(db, "notificationPreferences", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPreferences(docSnap.data() as NotificationPreferences);
        }
      } catch (error) {
        console.error("Failed to load preferences:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  // Save preferences
  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      const docRef = doc(db, "notificationPreferences", user.uid);
      await setDoc(docRef, preferences);

      toast.success("Preferences saved successfully");
    } catch (error) {
      console.error("Failed to save preferences:", error);
      toast.error("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  // Update preference
  const updatePreference = (
    channel: keyof NotificationPreferences,
    type: string,
    value: boolean,
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [type]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
            <div className="space-y-3 mt-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const notificationTypes = [
    {
      key: "orders",
      label: "Orders",
      description:
        "Order confirmations, shipping updates, and delivery notifications",
    },
    {
      key: "donations",
      label: "Donations",
      description: "Donation receipts and impact updates",
    },
    {
      key: "events",
      label: "Events",
      description: "Event reminders and updates",
    },
    {
      key: "tribe",
      label: "TRIBE",
      description: "Voting notifications and community updates",
    },
    {
      key: "projects",
      label: "Projects",
      description: "Impact project updates and milestones",
    },
    {
      key: "referrals",
      label: "Referrals",
      description: "Referral program updates and rewards",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="w-8 h-8" />
            Notification Preferences
          </h1>
          <p className="text-muted-foreground mt-2">
            Choose how you want to receive notifications from GRATIS
          </p>
        </div>

        {/* Email Notifications */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Email Notifications</h2>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            {notificationTypes.map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor={`email-${key}`} className="text-base">
                    {label}
                  </Label>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <Switch
                  id={`email-${key}`}
                  checked={
                    preferences.email[key as keyof typeof preferences.email]
                  }
                  onCheckedChange={(checked) =>
                    updatePreference("email", key, checked)
                  }
                />
              </div>
            ))}

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-marketing" className="text-base">
                  Marketing & Newsletter
                </Label>
                <p className="text-sm text-muted-foreground">
                  Product updates, special offers, and news
                </p>
              </div>
              <Switch
                id="email-marketing"
                checked={preferences.email.marketing}
                onCheckedChange={(checked) =>
                  updatePreference("email", "marketing", checked)
                }
              />
            </div>
          </div>
        </Card>

        {/* Push Notifications */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Push Notifications</h2>
              <p className="text-sm text-muted-foreground">
                Receive notifications on your devices
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            {notificationTypes.map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor={`push-${key}`} className="text-base">
                    {label}
                  </Label>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <Switch
                  id={`push-${key}`}
                  checked={
                    preferences.push[key as keyof typeof preferences.push]
                  }
                  onCheckedChange={(checked) =>
                    updatePreference("push", key, checked)
                  }
                />
              </div>
            ))}
          </div>
        </Card>

        {/* In-App Notifications */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">In-App Notifications</h2>
              <p className="text-sm text-muted-foreground">
                Receive notifications while using the website
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            {notificationTypes.map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor={`inApp-${key}`} className="text-base">
                    {label}
                  </Label>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <Switch
                  id={`inApp-${key}`}
                  checked={
                    preferences.inApp[key as keyof typeof preferences.inApp]
                  }
                  onCheckedChange={(checked) =>
                    updatePreference("inApp", key, checked)
                  }
                />
              </div>
            ))}

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="inApp-system" className="text-base">
                  System Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Important system updates and maintenance alerts
                </p>
              </div>
              <Switch
                id="inApp-system"
                checked={preferences.inApp.system}
                onCheckedChange={(checked) =>
                  updatePreference("inApp", "system", checked)
                }
              />
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setPreferences(defaultPreferences)}
          >
            Reset to Default
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </div>
    </div>
  );
}
