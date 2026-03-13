import SEO from "@/components/SEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Heart,
  Shield,
  Globe,
  CheckCircle2,
  Handshake,
  TrendingUp,
  Award,
  FileText,
} from "lucide-react";

const partnershipTiers = [
  {
    name: "Community Partner",
    range: "€5,000 – €24,999",
    color: "border-primary/40 bg-primary/5",
    badge: "text-primary bg-primary/10",
    benefits: [
      "Logo on GRATIS website partner page",
      "Annual impact report with your brand",
      "Social media mention (1×/year)",
      "Tax receipt for ANBI / 501(c)(3)",
    ],
  },
  {
    name: "Impact Partner",
    range: "€25,000 – €99,999",
    color: "border-accent/40 bg-accent/5",
    badge: "text-accent bg-accent/10",
    benefits: [
      "Everything in Community Partner",
      "Co-branded impact campaign",
      "Employee volunteer day coordination",
      "Quarterly impact dashboard access",
      "Press release co-announcement",
    ],
  },
  {
    name: "Catalyst Partner",
    range: "€100,000+",
    color: "border-[hsl(var(--brand-blue))]/40 bg-[hsl(var(--brand-blue))]/5",
    badge: "text-[hsl(var(--brand-blue))] bg-[hsl(var(--brand-blue))]/10",
    benefits: [
      "Everything in Impact Partner",
      "Naming rights for a water project or program",
      "Custom co-branded product edition",
      "Board advisory seat (non-voting)",
      "Dedicated account manager",
      "Annual gala VIP table",
    ],
  },
];

export default function CorporateGiving() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Corporate Giving — GRATIS SPARK"
        description="Partner with GRATIS to create lasting social impact. Corporate giving programs for water, art, and education initiatives worldwide."
        canonical="/spark/corporate-giving"
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-sm font-semibold tracking-wider mb-6 animate-fade-in">
            SPARK / CORPORATE GIVING
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
            PURPOSE MEETS PROFIT
          </h1>
          <p
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in"
            style={{ animationDelay: "100ms", animationFillMode: "backwards" }}
          >
            Align your brand with measurable social impact. Zero admin overhead.
            Full transparency. Real results your stakeholders can see.
          </p>
          <div
            className="flex flex-wrap justify-center gap-4 animate-fade-in"
            style={{ animationDelay: "200ms", animationFillMode: "backwards" }}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 text-lg px-8"
              onClick={() =>
                document
                  .getElementById("tiers")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              View Partnership Tiers <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-primary/40 text-primary hover:bg-primary/10 text-lg px-8"
              >
                Contact Our Team
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Partner */}
      <section className="py-20 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-black text-center mb-4">
              WHY PARTNER WITH GRATIS?
            </h2>
            <p className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto">
              Corporate social responsibility that goes beyond PR. Tangible,
              verified, and reported impact.
            </p>
          </ScrollReveal>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Top 3% Transparency",
                desc: "Ranked in the top 3% of charities for financial accountability.",
              },
              {
                icon: Globe,
                title: "Global Reach",
                desc: "Impact across 12+ countries through verified NGO partners.",
              },
              {
                icon: TrendingUp,
                title: "ESG Reporting",
                desc: "Quarterly data dashboards aligned with GRI and UN SDGs.",
              },
              {
                icon: Award,
                title: "Tax Benefits",
                desc: "Dutch ANBI and US 501(c)(3) deductible for maximum fiscal advantage.",
              },
            ].map((item) => (
              <ScrollReveal key={item.title}>
                <div className="p-6 rounded-xl border border-border bg-card/30 hover:border-primary/30 transition-all h-full">
                  <item.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Tiers */}
      <section id="tiers" className="py-20 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-black text-center mb-4">
              PARTNERSHIP TIERS
            </h2>
            <p className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto">
              Choose the level of partnership that aligns with your CSR goals
              and budget.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {partnershipTiers.map((tier, i) => (
              <ScrollReveal key={tier.name}>
                <Card
                  className={`h-full border-2 ${tier.color} hover:shadow-xl transition-all`}
                >
                  <CardHeader>
                    <Badge className={`w-fit ${tier.badge} border-0 font-bold`}>
                      {tier.range}
                    </Badge>
                    <CardTitle className="text-2xl mt-3">{tier.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {tier.benefits.map((b) => (
                        <li
                          key={b}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <Link to="/contact" className="block mt-6">
                      <Button
                        variant="outline"
                        className="w-full border-primary/30 text-primary hover:bg-primary/10"
                      >
                        Get Started <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-black text-center mb-14">
              HOW IT WORKS
            </h2>
          </ScrollReveal>
          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Discovery Call",
                desc: "We learn about your brand values, CSR goals, and budget to recommend the right partnership structure.",
              },
              {
                step: "02",
                title: "Custom Proposal",
                desc: "Our team delivers a tailored proposal with projected impact metrics, timelines, and co-branding options.",
              },
              {
                step: "03",
                title: "Launch & Execute",
                desc: "Partnership goes live with dedicated support, employee engagement activities, and media coordination.",
              },
              {
                step: "04",
                title: "Report & Renew",
                desc: "Quarterly impact reports with verified data. Annual review to deepen and expand the partnership.",
              },
            ].map((item) => (
              <ScrollReveal key={item.step}>
                <div className="flex items-start gap-6">
                  <div className="text-4xl font-black text-primary/30 flex-shrink-0 w-16">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <Building2 className="w-12 h-12 text-accent mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              READY TO MAKE AN IMPACT?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Contact our corporate partnerships team to start your journey.
              Response within 48 hours.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 text-lg px-8"
                >
                  Contact Partnerships Team{" "}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href="mailto:partnerships@gratis.ngo">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/40 text-primary hover:bg-primary/10 text-lg px-8"
                >
                  partnerships@gratis.ngo
                </Button>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
