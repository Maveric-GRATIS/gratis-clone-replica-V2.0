import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  published_date: string;
}

interface NewsModalProps {
  item: NewsItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewsModal({ item, open, onOpenChange }: NewsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item?.title ?? "News"}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{item?.excerpt ?? item?.content ?? "No content available."}</p>
      </DialogContent>
    </Dialog>
  );
}
