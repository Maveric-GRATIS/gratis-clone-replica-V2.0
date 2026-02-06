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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Search,
  Download,
  Filter,
  AlertCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
  DollarSign,
  Users,
  Lock,
  Activity,
  Calendar,
} from "lucide-react";

export default function AuditLogViewer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");

  const categories = [
    "auth",
    "donation",
    "subscription",
    "refund",
    "user",
    "role",
    "permission",
    "project",
    "gdpr",
    "system",
    "security",
    "payment",
  ];

  const severities = ["info", "warning", "error", "critical"];

  const auditLogs = [
    {
      id: "log_001",
      timestamp: "2024-06-15 14:32:15",
      category: "donation",
      action: "donation_created",
      severity: "info",
      userId: "user_123",
      userEmail: "donor@example.com",
      userRole: "member",
      resourceType: "donation",
      resourceId: "don_789",
      details: {
        amount: 50,
        currency: "EUR",
        projectId: "proj_456",
      },
      ipAddress: "192.168.1.100",
      success: true,
    },
    {
      id: "log_002",
      timestamp: "2024-06-15 14:28:43",
      category: "security",
      action: "failed_login_attempt",
      severity: "warning",
      userEmail: "unknown@example.com",
      details: {
        reason: "invalid_credentials",
        attempts: 3,
      },
      ipAddress: "203.0.113.42",
      success: false,
    },
    {
      id: "log_003",
      timestamp: "2024-06-15 14:15:22",
      category: "role",
      action: "role_assigned",
      severity: "info",
      userId: "user_456",
      userEmail: "admin@gratis.ngo",
      userRole: "admin",
      resourceType: "user",
      resourceId: "user_789",
      details: {
        newRole: "moderator",
        previousRole: "member",
      },
      ipAddress: "192.168.1.50",
      success: true,
    },
    {
      id: "log_004",
      timestamp: "2024-06-15 13:45:10",
      category: "refund",
      action: "refund_processed",
      severity: "warning",
      userId: "user_456",
      userEmail: "admin@gratis.ngo",
      userRole: "admin",
      resourceType: "payment",
      resourceId: "pay_321",
      details: {
        amount: 100,
        reason: "donor_request",
      },
      ipAddress: "192.168.1.50",
      success: true,
    },
    {
      id: "log_005",
      timestamp: "2024-06-15 12:30:00",
      category: "system",
      action: "database_backup_completed",
      severity: "info",
      details: {
        size: "2.4 GB",
        duration: "45 seconds",
      },
      success: true,
    },
    {
      id: "log_006",
      timestamp: "2024-06-15 11:15:33",
      category: "gdpr",
      action: "data_export_requested",
      severity: "info",
      userId: "user_234",
      userEmail: "user@example.com",
      userRole: "member",
      resourceType: "user",
      resourceId: "user_234",
      details: {
        format: "json",
      },
      ipAddress: "192.168.1.75",
      success: true,
    },
    {
      id: "log_007",
      timestamp: "2024-06-15 10:05:18",
      category: "payment",
      action: "payment_failed",
      severity: "error",
      userId: "user_567",
      userEmail: "donor2@example.com",
      userRole: "member",
      resourceType: "payment",
      resourceId: "pay_444",
      details: {
        amount: 25,
        errorCode: "card_declined",
        errorMessage: "Your card was declined",
      },
      ipAddress: "192.168.1.88",
      success: false,
      errorCode: "card_declined",
      errorMessage: "Your card was declined",
    },
  ];

  const stats = {
    total: auditLogs.length,
    byCategory: {
      donation: 1,
      security: 1,
      role: 1,
      refund: 1,
      system: 1,
      gdpr: 1,
      payment: 1,
    },
    bySeverity: {
      info: 5,
      warning: 1,
      error: 1,
      critical: 0,
    },
    recentErrors: 1,
    recentCritical: 0,
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "info":
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "critical":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "info":
        return "bg-blue-100 text-blue-700";
      case "warning":
        return "bg-yellow-100 text-yellow-700";
      case "error":
        return "bg-red-100 text-red-700";
      case "critical":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      donation: DollarSign,
      user: Users,
      role: Shield,
      security: Lock,
      system: Activity,
      gdpr: FileText,
      payment: DollarSign,
    };
    const Icon = icons[category] || Activity;
    return <Icon className="w-4 h-4" />;
  };

  const filteredLogs = auditLogs.filter((log) => {
    if (selectedCategory !== "all" && log.category !== selectedCategory)
      return false;
    if (selectedSeverity !== "all" && log.severity !== selectedSeverity)
      return false;
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      return (
        log.action.toLowerCase().includes(search) ||
        log.userEmail?.toLowerCase().includes(search) ||
        log.resourceId?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600" />
            Audit Log Viewer
          </h1>
          <p className="text-muted-foreground mt-1">
            Track all system activities and security events
          </p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Info</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bySeverity.info}</div>
            <p className="text-xs text-muted-foreground">Normal operations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bySeverity.warning}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bySeverity.error}</div>
            <p className="text-xs text-muted-foreground">Failed operations</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="capitalize">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Severity</Label>
              <Select
                value={selectedSeverity}
                onValueChange={setSelectedSeverity}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  {severities.map((sev) => (
                    <SelectItem key={sev} value={sev} className="capitalize">
                      {sev}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Last 24 hours
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>
                Showing {filteredLogs.length} of {stats.total} events
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className={`p-4 rounded-lg border transition-colors ${
                  log.severity === "critical" || log.severity === "error"
                    ? "border-red-200 bg-red-50/50"
                    : log.severity === "warning"
                      ? "border-yellow-200 bg-yellow-50/50"
                      : "hover:bg-muted/50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getSeverityIcon(log.severity)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getSeverityColor(log.severity)}>
                        {log.severity}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {getCategoryIcon(log.category)}
                        <span className="ml-1">{log.category}</span>
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {log.timestamp}
                      </span>
                    </div>

                    <p className="font-medium mb-1">
                      {log.action.replace(/_/g, " ")}
                    </p>

                    {log.userEmail && (
                      <p className="text-sm text-muted-foreground">
                        User: {log.userEmail}
                        {log.userRole && ` (${log.userRole})`}
                      </p>
                    )}

                    {log.resourceType && log.resourceId && (
                      <p className="text-sm text-muted-foreground">
                        Resource: {log.resourceType}:{log.resourceId}
                      </p>
                    )}

                    {log.ipAddress && (
                      <p className="text-sm text-muted-foreground">
                        IP: {log.ipAddress}
                      </p>
                    )}

                    {log.errorMessage && (
                      <div className="mt-2 p-2 rounded bg-red-100 border border-red-200">
                        <p className="text-sm text-red-800">
                          Error: {log.errorMessage}
                        </p>
                        {log.errorCode && (
                          <p className="text-xs text-red-600 mt-1">
                            Code: {log.errorCode}
                          </p>
                        )}
                      </div>
                    )}

                    {Object.keys(log.details).length > 0 &&
                      !log.errorMessage && (
                        <details className="mt-2">
                          <summary className="text-sm text-blue-600 cursor-pointer hover:underline">
                            View details
                          </summary>
                          <pre className="mt-2 p-2 rounded bg-muted text-xs overflow-x-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </details>
                      )}
                  </div>

                  <div className="flex-shrink-0">
                    {log.success ? (
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-600"
                      >
                        Success
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-red-600 border-red-600"
                      >
                        Failed
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
