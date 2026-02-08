// ============================================================================
// GRATIS.NGO — Data Import Page (Section 81)
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
  Import,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ImportJob } from "@/types/data-import";

export default function DataImportPage() {
  const [jobs, setJobs] = useState<ImportJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/import");
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Error loading import jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "pending":
      case "importing":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      completed: "default",
      failed: "destructive",
      pending: "secondary",
      importing: "secondary",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pt-24">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Import className="w-8 h-8 text-purple-600" />
              Data Import
            </h1>
            <p className="text-gray-600 mt-1">
              Import contacts, donations, and other data from CSV/JSON
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadJobs} variant="outline" size="sm">
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

        {/* Import Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Import Jobs</CardTitle>
            <CardDescription>
              Track the status of your data imports
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <p className="mt-2 text-sm text-gray-600">
                  Loading import jobs...
                </p>
              </div>
            ) : jobs.length > 0 ? (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(job.status)}
                        <div>
                          <div className="font-medium">{job.fileName}</div>
                          <div className="text-sm text-gray-600">
                            {job.entityType} • {job.format.toUpperCase()}
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(job.status)}
                    </div>

                    {/* Progress Bar */}
                    {job.status === "importing" && (
                      <div className="mb-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full transition-all"
                            style={{ width: `${job.progress.percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                          <span>
                            {job.progress.processedRows} /{" "}
                            {job.progress.totalRows}
                          </span>
                          <span>{job.progress.percentage}%</span>
                        </div>
                      </div>
                    )}

                    {/* Results Summary */}
                    {job.status === "completed" && (
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="bg-white rounded p-2">
                          <div className="text-lg font-bold text-green-600">
                            {job.results.created}
                          </div>
                          <div className="text-xs text-gray-600">Created</div>
                        </div>
                        <div className="bg-white rounded p-2">
                          <div className="text-lg font-bold text-blue-600">
                            {job.results.updated}
                          </div>
                          <div className="text-xs text-gray-600">Updated</div>
                        </div>
                        <div className="bg-white rounded p-2">
                          <div className="text-lg font-bold text-yellow-600">
                            {job.results.skipped}
                          </div>
                          <div className="text-xs text-gray-600">Skipped</div>
                        </div>
                        <div className="bg-white rounded p-2">
                          <div className="text-lg font-bold text-red-600">
                            {job.results.failed}
                          </div>
                          <div className="text-xs text-gray-600">Failed</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">
                <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No import jobs yet</p>
                <p className="text-sm mt-1">
                  Use the test page to start an import
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
