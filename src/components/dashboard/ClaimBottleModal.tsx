import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  increment,
  Timestamp,
} from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Package } from "lucide-react";
import { toast } from "sonner";

interface ClaimBottleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "address" | "confirm" | "success";

export function ClaimBottleModal({ isOpen, onClose }: ClaimBottleModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("address");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [formData, setFormData] = useState({
    street: "",
    city: "",
    postalCode: "",
    country: "NL",
    saveAsDefault: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === "address") {
      setStep("confirm");
      return;
    }

    if (step === "confirm") {
      setIsSubmitting(true);
      try {
        if (!user) throw new Error("User not authenticated");

        // Create order in Firestore
        const orderRef = await addDoc(collection(db, "orders"), {
          userId: user.uid,
          productId: "gratis-water",
          productName: "GRATIS Water Bottle",
          status: "pending",
          shippingAddress: {
            street: formData.street,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
          },
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });

        // Update user's bottlesClaimed count
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          bottlesClaimed: increment(1),
          lastClaimDate: Timestamp.now(),
        });

        // Save as default address if checked
        if (formData.saveAsDefault) {
          await updateDoc(userRef, {
            defaultShippingAddress: {
              street: formData.street,
              city: formData.city,
              postalCode: formData.postalCode,
              country: formData.country,
            },
          });
        }

        setOrderId(orderRef.id);
        setStep("success");
        toast.success("Bottle claimed successfully!");
      } catch (error) {
        console.error("Error claiming bottle:", error);
        toast.error("Failed to claim bottle. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setStep("address");
    setFormData({
      street: "",
      city: "",
      postalCode: "",
      country: "NL",
      saveAsDefault: false,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {step === "address" && (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Shipping Address</DialogTitle>
              <DialogDescription>
                Where should we send your free GRATIS Water bottle?
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  required
                  value={formData.street}
                  onChange={(e) =>
                    setFormData({ ...formData, street: e.target.value })
                  }
                  placeholder="Keizersgracht 123"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="Amsterdam"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={(e) =>
                      setFormData({ ...formData, postalCode: e.target.value })
                    }
                    placeholder="1016 EE"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) =>
                    setFormData({ ...formData, country: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NL">Netherlands</SelectItem>
                    <SelectItem value="DE">Germany</SelectItem>
                    <SelectItem value="BE">Belgium</SelectItem>
                    <SelectItem value="FR">France</SelectItem>
                    <SelectItem value="US">United States</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="saveAddress"
                  checked={formData.saveAsDefault}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      saveAsDefault: checked as boolean,
                    })
                  }
                />
                <Label
                  htmlFor="saveAddress"
                  className="text-sm font-normal cursor-pointer"
                >
                  Save as default address
                </Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit">Continue</Button>
              </div>
            </form>
          </>
        )}

        {step === "confirm" && (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Your Order</DialogTitle>
              <DialogDescription>
                Review your bottle claim details
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <Package className="h-12 w-12 text-primary" />
                <div>
                  <h4 className="font-semibold">GRATIS Water Bottle</h4>
                  <p className="text-sm text-muted-foreground">
                    500ml Premium BPA-Free
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Shipping to:</h4>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p>{formData.street}</p>
                  <p>
                    {formData.postalCode} {formData.city}
                  </p>
                  <p>{formData.country}</p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Delivery estimate:</strong> 3-5 business days
                </p>
                <p className="text-sm mt-1">
                  You'll receive tracking info at your email address.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("address")}
                >
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Confirm Claim"}
                </Button>
              </div>
            </div>
          </>
        )}

        {step === "success" && (
          <>
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <DialogTitle className="text-center">
                Bottle Claimed! 🎉
              </DialogTitle>
              <DialogDescription className="text-center">
                Your free GRATIS Water bottle is on its way
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="text-sm">
                  <strong>Order ID:</strong> GRT-
                  {orderId.slice(-8).toUpperCase()}
                </p>
                <p className="text-sm">
                  <strong>Estimated delivery:</strong>{" "}
                  {new Date(
                    Date.now() + 5 * 24 * 60 * 60 * 1000,
                  ).toLocaleDateString()}
                </p>
              </div>

              <p className="text-sm text-center text-muted-foreground">
                You'll receive tracking information at your email address within
                24 hours.
              </p>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleClose}>
                  Close
                </Button>
                <Button asChild>
                  <a href="/dashboard/bottles">Track Order</a>
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
