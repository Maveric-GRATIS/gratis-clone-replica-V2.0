// src/pages/admin/DataExportManager.tsx
// Admin page for managing data exports

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Download,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Loader,
} from "lucide-react";
import { useExport } from "@/hooks/useExport";
import { toast } from "sonner";
import type { ExportScope, ExportFormat } from "@/types/export";

const EXPORT_SCOPES: { value: ExportScope; label: string }[] = [
  { value: "donations", label: "Donations" },
  { value: "users", label: "Users" },
  { value: "projects", label: "Projects" },
  { value: "events", label: "Events" },
  { value: "bottles", label: "Bottle Submissions" },
  { value: "partners", label: "Partners" },
  { value: "subscriptions", label: "Subscriptions" },
  { value: "audit_logs", label: "Audit Logs" },
];

const EXPORT_FORMATS: { value: ExportFormat; label: string }[] = [
  { value: "csv", label: "CSV" },
  { value: "json", label: "JSON" },
  { value: "xlsx", label: "Excel" },
  { value: "pdf", label: "PDF" },
];

export default function DataExportManager() {
  const { exports, loading, createExport, downloadExport, refresh } =
    useExport();
  const [selectedScope, setSelectedScope] = useState<ExportScope>("donations");
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("csv");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateExport = async () => {
    setIsCreating(true);
    try {
      await createExport({
        scope: selectedScope,
        format: selectedFormat,
      });
      toast.success(
        `Export created successfully. Processing ${selectedScope} data...`,
      );

      // Refresh list after a delay to show the new export
      setTimeout(() => {
        refresh();
      }, 1000);
    } catch (error) {
      console.error("Failed to create export:", error);
      toast.error("Failed to create export. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDownload = async (exp: any) => {
    try {
      await downloadExport(exp);
      toast.success("Download started");
    } catch (error) {
      console.error("Failed to download export:", error);
      toast.error("Failed to download export");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "processing":
      case "pending":
        return <Loader className="w-5 h-5 text-blue-600 animate-spin" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <AdminLayout>
      <div className="pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Data Export Manager
            </h1>
            <p className="text-muted-foreground">
              Export data in various formats for reporting and analysis
            </p>
          </div>

          {/* Create Export Form */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Create New Export
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Data Scope
                </label>
                <select
                  value={selectedScope}
                  onChange={(e) =>
                    setSelectedScope(e.target.value as ExportScope)
                  }
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-foreground"
                >
                  {EXPORT_SCOPES.map((scope) => (
                    <option key={scope.value} value={scope.value}>
                      {scope.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Format
                </label>
                <select
                  value={selectedFormat}
                  onChange={(e) =>
                    setSelectedFormat(e.target.value as ExportFormat)
                  }
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-foreground"
                >
                  {EXPORT_FORMATS.map((format) => (
                    <option key={format.value} value={format.value}>
                      {format.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleCreateExport}
                  disabled={isCreating}
                  className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {isCreating ? "Creating..." : "Create Export"}
                </button>
              </div>
            </div>
          </div>

          {/* Recent Exports */}
          <div className="bg-card rounded-lg shadow-sm border border-border">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">
                Recent Exports
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Scope
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Format
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Records
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-4 text-center text-muted-foreground"
                      >
                        Loading exports...
                      </td>
                    </tr>
                  ) : exports.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-4 text-center text-muted-foreground"
                      >
                        No exports yet. Create your first export above.
                      </td>
                    </tr>
                  ) : (
                    exports.map((exp) => (
                      <tr key={exp.id} className="hover:bg-muted/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground capitalize">
                              {exp.scope.replace("_", " ")}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground uppercase">
                            {exp.format}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(exp.status)}
                            <span className="text-sm text-muted-foreground capitalize">
                              {exp.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {exp.rowCount?.toLocaleString() || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {exp.fileSize ? formatFileSize(exp.fileSize) : "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(exp.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {exp.status === "completed" && exp.fileUrl && (
                            <button
                              onClick={() => handleDownload(exp)}
                              className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
