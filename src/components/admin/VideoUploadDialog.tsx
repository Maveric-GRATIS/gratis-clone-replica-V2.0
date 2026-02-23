/**
 * Video Upload Dialog Component
 *
 * Admin interface for uploading videos to Mux
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Video,
  CheckCircle,
  XCircle,
  Loader2,
  FileVideo,
} from "lucide-react";
import { toast } from "sonner";
import {
  createDirectUpload,
  uploadVideoFile,
  getMuxAsset,
} from "@/lib/mux/api";
import { VIDEO_CATEGORIES } from "@/lib/mux/config";
import type { CreateVideoInput, VideoCategory } from "@/types/video";
import { db } from "@/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

interface VideoUploadDialogProps {
  onSuccess?: () => void;
}

type UploadStep = "form" | "uploading" | "processing" | "complete" | "error";

export function VideoUploadDialog({ onSuccess }: VideoUploadDialogProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<UploadStep>("form");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState<string>();

  // Form state
  const [file, setFile] = useState<File>();
  const [formData, setFormData] = useState<CreateVideoInput>({
    title: "",
    description: "",
    category: "impact_stories" as VideoCategory,
    tags: [],
    accessLevel: "public",
    featured: false,
  });
  const [tagInput, setTagInput] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith("video/")) {
        toast.error("Please select a valid video file");
        return;
      }

      // Validate file size (max 5GB)
      if (selectedFile.size > 5 * 1024 * 1024 * 1024) {
        toast.error("File size must be less than 5GB");
        return;
      }

      setFile(selectedFile);

      // Auto-fill title from filename if empty
      if (!formData.title) {
        const filename = selectedFile.name.replace(/\.[^/.]+$/, "");
        setFormData({ ...formData, title: filename });
      }
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    try {
      setStep("uploading");
      setError(undefined);

      // Step 1: Create direct upload URL
      const uploadData = await createDirectUpload(formData);

      // Step 2: Upload video file
      await uploadVideoFile(file, uploadData.uploadUrl, (progress) => {
        setUploadProgress(progress);
      });

      setStep("processing");

      // Step 3: Poll Mux asset status
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes max
      let assetReady = false;

      while (attempts < maxAttempts && !assetReady) {
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5s

        try {
          const asset = await getMuxAsset(uploadData.assetId);

          // Update processing progress
          const progress = Math.min((attempts / maxAttempts) * 100, 95);
          setProcessingProgress(progress);

          if (asset.status === "ready") {
            assetReady = true;
            setProcessingProgress(100);

            // Step 4: Save to Firestore
            await addDoc(collection(db, "videos"), {
              title: formData.title,
              slug: formData.title.toLowerCase().replace(/\s+/g, "-"),
              description: formData.description,
              muxAssetId: uploadData.assetId,
              muxPlaybackId: asset.playback_ids?.[0]?.id || "",
              category: formData.category,
              tags: formData.tags,
              duration: asset.duration || 0,
              thumbnailUrl: `https://image.mux.com/${asset.playback_ids?.[0]?.id}/thumbnail.jpg`,
              accessLevel: formData.accessLevel,
              requiredTier: formData.requiredTier,
              status: "ready",
              viewCount: 0,
              likeCount: 0,
              authorId: user.uid,
              authorName: user.displayName || user.email || "Unknown",
              featured: formData.featured,
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now(),
            });

            setStep("complete");
            toast.success("Video uploaded successfully!");
            onSuccess?.();
          } else if (asset.status === "errored") {
            throw new Error("Video processing failed");
          }
        } catch (err) {
          console.error("Error checking asset status:", err);
        }

        attempts++;
      }

      if (!assetReady) {
        throw new Error("Video processing timeout");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Upload failed");
      setStep("error");
      toast.error("Failed to upload video");
    }
  };

  const resetForm = () => {
    setStep("form");
    setFile(undefined);
    setFormData({
      title: "",
      description: "",
      category: "impact_stories" as VideoCategory,
      tags: [],
      accessLevel: "public",
      featured: false,
    });
    setTagInput("");
    setUploadProgress(0);
    setProcessingProgress(0);
    setError(undefined);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) setTimeout(resetForm, 300);
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Video
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Video</DialogTitle>
          <DialogDescription>
            Upload a video to ImpactTV powered by Mux
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="video-file">Video File</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="video-file"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  {file && (
                    <Badge variant="secondary" className="gap-2">
                      <FileVideo className="h-3 w-3" />
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Supports MP4, MOV, AVI, WebM. Max 5GB.
                </p>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter video title"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your video"
                  rows={4}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      category: value as VideoCategory,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(VIDEO_CATEGORIES).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add a tag"
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-2">
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Access Level */}
              <div className="space-y-2">
                <Label htmlFor="access">Access Level</Label>
                <Select
                  value={formData.accessLevel}
                  onValueChange={(
                    value: "public" | "members_only" | "tier_specific",
                  ) => setFormData({ ...formData, accessLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="members_only">Members Only</SelectItem>
                    <SelectItem value="tier_specific">Tier Specific</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.accessLevel === "tier_specific" && (
                <div className="space-y-2">
                  <Label htmlFor="tier">Required Tier</Label>
                  <Select
                    value={formData.requiredTier}
                    onValueChange={(value: "insider" | "core" | "founder") =>
                      setFormData({ ...formData, requiredTier: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="insider">Insider</SelectItem>
                      <SelectItem value="core">Core</SelectItem>
                      <SelectItem value="founder">Founder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!file || !formData.title}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload Video
                </Button>
              </div>
            </motion.div>
          )}

          {step === "uploading" && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 space-y-6"
            >
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Upload className="h-12 w-12 text-hot-lime" />
                </motion.div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Uploading Video</h3>
                  <p className="text-sm text-muted-foreground">
                    {uploadProgress.toFixed(0)}% complete
                  </p>
                </div>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </motion.div>
          )}

          {step === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 space-y-6"
            >
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Video className="h-12 w-12 text-electric-blue" />
                </motion.div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Processing Video</h3>
                  <p className="text-sm text-muted-foreground">
                    Mux is optimizing your video for streaming
                  </p>
                </div>
              </div>
              <Progress value={processingProgress} className="w-full" />
            </motion.div>
          )}

          {step === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center space-y-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              </motion.div>
              <div>
                <h3 className="text-lg font-semibold">Upload Complete!</h3>
                <p className="text-sm text-muted-foreground">
                  Your video has been uploaded and is ready to publish
                </p>
              </div>
              <Button onClick={() => setOpen(false)} className="mt-4">
                Done
              </Button>
            </motion.div>
          )}

          {step === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center space-y-4"
            >
              <XCircle className="h-16 w-16 text-red-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">Upload Failed</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={resetForm}>Try Again</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
