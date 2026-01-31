/**
 * VideoUpload Component
 *
 * Admin interface for uploading videos to Mux
 */

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import {
  VIDEO_CATEGORIES,
  VideoCategory,
  VideoAccessLevel,
} from "@/lib/mux/config";
import { CreateVideoInput, VideoUploadProgress } from "@/types/video";

export function VideoUpload() {
  const [uploadProgress, setUploadProgress] =
    useState<VideoUploadProgress | null>(null);
  const [formData, setFormData] = useState<CreateVideoInput>({
    title: "",
    description: "",
    category: "impact_stories",
    tags: [],
    accessLevel: "public",
    featured: false,
  });
  const [tagInput, setTagInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("video/")) {
        alert("Please select a video file");
        return;
      }

      // Check file size (max 5GB for example)
      const maxSize = 5 * 1024 * 1024 * 1024; // 5GB
      if (file.size > maxSize) {
        alert("File is too large. Maximum size is 5GB");
        return;
      }

      setSelectedFile(file);
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

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    if (!formData.title || !formData.description) {
      alert("Please fill in title and description");
      return;
    }

    // Initialize upload progress
    const videoId = `video_${Date.now()}`;
    setUploadProgress({
      videoId,
      uploadProgress: 0,
      processingProgress: 0,
      status: "uploading",
    });

    try {
      // In production: Upload to Mux via Firebase Function
      // 1. Create Mux upload URL
      // 2. Upload file to Mux
      // 3. Create video document in Firestore
      // 4. Wait for Mux processing

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setUploadProgress((prev) =>
          prev
            ? {
                ...prev,
                uploadProgress: i,
              }
            : null,
        );
      }

      // Simulate processing
      setUploadProgress((prev) =>
        prev
          ? {
              ...prev,
              status: "processing",
            }
          : null,
      );

      for (let i = 0; i <= 100; i += 20) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setUploadProgress((prev) =>
          prev
            ? {
                ...prev,
                processingProgress: i,
              }
            : null,
        );
      }

      // Complete
      setUploadProgress((prev) =>
        prev
          ? {
              ...prev,
              status: "complete",
            }
          : null,
      );

      // Reset form
      setTimeout(() => {
        setFormData({
          title: "",
          description: "",
          category: "impact_stories",
          tags: [],
          accessLevel: "public",
          featured: false,
        });
        setSelectedFile(null);
        setUploadProgress(null);
      }, 3000);
    } catch (error: any) {
      setUploadProgress((prev) =>
        prev
          ? {
              ...prev,
              status: "error",
              error: error.message,
            }
          : null,
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Video</CardTitle>
        <CardDescription>
          Upload a video to the GRATIS video platform powered by Mux
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="video-file">Video File *</Label>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            {selectedFile ? (
              <div className="space-y-2">
                <CheckCircle2 className="h-12 w-12 mx-auto text-success" />
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                >
                  Choose Different File
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <Label
                    htmlFor="video-file"
                    className="cursor-pointer text-primary hover:underline"
                  >
                    Click to upload
                  </Label>
                  <span className="text-muted-foreground">
                    {" "}
                    or drag and drop
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  MP4, MOV, or AVI (max 5GB)
                </p>
                <Input
                  id="video-file"
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            )}
          </div>
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
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Enter video description"
            rows={4}
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value: VideoCategory) =>
              setFormData({ ...formData, category: value })
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
              placeholder="Add tag"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button type="button" onClick={handleAddTag}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => handleRemoveTag(tag)}
              >
                {tag} ×
              </Badge>
            ))}
          </div>
        </div>

        {/* Access Level */}
        <div className="space-y-2">
          <Label htmlFor="access">Access Level</Label>
          <Select
            value={formData.accessLevel}
            onValueChange={(value: VideoAccessLevel) =>
              setFormData({ ...formData, accessLevel: value })
            }
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

          {formData.accessLevel === "tier_specific" && (
            <Select
              value={formData.requiredTier}
              onValueChange={(value) =>
                setFormData({ ...formData, requiredTier: value as any })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select required tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="insider">Insider</SelectItem>
                <SelectItem value="core">Core</SelectItem>
                <SelectItem value="founder">Founder</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Featured */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, featured: checked as boolean })
            }
          />
          <Label htmlFor="featured" className="cursor-pointer">
            Feature this video on the homepage
          </Label>
        </div>

        {/* Upload Progress */}
        {uploadProgress && (
          <Card className="bg-muted">
            <CardContent className="pt-6 space-y-4">
              {uploadProgress.status === "uploading" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress.uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress.uploadProgress} />
                </div>
              )}

              {uploadProgress.status === "processing" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Processing video...</span>
                  </div>
                  <Progress value={uploadProgress.processingProgress} />
                </div>
              )}

              {uploadProgress.status === "complete" && (
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Upload complete!</span>
                </div>
              )}

              {uploadProgress.status === "error" && (
                <div className="flex items-center gap-2 text-destructive">
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">
                    {uploadProgress.error || "Upload failed"}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleUpload}
          disabled={
            !selectedFile ||
            !formData.title ||
            !formData.description ||
            !!uploadProgress
          }
          className="w-full"
        >
          {uploadProgress ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Video
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
