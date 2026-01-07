import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2, TrendingUp } from "lucide-react";

const investmentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  country: z.string().min(2, "Country is required"),
  investmentType: z.enum(["scholarship", "microcredit"]),
  amount: z.number().min(100, "Minimum investment is €100"),
  commitment: z.enum(["one-time", "annual"]),
  motivation: z.string().optional(),
});

type InvestmentFormData = z.infer<typeof investmentSchema>;

export const InvestmentForm = () => {
  const [formData, setFormData] = useState<InvestmentFormData>({
    name: "",
    email: "",
    country: "",
    investmentType: "scholarship",
    amount: 500,
    commitment: "one-time",
    motivation: "",
  });
  const [customAmount, setCustomAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const presetAmounts = {
    scholarship: [100, 250, 500, 1000],
    microcredit: [100, 250, 500, 1000],
  };

  const calculateImpact = (type: "scholarship" | "microcredit", amount: number) => {
    if (type === "scholarship") {
      const scholarships = Math.floor(amount / 500);
      return {
        primary: scholarships,
        primaryLabel: scholarships === 1 ? "scholarship" : "scholarships",
        secondary: "Full year education + supplies",
      };
    } else {
      const loans = Math.floor(amount / 100);
      return {
        primary: loans,
        primaryLabel: loans === 1 ? "entrepreneur" : "entrepreneurs",
        secondary: "Local businesses funded",
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const finalAmount = customAmount ? parseFloat(customAmount) : formData.amount;
      const validatedData = investmentSchema.parse({
        ...formData,
        amount: finalAmount,
      });

      console.log("Investment submitted:", validatedData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const impact = calculateImpact(validatedData.investmentType, validatedData.amount);

      toast.success("Investment received! 📈", {
        description: `Your €${validatedData.amount} will fund ${impact.primary} ${impact.primaryLabel}. Welcome to the impact dashboard (coming soon).`,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        country: "",
        investmentType: "scholarship",
        amount: 500,
        commitment: "one-time",
        motivation: "",
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

  const impact = calculateImpact(
    formData.investmentType,
    customAmount ? parseFloat(customAmount) || 0 : formData.amount
  );

  return (
    <Card className="bg-card border-border shadow-lg">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Investment Type */}
          <div className="space-y-3">
            <Label>Investment Type</Label>
            <RadioGroup
              value={formData.investmentType}
              onValueChange={(value: "scholarship" | "microcredit") =>
                setFormData({ ...formData, investmentType: value })
              }
            >
              <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:border-accent/40 transition-colors">
                <RadioGroupItem value="scholarship" id="scholarship" />
                <Label htmlFor="scholarship" className="cursor-pointer flex-1">
                  <div className="font-semibold">Scholarship Fund</div>
                  <div className="text-xs text-muted-foreground">Direct investment in education</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:border-primary/40 transition-colors">
                <RadioGroupItem value="microcredit" id="microcredit" />
                <Label htmlFor="microcredit" className="cursor-pointer flex-1">
                  <div className="font-semibold">Microcredit Program</div>
                  <div className="text-xs text-muted-foreground">Small loans for entrepreneurs</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Amount Selection */}
          <div className="space-y-3">
            <Label>Amount</Label>
            <div className="grid grid-cols-4 gap-2">
              {presetAmounts[formData.investmentType].map((amount) => (
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
                      ? "bg-accent/20 border-accent/40"
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
                min="100"
                step="50"
              />
            </div>
          </div>

          {/* Commitment Type */}
          <div className="space-y-3">
            <Label>Investment Terms</Label>
            <RadioGroup
              value={formData.commitment}
              onValueChange={(value: "one-time" | "annual") =>
                setFormData({ ...formData, commitment: value })
              }
            >
              <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:border-primary/40 transition-colors">
                <RadioGroupItem value="one-time" id="one-time" />
                <Label htmlFor="one-time" className="cursor-pointer flex-1">
                  One-Time Investment
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:border-accent/40 transition-colors">
                <RadioGroupItem value="annual" id="annual" />
                <Label htmlFor="annual" className="cursor-pointer flex-1">
                  Annual Commitment
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Impact Visualization */}
          <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              <span className="font-semibold text-sm">PROJECTED IMPACT</span>
            </div>
            <p className="text-sm text-muted-foreground">
              €{customAmount || formData.amount} = {impact.primary} {impact.primaryLabel}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{impact.secondary}</p>
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
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Your country"
                required
              />
            </div>

            <div>
              <Label htmlFor="motivation">Why are you investing? (Optional)</Label>
              <Textarea
                id="motivation"
                value={formData.motivation}
                onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                placeholder="Share your motivation..."
                rows={3}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-accent to-primary hover:opacity-90 text-primary-foreground"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "INFUSE IMPACT"
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Investment tracking dashboard and secure payment processing coming soon.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
