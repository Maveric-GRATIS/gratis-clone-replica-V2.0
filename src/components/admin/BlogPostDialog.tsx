import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface BlogPost {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  author_id: string;
  imageUrl?: string;
  published: boolean;
  featured: boolean;
}

interface BlogPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post?: BlogPost | null;
}

const CATEGORIES = [
  "Impact Story",
  "Partner Spotlight",
  "Community Update",
  "Event Recap",
  "Donation Impact",
  "Volunteer Story",
  "News",
];

export function BlogPostDialog({ open, onOpenChange, post }: BlogPostDialogProps) {
  const queryClient = useQueryClient();
  const isEdit = !!post;

  const [formData, setFormData] = useState({
    title: post?.title || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    category: post?.category || "Impact Story",
    tags: post?.tags?.join(", ") || "",
    author: post?.author || "",
    imageUrl: post?.imageUrl || "/lovable-uploads/blog-placeholder.jpg",
    published: post?.published ?? false,
    featured: post?.featured ?? false,
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const postsCollection = collection(db, "blog_posts");

      await addDoc(postsCollection, {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        tags: data.tags.split(",").map(t => t.trim()).filter(Boolean),
        author: data.author || "Admin",
        author_id: "admin",
        imageUrl: data.imageUrl,
        published: data.published,
        featured: data.featured,
        views_count: 0,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        published_at: data.published ? serverTimestamp() : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast.success("Blog post created successfully");
      onOpenChange(false);
      resetForm();
    },
    onError: () => {
      toast.error("Failed to create blog post");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!post?.id) return;

      const postRef = doc(db, "blog_posts", post.id);
      await updateDoc(postRef, {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        tags: data.tags.split(",").map(t => t.trim()).filter(Boolean),
        author: data.author,
        imageUrl: data.imageUrl,
        published: data.published,
        featured: data.featured,
        updated_at: serverTimestamp(),
        published_at: data.published && !post.published ? serverTimestamp() : post.published ? undefined : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast.success("Blog post updated successfully");
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to update blog post");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.excerpt || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isEdit) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "Impact Story",
      tags: "",
      author: "",
      imageUrl: "/lovable-uploads/blog-placeholder.jpg",
      published: false,
      featured: false,
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !createMutation.isPending && !updateMutation.isPending) {
      onOpenChange(false);
      if (!isEdit) {
        resetForm();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Blog Post" : "Create New Blog Post"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the blog post details"
              : "Add a new blog post to share impact stories"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter post title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt *</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief summary (shown in post cards)"
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Full post content (supports markdown)"
              rows={10}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Author name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g. clean water, education, impact"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="/lovable-uploads/..."
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, published: checked })
                }
              />
              <Label htmlFor="published">Published</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, featured: checked })
                }
              />
              <Label htmlFor="featured">Featured</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEdit ? "Updating..." : "Creating..."}
                </>
              ) : isEdit ? (
                "Update Post"
              ) : (
                "Create Post"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
