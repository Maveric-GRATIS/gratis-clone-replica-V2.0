import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings as SettingsIcon,
  Save,
  Globe,
  Bell,
  Shield,
  Palette,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";

interface PlatformSettings {
  siteName: string;
  siteUrl: string;
  contactEmail: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  enableDonations: boolean;
  enableProducts: boolean;
  currency: string;
  language: string;
}

export default function AdminSettings() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery<PlatformSettings>({
    queryKey: ["platform-settings"],
    queryFn: async () => {
      const docRef = doc(db, "settings", "platform");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as PlatformSettings;
      }
      // Default settings
      return {
        siteName: "GRATIS",
        siteUrl: "https://gratis.com",
        contactEmail: "info@gratis.com",
        maintenanceMode: false,
        allowRegistration: true,
        enableDonations: true,
        enableProducts: true,
        currency: "EUR",
        language: "en",
      };
    },
  });

  const [formData, setFormData] = useState<PlatformSettings>();

  // Update form data when settings load
  useState(() => {
    if (settings && !formData) {
      setFormData(settings);
    }
  });

  const saveSettings = useMutation({
    mutationFn: async (data: PlatformSettings) => {
      const docRef = doc(db, "settings", "platform");
      await setDoc(docRef, data, { merge: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-settings"] });
      toast.success("Settings saved successfully");
    },
    onError: () => {
      toast.error("Failed to save settings");
    },
  });

  const handleSave = () => {
    if (formData) {
      saveSettings.mutate(formData);
    }
  };

  const handleChange = (field: keyof PlatformSettings, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : settings));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-8 w-8 text-gray-600" />
            <div>
              <h1 className="text-3xl font-bold">Platform Settings</h1>
              <p className="text-muted-foreground">Configure your platform</p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={saveSettings.isPending}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general" className="gap-2">
              <Globe className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="features" className="gap-2">
              <Shield className="h-4 w-4" />
              Features
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic platform configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={formData?.siteName || ""}
                    onChange={(e) => handleChange("siteName", e.target.value)}
                    placeholder="GRATIS"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    value={formData?.siteUrl || ""}
                    onChange={(e) => handleChange("siteUrl", e.target.value)}
                    placeholder="https://gratis.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData?.contactEmail || ""}
                    onChange={(e) =>
                      handleChange("contactEmail", e.target.value)
                    }
                    placeholder="info@gratis.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={formData?.currency || "EUR"}
                    onChange={(e) => handleChange("currency", e.target.value)}
                    placeholder="EUR"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    value={formData?.language || "en"}
                    onChange={(e) => handleChange("language", e.target.value)}
                    placeholder="en"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Feature Toggles</CardTitle>
                <CardDescription>
                  Enable or disable platform features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">User Registration</p>
                    <p className="text-sm text-muted-foreground">
                      Allow new users to register
                    </p>
                  </div>
                  <Button
                    variant={
                      formData?.allowRegistration ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      handleChange(
                        "allowRegistration",
                        !formData?.allowRegistration,
                      )
                    }
                  >
                    {formData?.allowRegistration ? "Enabled" : "Disabled"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Donations</p>
                    <p className="text-sm text-muted-foreground">
                      Enable donation functionality
                    </p>
                  </div>
                  <Button
                    variant={formData?.enableDonations ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      handleChange(
                        "enableDonations",
                        !formData?.enableDonations,
                      )
                    }
                  >
                    {formData?.enableDonations ? "Enabled" : "Disabled"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Products</p>
                    <p className="text-sm text-muted-foreground">
                      Enable product sales
                    </p>
                  </div>
                  <Button
                    variant={formData?.enableProducts ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      handleChange("enableProducts", !formData?.enableProducts)
                    }
                  >
                    {formData?.enableProducts ? "Enabled" : "Disabled"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Maintenance Mode</p>
                    <p className="text-sm text-muted-foreground">
                      Put site in maintenance mode
                    </p>
                  </div>
                  <Button
                    variant={
                      formData?.maintenanceMode ? "destructive" : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      handleChange(
                        "maintenanceMode",
                        !formData?.maintenanceMode,
                      )
                    }
                  >
                    {formData?.maintenanceMode ? "Active" : "Inactive"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Notification settings coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Appearance settings coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
