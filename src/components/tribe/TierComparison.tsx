import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface TierFeature {
  name: string;
  explorer: boolean | string;
  insider: boolean | string;
  core: boolean | string;
  founder: boolean | string;
}

export function TierComparison() {
  const { t } = useTranslation();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const tiers = [
    {
      id: "explorer",
      name: t("tribePage.comparison.explorer.name"),
      price: t("tribePage.comparison.explorer.price"),
      period: "",
      description: t("tribePage.comparison.explorer.description"),
      popular: false,
    },
    {
      id: "insider",
      name: t("tribePage.comparison.insider.name"),
      price: "€9.99",
      period: t("tribePage.comparison.insider.period"),
      description: t("tribePage.comparison.insider.description"),
      popular: true,
    },
    {
      id: "core",
      name: t("tribePage.comparison.core.name"),
      price: "€97",
      period: t("tribePage.comparison.core.period"),
      description: t("tribePage.comparison.core.description"),
      popular: false,
    },
    {
      id: "founder",
      name: t("tribePage.comparison.founder.name"),
      price: "€247",
      period: t("tribePage.comparison.founder.period"),
      description: t("tribePage.comparison.founder.description"),
      popular: false,
      limited: true,
    },
  ];

  const features: TierFeature[] = [
    {
      name: t("tribePage.comparison.features.newsletter"),
      explorer: true,
      insider: true,
      core: true,
      founder: true,
    },
    {
      name: t("tribePage.comparison.features.impactReports"),
      explorer: true,
      insider: true,
      core: true,
      founder: true,
    },
    {
      name: t("tribePage.comparison.features.bottles"),
      explorer: false,
      insider: "2/month",
      core: "4/month",
      founder: "10/month",
    },
    {
      name: t("tribePage.comparison.features.voting"),
      explorer: false,
      insider: true,
      core: true,
      founder: true,
    },
    {
      name: t("tribePage.comparison.features.earlyAccess"),
      explorer: false,
      insider: true,
      core: true,
      founder: true,
    },
    {
      name: t("tribePage.comparison.features.discount"),
      explorer: false,
      insider: "10%",
      core: "15%",
      founder: "20%",
    },
    {
      name: t("tribePage.comparison.features.events"),
      explorer: false,
      insider: false,
      core: true,
      founder: true,
    },
    {
      name: t("tribePage.comparison.features.badge"),
      explorer: false,
      insider: false,
      core: true,
      founder: true,
    },
    {
      name: t("tribePage.comparison.features.merchBundle"),
      explorer: false,
      insider: false,
      core: false,
      founder: true,
    },
    {
      name: t("tribePage.comparison.features.lifetime"),
      explorer: false,
      insider: false,
      core: false,
      founder: true,
    },
  ];

  const renderFeatureValue = (value: boolean | string) => {
    if (value === true) {
      return <Check className="h-5 w-5 text-green-600 mx-auto" />;
    }
    if (value === false) {
      return <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />;
    }
    return <span className="text-sm font-semibold text-primary">{value}</span>;
  };

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
            <Sparkles className="mr-1 h-3 w-3" />
            {t("tribePage.comparison.badge")}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            {t("tribePage.comparison.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t("tribePage.comparison.subtitle")}
          </p>
        </div>

        {/* Mobile: Tier Cards */}
        <div className="lg:hidden space-y-6 mb-12">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative border-2 rounded-xl p-6 transition-all ${
                tier.popular
                  ? "border-primary shadow-lg shadow-primary/20"
                  : "border-border"
              }`}
            >
              {tier.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  {t("tribePage.comparison.mostPopular")}
                </Badge>
              )}
              {tier.limited && (
                <Badge
                  variant="destructive"
                  className="absolute -top-3 left-1/2 -translate-x-1/2"
                >
                  {t("tribePage.comparison.limited")}
                </Badge>
              )}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <div className="text-3xl font-black text-primary mb-1">
                  {tier.price}
                </div>
                {tier.period && (
                  <div className="text-sm text-muted-foreground">
                    {tier.period}
                  </div>
                )}
                <p className="text-sm text-muted-foreground mt-3">
                  {tier.description}
                </p>
              </div>
              <Link to={`/tribe/signup?tier=${tier.id}`}>
                <Button
                  className="w-full"
                  variant={tier.popular ? "default" : "outline"}
                >
                  {t("tribePage.comparison.selectTier")}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Desktop: Comparison Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 w-1/4">
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    {t("tribePage.comparison.features.title")}
                  </span>
                </th>
                {tiers.map((tier) => (
                  <th key={tier.id} className="p-4 align-bottom">
                    <div
                      className={`relative border-2 rounded-t-xl p-6 transition-all ${
                        selectedTier === tier.id
                          ? "border-primary bg-primary/5"
                          : tier.popular
                            ? "border-primary"
                            : "border-border"
                      }`}
                      onMouseEnter={() => setSelectedTier(tier.id)}
                      onMouseLeave={() => setSelectedTier(null)}
                    >
                      {tier.popular && (
                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                          {t("tribePage.comparison.mostPopular")}
                        </Badge>
                      )}
                      {tier.limited && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-3 left-1/2 -translate-x-1/2"
                        >
                          {t("tribePage.comparison.limited")}
                        </Badge>
                      )}
                      <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                      <div className="text-3xl font-black text-primary mb-1">
                        {tier.price}
                      </div>
                      {tier.period && (
                        <div className="text-xs text-muted-foreground mb-3">
                          {tier.period}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mb-4 min-h-[40px]">
                        {tier.description}
                      </p>
                      <Link to={`/tribe/signup?tier=${tier.id}`}>
                        <Button
                          className="w-full"
                          size="sm"
                          variant={tier.popular ? "default" : "outline"}
                        >
                          {t("tribePage.comparison.selectTier")}
                        </Button>
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr
                  key={index}
                  className={`border-t ${index % 2 === 0 ? "bg-muted/5" : ""}`}
                >
                  <td className="p-4 font-medium">{feature.name}</td>
                  <td className="p-4 text-center border-l border-border">
                    {renderFeatureValue(feature.explorer)}
                  </td>
                  <td className="p-4 text-center border-l border-primary/20 bg-primary/5">
                    {renderFeatureValue(feature.insider)}
                  </td>
                  <td className="p-4 text-center border-l border-border">
                    {renderFeatureValue(feature.core)}
                  </td>
                  <td className="p-4 text-center border-l border-border">
                    {renderFeatureValue(feature.founder)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="p-4"></td>
                {tiers.map((tier) => (
                  <td key={tier.id} className="p-4">
                    <div
                      className={`border-2 border-t-0 rounded-b-xl p-4 ${
                        tier.popular ? "border-primary" : "border-border"
                      }`}
                    >
                      <Link to={`/tribe/signup?tier=${tier.id}`}>
                        <Button
                          className="w-full"
                          variant={tier.popular ? "default" : "outline"}
                        >
                          {t("tribePage.comparison.selectTier")}
                        </Button>
                      </Link>
                    </div>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  );
}
