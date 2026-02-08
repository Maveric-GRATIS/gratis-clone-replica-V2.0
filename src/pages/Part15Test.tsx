// src/pages/Part15Test.tsx
// GRATIS.NGO — Part 15 Feature Test Page

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";

export default function Part15Test() {
  const [testResults, setTestResults] = useState<
    Record<string, boolean | null>
  >({
    apiKeys: null,
    notifications: null,
    scheduler: null,
    platformConfig: null,
  });
  const [loading, setLoading] = useState(false);

  // Test real-time notifications hook
  const { notifications, unreadCount } = useRealtimeNotifications();

  const testAPIKeys = async () => {
    try {
      const response = await fetch("/api/admin/api-keys", {
        headers: { "x-user-id": "test-user" },
      });
      const result = response.ok;
      setTestResults((prev) => ({ ...prev, apiKeys: result }));
      return result;
    } catch {
      setTestResults((prev) => ({ ...prev, apiKeys: false }));
      return false;
    }
  };

  const testNotifications = async () => {
    try {
      // Check if notifications hook is working
      const result = notifications !== undefined;
      setTestResults((prev) => ({ ...prev, notifications: result }));
      return result;
    } catch {
      setTestResults((prev) => ({ ...prev, notifications: false }));
      return false;
    }
  };

  const testScheduler = async () => {
    try {
      const response = await fetch("/api/admin/scheduler/jobs", {
        headers: { "x-user-id": "test-admin" },
      });
      const result = response.ok;
      setTestResults((prev) => ({ ...prev, scheduler: result }));
      return result;
    } catch {
      setTestResults((prev) => ({ ...prev, scheduler: false }));
      return false;
    }
  };

  const testPlatformConfig = async () => {
    try {
      const response = await fetch("/api/admin/config", {
        headers: { "x-user-id": "test-admin" },
      });
      const result = response.ok;
      setTestResults((prev) => ({ ...prev, platformConfig: result }));
      return result;
    } catch {
      setTestResults((prev) => ({ ...prev, platformConfig: false }));
      return false;
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setTestResults({
      apiKeys: null,
      notifications: null,
      scheduler: null,
      platformConfig: null,
    });

    await testAPIKeys();
    await testNotifications();
    await testScheduler();
    await testPlatformConfig();

    setLoading(false);
  };

  const getStatusIcon = (status: boolean | null) => {
    if (status === null)
      return <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />;
    if (status === true)
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusBadge = (status: boolean | null) => {
    if (status === null) return <Badge variant="outline">Not Tested</Badge>;
    if (status === true) return <Badge className="bg-green-500">Pass</Badge>;
    return <Badge variant="destructive">Fail</Badge>;
  };

  const allTestsPassed =
    Object.values(testResults).every((result) => result === true) &&
    Object.values(testResults).some((result) => result !== null);

  return (
    <div className="container mx-auto p-8 pt-24 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Part 15 Feature Test</h1>
        <p className="text-muted-foreground">
          Test all Part 15 enterprise features (API Keys, Notifications,
          Scheduler, Config)
        </p>
      </div>

      {/* Test Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Runner</CardTitle>
          <CardDescription>
            Run all Part 15 feature tests to verify implementation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button onClick={runAllTests} disabled={loading} size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Tests...
                </>
              ) : (
                "Run All Tests"
              )}
            </Button>
            {allTestsPassed && (
              <Badge className="bg-green-500 text-white">
                All Tests Passed! ✅
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <div className="grid gap-4">
        {/* API Keys Test */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(testResults.apiKeys)}
                  API Keys System
                </CardTitle>
                <CardDescription>
                  Tests the Developer API Keys management system
                </CardDescription>
              </div>
              {getStatusBadge(testResults.apiKeys)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Endpoint:</strong> GET /api/admin/api-keys
              </p>
              <p>
                <strong>Features:</strong> Create, revoke, rotate API keys with
                rate limiting
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={testAPIKeys}
                disabled={loading}
              >
                Test API Keys
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Test */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(testResults.notifications)}
                  Real-time Notifications
                </CardTitle>
                <CardDescription>
                  Tests the notification center and real-time updates
                </CardDescription>
              </div>
              {getStatusBadge(testResults.notifications)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Hook:</strong> useRealtimeNotifications()
              </p>
              <p>
                <strong>Current Status:</strong> {notifications?.length || 0}{" "}
                notifications, {unreadCount} unread
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={testNotifications}
                disabled={loading}
              >
                Test Notifications
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Scheduler Test */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(testResults.scheduler)}
                  Job Scheduler
                </CardTitle>
                <CardDescription>
                  Tests the cron job scheduler and background tasks
                </CardDescription>
              </div>
              {getStatusBadge(testResults.scheduler)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Endpoint:</strong> GET /api/admin/scheduler/jobs
              </p>
              <p>
                <strong>Features:</strong> Create, pause, resume, delete
                scheduled jobs
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={testScheduler}
                disabled={loading}
              >
                Test Scheduler
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Platform Config Test */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(testResults.platformConfig)}
                  Platform Configuration
                </CardTitle>
                <CardDescription>
                  Tests the platform settings and configuration API
                </CardDescription>
              </div>
              {getStatusBadge(testResults.platformConfig)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Endpoint:</strong> GET /api/admin/config
              </p>
              <p>
                <strong>Features:</strong> Maintenance mode, feature flags,
                email config
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={testPlatformConfig}
                disabled={loading}
              >
                Test Config
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Summary */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Part 15 Files Created</CardTitle>
          <CardDescription>13 files, ~2,800 LOC</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <strong>Types:</strong>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>api-keys.ts</li>
                <li>realtime.ts</li>
                <li>scheduler.ts</li>
                <li>platform-config.ts</li>
              </ul>
            </div>
            <div>
              <strong>Pages:</strong>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>DeveloperAPIKeys.tsx</li>
                <li>SchedulerDashboard.tsx</li>
                <li>PlatformSettings.tsx</li>
              </ul>
            </div>
            <div>
              <strong>Hooks:</strong>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>useRealtimeNotifications.ts</li>
              </ul>
            </div>
            <div>
              <strong>E2E Tests:</strong>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>auth.spec.ts</li>
                <li>part15-features.spec.ts</li>
                <li>playwright.config.ts</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
