// ============================================================================
// GRATIS.NGO — Bulk Operations Page (Section 82)
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
import { Layers, Clock, CheckCircle, RefreshCw, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { BulkOperation, BULK_OPERATION_CONFIGS } from "@/types/bulk-operations";

export default function BulkOperationsPage() {
  const [operations, setOperations] = useState<BulkOperation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOperations();
  }, []);

  const loadOperations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bulk");
      const data = await res.json();
      setOperations(data.operations || []);
    } catch (error) {
      console.error("Error loading bulk operations:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      completed: "default",
      failed: "destructive",
      pending: "secondary",
      processing: "secondary",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pt-24">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Layers className="w-8 h-8 text-orange-600" />
              Bulk Operations
            </h1>
            <p className="text-gray-600 mt-1">
              Perform actions on multiple records at once
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadOperations} variant="outline" size="sm">
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

        {/* Operation Types */}
        <Card>
          <CardHeader>
            <CardTitle>Available Operations</CardTitle>
            <CardDescription>10 different bulk operation types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {Object.values(BULK_OPERATION_CONFIGS).map((config) => (
                <div
                  key={config.type}
                  className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="text-2xl mb-2">{config.icon}</div>
                  <div className="font-medium text-sm">{config.label}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Max: {config.maxTargets.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Operations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Operations</CardTitle>
            <CardDescription>
              History of bulk operations performed
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <p className="mt-2 text-sm text-gray-600">
                  Loading operations...
                </p>
              </div>
            ) : operations.length > 0 ? (
              <div className="space-y-3">
                {operations.map((op) => (
                  <div
                    key={op.id}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {BULK_OPERATION_CONFIGS[op.type].icon}
                        </div>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {BULK_OPERATION_CONFIGS[op.type].label}
                            <Badge variant="outline">{op.entityType}</Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            {op.targetIds.length} records •{" "}
                            {new Date(op.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(op.status)}
                        {op.undoAvailable && (
                          <Badge variant="outline">
                            <Clock className="w-3 h-3 mr-1" />
                            Undo
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Progress */}
                    {op.status === "processing" && (
                      <div className="mb-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-600 h-2 rounded-full transition-all"
                            style={{ width: `${op.progress.percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                          <span>
                            {op.progress.processed} / {op.progress.total}
                          </span>
                          <span>{op.progress.percentage}%</span>
                        </div>
                      </div>
                    )}

                    {/* Results */}
                    {op.status === "completed" && (
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>{op.results.affectedCount} succeeded</span>
                        </div>
                        {op.results.failedIds.length > 0 && (
                          <div className="text-red-600">
                            {op.results.failedIds.length} failed
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No bulk operations yet</p>
                <p className="text-sm mt-1">
                  Use the test page to create operations
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
