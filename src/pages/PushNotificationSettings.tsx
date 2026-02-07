/**
 * Push Notification Settings Page
 * Part 9 - Section 43: Mobile push notifications and preferences
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  BellOff,
  Moon,
  Smartphone,
  Globe,
  Clock,
  Volume2,
  CheckCircle2,
} from "lucide-react";
import type {
  UserPushSettings,
  NotificationChannel,
  FCMToken,
} from "@/types/push-notification";

const CHANNELS: Array<{
  key: NotificationChannel;
  label: string;
  description: string;
  icon: any;
}> = [
  {
    key: "donations",
    label: "Donations",
    description: "Updates about your donations and receipts",
    icon: "💰",
  },
  {
    key: "impact",
    label: "Impact Updates",
    description: "Stories about how your donations help",
    icon: "🌍",
  },
  {
    key: "events",
    label: "Events",
    description: "Upcoming events and volunteer opportunities",
    icon: "📅",
  },
  {
    key: "community",
    label: "Community",
    description: "Community posts, comments, and interactions",
    icon: "👥",
  },
  {
    key: "promotions",
    label: "Promotions",
    description: "Special offers and campaigns",
    icon: "🎁",
  },
  {
    key: "account",
    label: "Account",
    description: "Security alerts and account updates",
    icon: "🔒",
  },
  {
    key: "partners",
    label: "Partners",
    description: "Updates from partner organizations",
    icon: "🤝",
  },
];

export default function PushNotificationSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserPushSettings | null>(null);
  const [devices, setDevices] = useState<FCMToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      // Mock data - replace with actual API call
      const mockSettings: UserPushSettings = {
        userId: user?.uid || "",
        fcmTokens: [
          {
            token: "mock-token-1",
            platform: "web",
            deviceId: "device-1",
            deviceName: "Chrome on Windows",
            lastUsedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
          {
            token: "mock-token-2",
            platform: "android",
            deviceId: "device-2",
            deviceName: "Samsung Galaxy S21",
            lastUsedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          },
        ],
        channels: {
          donations: true,
          impact: true,
          events: true,
          community: true,
          promotions: false,
          account: true,
          partners: true,
        },
        quietHours: {
          enabled: true,
          startTime: "22:00",
          endTime: "08:00",
          timezone: "Europe/Amsterdam",
        },
        frequency: "all",
        updatedAt: new Date(),
      };

      setSettings(mockSettings);
      setDevices(mockSettings.fcmTokens);
    } catch (error) {
      console.error("Error loading notification settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChannelToggle = (
    channel: NotificationChannel,
    enabled: boolean,
  ) => {
    if (!settings) return;

    setSettings({
      ...settings,
      channels: {
        ...settings.channels,
        [channel]: enabled,
      },
    });
  };

  const handleFrequencyChange = (
    frequency: "all" | "important" | "minimal",
  ) => {
    if (!settings) return;
    setSettings({ ...settings, frequency });
  };

  const handleQuietHoursToggle = (enabled: boolean) => {
    if (!settings) return;

    setSettings({
      ...settings,
      quietHours: {
        ...settings.quietHours!,
        enabled,
      },
    });
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Saving settings:", settings);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleRequestPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted");
        // Register FCM token
      }
    }
  };

  const handleRemoveDevice = async (deviceId: string) => {
    setDevices(devices.filter((d) => d.deviceId !== deviceId));
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Unable to load notification settings
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const permissionStatus =
    typeof Notification !== "undefined" ? Notification.permission : "default";

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Push Notifications</h1>
        <p className="text-muted-foreground">
          Manage how you receive notifications about donations, impact, and
          events
        </p>
      </div>

      {/* Permission Status */}
      {permissionStatus !== "granted" && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Bell className="h-8 w-8 text-orange-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900 mb-1">
                  Enable Push Notifications
                </h3>
                <p className="text-sm text-orange-700">
                  Allow notifications to stay updated on your donations and
                  impact
                </p>
              </div>
              <Button onClick={handleRequestPermission}>
                Enable Notifications
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notification Frequency */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Notification Frequency
          </CardTitle>
          <CardDescription>
            Control how often you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div
              className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                settings.frequency === "all"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleFrequencyChange("all")}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">All Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive all notifications as they happen
                  </p>
                </div>
                {settings.frequency === "all" && (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                )}
              </div>
            </div>

            <div
              className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                settings.frequency === "important"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleFrequencyChange("important")}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Important Only</h4>
                  <p className="text-sm text-muted-foreground">
                    Only urgent notifications and account updates
                  </p>
                </div>
                {settings.frequency === "important" && (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                )}
              </div>
            </div>

            <div
              className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                settings.frequency === "minimal"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleFrequencyChange("minimal")}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Minimal</h4>
                  <p className="text-sm text-muted-foreground">
                    Weekly digest of important updates
                  </p>
                </div>
                {settings.frequency === "minimal" && (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Channels */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Notification Channels</CardTitle>
          <CardDescription>
            Choose which types of notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {CHANNELS.map((channel) => (
              <div
                key={channel.key}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{channel.icon}</span>
                  <div>
                    <Label
                      htmlFor={`channel-${channel.key}`}
                      className="text-base font-medium cursor-pointer"
                    >
                      {channel.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {channel.description}
                    </p>
                  </div>
                </div>
                <Switch
                  id={`channel-${channel.key}`}
                  checked={settings.channels[channel.key]}
                  onCheckedChange={(checked) =>
                    handleChannelToggle(channel.key, checked)
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Quiet Hours
          </CardTitle>
          <CardDescription>
            Pause notifications during specific hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="quiet-hours" className="text-base">
                Enable quiet hours
              </Label>
              <Switch
                id="quiet-hours"
                checked={settings.quietHours?.enabled || false}
                onCheckedChange={handleQuietHoursToggle}
              />
            </div>

            {settings.quietHours?.enabled && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <Label htmlFor="start-time" className="text-sm mb-2 block">
                    Start Time
                  </Label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <input
                      type="time"
                      id="start-time"
                      value={settings.quietHours.startTime}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          quietHours: {
                            ...settings.quietHours!,
                            startTime: e.target.value,
                          },
                        })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="end-time" className="text-sm mb-2 block">
                    End Time
                  </Label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <input
                      type="time"
                      id="end-time"
                      value={settings.quietHours.endTime}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          quietHours: {
                            ...settings.quietHours!,
                            endTime: e.target.value,
                          },
                        })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Connected Devices */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Connected Devices
          </CardTitle>
          <CardDescription>
            Manage devices that can receive push notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {devices.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No devices connected
              </p>
            ) : (
              devices.map((device) => (
                <div
                  key={device.deviceId}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    {device.platform === "web" ? (
                      <Globe className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Smartphone className="h-5 w-5 text-green-600" />
                    )}
                    <div>
                      <p className="font-medium">{device.deviceName}</p>
                      <p className="text-sm text-muted-foreground">
                        Last active{" "}
                        {Math.floor(
                          (Date.now() - device.lastUsedAt.getTime()) /
                            (24 * 60 * 60 * 1000),
                        )}{" "}
                        days ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {device.platform}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveDevice(device.deviceId)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={loadSettings}>
          Reset
        </Button>
        <Button onClick={handleSaveSettings} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
