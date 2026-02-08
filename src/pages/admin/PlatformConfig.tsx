// PlatformConfig.tsx - Platform Configuration Management

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
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
  Settings,
  Save,
  RotateCcw,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { platformConfigService } from "@/lib/config/platform-config-service";
import type { PlatformConfig } from "@/types/platform-config";

// Define ConfigSection locally since it doesn't exist in types
type ConfigSection =
  | "general"
  | "branding"
  | "features"
  | "donations"
  | "email"
  | "security"
  | "integrations"
  | "maintenance"
  | "limits";
import { useToast } from "@/hooks/use-toast";

export default function PlatformConfig() {
  const [config, setConfig] = useState<PlatformConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changedSections, setChangedSections] = useState<Set<ConfigSection>>(
    new Set(),
  );
  const { toast } = useToast();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      // Mock data - Platform config service not fully implemented yet
      const mockConfig: PlatformConfig = {
        id: "platform-config",
        environment: "development",
        siteName: "GRATIS",
        siteUrl: "https://gratis.org",
        supportEmail: "support@gratis.org",
        maintenanceMode: false,
        features: {
          videoUpload: true,
          liveStreaming: false,
          subscriptions: true,
          donations: true,
          marketplace: false,
          messaging: true,
          apiAccess: true,
        },
        limits: {
          maxVideoSize: 100,
          maxVideoDuration: 3600,
          maxVideosPerMonth: {
            free: 5,
            basic: 50,
            pro: 500,
            enterprise: -1,
          },
          maxStoragePerUser: 10,
          apiRateLimit: 60,
        },
        security: {
          sessionTimeout: 60,
          passwordMinLength: 8,
          requireEmailVerification: true,
          require2FA: false,
          allowedFileTypes: ["image/jpeg", "image/png", "application/pdf"],
          maxLoginAttempts: 5,
        },
        payment: {
          stripeEnabled: true,
          stripeLiveMode: false,
          currency: "EUR",
          processingFee: 2.9,
          minimumDonation: 5,
        },
        email: {
          provider: "sendgrid",
          fromAddress: "noreply@gratis.org",
          fromName: "GRATIS",
          replyTo: "support@gratis.org",
        },
        storage: {
          provider: "firebase",
          cdnEnabled: false,
        },
        analytics: {
          enabled: true,
          googleAnalyticsId: "UA-XXXXXXX",
        },
        social: {
          facebookAppId: "",
          twitterHandle: "",
          linkedinPage: "",
        },
        updatedAt: new Date().toISOString(),
        updatedBy: "admin",
      };
      setConfig(mockConfig);
      setChangedSections(new Set());
    } catch (error) {
      console.error("Failed to load config:", error);
      toast({
        title: "Error",
        description: "Failed to load platform configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSection = async (section: ConfigSection) => {
    if (!config) return;

    setSaving(true);
    try {
      // Mock implementation - save functionality to be completed
      toast({
        title: "Success",
        description: `${section} settings saved (mock)`,
      });
      setChangedSections((prev) => {
        const next = new Set(prev);
        next.delete(section);
        return next;
      });
      await loadConfig();
    } catch (error) {
      console.error("Failed to save section:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResetSection = async (section: ConfigSection) => {
    if (!confirm(`Reset ${section} to default values?`)) return;

    try {
      // Mock implementation - reset functionality to be completed
      toast({
        title: "Success",
        description: `${section} reset to defaults (mock)`,
      });
      await loadConfig();
    } catch (error) {
      console.error("Failed to reset section:", error);
      toast({
        title: "Error",
        description: "Failed to reset settings",
        variant: "destructive",
      });
    }
  };

  const updateConfigValue = (
    section: ConfigSection,
    key: string,
    value: any,
  ) => {
    if (!config) return;
    setConfig({
      ...config,
      [section]: {
        ...config[section],
        [key]: value,
      },
    });
    setChangedSections((prev) => new Set(prev).add(section));
  };

  if (loading || !config) {
    return (
      <AdminLayout>
        <div className="text-center py-12">Loading configuration...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="w-8 h-8" />
            Platform Configuration
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage platform-wide settings and features
          </p>
        </div>

        {/* Configuration Tabs */}
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid grid-cols-4 lg:grid-cols-9 w-full">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="limits">Limits</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>
                      Basic platform configuration
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {changedSections.has("general") && (
                      <Button
                        variant="default"
                        onClick={() => handleSaveSection("general")}
                        disabled={saving}
                        className="gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => handleResetSection("general")}
                      className="gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={config.siteName}
                    onChange={(e) =>
                      updateConfigValue("general", "siteName", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Input
                    id="siteDescription"
                    value={config.siteUrl || ""}
                    onChange={(e) =>
                      updateConfigValue(
                        "general",
                        "siteDescription",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={config.supportEmail}
                    onChange={(e) =>
                      updateConfigValue(
                        "general",
                        "supportEmail",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultLanguage">Default Language</Label>
                  <Input
                    id="defaultLanguage"
                    value={"en"}
                    onChange={(e) =>
                      updateConfigValue(
                        "general",
                        "defaultLanguage",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultCurrency">Default Currency</Label>
                  <Input
                    id="defaultCurrency"
                    value={config.payment?.currency || "EUR"}
                    onChange={(e) =>
                      updateConfigValue(
                        "general",
                        "defaultCurrency",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={"UTC"}
                    onChange={(e) =>
                      updateConfigValue("general", "timezone", e.target.value)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Settings */}
          <TabsContent value="features" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Feature Flags</CardTitle>
                    <CardDescription>
                      Enable or disable platform features
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {changedSections.has("features") && (
                      <Button
                        variant="default"
                        onClick={() => handleSaveSection("features")}
                        disabled={saving}
                        className="gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => handleResetSection("features")}
                      className="gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="donations">Donations</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable donation functionality
                    </p>
                  </div>
                  <Switch
                    id="donations"
                    checked={config.features.donations}
                    onCheckedChange={(checked) =>
                      updateConfigValue("features", "donations", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ecommerce">E-commerce</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable product store
                    </p>
                  </div>
                  <Switch
                    id="ecommerce"
                    checked={config.features.marketplace}
                    onCheckedChange={(checked) =>
                      updateConfigValue("features", "ecommerce", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="events">Events</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable event management
                    </p>
                  </div>
                  <Switch
                    id="events"
                    checked={false}
                    onCheckedChange={(checked) =>
                      updateConfigValue("features", "events", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="videos">Videos</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable video platform (ImpactTV)
                    </p>
                  </div>
                  <Switch
                    id="videos"
                    checked={config.features.videoUpload}
                    onCheckedChange={(checked) =>
                      updateConfigValue("features", "videos", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="community">Community</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable community features (Tribe)
                    </p>
                  </div>
                  <Switch
                    id="community"
                    checked={config.features.messaging}
                    onCheckedChange={(checked) =>
                      updateConfigValue("features", "community", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="partners">Partners</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable partner portal
                    </p>
                  </div>
                  <Switch
                    id="partners"
                    checked={config.features.apiAccess}
                    onCheckedChange={(checked) =>
                      updateConfigValue("features", "partners", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maintenance Settings */}
          <TabsContent value="maintenance" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Maintenance Mode</CardTitle>
                    <CardDescription>
                      Control platform availability
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {changedSections.has("maintenance") && (
                      <Button
                        variant="default"
                        onClick={() => handleSaveSection("maintenance")}
                        disabled={saving}
                        className="gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => handleResetSection("maintenance")}
                      className="gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {config.maintenanceMode && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                        Maintenance Mode Active
                      </p>
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        Only admins can access the platform
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenanceEnabled">
                      Enable Maintenance Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Put the platform into maintenance mode
                    </p>
                  </div>
                  <Switch
                    id="maintenanceEnabled"
                    checked={config.maintenanceMode}
                    onCheckedChange={(checked) =>
                      updateConfigValue("maintenance", "enabled", checked)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maintenanceMessage">
                    Maintenance Message
                  </Label>
                  <Input
                    id="maintenanceMessage"
                    value={""}
                    onChange={(e) =>
                      updateConfigValue(
                        "maintenance",
                        "message",
                        e.target.value,
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedEnd">Estimated End Time</Label>
                  <Input
                    id="estimatedEnd"
                    type="datetime-local"
                    value={""}
                    onChange={(e) =>
                      updateConfigValue(
                        "maintenance",
                        "estimatedEndTime",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Configure security policies
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {changedSections.has("security") && (
                      <Button
                        variant="default"
                        onClick={() => handleSaveSection("security")}
                        disabled={saving}
                        className="gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => handleResetSection("security")}
                      className="gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireEmailVerification">
                      Email Verification
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Require email verification for new accounts
                    </p>
                  </div>
                  <Switch
                    id="requireEmailVerification"
                    checked={config.security.requireEmailVerification}
                    onCheckedChange={(checked) =>
                      updateConfigValue(
                        "security",
                        "requireEmailVerification",
                        checked,
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireMfaForAdmin">Admin MFA</Label>
                    <p className="text-sm text-muted-foreground">
                      Require multi-factor auth for admin accounts
                    </p>
                  </div>
                  <Switch
                    id="requireMfaForAdmin"
                    checked={config.security.require2FA}
                    onCheckedChange={(checked) =>
                      updateConfigValue(
                        "security",
                        "requireMfaForAdmin",
                        checked,
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={config.security.sessionTimeout}
                    onChange={(e) =>
                      updateConfigValue(
                        "security",
                        "sessionTimeout",
                        parseInt(e.target.value, 10),
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={config.security.maxLoginAttempts}
                    onChange={(e) =>
                      updateConfigValue(
                        "security",
                        "maxLoginAttempts",
                        parseInt(e.target.value, 10),
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">
                    Minimum Password Length
                  </Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={config.security.passwordMinLength}
                    onChange={(e) =>
                      updateConfigValue(
                        "security",
                        "passwordMinLength",
                        parseInt(e.target.value, 10),
                      )
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs would follow similar patterns... */}
        </Tabs>
      </div>
    </AdminLayout>
  );
}
