import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PartnershipApplicationWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PartnershipApplicationWizard({ open, onOpenChange }: PartnershipApplicationWizardProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Partnership Application</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Application flow can be connected here.
        </p>
      </DialogContent>
    </Dialog>
  );
}
