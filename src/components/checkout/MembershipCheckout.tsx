import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, Crown, Users, Building2 } from "lucide-react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface MembershipTier {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  recommended?: boolean;
  stripePriceId?: string;
}

export default function MembershipCheckout() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const tiers: MembershipTier[] = [
    {
      id: "insider",
      name: t("membership.insider.title", "Insider"),
      price: 9.99,
      interval: "month",
      icon: Users,
      features: [
        t("membership.insider.feature1", "Early access to campaigns"),
        t("membership.insider.feature2", "Quarterly impact reports"),
        t("membership.insider.feature3", "Exclusive newsletter"),
        t("membership.insider.feature4", "Member badge on profile"),
      ],
    },
    {
      id: "champion",
      name: t("membership.champion.title", "Champion"),
      price: 29.99,
      interval: "month",
      icon: Crown,
      features: [
        t("membership.champion.feature1", "All Insider benefits"),
        t("membership.champion.feature2", "Priority event access"),
        t("membership.champion.feature3", "Voting rights on campaigns"),
        t("membership.champion.feature4", "Quarterly video calls with team"),
        t("membership.champion.feature5", "Tax deduction certificate"),
      ],
      recommended: true,
    },
    {
      id: "partner",
      name: t("membership.partner.title", "Corporate Partner"),
      price: 499,
      interval: "month",
      icon: Building2,
      features: [
        t("membership.partner.feature1", "All Champion benefits"),
        t("membership.partner.feature2", "Logo on website & materials"),
        t("membership.partner.feature3", "CSR partnership opportunities"),
        t("membership.partner.feature4", "Dedicated account manager"),
        t("membership.partner.feature5", "Co-branding opportunities"),
        t("membership.partner.feature6", "Annual impact report"),
      ],
    },
  ];

  const handleCheckout = async (tier: MembershipTier) => {
    if (!user) {
      toast({
        title: t("auth.required", "Authentication Required"),
        description: t("auth.loginToContinue", "Please log in to continue"),
        variant: "destructive",
      });
      navigate("/login", { state: { returnTo: "/membership" } });
      return;
    }

    setLoading(tier.id);

    try {
      const functions = getFunctions();
      const createCheckout = httpsCallable(
        functions,
        "createMembershipCheckout",
      );

      const result = await createCheckout({
        tier: tier.id,
        successUrl: `${window.location.origin}/membership/success`,
        cancelUrl: `${window.location.origin}/membership`,
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
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          {t("membership.title", "Choose Your Membership")}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t(
            "membership.subtitle",
            "Support our mission and unlock exclusive benefits",
          )}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {tiers.map((tier) => {
          const Icon = tier.icon;
          return (
            <Card
              key={tier.id}
              className={`relative p-8 ${
                tier.recommended
                  ? "border-primary shadow-xl scale-105"
                  : "border-border"
              }`}
            >
              {tier.recommended && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                  {t("membership.recommended", "Recommended")}
                </Badge>
              )}

              <div className="text-center mb-6">
                <Icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold">€{tier.price}</span>
                  <span className="text-muted-foreground">
                    /{t(`common.${tier.interval}`, tier.interval)}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleCheckout(tier)}
                disabled={loading === tier.id}
                className="w-full"
                size="lg"
                variant={tier.recommended ? "default" : "outline"}
              >
                {loading === tier.id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("common.loading", "Loading...")}
                  </>
                ) : (
                  t("membership.choosePlan", "Choose Plan")
                )}
              </Button>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          {t(
            "membership.cancellation",
            "Cancel anytime. All memberships are tax-deductible.",
          )}
        </p>
      </div>
    </div>
  );
}
