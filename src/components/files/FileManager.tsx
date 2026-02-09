// ============================================================================
// GRATIS.NGO — File Manager Component with Grid/List View
// ============================================================================

import React, { useState, useEffect } from "react";
import {
  Grid,
  List,
  Search,
  Folder,
  Download,
  Trash2,
  Eye,
  MoreHorizontal,
  HardDrive,
  RefreshCw,
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  Archive,
} from "lucide-react";
import {
  StoredFile,
  FileQuota,
  FolderStructure,
} from "@/types/file-management";
import FileUploader from "./FileUploader";

interface FileManagerProps {
  userId: string;
  userName: string;
  userEmail: string;
}

type ViewMode = "grid" | "list";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/"))
    return <ImageIcon className="w-6 h-6 text-blue-400" />;
  if (mimeType.startsWith("video/"))
    return <Film className="w-6 h-6 text-purple-400" />;
  if (mimeType.startsWith("audio/"))
    return <Music className="w-6 h-6 text-pink-400" />;
  if (mimeType.includes("zip") || mimeType.includes("archive"))
    return <Archive className="w-6 h-6 text-yellow-400" />;
  return <FileText className="w-6 h-6 text-gray-400" />;
}

export default function FileManager({
  userId,
  userName,
  userEmail,
}: FileManagerProps) {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [quota, setQuota] = useState<FileQuota | null>(null);
  const [folders, setFolders] = useState<FolderStructure[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | undefined>();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [showUploader, setShowUploader] = useState(false);

  useEffect(() => {
    loadFiles();
    loadQuota();
    loadFolders();
  }, [currentFolder]);

  async function loadFiles() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ userId });
      if (currentFolder) params.set("folder", currentFolder);
      const res = await fetch(`/api/files?${params}`);
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error("Failed to load files:", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadQuota() {
    const res = await fetch(`/api/files?action=quota&userId=${userId}`);
    const data = await res.json();
    setQuota(data.quota);
  }

  async function loadFolders() {
    const res = await fetch(`/api/files?action=folders&userId=${userId}`);
    const data = await res.json();
    setFolders(data.folders || []);
  }

  async function handleDelete(fileId: string) {
    if (!confirm("Delete this file?")) return;
    await fetch("/api/files", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileId }),
    });
    loadFiles();
    loadQuota();
  }

  const filteredFiles = files.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.originalName.toLowerCase().includes(search.toLowerCase()) ||
      f.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase())),
  );

  const toggleSelect = (id: string) => {
    setSelectedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header: Quota + Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">File Manager</h2>
          {quota && (
            <div className="flex items-center gap-2 mt-1">
              <HardDrive className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">
                {quota.usedFormatted} / {quota.limitFormatted} (
                {quota.percentUsed}%)
              </span>
              <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    quota.percentUsed > 90
                      ? "bg-red-500"
                      : quota.percentUsed > 70
                        ? "bg-yellow-500"
                        : "bg-emerald-500"
                  }`}
                  style={{ width: `${quota.percentUsed}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUploader(!showUploader)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition"
          >
            Upload Files
          </button>
          <button
            onClick={loadFiles}
            className="p-2 text-gray-400 hover:text-white border border-gray-600 rounded-lg"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Upload Area (collapsible) */}
      {showUploader && (
        <FileUploader
          userId={userId}
          userName={userName}
          userEmail={userEmail}
          folder={currentFolder}
          onUploadComplete={() => {
            loadFiles();
            loadQuota();
          }}
        />
      )}

      {/* Search + View Toggle */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="flex border border-gray-600 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 ${viewMode === "grid" ? "bg-gray-600 text-white" : "text-gray-400 hover:text-white"}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 ${viewMode === "list" ? "bg-gray-600 text-white" : "text-gray-400 hover:text-white"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Folder Breadcrumb */}
      <div className="flex items-center gap-1 text-sm">
        <button
          onClick={() => setCurrentFolder(undefined)}
          className="text-emerald-400 hover:underline"
        >
          All Files
        </button>
        {currentFolder && (
          <>
            <span className="text-gray-500">/</span>
            <span className="text-white">{currentFolder}</span>
          </>
        )}
      </div>

      {/* Folders */}
      {!currentFolder && folders.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {folders.map((folder) => (
            <button
              key={folder.path}
              onClick={() => setCurrentFolder(folder.path)}
              className="flex items-center gap-3 p-3 bg-gray-800/60 border border-gray-700 rounded-lg hover:border-gray-500 transition text-left"
            >
              <Folder className="w-8 h-8 text-yellow-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white font-medium truncate">
                  {folder.name}
                </p>
                <p className="text-xs text-gray-400">
                  {folder.fileCount} files • {formatBytes(folder.totalSize)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Files Grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className={`group relative bg-gray-800/60 border rounded-lg overflow-hidden transition ${
                selectedFiles.has(file.id)
                  ? "border-emerald-500"
                  : "border-gray-700 hover:border-gray-500"
              }`}
            >
              <div
                className="aspect-square flex items-center justify-center bg-gray-900/50 cursor-pointer"
                onClick={() => toggleSelect(file.id)}
              >
                {file.mimeType.startsWith("image/") ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    {getFileIcon(file.mimeType)}
                    <p className="text-xs text-gray-400 mt-2">
                      {file.extension.toUpperCase()}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-3">
                <p className="text-sm text-white font-medium truncate">
                  {file.originalName}
                </p>
                <p className="text-xs text-gray-400">
                  {formatBytes(file.size)}
                </p>
              </div>

              {/* Actions */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-1">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 bg-gray-900/80 rounded hover:bg-gray-700"
                >
                  <Eye className="w-4 h-4 text-white" />
                </a>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="p-1.5 bg-gray-900/80 rounded hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Files List */
        <div className="space-y-2">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className={`flex items-center gap-4 p-4 bg-gray-800/60 border rounded-lg hover:border-gray-500 transition ${
                selectedFiles.has(file.id)
                  ? "border-emerald-500"
                  : "border-gray-700"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedFiles.has(file.id)}
                onChange={() => toggleSelect(file.id)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-emerald-600"
              />

              {getFileIcon(file.mimeType)}

              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">
                  {file.originalName}
                </p>
                <p className="text-xs text-gray-400">
                  {formatBytes(file.size)} •{" "}
                  {new Date(file.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <Eye className="w-4 h-4" />
                </a>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="p-2 text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && <p className="text-center text-gray-400">Loading files...</p>}
      {!loading && filteredFiles.length === 0 && (
        <p className="text-center text-gray-400 py-12">No files found</p>
      )}
    </div>
  );
}
