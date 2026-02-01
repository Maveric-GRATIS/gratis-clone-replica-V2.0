import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { TierComparison } from "@/components/tribe/TierComparison";
import { DetailedTierCards } from "@/components/tribe/DetailedTierCards";
import { VotingExplainer } from "@/components/tribe/VotingExplainer";
import { TribeTestimonials } from "@/components/tribe/TribeTestimonials";
import { FounderSpotCounter } from "@/components/tribe/FounderSpotCounter";
import { TribeFAQ } from "@/components/tribe/TribeFAQ";
import { BenefitShowcase } from "@/components/tribe/BenefitShowcase";
import { TribeLiveStats } from "@/components/tribe/TribeLiveStats";
import { Crown, Zap, Heart } from "lucide-react";

export default function Tribe() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={t("tribePage.title")}
        description={t("tribePage.description")}
        canonical={
          typeof window !== "undefined" ? window.location.href : "/tribe"
        }
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
        <div className="relative max-w-4xl mx-auto text-center">
          <Badge className="mb-6 text-lg px-4 py-2">
            <Crown className="mr-2 h-4 w-4" />
            {t("tribePage.hero.badge")}
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            {t("tribePage.hero.title")}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t("tribePage.hero.subtitle")}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/tribe/signup">
              <Button size="lg" className="text-lg">
                <Zap className="mr-2 h-5 w-5" />
                {t("tribePage.hero.cta")}
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg" asChild>
              <a href="#comparison">{t("tribePage.hero.compareTiers")}</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="border-t border-border py-16">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="p-4 rounded-full bg-primary/10">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t("tribePage.valueProps.prop1.title")}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t("tribePage.valueProps.prop1.description")}
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="p-4 rounded-full bg-primary/10">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t("tribePage.valueProps.prop2.title")}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t("tribePage.valueProps.prop2.description")}
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="p-4 rounded-full bg-primary/10">
                  <Crown className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t("tribePage.valueProps.prop3.title")}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t("tribePage.valueProps.prop3.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <TribeLiveStats />

      {/* Tier Comparison Table */}
      <div id="comparison">
        <TierComparison />
      </div>

      {/* Detailed Tier Cards */}
      <DetailedTierCards />

      {/* Benefit Showcase */}
      <BenefitShowcase />

      {/* Founder Spot Counter */}
      <FounderSpotCounter />

      {/* Voting Explainer */}
      <VotingExplainer />

      {/* Testimonials */}
      <TribeTestimonials />

      {/* FAQ */}
      <TribeFAQ />

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            {t("tribePage.finalCta.title")}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {t("tribePage.finalCta.subtitle")}
          </p>
          <Link to="/tribe/signup">
            <Button size="lg" className="text-lg">
              <Crown className="mr-2 h-5 w-5" />
              {t("tribePage.finalCta.cta")}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
