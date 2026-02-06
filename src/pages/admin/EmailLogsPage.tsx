/**
 * Email Logs Dashboard
 * View and manage all transactional email logs
 */

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Search,
  Filter,
  Download,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  MousePointerClick,
} from "lucide-react";

export default function EmailLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [templateFilter, setTemplateFilter] = useState("all");

  // Mock data - replace with real Firestore queries
  const emailLogs = [
    {
      id: "1",
      to: "user@example.com",
      template: "welcome",
      subject: "Welcome to GRATIS! 🎉",
      status: "delivered",
      sentAt: "2026-02-06T10:30:00Z",
      deliveredAt: "2026-02-06T10:30:05Z",
      opens: 1,
      clicks: 2,
    },
    {
      id: "2",
      to: "member@example.com",
      template: "tribe_welcome",
      subject: "Welcome to TRIBE Insider! 🌟",
      status: "delivered",
      sentAt: "2026-02-06T09:15:00Z",
      deliveredAt: "2026-02-06T09:15:03Z",
      opens: 1,
      clicks: 0,
    },
    {
      id: "3",
      to: "donor@example.com",
      template: "donation_thank_you",
      subject: "Thank you for your generous donation! 💚",
      status: "delivered",
      sentAt: "2026-02-06T08:00:00Z",
      deliveredAt: "2026-02-06T08:00:04Z",
      opens: 2,
      clicks: 1,
    },
    {
      id: "4",
      to: "test@example.com",
      template: "password_reset",
      subject: "Reset Your Password",
      status: "bounced",
      sentAt: "2026-02-06T07:45:00Z",
      error: "Invalid email address",
      opens: 0,
      clicks: 0,
    },
    {
      id: "5",
      to: "admin@gratis.ngo",
      template: "admin_alert",
      subject: "[CRITICAL] System Alert",
      status: "delivered",
      sentAt: "2026-02-06T07:00:00Z",
      deliveredAt: "2026-02-06T07:00:02Z",
      opens: 3,
      clicks: 1,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <Badge className="bg-green-500 text-white flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Delivered
          </Badge>
        );
      case "sent":
        return (
          <Badge className="bg-blue-500 text-white flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Sent
          </Badge>
        );
      case "bounced":
        return (
          <Badge className="bg-red-500 text-white flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Bounced
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-500 text-white flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Queued
          </Badge>
        );
    }
  };

  const stats = {
    total: emailLogs.length,
    delivered: emailLogs.filter((e) => e.status === "delivered").length,
    bounced: emailLogs.filter((e) => e.status === "bounced").length,
    openRate: Math.round(
      (emailLogs.filter((e) => e.opens > 0).length / emailLogs.length) * 100
    ),
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Mail className="h-8 w-8 text-primary" />
              Email Logs
            </h1>
            <p className="text-muted-foreground mt-1">
              Track and manage all transactional emails
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Sent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Last 24 hours
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Delivered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.delivered}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((stats.delivered / stats.total) * 100)}% success rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Open Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.openRate}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Industry avg: 21%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Bounced
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.bounced}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((stats.bounced / stats.total) * 100)}% bounce rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Search and filter email logs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by email, subject..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="bounced">Bounced</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={templateFilter} onValueChange={setTemplateFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Templates</SelectItem>
                  <SelectItem value="welcome">Welcome</SelectItem>
                  <SelectItem value="tribe_welcome">TRIBE Welcome</SelectItem>
                  <SelectItem value="donation_thank_you">Donation</SelectItem>
                  <SelectItem value="password_reset">Password Reset</SelectItem>
                  <SelectItem value="admin_alert">Admin Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Email Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Emails</CardTitle>
            <CardDescription>
              Latest transactional emails sent from the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emailLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium">{log.to}</span>
                      {getStatusBadge(log.status)}
                      <Badge variant="outline" className="text-xs">
                        {log.template}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {log.subject}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>
                        Sent: {new Date(log.sentAt).toLocaleString()}
                      </span>
                      {log.deliveredAt && (
                        <span>
                          Delivered: {new Date(log.deliveredAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <span>{log.opens}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MousePointerClick className="w-4 h-4 text-muted-foreground" />
                      <span>{log.clicks}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
