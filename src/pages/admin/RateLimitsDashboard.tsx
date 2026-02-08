// ============================================================================
// GRATIS.NGO — Rate Limits Dashboard (Section 79)
// ============================================================================

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Activity,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { RateLimitStats } from "@/types/rate-limit";

export default function RateLimitsDashboard() {
  const [stats, setStats] = useState<RateLimitStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/rate-limits?action=stats");
      const data = await res.json();
      setStats(data.stats);
    } catch (error) {
      console.error("Error loading rate limit stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pt-24">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="w-8 h-8 text-blue-600" />
              Rate Limits Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor API rate limiting and traffic patterns
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadStats} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Link to="/part18-test">
              <Button variant="secondary" size="sm">
                Test APIs
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-sm text-gray-600">Loading stats...</p>
          </div>
        ) : stats ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalRequests.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <Activity className="w-3 h-3" />
                    All scopes combined
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Blocked Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {stats.blockedRequests.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    Rate limit violations
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Unique Keys
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.uniqueKeys.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    Active rate limit entries
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Avg Requests/Min
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.averageRequestsPerMinute}
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    Current rate
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Requests by Scope */}
            <Card>
              <CardHeader>
                <CardTitle>Requests by Scope</CardTitle>
                <CardDescription>
                  Traffic distribution across different API scopes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats.requestsByScope).map(
                    ([scope, count]) => (
                      <div
                        key={scope}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{scope}</Badge>
                          <span className="text-sm text-gray-600">
                            {count} requests
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${(count / stats.totalRequests) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-12 text-right">
                            {((count / stats.totalRequests) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Violators */}
            {stats.topViolators.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    Top Violators
                  </CardTitle>
                  <CardDescription>
                    Keys with the most rate limit violations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats.topViolators.map((violator, index) => (
                      <div
                        key={violator.key}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <code className="text-sm text-gray-700">
                            {violator.key}
                          </code>
                        </div>
                        <Badge variant="destructive">
                          {violator.violations} violations
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">No rate limit data available</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
