import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Download,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Cookie,
  FileText,
  Users,
  Lock,
} from "lucide-react";

export default function GDPRComplianceDashboard() {
  const [consentPreferences, setConsentPreferences] = useState({
    essential: true,
    functional: true,
    analytics: false,
    marketing: false,
    advertising: false,
    profiling: false,
  });

  const consentHistory = [
    {
      id: "1",
      type: "analytics",
      status: "granted",
      timestamp: "2024-06-15 14:30",
      source: "privacy_settings",
    },
    {
      id: "2",
      type: "marketing",
      status: "denied",
      timestamp: "2024-06-15 14:30",
      source: "cookie_banner",
    },
    {
      id: "3",
      type: "functional",
      status: "granted",
      timestamp: "2024-06-01 10:15",
      source: "registration",
    },
  ];

  const exportRequests = [
    {
      id: "1",
      status: "completed",
      requestedAt: "2024-06-10",
      completedAt: "2024-06-11",
      format: "json",
      fileSize: "2.4 MB",
    },
    {
      id: "2",
      status: "processing",
      requestedAt: "2024-06-15",
      format: "csv",
    },
  ];

  const cookieCategories = [
    {
      id: "essential",
      name: "Essential Cookies",
      description: "Required for the website to function properly",
      required: true,
      enabled: true,
      cookies: [
        {
          name: "session_id",
          purpose: "User authentication and session management",
          duration: "24 hours",
          provider: "GRATIS.NGO",
        },
        {
          name: "csrf_token",
          purpose: "Security - prevent cross-site request forgery",
          duration: "Session",
          provider: "GRATIS.NGO",
        },
      ],
    },
    {
      id: "functional",
      name: "Functional Cookies",
      description: "Remember your preferences and personalize your experience",
      required: false,
      enabled: consentPreferences.functional,
      cookies: [
        {
          name: "language_pref",
          purpose: "Store your language preference",
          duration: "1 year",
          provider: "GRATIS.NGO",
        },
        {
          name: "theme_mode",
          purpose: "Remember dark/light mode preference",
          duration: "1 year",
          provider: "GRATIS.NGO",
        },
      ],
    },
    {
      id: "analytics",
      name: "Analytics Cookies",
      description: "Help us understand how visitors use our website",
      required: false,
      enabled: consentPreferences.analytics,
      cookies: [
        {
          name: "_ga",
          purpose: "Google Analytics - track website usage",
          duration: "2 years",
          provider: "Google",
        },
        {
          name: "_gid",
          purpose: "Google Analytics - distinguish users",
          duration: "24 hours",
          provider: "Google",
        },
      ],
    },
    {
      id: "marketing",
      name: "Marketing Cookies",
      description: "Track visits across websites for advertising purposes",
      required: false,
      enabled: consentPreferences.marketing,
      cookies: [
        {
          name: "fbp",
          purpose: "Facebook Pixel - track conversions",
          duration: "90 days",
          provider: "Facebook",
        },
      ],
    },
  ];

  const handleToggleConsent = (category: keyof typeof consentPreferences) => {
    if (category === "essential") return; // Cannot disable essential cookies
    setConsentPreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleRequestDataExport = () => {
    alert(
      "Data export request submitted. You will receive an email when ready.",
    );
  };

  const handleRequestDataDeletion = () => {
    const confirmed = confirm(
      "Are you sure you want to request account deletion? This action cannot be undone.",
    );
    if (confirmed) {
      alert(
        "Data deletion request submitted. Our team will review within 30 days.",
      );
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            Privacy & GDPR Compliance
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your data privacy preferences and rights
          </p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          <CheckCircle className="w-4 h-4 mr-1" />
          GDPR Compliant
        </Badge>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="consent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="consent">
            <Shield className="w-4 h-4 mr-2" />
            Consent Management
          </TabsTrigger>
          <TabsTrigger value="cookies">
            <Cookie className="w-4 h-4 mr-2" />
            Cookie Settings
          </TabsTrigger>
          <TabsTrigger value="data-rights">
            <FileText className="w-4 h-4 mr-2" />
            Data Rights
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="w-4 h-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        {/* Consent Management Tab */}
        <TabsContent value="consent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Privacy Preferences</CardTitle>
              <CardDescription>
                Control how we collect and use your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(consentPreferences).map(([key, value]) => {
                const isEssential = key === "essential";
                const icons: Record<string, any> = {
                  essential: Lock,
                  functional: Users,
                  analytics: FileText,
                  marketing: AlertTriangle,
                  advertising: AlertTriangle,
                  profiling: Users,
                };
                const Icon = icons[key];

                return (
                  <div
                    key={key}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {isEssential
                            ? "Required for basic functionality"
                            : `Allow ${key} data collection`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={value}
                        onCheckedChange={() =>
                          handleToggleConsent(
                            key as keyof typeof consentPreferences,
                          )
                        }
                        disabled={isEssential}
                      />
                      {value ? (
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Granted
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="w-3 h-3 mr-1" />
                          Denied
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 border-t">
                <Button className="w-full">Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cookie Settings Tab */}
        <TabsContent value="cookies" className="space-y-4">
          {cookieCategories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Cookie className="w-5 h-5" />
                      {category.name}
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                  <Switch
                    checked={category.enabled}
                    disabled={category.required}
                    onCheckedChange={() =>
                      handleToggleConsent(
                        category.id as keyof typeof consentPreferences,
                      )
                    }
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.cookies.map((cookie, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{cookie.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {cookie.purpose}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Duration: {cookie.duration}</span>
                          <span>Provider: {cookie.provider}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Data Rights Tab */}
        <TabsContent value="data-rights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Export Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-blue-600" />
                  Export Your Data
                </CardTitle>
                <CardDescription>
                  Download a copy of all your personal data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  We'll prepare a complete export of your data including:
                </p>
                <ul className="text-sm space-y-1 ml-4 list-disc text-muted-foreground">
                  <li>Profile information</li>
                  <li>Donation history</li>
                  <li>Event registrations</li>
                  <li>Social posts and comments</li>
                  <li>Messages and notifications</li>
                </ul>
                <Button onClick={handleRequestDataExport} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Request Data Export
                </Button>

                {/* Export Requests */}
                {exportRequests.length > 0 && (
                  <div className="pt-4 border-t space-y-2">
                    <p className="text-sm font-medium">Recent Requests:</p>
                    {exportRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between text-sm p-2 rounded bg-muted/50"
                      >
                        <div>
                          <p className="font-medium">
                            {request.format.toUpperCase()} Export
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Requested {request.requestedAt}
                          </p>
                        </div>
                        <Badge
                          variant={
                            request.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {request.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delete Data */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Trash2 className="w-5 h-5" />
                  Delete Your Data
                </CardTitle>
                <CardDescription>
                  Request permanent deletion of your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-800 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      This action is permanent and cannot be undone. Some
                      financial records may be retained for legal compliance
                      (ANBI regulations require 7 years retention).
                    </span>
                  </p>
                </div>

                <p className="text-sm text-muted-foreground">
                  What will be deleted:
                </p>
                <ul className="text-sm space-y-1 ml-4 list-disc text-muted-foreground">
                  <li>Personal profile information</li>
                  <li>Social posts and interactions</li>
                  <li>Messages and preferences</li>
                  <li>Event registrations</li>
                </ul>

                <p className="text-sm text-muted-foreground">
                  What will be retained:
                </p>
                <ul className="text-sm space-y-1 ml-4 list-disc text-muted-foreground">
                  <li>Donation records (anonymized)</li>
                  <li>Financial transaction history</li>
                  <li>Tax receipts (ANBI requirement)</li>
                </ul>

                <Button
                  variant="destructive"
                  onClick={handleRequestDataDeletion}
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Request Account Deletion
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Consent History</CardTitle>
              <CardDescription>
                All changes to your privacy preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {consentHistory.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      {record.status === "granted" ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium capitalize">{record.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {record.timestamp} • via{" "}
                          {record.source.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        record.status === "granted" ? "default" : "secondary"
                      }
                      className={
                        record.status === "granted"
                          ? "bg-green-600"
                          : "bg-red-600 text-white"
                      }
                    >
                      {record.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
