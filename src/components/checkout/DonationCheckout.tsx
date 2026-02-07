import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Heart, Users, Home, GraduationCap } from "lucide-react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface AllocationCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  percentage: number;
}

export default function DonationCheckout() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [amount, setAmount] = useState<string>("25");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [recurring, setRecurring] = useState<boolean>(false);
  const [interval, setInterval] = useState<"month" | "year">("month");
  const [loading, setLoading] = useState<boolean>(false);

  const [allocation, setAllocation] = useState<AllocationCategory[]>([
    {
      id: "healthcare",
      name: t("donation.categories.healthcare", "Healthcare"),
      icon: Heart,
      percentage: 40,
    },
    {
      id: "housing",
      name: t("donation.categories.housing", "Housing"),
      icon: Home,
      percentage: 30,
    },
    {
      id: "education",
      name: t("donation.categories.education", "Education"),
      icon: GraduationCap,
      percentage: 20,
    },
    {
      id: "community",
      name: t("donation.categories.community", "Community"),
      icon: Users,
      percentage: 10,
    },
  ]);

  const presetAmounts = [10, 25, 50, 100, 250];

  const handleAllocationChange = (index: number, value: number) => {
    const newAllocation = [...allocation];
    const oldValue = newAllocation[index].percentage;
    const difference = value - oldValue;

    newAllocation[index].percentage = value;

    // Distribute the difference among other categories
    const others = newAllocation.filter((_, i) => i !== index);
    const totalOthers = others.reduce((sum, cat) => sum + cat.percentage, 0);

    if (totalOthers > 0) {
      others.forEach((cat) => {
        const proportion = cat.percentage / totalOthers;
        cat.percentage = Math.max(0, cat.percentage - difference * proportion);
      });
    }

    // Normalize to ensure total is 100%
    const total = newAllocation.reduce((sum, cat) => sum + cat.percentage, 0);
    newAllocation.forEach((cat) => {
      cat.percentage = Math.round((cat.percentage / total) * 100);
    });

    setAllocation(newAllocation);
  };

  const handleCheckout = async () => {
    const donationAmount = customAmount || amount;

    if (!donationAmount || parseFloat(donationAmount) < 1) {
      toast({
        title: t("error.invalidAmount", "Invalid Amount"),
        description: t("error.minDonation", "Minimum donation is €1"),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const functions = getFunctions();
      const createCheckout = httpsCallable(functions, "createDonationCheckout");

      // Convert allocation to object
      const allocationData = allocation.reduce(
        (acc, cat) => {
          acc[cat.id] = cat.percentage;
          return acc;
        },
        {} as Record<string, number>,
      );

      const result = await createCheckout({
        amount: parseFloat(donationAmount),
        recurring,
        interval: recurring ? interval : undefined,
        allocation: allocationData,
        successUrl: `${window.location.origin}/donate/success`,
        cancelUrl: `${window.location.origin}/donate`,
      });

      const { url } = result.data as { url: string };
      window.location.href = url;
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: t("error.checkoutFailed", "Checkout Failed"),
        description:
          error.message || t("error.tryAgain", "Please try again later"),
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const selectedAmount = customAmount || amount;
  const donationImpact = parseFloat(selectedAmount) || 0;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {t("donation.title", "Make a Donation")}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t("donation.subtitle", "Every contribution makes a difference")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Amount Selection */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">
              {t("donation.selectAmount", "Select Amount")}
            </h3>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {presetAmounts.map((preset) => (
                <Button
                  key={preset}
                  variant={amount === preset.toString() ? "default" : "outline"}
                  onClick={() => {
                    setAmount(preset.toString());
                    setCustomAmount("");
                  }}
                  className="h-16 text-lg"
                >
                  €{preset}
                </Button>
              ))}
            </div>

            <div className="space-y-2 mb-6">
              <Label htmlFor="custom-amount">
                {t("donation.customAmount", "Custom Amount")}
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">€</span>
                <Input
                  id="custom-amount"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="0.00"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setAmount("");
                  }}
                  className="text-2xl font-bold"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <Label htmlFor="recurring">
                  {t("donation.makeRecurring", "Make this recurring")}
                </Label>
                <Switch
                  id="recurring"
                  checked={recurring}
                  onCheckedChange={setRecurring}
                />
              </div>

              {recurring && (
                <RadioGroup value={interval} onValueChange={setInterval as any}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="month" id="monthly" />
                    <Label htmlFor="monthly">
                      {t("donation.monthly", "Monthly")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="year" id="yearly" />
                    <Label htmlFor="yearly">
                      {t("donation.yearly", "Yearly")}
                    </Label>
                  </div>
                </RadioGroup>
              )}
            </div>

            {donationImpact > 0 && (
              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <p className="text-sm font-medium">
                  {t("donation.impact", "Your Impact")}:
                </p>
                <p className="text-2xl font-bold text-primary">
                  €{donationImpact.toFixed(2)}
                  {recurring && ` /${t(`common.${interval}`, interval)}`}
                </p>
              </div>
            )}
          </Card>

          {/* Allocation Selection */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">
              {t("donation.allocateFunds", "Allocate Your Donation")}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {t(
                "donation.allocationDescription",
                "Choose how your donation is distributed across our programs",
              )}
            </p>

            <div className="space-y-6">
              {allocation.map((category, index) => {
                const Icon = category.icon;
                return (
                  <div key={category.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-primary" />
                        <Label>{category.name}</Label>
                      </div>
                      <span className="font-semibold">
                        {category.percentage}%
                      </span>
                    </div>
                    <Slider
                      value={[category.percentage]}
                      onValueChange={([value]) =>
                        handleAllocationChange(index, value)
                      }
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    {donationImpact > 0 && (
                      <p className="text-sm text-muted-foreground">
                        €
                        {((donationImpact * category.percentage) / 100).toFixed(
                          2,
                        )}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <Button
              onClick={handleCheckout}
              disabled={loading || !selectedAmount}
              className="w-full mt-8"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("common.processing", "Processing...")}
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 mr-2" />
                  {t("donation.donate", "Donate")} €{selectedAmount}
                  {recurring && ` /${t(`common.${interval}`, interval)}`}
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              {t(
                "donation.taxDeductible",
                "Your donation is tax-deductible. You'll receive a receipt via email.",
              )}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
