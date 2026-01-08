import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2, Heart } from "lucide-react";

const donationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  donationType: z.enum(["one-time", "monthly"]),
  amount: z.number().min(5, "Minimum donation is €5"),
  message: z.string().optional(),
});

type DonationFormData = z.infer<typeof donationSchema>;

export const DonationForm = () => {
  const [formData, setFormData] = useState<DonationFormData>({
    name: "",
    email: "",
    donationType: "one-time",
    amount: 25,
    message: "",
  });
  const [customAmount, setCustomAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const presetAmounts = [10, 25, 50, 100];

  const calculateImpact = (amount: number) => {
    const bottles = amount * 2; // €1 = 2 bottles
    const families = Math.floor(bottles / 5); // 5 bottles per family
    return { bottles, families };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const finalAmount = customAmount ? parseFloat(customAmount) : formData.amount;
      const validatedData = donationSchema.parse({
        ...formData,
        amount: finalAmount,
      });

      console.log("Donation submitted:", validatedData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const { bottles, families } = calculateImpact(validatedData.amount);

      toast.success("Donation received! 🙏", {
        description: `Your €${validatedData.amount} will provide ${bottles} bottles to ${families} families. Impact report coming soon.`,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        donationType: "one-time",
        amount: 25,
        message: "",
      });
      setCustomAmount("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const impact = calculateImpact(customAmount ? parseFloat(customAmount) || 0 : formData.amount);

  return (
    <Card className="bg-card border-border shadow-lg">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Donation Type */}
          <div className="space-y-3">
            <Label>Donation Type</Label>
            <RadioGroup
              value={formData.donationType}
              onValueChange={(value: "one-time" | "monthly") =>
                setFormData({ ...formData, donationType: value })
              }
            >
              <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:border-primary/40 transition-colors">
                <RadioGroupItem value="one-time" id="one-time" />
                <Label htmlFor="one-time" className="cursor-pointer flex-1">
                  One-Time Donation
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:border-accent/40 transition-colors">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly" className="cursor-pointer flex-1">
                  Monthly Recurring
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Amount Selection */}
          <div className="space-y-3">
            <Label>Amount</Label>
            <div className="grid grid-cols-4 gap-2">
              {presetAmounts.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant={formData.amount === amount && !customAmount ? "default" : "outline"}
                  onClick={() => {
                    setFormData({ ...formData, amount });
                    setCustomAmount("");
                  }}
                  className={
                    formData.amount === amount && !customAmount
                      ? "bg-primary/20 border-primary/40"
                      : ""
                  }
                >
                  €{amount}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">€</span>
              <Input
                type="number"
                placeholder="Custom amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                min="5"
                step="1"
              />
            </div>
          </div>

          {/* Impact Visualization */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-primary" />
              <span className="font-semibold text-sm">YOUR IMPACT</span>
            </div>
            <p className="text-sm text-muted-foreground">
              €{customAmount || formData.amount} = {impact.bottles} bottles = {impact.families}{" "}
              families for a week
            </p>
          </div>

          {/* Personal Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Any message or dedication?"
                rows={3}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "MAKE IT COUNT"
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Secure payment processing coming soon. For now, donations are recorded for future processing.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
