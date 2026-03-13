import SEO from "@/components/SEO";
import { PageHero } from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, PieChart, Shield, BarChart3, Target, Award } from "lucide-react";

export default function CharityRating() {
  return (
    <>
      <SEO
        title="Charity Rating | G.R.A.T.I.S. Foundation"
        description="G.R.A.T.I.S. Foundation's charity ratings, accountability metrics, and third-party evaluations for donor confidence."
      />
      <PageHero
        title="Charity Rating"
        subtitle="Accountability, efficiency, and impact — measured and verified."
        lastUpdated="March 2026"
      />

      <div className="container max-w-4xl mx-auto px-4 pb-20 space-y-8">
        {/* Rating Overview */}
        <Card className="p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Our Rating Status
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                As a newly established foundation, G.R.A.T.I.S. is in the
                process of building the operational track record required for
                formal charity ratings. We are committed to achieving the
                highest standards of accountability and will pursue independent
                evaluations as we become eligible.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                platform: "Charity Navigator",
                region: "United States",
                status: "Pending Eligibility",
                note: "Requires 7+ years of Form 990 filings and $1M+ revenue. We are building toward this milestone.",
              },
              {
                platform: "GuideStar / Candid",
                region: "United States",
                status: "Profile Created",
                note: "Our GuideStar profile will be published upon 501(c)(3) determination. Targeting Gold Seal of Transparency.",
              },
              {
                platform: "CBF Erkenning",
                region: "Netherlands",
                status: "Planned Application",
                note: "CBF (Centraal Bureau Fondsenwerving) recognition is the Dutch quality mark for charities. Application planned for 2027.",
              },
              {
                platform: "Geef.nl",
                region: "Netherlands",
                status: "Registration Planned",
                note: "The Netherlands' leading charity transparency platform. Profile to be created upon ANBI confirmation.",
              },
              {
                platform: "BBB Wise Giving Alliance",
                region: "United States",
                status: "Future Goal",
                note: "We intend to meet all 20 BBB Standards for Charity Accountability.",
              },
              {
                platform: "Transparantie Prijs",
                region: "Netherlands",
                status: "Future Goal",
                note: "The Dutch Transparency Award recognizes the most transparent charitable organizations.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-border bg-muted/20 space-y-2"
              >
                <h3 className="font-semibold text-foreground text-sm">
                  {item.platform}
                </h3>
                <p className="text-xs text-muted-foreground">{item.region}</p>
                <Badge
                  variant="outline"
                  className="text-[hsl(var(--brand-yellow))] border-[hsl(var(--brand-yellow))] text-xs"
                >
                  {item.status}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Financial Efficiency */}
        <Card className="p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <PieChart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Financial Efficiency Targets
              </h2>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                We hold ourselves to the highest standards of financial
                stewardship. Here are our operational targets, benchmarked
                against leading charity rating criteria:
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                metric: "Program Spending Ratio",
                target: "≥ 85%",
                description:
                  "Percentage of total expenditure directed to charitable programs (water distribution, NGO funding, events). Industry benchmark: 75%+.",
              },
              {
                metric: "Fundraising Efficiency",
                target: "≤ €0.10 per €1 raised",
                description:
                  "Cost to raise each euro of donation revenue. Our model leverages merchandise and ad revenue, minimizing traditional fundraising costs.",
              },
              {
                metric: "Administrative Overhead",
                target: "≤ 10%",
                description:
                  "Management and general expenses as a percentage of total spending. We aim well below the 25% threshold set by most watchdogs.",
              },
              {
                metric: "Revenue Diversification",
                target: "3+ revenue streams",
                description:
                  "Merchandise sales, advertising revenue, corporate sponsorships, and individual donations ensure financial resilience.",
              },
              {
                metric: "Working Capital Reserve",
                target: "3-6 months operating expenses",
                description:
                  "Maintaining a prudent reserve without excessive accumulation, in line with CBF and Charity Navigator guidelines.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex gap-4 p-4 rounded-lg bg-muted/30 border border-border/50"
              >
                <div className="shrink-0">
                  <div className="text-lg font-black text-primary">
                    {item.target}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">
                    {item.metric}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Accountability Standards */}
        <Card className="p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Accountability Standards
              </h2>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                We voluntarily adhere to the following accountability
                frameworks:
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                standard: "Goede Doelen Nederland Code",
                description:
                  "The Dutch code of conduct for charities, covering governance, financial management, fundraising ethics, and communication standards.",
              },
              {
                standard: "IATI (International Aid Transparency Initiative)",
                description:
                  "We plan to publish our aid activities in IATI format for global transparency and comparability.",
              },
              {
                standard: "BBB 20 Standards for Charity Accountability",
                description:
                  "Covering governance, measuring effectiveness, finances, and fundraising/informational materials.",
              },
              {
                standard: "GRI Standards (adapted)",
                description:
                  "We use adapted Global Reporting Initiative standards for sustainability and impact reporting.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-border bg-muted/20 space-y-2"
              >
                <h3 className="font-semibold text-foreground text-sm">
                  {item.standard}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Impact Metrics */}
        <Card className="p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                How We Measure Impact
              </h2>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                Beyond financial metrics, we track real-world outcomes to ensure
                every euro creates measurable change:
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                metric: "Liters of Water Distributed",
                description: "Tracked per event, per location, per partner",
              },
              {
                metric: "People Served",
                description:
                  "Unique individuals reached at distribution events",
              },
              {
                metric: "NGO Funding Disbursed",
                description: "Total euros transferred to verified NGO partners",
              },
              {
                metric: "Events Attended",
                description:
                  "Festivals, community gatherings, and emergency distributions",
              },
              {
                metric: "Volunteer Hours",
                description: "Community engagement and workforce contribution",
              },
              {
                metric: "Carbon Offset",
                description:
                  "Environmental impact of our sustainable operations",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/20"
              >
                <Target className="h-4 w-4 text-primary mt-1 shrink-0" />
                <div>
                  <div className="font-semibold text-foreground text-sm">
                    {item.metric}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Commitment */}
        <Card className="p-8 space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Our Commitment
              </h2>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                We believe donors deserve complete confidence in how their
                contributions are used. As G.R.A.T.I.S. grows, we are committed
                to:
              </p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground ml-4">
            <li>• Publishing annual audited financial statements</li>
            <li>
              • Pursuing independent charity ratings as we become eligible
            </li>
            <li>
              • Exceeding minimum transparency requirements in every
              jurisdiction we operate
            </li>
            <li>
              • Responding to all donor inquiries about fund allocation within 5
              business days
            </li>
            <li>• Engaging an independent auditor by Year 2 of operations</li>
          </ul>
        </Card>

        {/* Disclaimer */}
        <Card className="p-6 bg-muted/30 border-border/50">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Disclaimer:</strong> The ratings and targets described on
            this page reflect our goals and commitments as a newly established
            organization. Formal ratings from third-party evaluators will be
            published here as they become available. Financial efficiency
            targets are aspirational benchmarks based on industry best practices
            and do not represent audited figures at this time.
          </p>
        </Card>
      </div>
    </>
  );
}
