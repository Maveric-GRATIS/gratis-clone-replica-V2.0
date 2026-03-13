import { PageHero } from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import {
  FileText,
  Shield,
  Globe,
  CheckCircle,
  Building,
  Scale,
} from "lucide-react";

export default function EIN() {
  return (
    <>
      <SEO
        title="EIN: 95-1831116 | G.R.A.T.I.S. Tax-Exempt Status"
        description="G.R.A.T.I.S. Foundation's Employer Identification Number (EIN) and tax-exempt registration details for US donors and partners."
      />
      <PageHero
        title="EIN: 95-1831116"
        subtitle="Our tax identification and exempt status for transparency and donor confidence."
        lastUpdated="March 2026"
      />

      <div className="container max-w-4xl mx-auto px-4 pb-20 space-y-8">
        {/* Primary Registration */}
        <Card className="p-8 space-y-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Employer Identification Number
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                The EIN (Employer Identification Number) is a unique nine-digit
                number assigned by the U.S. Internal Revenue Service (IRS) to
                identify tax-exempt organizations. Our EIN confirms G.R.A.T.I.S.
                Foundation's legal standing as a registered entity.
              </p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-6 border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Organization Name
                </p>
                <p className="text-lg font-semibold text-foreground">
                  G.R.A.T.I.S. Foundation
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  EIN / Tax ID
                </p>
                <p className="text-lg font-mono font-bold text-primary">
                  95-1831116
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Organization Type
                </p>
                <p className="text-foreground">
                  Non-Profit Foundation (Stichting)
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  IRS Determination Status
                </p>
                <Badge
                  variant="outline"
                  className="text-[hsl(var(--brand-yellow))] border-[hsl(var(--brand-yellow))]"
                >
                  501(c)(3) — Pending
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Country of Incorporation
                </p>
                <p className="text-foreground">
                  The Netherlands (Dutch Stichting)
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Fiscal Year End
                </p>
                <p className="text-foreground">December 31</p>
              </div>
            </div>
          </div>
        </Card>

        {/* What This Means for Donors */}
        <Card className="p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                What This Means for Donors
              </h2>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                Our EIN is used to verify our organization's legitimacy and tax
                status. Here's what it means for you:
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {[
              {
                title: "Tax-Deductible Donations (Pending)",
                description:
                  "Once our 501(c)(3) determination is finalized, donations made by U.S. taxpayers will be tax-deductible to the fullest extent allowed by law. We will update this page and notify donors upon approval.",
              },
              {
                title: "Donation Receipts",
                description:
                  "All donors receive an official receipt referencing our EIN for their tax records. Receipts are issued automatically for online donations and upon request for offline contributions.",
              },
              {
                title: "Verification",
                description:
                  "You can verify our EIN through the IRS Tax Exempt Organization Search tool (TEOS) or through third-party charity verification platforms such as GuideStar/Candid and Charity Navigator.",
              },
              {
                title: "Employer Matching",
                description:
                  "Many employers match charitable contributions. Provide our EIN (95-1831116) to your employer's matching gift program to potentially double your impact.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex gap-3 p-4 rounded-lg bg-muted/30 border border-border/50"
              >
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Dual Jurisdiction */}
        <Card className="p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Dual-Jurisdiction Registration
              </h2>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                G.R.A.T.I.S. Foundation operates under a dual-jurisdiction model
                to serve donors and beneficiaries across multiple countries.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl border border-border bg-muted/20 space-y-3">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Netherlands</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  • Legal form:{" "}
                  <span className="text-foreground">Stichting</span>{" "}
                  (Foundation)
                </li>
                <li>
                  • KvK (Chamber of Commerce):{" "}
                  <span className="text-foreground">Registered</span>
                </li>
                <li>
                  • RSIN:{" "}
                  <span className="font-mono text-foreground">95-1831116</span>
                </li>
                <li>
                  • ANBI Status:{" "}
                  <span className="text-[hsl(var(--brand-yellow))]">
                    Pending
                  </span>
                </li>
              </ul>
            </div>
            <div className="p-5 rounded-xl border border-border bg-muted/20 space-y-3">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">United States</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  • EIN:{" "}
                  <span className="font-mono text-foreground">95-1831116</span>
                </li>
                <li>
                  • IRS Status:{" "}
                  <span className="text-[hsl(var(--brand-yellow))]">
                    501(c)(3) Pending
                  </span>
                </li>
                <li>
                  • State Registration:{" "}
                  <span className="text-foreground">In Progress</span>
                </li>
                <li>
                  • Form 990:{" "}
                  <span className="text-foreground">
                    Will be filed annually
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Disclaimer */}
        <Card className="p-6 bg-muted/30 border-border/50">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Disclaimer:</strong> G.R.A.T.I.S. Foundation's 501(c)(3)
            tax-exempt determination is currently pending with the IRS. Until
            the determination letter is received, donations may not qualify as
            tax-deductible under U.S. tax law. Donors are advised to consult
            with a qualified tax professional regarding the deductibility of
            their contributions. This page is provided for informational
            purposes only and does not constitute tax advice.
          </p>
        </Card>
      </div>
    </>
  );
}
