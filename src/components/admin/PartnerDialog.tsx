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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Partner {
  id?: string;
  organizationName: string;
  name?: string;
  email: string;
  country?: string;
  website?: string;
  description?: string;
  logo?: string;
  type?: string;
  active?: boolean;
  status: "pending" | "approved" | "rejected" | "suspended";
  tier?: "bronze" | "silver" | "gold" | "platinum";
  projectsCount?: number;
}

interface PartnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partner?: Partner | null;
}

export function PartnerDialog({
  open,
  onOpenChange,
  partner,
}: PartnerDialogProps) {
  const queryClient = useQueryClient();
  const isEdit = !!partner;

  const [formData, setFormData] = useState({
    organizationName: partner?.organizationName || partner?.name || "",
    email: partner?.email || "",
    country: partner?.country || "",
    website: partner?.website || "",
    description: partner?.description || "",
    logo: partner?.logo || "/lovable-uploads/partner-placeholder.jpg",
    type: partner?.type || "Strategic Partner",
    active: partner?.active ?? true,
    status: partner?.status || "pending",
    tier: partner?.tier || "bronze",
    projectsCount: partner?.projectsCount || 0,
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const partnersCollection = collection(db, "partners");
      await addDoc(partnersCollection, {
        ...data,
        name: data.organizationName, // For compatibility
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-partners"] });
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast.success("Partner created successfully");
      onOpenChange(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast.error("Failed to create partner: " + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!partner?.id) throw new Error("Partner ID is required");
      const partnerRef = doc(db, "partners", partner.id);
      await updateDoc(partnerRef, {
        ...data,
        name: data.organizationName, // For compatibility
        updatedAt: Timestamp.now(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-partners"] });
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast.success("Partner updated successfully");
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error("Failed to update partner: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.organizationName.trim()) {
      toast.error("Organization name is required");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
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
      organizationName: "",
      email: "",
      country: "",
      website: "",
      description: "",
      logo: "/lovable-uploads/partner-placeholder.jpg",
      type: "Strategic Partner",
      active: true,
      status: "pending",
      tier: "bronze",
      projectsCount: 0,
    });
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Partner" : "Create New Partner"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update partner information"
              : "Add a new NGO partner organization"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            {/* Organization Name */}
            <div className="space-y-2">
              <Label htmlFor="organizationName">Organization Name *</Label>
              <Input
                id="organizationName"
                value={formData.organizationName}
                onChange={(e) =>
                  setFormData({ ...formData, organizationName: e.target.value })
                }
                placeholder="e.g., Dutch Water Alliance"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="contact@organization.org"
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
                placeholder="Brief description of the organization..."
                rows={3}
              />
            </div>

            {/* Country & Website */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  placeholder="Netherlands"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  placeholder="https://organization.org"
                />
              </div>
            </div>

            {/* Type & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Partner Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Strategic Partner">
                      Strategic Partner
                    </SelectItem>
                    <SelectItem value="Funding Partner">
                      Funding Partner
                    </SelectItem>
                    <SelectItem value="Technology Partner">
                      Technology Partner
                    </SelectItem>
                    <SelectItem value="Implementation Partner">
                      Implementation Partner
                    </SelectItem>
                    <SelectItem value="Media Partner">Media Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tier */}
            <div className="space-y-2">
              <Label htmlFor="tier">Partnership Tier</Label>
              <Select
                value={formData.tier}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, tier: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bronze">Bronze</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Logo URL */}
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                value={formData.logo}
                onChange={(e) =>
                  setFormData({ ...formData, logo: e.target.value })
                }
                placeholder="/lovable-uploads/partner-logo.jpg"
              />
              {formData.logo && (
                <img
                  src={formData.logo}
                  alt="Logo preview"
                  className="h-16 w-16 object-cover rounded border"
                />
              )}
            </div>

            {/* Projects Count */}
            <div className="space-y-2">
              <Label htmlFor="projectsCount">Number of Projects</Label>
              <Input
                id="projectsCount"
                type="number"
                min="0"
                value={formData.projectsCount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    projectsCount: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            {/* Active Switch */}
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, active: checked })
                }
              />
              <Label htmlFor="active">Active Partner</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Update Partner" : "Create Partner"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
