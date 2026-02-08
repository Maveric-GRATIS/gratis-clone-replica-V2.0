// ============================================================================
// GRATIS.NGO — File Manager Page (Section 80)
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
  Database,
  File,
  Folder,
  Upload,
  RefreshCw,
  HardDrive,
} from "lucide-react";
import { Link } from "react-router-dom";
import { StoredFile, FileQuota } from "@/types/file-management";

export default function FileManagerPage() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [quota, setQuota] = useState<FileQuota | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [filesRes, quotaRes] = await Promise.all([
        fetch("/api/files"),
        fetch("/api/files?action=quota&userId=user123"),
      ]);

      const filesData = await filesRes.json();
      const quotaData = await quotaRes.json();

      setFiles(filesData.files || []);
      setQuota(quotaData.quota || null);
    } catch (error) {
      console.error("Error loading files:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pt-24">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Database className="w-8 h-8 text-green-600" />
              File Manager
            </h1>
            <p className="text-gray-600 mt-1">
              Manage uploaded files and storage
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadData} variant="outline" size="sm">
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

        {/* Storage Quota */}
        {quota && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="w-5 h-5" />
                Storage Quota
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Space Used</span>
                  <span className="font-semibold">
                    {quota.usedFormatted} / {quota.limitFormatted}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all"
                    style={{ width: `${quota.percentUsed}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>
                    {quota.fileCount} / {quota.fileCountLimit} files
                  </span>
                  <span>{quota.percentUsed}% used</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Files List */}
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
            <CardDescription>Recent files in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <p className="mt-2 text-sm text-gray-600">Loading files...</p>
              </div>
            ) : files.length > 0 ? (
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <File className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-medium">{file.name}</div>
                        <div className="text-sm text-gray-600">
                          {formatFileSize(file.size)} • {file.mimeType}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {file.folder && (
                        <Badge variant="outline">
                          <Folder className="w-3 h-3 mr-1" />
                          {file.folder}
                        </Badge>
                      )}
                      <Badge
                        variant={
                          file.status === "ready" ? "default" : "secondary"
                        }
                      >
                        {file.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">
                <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No files uploaded yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
