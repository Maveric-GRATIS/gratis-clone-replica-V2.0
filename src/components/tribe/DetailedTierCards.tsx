import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  Check,
  Gift,
  Users,
  Crown,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface TierCardProps {
  tier: "explorer" | "insider" | "core" | "founder";
}

export function DetailedTierCards() {
  const { t } = useTranslation();
  const [expandedTier, setExpandedTier] = useState<string | null>(null);

  const toggleExpand = (tierId: string) => {
    setExpandedTier(expandedTier === tierId ? null : tierId);
  };

  const tiers = [
    {
      id: "explorer",
      icon: Sparkles,
      name: t("tribePage.tierCards.explorer.name"),
      tagline: t("tribePage.tierCards.explorer.tagline"),
      price: t("tribePage.tierCards.explorer.price"),
      period: "",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-blue-200 dark:border-blue-900",
      features: [
        t("tribePage.tierCards.explorer.feature1"),
        t("tribePage.tierCards.explorer.feature2"),
        t("tribePage.tierCards.explorer.feature3"),
        t("tribePage.tierCards.explorer.feature4"),
      ],
      limits: [
        t("tribePage.tierCards.explorer.limit1"),
        t("tribePage.tierCards.explorer.limit2"),
      ],
    },
    {
      id: "insider",
      icon: Gift,
      name: t("tribePage.tierCards.insider.name"),
      tagline: t("tribePage.tierCards.insider.tagline"),
      price: "€9.99",
      period: t("tribePage.tierCards.insider.period"),
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary",
      popular: true,
      features: [
        t("tribePage.tierCards.insider.feature1"),
        t("tribePage.tierCards.insider.feature2"),
        t("tribePage.tierCards.insider.feature3"),
        t("tribePage.tierCards.insider.feature4"),
        t("tribePage.tierCards.insider.feature5"),
        t("tribePage.tierCards.insider.feature6"),
      ],
      limits: [t("tribePage.tierCards.insider.limit1")],
    },
    {
      id: "core",
      icon: Users,
      name: t("tribePage.tierCards.core.name"),
      tagline: t("tribePage.tierCards.core.tagline"),
      price: "€97",
      period: t("tribePage.tierCards.core.period"),
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      borderColor: "border-purple-200 dark:border-purple-900",
      features: [
        t("tribePage.tierCards.core.feature1"),
        t("tribePage.tierCards.core.feature2"),
        t("tribePage.tierCards.core.feature3"),
        t("tribePage.tierCards.core.feature4"),
        t("tribePage.tierCards.core.feature5"),
        t("tribePage.tierCards.core.feature6"),
        t("tribePage.tierCards.core.feature7"),
      ],
      limits: [],
    },
    {
      id: "founder",
      icon: Crown,
      name: t("tribePage.tierCards.founder.name"),
      tagline: t("tribePage.tierCards.founder.tagline"),
      price: "€247",
      period: t("tribePage.tierCards.founder.period"),
      color: "text-yellow-600",
      bgColor:
        "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20",
      borderColor: "border-yellow-400 dark:border-yellow-600",
      limited: true,
      features: [
        t("tribePage.tierCards.founder.feature1"),
        t("tribePage.tierCards.founder.feature2"),
        t("tribePage.tierCards.founder.feature3"),
        t("tribePage.tierCards.founder.feature4"),
        t("tribePage.tierCards.founder.feature5"),
        t("tribePage.tierCards.founder.feature6"),
        t("tribePage.tierCards.founder.feature7"),
        t("tribePage.tierCards.founder.feature8"),
      ],
      limits: [],
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            {t("tribePage.tierCards.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t("tribePage.tierCards.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            const isExpanded = expandedTier === tier.id;

            return (
              <Card
                key={tier.id}
                className={`relative border-2 ${tier.borderColor} ${tier.bgColor} overflow-hidden transition-all hover:shadow-lg`}
              >
                {tier.popular && (
                  <Badge className="absolute top-4 right-4">
                    {t("tribePage.tierCards.mostPopular")}
                  </Badge>
                )}
                {tier.limited && (
                  <Badge
                    variant="destructive"
                    className="absolute top-4 right-4"
                  >
                    {t("tribePage.tierCards.limited")}
                  </Badge>
                )}

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className={`p-3 rounded-lg ${tier.bgColor} border ${tier.borderColor}`}
                    >
                      <Icon className={`h-6 w-6 ${tier.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-1">{tier.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {tier.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black">{tier.price}</span>
                      {tier.period && (
                        <span className="text-muted-foreground">
                          {tier.period}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Features (always visible) */}
                  <div className="space-y-3 mb-6">
                    {tier.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check
                          className={`h-5 w-5 ${tier.color} flex-shrink-0 mt-0.5`}
                        />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Expandable section */}
                  {isExpanded && (
                    <div className="space-y-3 mb-6 animate-in slide-in-from-top">
                      {tier.features.slice(3).map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Check
                            className={`h-5 w-5 ${tier.color} flex-shrink-0 mt-0.5`}
                          />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                      {tier.limits.length > 0 && (
                        <div className="pt-4 border-t mt-4">
                          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
                            {t("tribePage.tierCards.limitations")}
                          </p>
                          {tier.limits.map((limit, index) => (
                            <p
                              key={index}
                              className="text-xs text-muted-foreground"
                            >
                              • {limit}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Expand/Collapse Button */}
                  {tier.features.length > 3 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mb-4"
                      onClick={() => toggleExpand(tier.id)}
                    >
                      {isExpanded ? (
                        <>
                          {t("tribePage.tierCards.showLess")}
                          <ChevronUp className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          {t("tribePage.tierCards.showMore")}
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}

                  {/* CTA */}
                  <Link to={`/tribe/signup?tier=${tier.id}`}>
                    <Button
                      className="w-full"
                      variant={tier.popular ? "default" : "outline"}
                      size="lg"
                    >
                      {t("tribePage.tierCards.selectTier")}
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
