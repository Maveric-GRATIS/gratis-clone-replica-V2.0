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
  Timestamp,
} from "firebase/firestore";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Campaign {
  id?: string;
  title: string;
  description: string;
  type: string;
  goal_amount?: number;
  current_amount?: number;
  start_date: Timestamp | { seconds: number; nanoseconds: number } | null;
  end_date: Timestamp | { seconds: number; nanoseconds: number } | null;
  active: boolean;
  featured: boolean;
  imageUrl?: string;
  cta_text?: string;
  cta_url?: string;
}

interface CampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign?: Campaign | null;
}

const CAMPAIGN_TYPES = [
  "Fundraising",
  "Awareness",
  "Volunteer Recruitment",
  "Event Promotion",
  "Product Launch",
  "Membership Drive",
];

export function CampaignDialog({ open, onOpenChange, campaign }: CampaignDialogProps) {
  const queryClient = useQueryClient();
  const isEdit = !!campaign;

  const [formData, setFormData] = useState({
    title: campaign?.title || "",
    description: campaign?.description || "",
    type: campaign?.type || "Fundraising",
    goal_amount: campaign?.goal_amount || 0,
    current_amount: campaign?.current_amount || 0,
    start_date: campaign?.start_date
      ? new Date((campaign.start_date as any).seconds * 1000)
          .toISOString()
          .slice(0, 10)
      : "",
    end_date: campaign?.end_date
      ? new Date((campaign.end_date as any).seconds * 1000)
          .toISOString()
          .slice(0, 10)
      : "",
    active: campaign?.active ?? true,
    featured: campaign?.featured ?? false,
    imageUrl: campaign?.imageUrl || "/lovable-uploads/campaign-placeholder.jpg",
    cta_text: campaign?.cta_text || "Learn More",
    cta_url: campaign?.cta_url || "",
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const campaignsCollection = collection(db, "campaigns");

      const startDate = data.start_date
        ? Timestamp.fromDate(new Date(data.start_date))
        : null;
      const endDate = data.end_date
        ? Timestamp.fromDate(new Date(data.end_date))
        : null;

      await addDoc(campaignsCollection, {
        title: data.title,
        description: data.description,
        type: data.type,
        goal_amount: Number(data.goal_amount) || 0,
        current_amount: Number(data.current_amount) || 0,
        start_date: startDate,
        end_date: endDate,
        active: data.active,
        featured: data.featured,
        imageUrl: data.imageUrl,
        cta_text: data.cta_text,
        cta_url: data.cta_url,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-campaigns"] });
      toast.success("Campaign created successfully");
      onOpenChange(false);
      resetForm();
    },
    onError: () => {
      toast.error("Failed to create campaign");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!campaign?.id) return;

      const campaignRef = doc(db, "campaigns", campaign.id);

      const startDate = data.start_date
        ? Timestamp.fromDate(new Date(data.start_date))
        : null;
      const endDate = data.end_date
        ? Timestamp.fromDate(new Date(data.end_date))
        : null;

      await updateDoc(campaignRef, {
        title: data.title,
        description: data.description,
        type: data.type,
        goal_amount: Number(data.goal_amount) || 0,
        current_amount: Number(data.current_amount) || 0,
        start_date: startDate,
        end_date: endDate,
        active: data.active,
        featured: data.featured,
        imageUrl: data.imageUrl,
        cta_text: data.cta_text,
        cta_url: data.cta_url,
        updated_at: serverTimestamp(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-campaigns"] });
      toast.success("Campaign updated successfully");
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to update campaign");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
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
      description: "",
      type: "Fundraising",
      goal_amount: 0,
      current_amount: 0,
      start_date: "",
      end_date: "",
      active: true,
      featured: false,
      imageUrl: "/lovable-uploads/campaign-placeholder.jpg",
      cta_text: "Learn More",
      cta_url: "",
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Campaign" : "Create New Campaign"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the campaign details"
              : "Create a new marketing campaign"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Campaign Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter campaign title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Campaign description"
              rows={4}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Campaign Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {CAMPAIGN_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          </div>

          {formData.type === "Fundraising" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="goal_amount">Goal Amount (€)</Label>
                <Input
                  id="goal_amount"
                  type="number"
                  value={formData.goal_amount}
                  onChange={(e) => setFormData({ ...formData, goal_amount: Number(e.target.value) })}
                  placeholder="10000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current_amount">Current Amount (€)</Label>
                <Input
                  id="current_amount"
                  type="number"
                  value={formData.current_amount}
                  onChange={(e) => setFormData({ ...formData, current_amount: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cta_text">Call-to-Action Text</Label>
              <Input
                id="cta_text"
                value={formData.cta_text}
                onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                placeholder="Learn More"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cta_url">Call-to-Action URL</Label>
              <Input
                id="cta_url"
                value={formData.cta_url}
                onChange={(e) => setFormData({ ...formData, cta_url: e.target.value })}
                placeholder="/donate"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, active: checked })
                }
              />
              <Label htmlFor="active">Active</Label>
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
                "Update Campaign"
              ) : (
                "Create Campaign"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
