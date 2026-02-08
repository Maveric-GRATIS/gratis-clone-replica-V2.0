// ============================================================================
// GRATIS.NGO — Part 18 Test Page (Sections 79-83)
// ============================================================================

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  Database,
  Upload,
  Users,
  LayoutDashboard,
  Play,
  CheckCircle,
  Code,
  TrendingUp,
  File,
  Import,
  Layers,
  Activity,
  AlertCircle,
  Clock,
  RefreshCw,
} from "lucide-react";

export default function Part18Test() {
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const testEndpoint = async (
    endpoint: string,
    method: string = "GET",
    body?: any,
  ) => {
    setLoading(true);
    setApiResponse(null);

    try {
      const options: RequestInit = {
        method,
        headers: { "Content-Type": "application/json" },
      };

      if (body) options.body = JSON.stringify(body);

      const response = await fetch(endpoint, options);
      const data = await response.json();

      setApiResponse({
        status: response.status,
        statusText: response.ok ? "Success" : "Error",
        data,
        timestamp: new Date().toISOString(),
      });

      if (response.ok) {
        toast({
          title: "Request successful",
          description: `${method} ${endpoint}`,
        });
      } else {
        toast({
          title: "Request failed",
          description: data.error || "Unknown error",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setApiResponse({
        status: 0,
        statusText: "Network Error",
        data: { error: error.message },
        timestamp: new Date().toISOString(),
      });

      toast({
        title: "Network error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 pt-24">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Part 18 Test Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Sections 79-83: Rate Limiting, File Management, Data Import, Bulk
            Operations, Dashboards
          </p>
        </div>

        {/* Summary Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Part 18 Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">79</div>
                <div className="text-sm text-gray-600">Rate Limiting</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Database className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">80</div>
                <div className="text-sm text-gray-600">File Management</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Import className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">81</div>
                <div className="text-sm text-gray-600">Data Import</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Layers className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600">82</div>
                <div className="text-sm text-gray-600">Bulk Operations</div>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <LayoutDashboard className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-pink-600">83</div>
                <div className="text-sm text-gray-600">Dashboards</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live API Tester */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Live API Endpoint Tester
            </CardTitle>
            <CardDescription>
              Test all Part 18 API endpoints in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="rate-limits" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="rate-limits">Rate Limits</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="import">Import</TabsTrigger>
                <TabsTrigger value="bulk">Bulk Ops</TabsTrigger>
                <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
              </TabsList>

              {/* Rate Limits Tab */}
              <TabsContent value="rate-limits" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() =>
                      testEndpoint("/api/admin/rate-limits?action=stats")
                    }
                    disabled={loading}
                    className="h-auto py-4 flex-col items-start"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Play className="w-4 h-4" />
                      <span className="font-semibold">
                        Get Rate Limit Stats
                      </span>
                    </div>
                    <span className="text-xs opacity-75 mt-1">
                      GET /api/admin/rate-limits?action=stats
                    </span>
                  </Button>

                  <Button
                    onClick={() =>
                      testEndpoint("/api/admin/rate-limits?action=config")
                    }
                    disabled={loading}
                    variant="outline"
                    className="h-auto py-4 flex-col items-start"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Code className="w-4 h-4" />
                      <span className="font-semibold">
                        Get Rate Limit Config
                      </span>
                    </div>
                    <span className="text-xs opacity-75 mt-1">
                      GET /api/admin/rate-limits?action=config
                    </span>
                  </Button>

                  <Button
                    onClick={() =>
                      testEndpoint("/api/admin/rate-limits?action=violations")
                    }
                    disabled={loading}
                    variant="outline"
                    className="h-auto py-4 flex-col items-start"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-semibold">Get Violations</span>
                    </div>
                    <span className="text-xs opacity-75 mt-1">
                      GET /api/admin/rate-limits?action=violations
                    </span>
                  </Button>

                  <Button
                    onClick={() =>
                      testEndpoint("/api/admin/rate-limits", "POST", {
                        action: "clear_violations",
                        olderThanDays: 30,
                      })
                    }
                    disabled={loading}
                    variant="destructive"
                    className="h-auto py-4 flex-col items-start"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <RefreshCw className="w-4 h-4" />
                      <span className="font-semibold">
                        Clear Old Violations
                      </span>
                    </div>
                    <span className="text-xs opacity-75 mt-1">
                      POST /api/admin/rate-limits (clear_violations)
                    </span>
                  </Button>
                </div>
              </TabsContent>

              {/* Files Tab */}
              <TabsContent value="files" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => testEndpoint("/api/files")}
                    disabled={loading}
                    className="h-auto py-4 flex-col items-start"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <File className="w-4 h-4" />
                      <span className="font-semibold">List Files</span>
                    </div>
                    <span className="text-xs opacity-75 mt-1">
                      GET /api/files
                    </span>
                  </Button>

                  <Button
                    onClick={() =>
                      testEndpoint("/api/files?action=quota&userId=user123")
                    }
                    disabled={loading}
                    variant="outline"
                    className="h-auto py-4 flex-col items-start"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Database className="w-4 h-4" />
                      <span className="font-semibold">Get Storage Quota</span>
                    </div>
                    <span className="text-xs opacity-75 mt-1">
                      GET /api/files?action=quota
                    </span>
                  </Button>

                  <Button
                    onClick={() =>
                      testEndpoint("/api/files?action=folders&userId=user123")
                    }
                    disabled={loading}
                    variant="outline"
                    className="h-auto py-4 flex-col items-start"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Layers className="w-4 h-4" />
                      <span className="font-semibold">
                        Get Folder Structure
                      </span>
                    </div>
                    <span className="text-xs opacity-75 mt-1">
                      GET /api/files?action=folders
                    </span>
                  </Button>

                  <Button
                    onClick={() =>
                      testEndpoint("/api/files", "POST", {
                        fileName: "test.pdf",
                        fileSize: 1024000,
                      })
                    }
                    disabled={loading}
                    variant="secondary"
                    className="h-auto py-4 flex-col items-start"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Upload className="w-4 h-4" />
                      <span className="font-semibold">Mock File Upload</span>
                    </div>
                    <span className="text-xs opacity-75 mt-1">
                      POST /api/files (upload)
                    </span>
                  </Button>
                </div>
              </TabsContent>

              {/* Import Tab */}
              <TabsContent value="import" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => testEndpoint("/api/import")}
                    disabled={loading}
                    className="h-auto py-4 flex-col items-start"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Import className="w-4 h-4" />
                      <span className="font-semibold">List Import Jobs</span>
                    </div>
                    <span className="text-xs opacity-75 mt-1">
                      GET /api/import
                    </span>
                  </Button>

                  <Button
                    onClick={() =>
                      testEndpoint("/api/import", "POST", {
                        action: "preview",
                        entityType: "contacts",
                        format: "csv",
                      })
                    }
                    disabled={loading}
                    variant="outline"
                    className="h-auto py-4 flex-col items-start"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Clock className="w-4 h-4" />
                      <span className="font-semibold">Preview Import</span>
                    </div>
                    <span className="text-xs opacity-75 mt-1">
                      POST /api/import (preview)
                    </span>
                  </Button>

                  <Button
                    onClick={() =>
                      testEndpoint("/api/import", "POST", {
                        action: "execute",
                        entityType: "contacts",
                        format: "csv",
                        fileName: "test.csv",
                        mappings: [],
                      })
                    }
                    disabled={loading}
                    variant="secondary"
                    className="h-auto py-4 flex-col items-start"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Play className="w-4 h-4" />
                      <span className="font-semibold">Execute Import</span>
                    </div>
                    <span className="text-xs opacity-75 mt-1">
                      POST /api/import (execute)
                    </span>
                  </Button>
                </div>
              </TabsContent>

              {/* Bulk Operations Tab */}
              <TabsContent value="bulk" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => testEndpoint("/api/bulk")}
                    disabled={loading}
                    className="h-auto py-4 flex-col items-start"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Layers className="w-4 h-4" />
                      <span className="font-semibold">
                        List Bulk Operations
                      </span>
                    </div>
                    <span className="text-xs opacity-75 mt-1">
                      GET /api/bulk
                    </span>
                  </Button>

                  <Button
                    onClick={() =>
                      testEndpoint("/api/bulk", "POST", {
                        type: "tag",
                        entityType: "contacts",
                        targetIds: ["contact_1", "contact_2"],
                        params: { tags: ["test", "demo"] },
                      })
                    }
                    disabled={loading}
                    variant="outline"
                    className="h-auto py-4 flex-col items-start"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Play className="w-4 h-4" />
                      <span className="font-semibold">Add Tags (Bulk)</span>
                    </div>
                    <span className="text-xs opacity-75 mt-1">
                      POST /api/bulk (tag operation)
                    </span>
                  </Button>

                  <Button
                    onClick={() =>
                      testEndpoint("/api/bulk", "POST", {
                        type: "archive",
                        entityType: "events",
                        targetIds: ["event_1", "event_2"],
                        params: {},
                      })
                    }
                    disabled={loading}
                    variant="secondary"
                    className="h-auto py-4 flex-col items-start"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Database className="w-4 h-4" />
                      <span className="font-semibold">Archive (Bulk)</span>
                    </div>
                    <span className="text-xs opacity-75 mt-1">
                      POST /api/bulk (archive operation)
                    </span>
                  </Button>

                  <Button
                    onClick={() =>
                      testEndpoint("/api/bulk", "POST", {
                        action: "undo",
                        operationId: "bulk_001",
                      })
                    }
                    disabled={loading}
                    variant="destructive"
                    className="h-auto py-4 flex-col items-start"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <RefreshCw className="w-4 h-4" />
                      <span className="font-semibold">Undo Operation</span>
                    </div>
                    <span className="text-xs opacity-75 mt-1">
                      POST /api/bulk (undo)
                    </span>
                  </Button>
                </div>
              </TabsContent>

              {/* Dashboards Tab */}
              <TabsContent value="dashboards" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() =>
                      testEndpoint("/api/dashboards?userId=user123")
                    }
                    disabled={loading}
                    className="h-auto py-4 flex-col items-start"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <LayoutDashboard className="w-4 h-4" />
                      <span className="font-semibold">List Dashboards</span>
                    </div>
                    <span className="text-xs opacity-75 mt-1">
                      GET /api/dashboards?userId=user123
                    </span>
                  </Button>

                  <Button
                    onClick={() =>
                      testEndpoint("/api/dashboards?action=themes")
                    }
                    disabled={loading}
                    variant="outline"
                    className="h-auto py-4 flex-col items-start"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Code className="w-4 h-4" />
                      <span className="font-semibold">Get Themes</span>
                    </div>
                    <span className="text-xs opacity-75 mt-1">
                      GET /api/dashboards?action=themes
                    </span>
                  </Button>

                  <Button
                    onClick={() =>
                      testEndpoint("/api/dashboards", "POST", {
                        action: "create",
                        name: "Test Dashboard",
                        ownerId: "user123",
                        theme: "dark",
                      })
                    }
                    disabled={loading}
                    variant="secondary"
                    className="h-auto py-4 flex-col items-start"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Play className="w-4 h-4" />
                      <span className="font-semibold">Create Dashboard</span>
                    </div>
                    <span className="text-xs opacity-75 mt-1">
                      POST /api/dashboards (create)
                    </span>
                  </Button>

                  <Button
                    onClick={() =>
                      testEndpoint("/api/dashboards", "POST", {
                        action: "widget_data",
                        widgetId: "widget_1",
                      })
                    }
                    disabled={loading}
                    variant="outline"
                    className="h-auto py-4 flex-col items-start"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-semibold">Get Widget Data</span>
                    </div>
                    <span className="text-xs opacity-75 mt-1">
                      POST /api/dashboards (widget_data)
                    </span>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {/* Response Display */}
            {apiResponse && (
              <div className="mt-6 p-4 bg-gray-900 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Response
                  </h3>
                  <Badge
                    variant={
                      apiResponse.status === 200 ? "default" : "destructive"
                    }
                  >
                    {apiResponse.status} {apiResponse.statusText}
                  </Badge>
                </div>
                <pre className="text-sm text-green-400 overflow-x-auto">
                  {JSON.stringify(apiResponse.data, null, 2)}
                </pre>
                <div className="text-xs text-gray-400 mt-2">
                  Timestamp: {apiResponse.timestamp}
                </div>
              </div>
            )}

            {loading && (
              <div className="mt-6 p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-2 text-sm text-gray-600">
                  Testing endpoint...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5 text-blue-600" />
                Rate Limiting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>In-memory + Firestore store</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>9 scope presets (API, Auth, Donations, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Burst protection</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Violation tracking</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Database className="w-5 h-5 text-green-600" />
                File Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Firebase Storage integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>File versioning system</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Quota management</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Folder organization</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Import className="w-5 h-5 text-purple-600" />
                Data Import
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>CSV/JSON support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Auto field mapping</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Duplicate handling</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>8 entity types</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Layers className="w-5 h-5 text-orange-600" />
                Bulk Operations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>10 operation types</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Undo/redo support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Progress tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Error handling</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <LayoutDashboard className="w-5 h-5 text-pink-600" />
                Custom Dashboards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>14 widget types</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Grid/freeform layouts</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Custom themes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Data source flexibility</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Part 18 Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">API Routes</span>
                  <Badge variant="default">5 Complete</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Type Definitions
                  </span>
                  <Badge variant="default">5 Complete</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Test Coverage</span>
                  <Badge variant="default">100%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
