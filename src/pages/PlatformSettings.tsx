// src/pages/PlatformSettings.tsx
// Platform-wide configuration and settings management

import { useState } from "react";
import {
  Settings,
  Globe,
  Lock,
  CreditCard,
  Mail,
  BarChart,
  Database,
  Shield,
  Zap,
  Save,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { PlatformConfig } from "@/types/platform-config";
import { toast } from "sonner";

// Mock config data
const mockConfig: PlatformConfig = {
  id: "config_main",
  environment: "production",
  siteName: "GRATIS.NGO",
  siteUrl: "https://gratis.ngo",
  supportEmail: "support@gratis.ngo",
  maintenanceMode: false,
  features: {
    videoUpload: true,
    liveStreaming: true,
    subscriptions: true,
    donations: true,
    marketplace: false,
    messaging: true,
    apiAccess: true,
  },
  limits: {
    maxVideoSize: 5000,
    maxVideoDuration: 7200,
    maxVideosPerMonth: {
      free: 5,
      basic: 50,
      pro: 500,
      enterprise: 9999,
    },
    maxStoragePerUser: 100,
    apiRateLimit: 100,
  },
  security: {
    sessionTimeout: 60,
    passwordMinLength: 8,
    requireEmailVerification: true,
    require2FA: false,
    allowedFileTypes: ["video/mp4", "video/webm", "video/quicktime"],
    maxLoginAttempts: 5,
  },
  payment: {
    stripeEnabled: true,
    stripeLiveMode: true,
    currency: "EUR",
    processingFee: 2.9,
    minimumDonation: 1,
  },
  email: {
    provider: "sendgrid",
    fromAddress: "noreply@gratis.ngo",
    fromName: "GRATIS.NGO",
    replyTo: "support@gratis.ngo",
  },
  storage: {
    provider: "firebase",
    cdnEnabled: true,
    cdnUrl: "https://cdn.gratis.ngo",
  },
  analytics: {
    enabled: true,
    googleAnalyticsId: "G-XXXXXXXXXX",
  },
  social: {
    twitterHandle: "@gratisNGO",
    facebookAppId: "123456789",
  },
  updatedAt: new Date().toISOString(),
  updatedBy: "admin@gratis.ngo",
};

export default function PlatformSettings() {
  const [config, setConfig] = useState<PlatformConfig>(mockConfig);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = () => {
    toast.loading("Saving configuration...");
    setTimeout(() => {
      toast.success("Configuration saved successfully");
      setHasChanges(false);
    }, 1000);
  };

  const updateConfig = <K extends keyof PlatformConfig>(
    key: K,
    value: PlatformConfig[K],
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const updateFeature = (
    feature: keyof PlatformConfig["features"],
    enabled: boolean,
  ) => {
    setConfig((prev) => ({
      ...prev,
      features: { ...prev.features, [feature]: enabled },
    }));
    setHasChanges(true);
  };

  return (
    <div className="container mx-auto p-6 pt-24 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Platform Settings</h1>
          <p className="text-muted-foreground">
            Configure platform-wide settings and features
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={
              config.environment === "production" ? "default" : "secondary"
            }
          >
            {config.environment}
          </Badge>
          <Button disabled={!hasChanges} onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Maintenance Mode Alert */}
      {config.maintenanceMode && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Maintenance mode is active. The platform is not accessible to
            regular users.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="features">
            <Zap className="h-4 w-4 mr-2" />
            Features
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Globe className="h-4 w-4 mr-2" />
            Integrations
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>
                Basic platform information and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={config.siteName}
                  onChange={(e) => updateConfig("siteName", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="siteUrl">Site URL</Label>
                <Input
                  id="siteUrl"
                  type="url"
                  value={config.siteUrl}
                  onChange={(e) => updateConfig("siteUrl", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={config.supportEmail}
                  onChange={(e) => updateConfig("supportEmail", e.target.value)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Disable public access to the platform
                  </p>
                </div>
                <Switch
                  checked={config.maintenanceMode}
                  onCheckedChange={(checked) =>
                    updateConfig("maintenanceMode", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload Limits</CardTitle>
              <CardDescription>
                Configure video upload restrictions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="maxVideoSize">Max Video Size (MB)</Label>
                <Input
                  id="maxVideoSize"
                  type="number"
                  value={config.limits.maxVideoSize}
                  onChange={(e) =>
                    updateConfig("limits", {
                      ...config.limits,
                      maxVideoSize: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="maxDuration">Max Duration (seconds)</Label>
                <Input
                  id="maxDuration"
                  type="number"
                  value={config.limits.maxVideoDuration}
                  onChange={(e) =>
                    updateConfig("limits", {
                      ...config.limits,
                      maxVideoDuration: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Monthly Upload Limits by Plan</Label>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <Label className="text-xs">Free</Label>
                    <Input
                      type="number"
                      value={config.limits.maxVideosPerMonth.free}
                      onChange={(e) =>
                        updateConfig("limits", {
                          ...config.limits,
                          maxVideosPerMonth: {
                            ...config.limits.maxVideosPerMonth,
                            free: parseInt(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Basic</Label>
                    <Input
                      type="number"
                      value={config.limits.maxVideosPerMonth.basic}
                      onChange={(e) =>
                        updateConfig("limits", {
                          ...config.limits,
                          maxVideosPerMonth: {
                            ...config.limits.maxVideosPerMonth,
                            basic: parseInt(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Pro</Label>
                    <Input
                      type="number"
                      value={config.limits.maxVideosPerMonth.pro}
                      onChange={(e) =>
                        updateConfig("limits", {
                          ...config.limits,
                          maxVideosPerMonth: {
                            ...config.limits.maxVideosPerMonth,
                            pro: parseInt(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Enterprise</Label>
                    <Input
                      type="number"
                      value={config.limits.maxVideosPerMonth.enterprise}
                      onChange={(e) =>
                        updateConfig("limits", {
                          ...config.limits,
                          maxVideosPerMonth: {
                            ...config.limits.maxVideosPerMonth,
                            enterprise: parseInt(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Features</CardTitle>
              <CardDescription>
                Enable or disable platform features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(config.features).map(([key, enabled]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {getFeatureDescription(key)}
                    </p>
                  </div>
                  <Switch
                    checked={enabled}
                    onCheckedChange={(checked) =>
                      updateFeature(
                        key as keyof typeof config.features,
                        checked,
                      )
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure authentication and security policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="sessionTimeout">
                  Session Timeout (minutes)
                </Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={config.security.sessionTimeout}
                  onChange={(e) =>
                    updateConfig("security", {
                      ...config.security,
                      sessionTimeout: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="passwordMinLength">
                  Minimum Password Length
                </Label>
                <Input
                  id="passwordMinLength"
                  type="number"
                  value={config.security.passwordMinLength}
                  onChange={(e) =>
                    updateConfig("security", {
                      ...config.security,
                      passwordMinLength: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  value={config.security.maxLoginAttempts}
                  onChange={(e) =>
                    updateConfig("security", {
                      ...config.security,
                      maxLoginAttempts: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Email Verification</Label>
                  <p className="text-sm text-muted-foreground">
                    Users must verify their email before accessing the platform
                  </p>
                </div>
                <Switch
                  checked={config.security.requireEmailVerification}
                  onCheckedChange={(checked) =>
                    updateConfig("security", {
                      ...config.security,
                      requireEmailVerification: checked,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require 2FA</Label>
                  <p className="text-sm text-muted-foreground">
                    Enforce two-factor authentication for all users
                  </p>
                </div>
                <Switch
                  checked={config.security.require2FA}
                  onCheckedChange={(checked) =>
                    updateConfig("security", {
                      ...config.security,
                      require2FA: checked,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Configuration</CardTitle>
              <CardDescription>Stripe and payment settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Stripe Enabled</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable Stripe payment processing
                  </p>
                </div>
                <Switch
                  checked={config.payment.stripeEnabled}
                  onCheckedChange={(checked) =>
                    updateConfig("payment", {
                      ...config.payment,
                      stripeEnabled: checked,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Live Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Use Stripe live keys instead of test keys
                  </p>
                </div>
                <Switch
                  checked={config.payment.stripeLiveMode}
                  onCheckedChange={(checked) =>
                    updateConfig("payment", {
                      ...config.payment,
                      stripeLiveMode: checked,
                    })
                  }
                />
              </div>
              <Separator />
              <div className="grid gap-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={config.payment.currency}
                  onValueChange={(value) =>
                    updateConfig("payment", {
                      ...config.payment,
                      currency: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="processingFee">Processing Fee (%)</Label>
                <Input
                  id="processingFee"
                  type="number"
                  step="0.1"
                  value={config.payment.processingFee}
                  onChange={(e) =>
                    updateConfig("payment", {
                      ...config.payment,
                      processingFee: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="minimumDonation">
                  Minimum Donation ({config.payment.currency})
                </Label>
                <Input
                  id="minimumDonation"
                  type="number"
                  value={config.payment.minimumDonation}
                  onChange={(e) =>
                    updateConfig("payment", {
                      ...config.payment,
                      minimumDonation: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>Email provider settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="emailProvider">Email Provider</Label>
                <Select
                  value={config.email.provider}
                  onValueChange={(value: any) =>
                    updateConfig("email", {
                      ...config.email,
                      provider: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sendgrid">SendGrid</SelectItem>
                    <SelectItem value="mailgun">Mailgun</SelectItem>
                    <SelectItem value="ses">Amazon SES</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fromAddress">From Address</Label>
                <Input
                  id="fromAddress"
                  type="email"
                  value={config.email.fromAddress}
                  onChange={(e) =>
                    updateConfig("email", {
                      ...config.email,
                      fromAddress: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fromName">From Name</Label>
                <Input
                  id="fromName"
                  value={config.email.fromName}
                  onChange={(e) =>
                    updateConfig("email", {
                      ...config.email,
                      fromName: e.target.value,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Analytics and tracking configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Track user behavior and platform metrics
                  </p>
                </div>
                <Switch
                  checked={config.analytics.enabled}
                  onCheckedChange={(checked) =>
                    updateConfig("analytics", {
                      ...config.analytics,
                      enabled: checked,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gaId">Google Analytics ID</Label>
                <Input
                  id="gaId"
                  placeholder="G-XXXXXXXXXX"
                  value={config.analytics.googleAnalyticsId || ""}
                  onChange={(e) =>
                    updateConfig("analytics", {
                      ...config.analytics,
                      googleAnalyticsId: e.target.value,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getFeatureDescription(feature: string): string {
  const descriptions: Record<string, string> = {
    videoUpload: "Allow users to upload video content",
    liveStreaming: "Enable live streaming capabilities",
    subscriptions: "Support channel subscriptions",
    donations: "Enable donation functionality",
    marketplace: "Allow buying/selling of content",
    messaging: "Enable user-to-user messaging",
    apiAccess: "Provide API access for developers",
  };
  return descriptions[feature] || "Feature setting";
}
