import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash, Eye, EyeOff } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { toast } from "sonner";
import { VideoUploadDialog } from "@/components/admin/VideoUploadDialog";

interface Video {
  id: string;
  title: string;
  category: string;
  views_count: number;
  published: boolean;
  featured: boolean;
  created_at: { seconds: number; nanoseconds: number };
}

export default function AdminVideos() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: videos, isLoading } = useQuery<Video[], Error>({
    queryKey: ["admin-videos"],
    queryFn: async () => {
      const videosCollection = collection(db, "videos");
      const q = query(videosCollection, orderBy("created_at", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Video,
      );
    },
  });

  const togglePublished = useMutation({
    mutationFn: async ({
      id,
      published,
    }: {
      id: string;
      published: boolean;
    }) => {
      const videoRef = doc(db, "videos", id);
      await updateDoc(videoRef, { published: !published });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      toast.success("Video status updated");
    },
    onError: () => {
      toast.error("Failed to update video status");
    },
  });

  const deleteVideo = useMutation({
    mutationFn: async (id: string) => {
      const videoRef = doc(db, "videos", id);
      await deleteDoc(videoRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      toast.success("Video deleted");
    },
    onError: () => {
      toast.error("Failed to delete video");
    },
  });

  const filteredVideos = videos?.filter(
    (video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (video.category &&
        video.category.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Videos</h1>
            <p className="text-muted-foreground">Manage ImpactTV content</p>
          </div>
          <VideoUploadDialog
            onSuccess={() =>
              queryClient.invalidateQueries({ queryKey: ["admin-videos"] })
            }
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Video Library</CardTitle>
            <CardDescription>
              All videos across ImpactTV categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">
                Loading videos...
              </p>
            ) : filteredVideos?.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No videos found
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVideos?.map((video) => (
                    <TableRow key={video.id}>
                      <TableCell className="font-medium">
                        {video.title}
                      </TableCell>
                      <TableCell>
                        {video.category && (
                          <Badge variant="outline">{video.category}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {video.views_count?.toLocaleString() || 0}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={video.published ? "default" : "secondary"}
                        >
                          {video.published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {video.featured && (
                          <Badge variant="default">Featured</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              togglePublished.mutate({
                                id: video.id,
                                published: video.published,
                              })
                            }
                          >
                            {video.published ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteVideo.mutate(video.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
