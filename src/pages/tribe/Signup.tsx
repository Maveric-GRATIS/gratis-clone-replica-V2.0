import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Crown,
  Gift,
  Users,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

type Step = 1 | 2 | 3 | 4;
type TierId = "explorer" | "insider" | "core" | "founder";

// MOCKUP: This will be replaced with actual Stripe integration
const mockStripeCheckout = async (
  tierId: TierId,
  email: string,
): Promise<{ success: boolean; sessionId?: string; error?: string }> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulate 95% success rate
  if (Math.random() < 0.95) {
    return {
      success: true,
      sessionId: `mock_session_${Date.now()}_${tierId}`,
    };
  } else {
    return {
      success: false,
      error: "Payment processing failed. Please try again.",
    };
  }
};

export default function TribeSignup() {
  const { t } = useTranslation();
  const { user, signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState<Step>(1);
  const [selectedTier, setSelectedTier] = useState<TierId>(
    (searchParams.get("tier") as TierId) || "insider",
  );
  const [isLoading, setIsLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    displayName: "",
    agreeTerms: false,
  });

  const tiers = [
    {
      id: "explorer" as TierId,
      name: t("tribePage.comparison.explorer.name"),
      price: t("tribePage.comparison.explorer.price"),
      period: "",
      icon: Sparkles,
      color: "text-blue-600",
      bottlesPerMonth: 0,
    },
    {
      id: "insider" as TierId,
      name: t("tribePage.comparison.insider.name"),
      price: "€9.99",
      period: t("tribePage.comparison.insider.period"),
      icon: Gift,
      color: "text-primary",
      bottlesPerMonth: 2,
      popular: true,
    },
    {
      id: "core" as TierId,
      name: t("tribePage.comparison.core.name"),
      price: "€97",
      period: t("tribePage.comparison.core.period"),
      icon: Users,
      color: "text-purple-600",
      bottlesPerMonth: 4,
    },
    {
      id: "founder" as TierId,
      name: t("tribePage.comparison.founder.name"),
      price: "€247",
      period: t("tribePage.comparison.founder.period"),
      icon: Crown,
      color: "text-yellow-600",
      bottlesPerMonth: 10,
      limited: true,
    },
  ];

  const selectedTierData = tiers.find((t) => t.id === selectedTier)!;
  const Icon = selectedTierData.icon;

  // Redirect if already logged in
  useEffect(() => {
    if (user && step === 2) {
      setStep(3);
    }
  }, [user, step]);

  const handleTierSelect = (tierId: TierId) => {
    setSelectedTier(tierId);
    setStep(2);
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreeTerms) {
      toast.error(t("tribePage.signup.errors.agreeTerms"));
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.displayName,
      );

      if (error) {
        toast.error(
          error.message || t("tribePage.signup.errors.createAccount"),
        );
        setIsLoading(false);
        return;
      }

      // Account created successfully, move to payment
      setStep(3);
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || t("tribePage.signup.errors.createAccount"));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      // MOCKUP: Simulate Stripe checkout
      const result = await mockStripeCheckout(
        selectedTier,
        formData.email || user?.email || "",
      );

      if (result.success) {
        // Update user's tier in Firestore
        if (user) {
          const userRef = doc(db, "users", user.uid);

          // Determine bottle limits based on tier
          const bottleLimits: Record<TierId, number> = {
            explorer: 0,
            insider: 2,
            core: 4,
            founder: 10,
          };

          await setDoc(
            userRef,
            {
              tribeTier: selectedTier,
              bottlesLimit: bottleLimits[selectedTier],
              bottlesClaimed: 0,
              subscriptionStatus: "active",
              subscriptionStartDate: Timestamp.now(),
              updatedAt: Timestamp.now(),
            },
            { merge: true },
          );

          // Move to success step
          setStep(4);
          toast.success(t("tribePage.signup.success"));
        }
      } else {
        toast.error(result.error || t("tribePage.signup.errors.payment"));
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || t("tribePage.signup.errors.payment"));
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-center">
              {t("tribePage.signup.step1.title")}
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              {t("tribePage.signup.step1.subtitle")}
            </p>

            <div className="grid gap-4">
              {tiers.map((tier) => {
                const TierIcon = tier.icon;
                return (
                  <Card
                    key={tier.id}
                    className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                      selectedTier === tier.id
                        ? "border-2 border-primary bg-primary/5"
                        : "border-2 border-transparent"
                    }`}
                    onClick={() => setSelectedTier(tier.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-muted">
                        <TierIcon className={`h-6 w-6 ${tier.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold">{tier.name}</h3>
                          {tier.popular && (
                            <Badge variant="default" className="text-xs">
                              {t("tribePage.comparison.mostPopular")}
                            </Badge>
                          )}
                          {tier.limited && (
                            <Badge variant="destructive" className="text-xs">
                              {t("tribePage.comparison.limited")}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-2xl font-black">
                            {tier.price}
                          </span>
                          {tier.period && (
                            <span className="text-sm text-muted-foreground">
                              {tier.period}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {tier.bottlesPerMonth > 0
                            ? `${tier.bottlesPerMonth} ${t("tribePage.signup.bottlesPerMonth")}`
                            : t("tribePage.signup.noBottles")}
                        </p>
                      </div>
                      {selectedTier === tier.id && (
                        <Check className="h-6 w-6 text-primary" />
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>

            <Button
              className="w-full mt-8"
              size="lg"
              onClick={() => handleTierSelect(selectedTier)}
            >
              {t("tribePage.signup.continue")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-center">
              {t("tribePage.signup.step2.title")}
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              {t("tribePage.signup.step2.subtitle")}
            </p>

            <form onSubmit={handleCreateAccount} className="space-y-6">
              <div>
                <Label htmlFor="displayName">
                  {t("tribePage.signup.step2.displayName")}
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                  required
                  placeholder={t(
                    "tribePage.signup.step2.displayNamePlaceholder",
                  )}
                />
              </div>

              <div>
                <Label htmlFor="email">
                  {t("tribePage.signup.step2.email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  placeholder={t("tribePage.signup.step2.emailPlaceholder")}
                />
              </div>

              <div>
                <Label htmlFor="password">
                  {t("tribePage.signup.step2.password")}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  minLength={6}
                  placeholder={t("tribePage.signup.step2.passwordPlaceholder")}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {t("tribePage.signup.step2.passwordHint")}
                </p>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, agreeTerms: checked as boolean })
                  }
                />
                <Label
                  htmlFor="terms"
                  className="text-sm leading-relaxed cursor-pointer"
                >
                  {t("tribePage.signup.step2.agreeTerms")}{" "}
                  <a
                    href="/tribe/terms"
                    className="text-primary underline"
                    target="_blank"
                  >
                    {t("tribePage.signup.step2.terms")}
                  </a>{" "}
                  {t("common.and")}{" "}
                  <a
                    href="/tribe/privacy"
                    className="text-primary underline"
                    target="_blank"
                  >
                    {t("tribePage.signup.step2.privacy")}
                  </a>
                </Label>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  {t("common.back")}
                </Button>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !formData.agreeTerms}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t("tribePage.signup.creating")}
                    </>
                  ) : (
                    <>
                      {t("tribePage.signup.createAccount")}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-center">
              {t("tribePage.signup.step3.title")}
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              {t("tribePage.signup.step3.subtitle")}
            </p>

            {/* Order Summary */}
            <Card className="p-6 mb-8 bg-muted/30">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-lg bg-background">
                  <Icon className={`h-8 w-8 ${selectedTierData.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{selectedTierData.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedTierData.bottlesPerMonth > 0
                      ? `${selectedTierData.bottlesPerMonth} ${t("tribePage.signup.bottlesPerMonth")}`
                      : t("tribePage.signup.noBottles")}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black">
                    {selectedTierData.price}
                  </div>
                  {selectedTierData.period && (
                    <div className="text-xs text-muted-foreground">
                      {selectedTierData.period}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-muted-foreground">
                    {t("tribePage.signup.step3.subtotal")}
                  </span>
                  <span className="font-semibold">
                    {selectedTierData.price}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-muted-foreground">
                    {t("tribePage.signup.step3.tax")}
                  </span>
                  <span className="font-semibold">€0.00</span>
                </div>
                <div className="border-t mt-2 pt-2 flex justify-between items-center">
                  <span className="font-bold">
                    {t("tribePage.signup.step3.total")}
                  </span>
                  <span className="text-2xl font-black">
                    {selectedTierData.price}
                  </span>
                </div>
              </div>
            </Card>

            {/* Mockup Payment Notice */}
            <Card className="p-4 mb-6 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-center">
                ⚠️ <strong>{t("tribePage.signup.step3.mockupNotice")}</strong>{" "}
                {t("tribePage.signup.step3.mockupDescription")}
              </p>
            </Card>

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setStep(2)}
                disabled={isLoading}
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                {t("common.back")}
              </Button>
              <Button
                className="w-full"
                onClick={handlePayment}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t("tribePage.signup.processing")}
                  </>
                ) : (
                  <>
                    {t("tribePage.signup.completePayment")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center mx-auto mb-4">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                {t("tribePage.signup.step4.title")}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t("tribePage.signup.step4.subtitle")}
              </p>
            </div>

            <Card className="p-6 mb-8 text-left">
              <h3 className="font-bold text-lg mb-4">
                {t("tribePage.signup.step4.nextSteps")}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">
                    {t("tribePage.signup.step4.step1")}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">
                    {t("tribePage.signup.step4.step2")}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">
                    {t("tribePage.signup.step4.step3")}
                  </span>
                </li>
              </ul>
            </Card>

            <Button
              size="lg"
              className="w-full"
              onClick={() => navigate("/dashboard")}
            >
              {t("tribePage.signup.step4.goToDashboard")}
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <SEO
        title={t("tribePage.signup.seoTitle")}
        description={t("tribePage.signup.seoDescription")}
      />

      <div className="container max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              {t("tribePage.signup.step")} {step} {t("tribePage.signup.of")} 4
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round((step / 4) * 100)}%
            </span>
          </div>
          <Progress value={(step / 4) * 100} className="h-2" />
        </div>

        {/* Main Card */}
        <Card className="p-8">{renderStep()}</Card>

        {/* Help Text */}
        {step < 4 && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            {t("tribePage.signup.helpText")}{" "}
            <a href="/contact" className="text-primary underline">
              {t("tribePage.signup.contactSupport")}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
