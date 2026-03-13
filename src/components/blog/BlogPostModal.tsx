import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DbBlogPost } from "@/hooks/useBlogPosts";

interface BlogPostModalProps {
  post: DbBlogPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BlogPostModal({
  post,
  open,
  onOpenChange,
}: BlogPostModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{post?.title ?? "Blog Post"}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {post?.excerpt ?? "No content available."}
        </p>
      </DialogContent>
    </Dialog>
  );
}
