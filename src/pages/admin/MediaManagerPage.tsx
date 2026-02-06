/**
 * Media Manager
 * Upload, organize and optimize media files
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Image as ImageIcon,
  Video,
  Upload,
  Search,
  Folder,
  Grid3x3,
  List,
  Download,
  Trash2,
  Edit,
} from "lucide-react";

export default function MediaManagerPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const mediaItems = [
    {
      id: "1",
      name: "hero-image.jpg",
      type: "image",
      size: "2.4 MB",
      dimensions: "1920x1080",
      url: "/lovable-uploads/sample-1.jpg",
      uploadedAt: "2026-02-06",
      folder: "Homepage",
    },
    {
      id: "2",
      name: "project-demo.mp4",
      type: "video",
      size: "15.2 MB",
      dimensions: "1280x720",
      url: "/lovable-uploads/sample-video.mp4",
      uploadedAt: "2026-02-05",
      folder: "Projects",
    },
    {
      id: "3",
      name: "tribe-bottle.png",
      type: "image",
      size: "0.8 MB",
      dimensions: "800x800",
      url: "/lovable-uploads/tribe-bottle.png",
      uploadedAt: "2026-02-04",
      folder: "TRIBE",
    },
    {
      id: "4",
      name: "event-banner.jpg",
      type: "image",
      size: "1.5 MB",
      dimensions: "1600x900",
      url: "/lovable-uploads/event-banner.jpg",
      uploadedAt: "2026-02-03",
      folder: "Events",
    },
  ];

  const folders = ["All Media", "Homepage", "Projects", "TRIBE", "Events"];
  const [selectedFolder, setSelectedFolder] = useState("All Media");

  const filteredMedia = mediaItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFolder =
      selectedFolder === "All Media" || item.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  const stats = {
    totalFiles: mediaItems.length,
    totalSize: "19.9 MB",
    images: mediaItems.filter((i) => i.type === "image").length,
    videos: mediaItems.filter((i) => i.type === "video").length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <ImageIcon className="h-8 w-8 text-primary" />
              Media Manager
            </h1>
            <p className="text-muted-foreground mt-1">
              Upload, organize and optimize your media files
            </p>
          </div>
          <Button className="gap-2">
            <Upload className="w-4 h-4" />
            Upload Media
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFiles}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Size
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSize}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.images}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Videos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.videos}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search media..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2">
                  {folders.map((folder) => (
                    <Button
                      key={folder}
                      variant={
                        selectedFolder === folder ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedFolder(folder)}
                      className="gap-2"
                    >
                      <Folder className="w-4 h-4" />
                      {folder}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media Grid */}
        {viewMode === "grid" ? (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredMedia.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-100 relative">
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  <Badge className="absolute top-2 right-2 capitalize">
                    {item.type}
                  </Badge>
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-medium truncate mb-1">{item.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {item.dimensions} • {item.size}
                  </p>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                {filteredMedia.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50"
                  >
                    <div className="flex items-center gap-3">
                      {item.type === "image" ? (
                        <ImageIcon className="w-8 h-8 text-blue-500" />
                      ) : (
                        <Video className="w-8 h-8 text-purple-500" />
                      )}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.folder} • {item.dimensions} • {item.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {filteredMedia.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No media files found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
