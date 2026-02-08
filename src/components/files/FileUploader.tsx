// ============================================================================
// GRATIS.NGO — File Uploader Component (Drag & Drop)
// ============================================================================

import React, { useState, useRef } from "react";
import { Upload, X, Check, AlertCircle } from "lucide-react";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZES } from "@/types/file-management";

interface FileUploaderProps {
  userId: string;
  userName: string;
  userEmail: string;
  folder?: string;
  onUploadComplete?: () => void;
}

interface UploadProgress {
  fileId: string;
  fileName: string;
  totalBytes: number;
  uploadedBytes: number;
  percentage: number;
  status: "uploading" | "complete" | "error";
  error?: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function FileUploader({
  userId,
  userName,
  userEmail,
  folder,
  onUploadComplete,
}: FileUploaderProps) {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const newUploads: UploadProgress[] = fileArray.map((file) => ({
      fileId: `upload_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      fileName: file.name,
      totalBytes: file.size,
      uploadedBytes: 0,
      percentage: 0,
      status: "uploading" as const,
    }));

    setUploads((prev) => [...prev, ...newUploads]);

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const upload = newUploads[i];

      try {
        await uploadFile(file, upload);
      } catch (error: any) {
        setUploads((prev) =>
          prev.map((u) =>
            u.fileId === upload.fileId
              ? { ...u, status: "error", error: error.message }
              : u,
          ),
        );
      }
    }

    if (onUploadComplete) onUploadComplete();
  };

  const uploadFile = async (
    file: File,
    upload: UploadProgress,
  ): Promise<void> => {
    // Validate file type
    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    const mimeType = file.type;
    const allowedTypes = Object.values(ALLOWED_FILE_TYPES).flat();

    if (
      !allowedTypes.includes(mimeType) &&
      !allowedTypes.includes(`.${extension}`)
    ) {
      throw new Error("File type not allowed");
    }

    // Validate size
    const category = Object.keys(ALLOWED_FILE_TYPES).find((key) =>
      ALLOWED_FILE_TYPES[key as keyof typeof ALLOWED_FILE_TYPES].includes(
        mimeType,
      ),
    ) as keyof typeof MAX_FILE_SIZES | undefined;

    const maxSize = category ? MAX_FILE_SIZES[category] : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error(`File too large. Max: ${formatBytes(maxSize)}`);
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    formData.append("userName", userName);
    formData.append("userEmail", userEmail);
    if (folder) formData.append("folder", folder);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const percentage = Math.round((e.loaded / e.total) * 100);
        setUploads((prev) =>
          prev.map((u) =>
            u.fileId === upload.fileId
              ? { ...u, uploadedBytes: e.loaded, percentage }
              : u,
          ),
        );
      }
    });

    return new Promise((resolve, reject) => {
      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          setUploads((prev) =>
            prev.map((u) =>
              u.fileId === upload.fileId
                ? { ...u, status: "complete", percentage: 100 }
                : u,
            ),
          );
          resolve();
        } else {
          reject(new Error(xhr.responseText || "Upload failed"));
        }
      });

      xhr.addEventListener("error", () => reject(new Error("Network error")));
      xhr.addEventListener("abort", () =>
        reject(new Error("Upload cancelled")),
      );

      xhr.open("POST", "/api/files/upload");
      xhr.send(formData);
    });
  };

  const removeUpload = (fileId: string) => {
    setUploads((prev) => prev.filter((u) => u.fileId !== fileId));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
          dragOver
            ? "border-emerald-500 bg-emerald-500/10"
            : "border-gray-600 bg-gray-800/40 hover:border-gray-500 hover:bg-gray-800/60"
        }`}
      >
        <Upload
          className={`w-12 h-12 mx-auto mb-4 ${dragOver ? "text-emerald-400" : "text-gray-400"}`}
        />
        <p className="text-white font-medium mb-1">
          {dragOver ? "Drop files here" : "Click to upload or drag and drop"}
        </p>
        <p className="text-sm text-gray-400">
          Images, Videos, Documents, Archives (max 50MB)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Upload Progress List */}
      {uploads.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto bg-gray-900/50 rounded-lg p-4">
          {uploads.map((upload) => (
            <div
              key={upload.fileId}
              className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{upload.fileName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        upload.status === "complete"
                          ? "bg-emerald-500"
                          : upload.status === "error"
                            ? "bg-red-500"
                            : "bg-blue-500"
                      }`}
                      style={{ width: `${upload.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-12 text-right">
                    {upload.status === "complete" ? (
                      <Check className="w-4 h-4 text-emerald-400 inline" />
                    ) : upload.status === "error" ? (
                      <AlertCircle className="w-4 h-4 text-red-400 inline" />
                    ) : (
                      `${upload.percentage}%`
                    )}
                  </span>
                </div>
                {upload.status === "error" && (
                  <p className="text-xs text-red-400 mt-0.5">{upload.error}</p>
                )}
                <p className="text-xs text-gray-500">
                  {formatBytes(upload.totalBytes)}
                </p>
              </div>
              <button
                onClick={() => removeUpload(upload.fileId)}
                className="text-gray-500 hover:text-gray-300 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
