// Part17Test.tsx - Part 17 Enterprise Features Showcase

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Key,
  Radio,
  Clock,
  TestTube,
  Settings,
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Activity,
  Code,
  Play,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Part17Test() {
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Test API endpoint
  const testEndpoint = async (
    endpoint: string,
    method: string = "GET",
    body?: any,
  ) => {
    setLoading(true);
    try {
      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(endpoint, options);
      const data = await response.json();

      setApiResponse({
        endpoint,
        method,
        status: response.status,
        ok: response.ok,
        data,
        timestamp: new Date().toISOString(),
      });

      toast({
        title: response.ok ? "✓ Success" : "✗ Error",
        description: `${method} ${endpoint} - Status: ${response.status}`,
        variant: response.ok ? "default" : "destructive",
      });
    } catch (error: any) {
      setApiResponse({
        endpoint,
        method,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const sections = [
    {
      id: 64,
      title: "API Key Management & Developer Portal",
      description: "Generate and manage API keys for third-party integrations",
      icon: Key,
      status: "complete",
      items: [
        "API key types (production/sandbox with different prefixes)",
        "Key generation with SHA-256 hashing",
        "Scope-based permissions (read, write, admin)",
        "Rate limiting per key",
        "IP and origin whitelisting",
        "Usage tracking and statistics",
        "Key rotation functionality",
      ],
      files: ["src/types/api-keys.ts", "src/lib/api-keys/api-key-service.ts"],
    },
    {
      id: 65,
      title: "Real-Time Notifications (Firestore Listeners)",
      description: "Push notifications using Firebase Realtime listeners",
      icon: Radio,
      status: "complete",
      items: [
        "Notification hub with channel subscriptions",
        "Firebase Firestore realtime listeners",
        "Multi-channel support (global, user, admin, project)",
        "Priority levels (low, medium, high, urgent)",
        "React hook for easy integration",
        "Notification center UI component",
        "Auto-dismiss and manual dismissal",
      ],
      files: [
        "src/types/realtime.ts",
        "src/lib/realtime/notification-hub.ts",
        "src/hooks/useRealtimeNotifications.ts",
      ],
    },
    {
      id: 66,
      title: "Scheduled Tasks & Cron Job Manager",
      description:
        "Manage recurring jobs like cleanup, analytics, and notifications",
      icon: Clock,
      status: "complete",
      items: [
        "Job registry with built-in handlers",
        "Cron expression parser",
        "Job execution tracking (runs, duration, status)",
        "Retry policy with exponential backoff",
        "Job status management (active, paused, disabled)",
        "Built-in jobs: cleanup, analytics, moderation, notifications",
        "Manual job execution for testing",
      ],
      files: [
        "src/types/scheduler.ts",
        "src/lib/scheduler/job-registry.ts",
        "src/lib/scheduler/scheduler-service.ts",
      ],
    },
    {
      id: 67,
      title: "End-to-End Testing Suite (Playwright)",
      description: "Comprehensive E2E tests for critical user flows",
      icon: TestTube,
      status: "planned",
      items: [
        "Playwright configuration for multiple browsers",
        "Authentication setup for test users",
        "Page object patterns and fixtures",
        "Homepage and navigation tests",
        "Donation flow tests",
        "Admin dashboard tests",
        "Accessibility tests with Axe",
      ],
      files: [
        "playwright.config.ts (to be created)",
        "e2e/auth.setup.ts (to be created)",
        "e2e/fixtures.ts (to be created)",
      ],
    },
    {
      id: 68,
      title: "Platform Configuration & Settings",
      description: "Centralized platform settings with audit logging",
      icon: Settings,
      status: "complete",
      items: [
        "Hierarchical config structure (9 sections)",
        "Change tracking with audit logs",
        "Config caching for performance",
        "Feature flags system",
        "Maintenance mode support",
        "Reset to defaults functionality",
        "Environment-specific settings",
      ],
      files: [
        "src/types/platform-config.ts",
        "src/lib/config/platform-config-service.ts",
      ],
    },
  ];

  const completedCount = sections.filter((s) => s.status === "complete").length;
  const progress = Math.round((completedCount / sections.length) * 100);

  return (
    <div className="container max-w-6xl mx-auto pt-24 pb-12 px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Code className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">
              Part 17 - Enterprise Platform
            </h1>
            <p className="text-muted-foreground">
              API Management, Real-Time Systems & Configuration
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg border">
          <Activity className="w-5 h-5 text-purple-600" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">
                Implementation Progress
              </span>
              <span className="text-sm font-bold text-purple-600">
                {progress}%
              </span>
            </div>
            <div className="w-full h-2 bg-white dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <Badge variant="outline" className="bg-white dark:bg-gray-900">
            {completedCount}/{sections.length} Complete
          </Badge>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/admin/developer">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <Key className="w-8 h-8 text-purple-600 mb-2" />
              <CardTitle className="text-lg">API Keys</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage API keys for third-party integrations
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/scheduler">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <Clock className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle className="text-lg">Scheduled Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View and manage cron jobs and scheduled tasks
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/config">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <Settings className="w-8 h-8 text-emerald-600 mb-2" />
              <CardTitle className="text-lg">Platform Config</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Configure platform settings and features
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Features */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-green-600" />
          Implemented Features
        </h2>

        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <Card
              key={section.id}
              className={`${
                section.status === "planned" ? "opacity-60 border-dashed" : ""
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        section.status === "complete"
                          ? "bg-green-100 dark:bg-green-950"
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          section.status === "complete"
                            ? "text-green-600"
                            : "text-gray-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline">Section {section.id}</Badge>
                        <Badge
                          variant={
                            section.status === "complete"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            section.status === "complete" ? "bg-green-600" : ""
                          }
                        >
                          {section.status === "complete"
                            ? "✓ Complete"
                            : "Planned"}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2">
                        {section.title}
                      </CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Key Features */}
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">
                      Key Features:
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {section.items.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Files */}
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">
                      Implementation Files:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {section.files.map((file, i) => (
                        <code
                          key={i}
                          className="text-xs bg-muted px-2 py-1 rounded"
                        >
                          {file}
                        </code>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <Card className="mt-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle>Part 17 Summary</CardTitle>
          <CardDescription>
            Enterprise platform capabilities overview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">5</div>
              <div className="text-sm text-muted-foreground">Sections</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {completedCount}
              </div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">15+</div>
              <div className="text-sm text-muted-foreground">Files Created</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">3500+</div>
              <div className="text-sm text-muted-foreground">Lines of Code</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live API Tester */}
      <Card className="mt-8 border-2 border-blue-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-6 h-6 text-blue-500" />
            Live API Endpoint Tester
          </CardTitle>
          <CardDescription>
            Test Part 17 API endpoints directly from this page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="get" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="get">GET Requests</TabsTrigger>
              <TabsTrigger value="post">POST Requests</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="validate">Validate Key</TabsTrigger>
            </TabsList>

            {/* GET Tests */}
            <TabsContent value="get" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    API Keys Endpoints
                  </Label>
                  <Button
                    onClick={() => testEndpoint("/api/developer/keys")}
                    disabled={loading}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    GET /api/developer/keys
                  </Button>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Scheduler Endpoints
                  </Label>
                  <div className="space-y-2">
                    <Button
                      onClick={() => testEndpoint("/api/admin/scheduler")}
                      disabled={loading}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      GET /api/admin/scheduler
                    </Button>
                    <Button
                      onClick={() =>
                        testEndpoint("/api/admin/scheduler/runs?jobId=test-job")
                      }
                      disabled={loading}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      GET /api/admin/scheduler/runs?jobId=test-job
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Platform Config Endpoints
                  </Label>
                  <div className="space-y-2">
                    <Button
                      onClick={() => testEndpoint("/api/admin/config")}
                      disabled={loading}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      GET /api/admin/config
                    </Button>
                    <Button
                      onClick={() =>
                        testEndpoint("/api/admin/config/maintenance")
                      }
                      disabled={loading}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      GET /api/admin/config/maintenance
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* POST Tests */}
            <TabsContent value="post" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Create API Key (requires auth)</Label>
                  <Button
                    onClick={() =>
                      testEndpoint("/api/developer/keys", "POST", {
                        name: "Test Key from Part17Test",
                        environment: "sandbox",
                        scopes: ["read"],
                        rateLimit: 1000,
                      })
                    }
                    disabled={loading}
                    className="w-full justify-start"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    POST /api/developer/keys
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Creates a sandbox API key with read permissions
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Execute Scheduled Job</Label>
                  <Button
                    onClick={() =>
                      testEndpoint(
                        "/api/admin/scheduler/execute?jobId=test-job",
                        "POST",
                      )
                    }
                    disabled={loading}
                    className="w-full justify-start"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    POST /api/admin/scheduler/execute
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Manually triggers a scheduled job execution
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Update Platform Config Section</Label>
                  <Button
                    onClick={() =>
                      testEndpoint("/api/admin/config", "PATCH", {
                        section: "general",
                        data: { platformName: "GRATIS Test" },
                        reason: "Testing from Part17Test page",
                      })
                    }
                    disabled={loading}
                    className="w-full justify-start"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    PATCH /api/admin/config
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Updates a specific config section
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Maintenance Tests */}
            <TabsContent value="maintenance" className="space-y-4 mt-4">
              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                <div className="flex gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Warning: Maintenance Mode Tests
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                      These tests will affect the platform's maintenance state.
                      Use with caution.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Enable Maintenance Mode</Label>
                  <Button
                    onClick={() =>
                      testEndpoint("/api/admin/config/maintenance", "POST", {
                        enabled: true,
                        reason: "Testing from Part17Test page",
                      })
                    }
                    disabled={loading}
                    variant="destructive"
                    className="w-full justify-start"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Enable Maintenance Mode
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Puts the platform into maintenance mode
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Disable Maintenance Mode</Label>
                  <Button
                    onClick={() =>
                      testEndpoint("/api/admin/config/maintenance", "POST", {
                        enabled: false,
                        reason: "Testing complete from Part17Test",
                      })
                    }
                    disabled={loading}
                    className="w-full justify-start"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Disable Maintenance Mode
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Exits maintenance mode and restores normal operations
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Check Maintenance Status</Label>
                  <Button
                    onClick={() =>
                      testEndpoint("/api/admin/config/maintenance")
                    }
                    disabled={loading}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    GET /api/admin/config/maintenance
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Check if maintenance mode is currently active
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link to="/maintenance">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Maintenance Page
                  </Link>
                </Button>
              </div>
            </TabsContent>

            {/* Validate Tests */}
            <TabsContent value="validate" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="testKey">API Key to Validate</Label>
                  <Input
                    id="testKey"
                    placeholder="gratis_live_xxxxxxxxxxxxx or gratis_sandbox_xxxxxxxxxxxxx"
                    defaultValue="test-api-key-123"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter a valid API key to test validation
                  </p>
                </div>
                <Button
                  onClick={() => {
                    const input = document.getElementById(
                      "testKey",
                    ) as HTMLInputElement;
                    testEndpoint("/api/developer/keys/validate", "POST", {
                      key: input?.value || "test-api-key-123",
                    });
                  }}
                  disabled={loading}
                  className="w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Validate API Key
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Response Display */}
          {apiResponse && (
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between">
                <Label>API Response:</Label>
                <Badge variant={apiResponse.ok ? "default" : "destructive"}>
                  {apiResponse.status || "Error"}
                </Badge>
              </div>
              <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs max-h-96 border">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <Link to="/part12-test">
          <Button variant="outline" className="gap-2">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Part 12 DevOps
          </Button>
        </Link>
        <Link to="/">
          <Button variant="ghost">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
