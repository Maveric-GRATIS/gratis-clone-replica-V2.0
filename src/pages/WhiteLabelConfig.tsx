/**
 * Part 10 - Section 52: White-label Solution
 * Custom branding and platform configuration for other NGOs
 */

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Palette,
  Globe,
  Settings,
  Check,
  Eye,
  Save,
  Upload,
  Type,
  Layout,
} from "lucide-react";

// Mock white-label configuration
const whiteLabelConfig = {
  subdomain: "mycause",
  customDomain: "donate.mycause.org",
  customDomainVerified: true,
  status: "active",
  plan: "professional",
  branding: {
    organizationName: "My Cause Foundation",
    tagline: "Making a difference together",
    logoUrl: "/logos/mycause.svg",
    colors: {
      primary: "#0066CC",
      primaryHover: "#0052A3",
      secondary: "#6B7280",
      accent: "#F59E0B",
    },
    typography: {
      fontFamily: "Inter, sans-serif",
      baseFontSize: 16,
    },
    borderRadius: "medium",
  },
  features: {
    donations: { enabled: true, minimumAmount: 5, allowRecurring: true },
    shop: { enabled: false },
    events: { enabled: true, allowRegistration: true },
    community: { enabled: true, showLeaderboard: true },
    gamification: { enabled: true },
    volunteer: { enabled: false },
  },
};

const colorPresets = [
  { name: "Ocean Blue", primary: "#0066CC", accent: "#10B981" },
  { name: "Forest Green", primary: "#059669", accent: "#F59E0B" },
  { name: "Sunset Orange", primary: "#F97316", accent: "#8B5CF6" },
  { name: "Royal Purple", primary: "#7C3AED", accent: "#EC4899" },
];

const fontOptions = [
  { name: "Inter", value: "Inter, sans-serif" },
  { name: "Roboto", value: "Roboto, sans-serif" },
  { name: "Open Sans", value: "'Open Sans', sans-serif" },
  { name: "Lato", value: "Lato, sans-serif" },
];

export default function WhiteLabelConfig() {
  const [config, setConfig] = useState(whiteLabelConfig);

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">White-label Configuration</h1>
          <p className="text-muted-foreground">
            Customize your platform branding and features
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  {config.branding.organizationName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {config.subdomain}.gratis.ngo •{" "}
                  {config.customDomainVerified && config.customDomain}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="default"
                className="bg-green-600 text-white px-4 py-1"
              >
                <Check className="mr-1 h-3 w-3" />
                {config.status}
              </Badge>
              <Badge variant="secondary" className="px-4 py-1 capitalize">
                {config.plan}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Tabs */}
      <Tabs defaultValue="branding" className="space-y-4">
        <TabsList>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="domain">Domain</TabsTrigger>
          <TabsTrigger value="localization">Localization</TabsTrigger>
        </TabsList>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Logo & Identity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Logo & Identity
                </CardTitle>
                <CardDescription>
                  Upload your organization logo and set identity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    Organization Name
                  </label>
                  <Input
                    value={config.branding.organizationName}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tagline</label>
                  <Input value={config.branding.tagline} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Logo</label>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="h-20 w-20 border-2 border-dashed rounded-lg flex items-center justify-center">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <Button variant="outline">Upload Logo</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Color Scheme */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Color Scheme
                </CardTitle>
                <CardDescription>
                  Choose colors that match your brand
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Presets */}
                <div>
                  <label className="text-sm font-medium">Color Presets</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {colorPresets.map((preset) => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        className="justify-start"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="h-4 w-4 rounded"
                            style={{ backgroundColor: preset.primary }}
                          />
                          <span className="text-sm">{preset.name}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Custom Colors */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Custom Colors</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground">
                        Primary
                      </label>
                      <div className="flex gap-2 mt-1">
                        <div
                          className="h-10 w-10 rounded border"
                          style={{
                            backgroundColor: config.branding.colors.primary,
                          }}
                        />
                        <Input
                          value={config.branding.colors.primary}
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">
                        Accent
                      </label>
                      <div className="flex gap-2 mt-1">
                        <div
                          className="h-10 w-10 rounded border"
                          style={{
                            backgroundColor: config.branding.colors.accent,
                          }}
                        />
                        <Input
                          value={config.branding.colors.accent}
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Typography */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Typography
                </CardTitle>
                <CardDescription>Select fonts and text styling</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Font Family</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-md">
                    {fontOptions.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Base Font Size</label>
                  <Input
                    type="number"
                    value={config.branding.typography.baseFontSize}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Layout */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5" />
                  Layout Style
                </CardTitle>
                <CardDescription>
                  Customize the overall look and feel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Border Radius</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-md">
                    <option value="none">None (Square)</option>
                    <option value="small">Small (2px)</option>
                    <option value="medium">Medium (8px)</option>
                    <option value="large">Large (16px)</option>
                    <option value="full">Full (Rounded)</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Configuration</CardTitle>
              <CardDescription>
                Enable or disable platform features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(config.features).map(([key, feature]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {feature.enabled
                          ? "Feature is enabled"
                          : "Feature is disabled"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={feature.enabled ? "default" : "secondary"}
                      >
                        {feature.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Domain Tab */}
        <TabsContent value="domain" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Domain Settings</CardTitle>
              <CardDescription>
                Configure your subdomain and custom domain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Subdomain</label>
                <div className="flex gap-2 mt-1">
                  <Input value={config.subdomain} className="flex-1" />
                  <span className="flex items-center text-sm text-muted-foreground">
                    .gratis.ngo
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Custom Domain</label>
                <Input
                  value={config.customDomain}
                  placeholder="donate.yourorganization.org"
                  className="mt-1"
                />
                {config.customDomainVerified && (
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                    <Check className="h-4 w-4" />
                    Domain verified
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Localization Tab */}
        <TabsContent value="localization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Localization Settings</CardTitle>
              <CardDescription>
                Configure language and regional preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">
                    Default Language
                  </label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-md">
                    <option value="en">English</option>
                    <option value="nl">Nederlands</option>
                    <option value="de">Deutsch</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Default Currency
                  </label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-md">
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Date Format</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-md">
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Timezone</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-md">
                    <option value="Europe/Amsterdam">Europe/Amsterdam</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="Europe/London">Europe/London</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
