import SEO from "@/components/SEO";
import { PageHero } from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ClipboardCheck, Euro, BookOpen, Users } from "lucide-react";

export default function ANBIStatus() {
  return (
    <>
      <SEO
        title="ANBI Status | G.R.A.T.I.S. Foundation"
        description="G.R.A.T.I.S. Foundation's ANBI (Algemeen Nut Beogende Instelling) status, tax benefits for Dutch donors, and public benefit compliance."
      />
      <PageHero
        title="ANBI Status"
        subtitle="Algemeen Nut Beogende Instelling — Public Benefit Institution."
        lastUpdated="March 2026"
      />

      <div className="container max-w-4xl mx-auto px-4 pb-20 space-y-8">
        {/* What is ANBI */}
        <Card className="p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                What is ANBI?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                ANBI stands for <em>Algemeen Nut Beogende Instelling</em>{" "}
                (Public Benefit Organisation). It is a designation granted by
                the Dutch Tax Administration (<em>Belastingdienst</em>) to
                institutions that serve the public interest. ANBI status is the
                gold standard for charitable organizations in the Netherlands,
                providing tax benefits to both the organization and its donors.
              </p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-6 border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Organization
                </p>
                <p className="text-lg font-semibold text-foreground">
                  Stichting G.R.A.T.I.S.
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  RSIN / Fiscaal nummer
                </p>
                <p className="text-lg font-mono font-bold text-primary">
                  95-1831116
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  ANBI Status
                </p>
                <Badge
                  variant="outline"
                  className="text-[hsl(var(--brand-yellow))] border-[hsl(var(--brand-yellow))]"
                >
                  Application Pending
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Registered Office
                </p>
                <p className="text-foreground">Amsterdam, The Netherlands</p>
              </div>
            </div>
          </div>
        </Card>

        {/* ANBI Requirements */}
        <Card className="p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <ClipboardCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                ANBI Requirements We Meet
              </h2>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                To qualify for ANBI status, an organization must satisfy strict
                criteria set by the Dutch Tax Administration. Here is how
                G.R.A.T.I.S. Foundation meets each requirement:
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                requirement:
                  "At least 90% of activities serve the public interest",
                status:
                  "100% of our activities — free water distribution, community events, and NGO funding — directly serve the public interest. No private benefit is derived.",
              },
              {
                requirement: "No profit motive",
                status:
                  "G.R.A.T.I.S. operates as a Dutch stichting (foundation) with no shareholders. All revenue from merchandise and advertising is reinvested into charitable programs.",
              },
              {
                requirement:
                  "Board members receive no compensation beyond expense reimbursement",
                status:
                  "Our board members serve on an unpaid, voluntary basis. Only reasonable, documented expenses are reimbursed.",
              },
              {
                requirement: "Separate assets policy (liquidation clause)",
                status:
                  "Our articles of association include a liquidation clause requiring all remaining assets to be transferred to another ANBI-registered institution upon dissolution.",
              },
              {
                requirement: "Public transparency obligations",
                status:
                  "We publish our mission, board composition, financial reports, and policy documents on this website — exceeding ANBI transparency requirements.",
              },
              {
                requirement: "Maintain accurate financial records",
                status:
                  "Annual financial statements are prepared in accordance with Dutch GAAP and reviewed by an independent auditor.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-muted/30 border border-border/50"
              >
                <h3 className="font-semibold text-foreground text-sm">
                  {item.requirement}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.status}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Tax Benefits */}
        <Card className="p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Euro className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Tax Benefits for Donors
              </h2>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                Once our ANBI status is confirmed, donors in the Netherlands
                will be entitled to significant tax advantages:
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl border border-border bg-muted/20 space-y-3">
              <h3 className="font-semibold text-foreground">
                Individual Donors
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  • Gifts are fully deductible from Dutch income tax (Box 1)
                </li>
                <li>
                  • Periodic gifts via notarial deed are 100% deductible with no
                  threshold
                </li>
                <li>
                  • One-off gifts are deductible above 1% of threshold income
                  (minimum €60)
                </li>
                <li>
                  • Inheritance and gift tax exemptions apply for ANBI
                  beneficiaries
                </li>
              </ul>
            </div>
            <div className="p-5 rounded-xl border border-border bg-muted/20 space-y-3">
              <h3 className="font-semibold text-foreground">
                Corporate Donors
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  • Donations deductible for corporate income tax (Vpb) purposes
                </li>
                <li>
                  • Deductible up to 50% of taxable profit (maximum €100,000)
                </li>
                <li>
                  • No inheritance or gift tax on donations from companies
                </li>
                <li>• In-kind donations recognized at fair market value</li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[hsl(var(--brand-yellow))]/10 border border-[hsl(var(--brand-yellow))]/20">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Note:</strong> Tax benefits
              become effective upon official ANBI approval by the
              Belastingdienst. We are actively working to complete the
              application process and expect a determination in 2026. We will
              notify all registered donors when the status is confirmed.
            </p>
          </div>
        </Card>

        {/* Required Public Information */}
        <Card className="p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                ANBI Public Information
              </h2>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                ANBI-registered organizations are required to publish the
                following information publicly. We proactively disclose all of
                this regardless of our pending status:
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                label: "Name",
                value:
                  "Stichting G.R.A.T.I.S. (Global Resources And Transparent Impact Services)",
              },
              { label: "RSIN / Fiscal Number", value: "95-1831116" },
              {
                label: "Contact",
                value: "info@grfreedrinx.com — Amsterdam, The Netherlands",
              },
              {
                label: "Objective",
                value:
                  "Free distribution of drinking water at public events, festivals, and communities in need; funding NGO partners; promoting sustainability through conscious commerce.",
              },
              {
                label: "Board Composition",
                value:
                  "See our Leadership page for current board members, advisors, and ambassadors.",
              },
              {
                label: "Policy Plan",
                value:
                  "Available upon request. Covers our 2025-2028 strategic plan including distribution targets, NGO partnership criteria, and financial projections.",
              },
              {
                label: "Remuneration Policy",
                value:
                  "Board members serve without compensation. Staff salaries are benchmarked against the Dutch charity sector median (Goede Doelen Nederland guidelines).",
              },
              {
                label: "Financial Statements",
                value:
                  "Annual reports including balance sheet, statement of income and expenditure, and notes are published on our Responsibility page.",
              },
              {
                label: "Activity Report",
                value:
                  "Annual impact reports detailing water distributed, events attended, NGO funding disbursed, and community reach are published on our Responsibility page.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:gap-4 p-3 rounded-lg even:bg-muted/20"
              >
                <span className="text-xs font-semibold text-primary uppercase tracking-wide sm:w-40 shrink-0">
                  {item.label}
                </span>
                <span className="text-sm text-muted-foreground">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Verification */}
        <Card className="p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Verify Our Status
              </h2>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                Once our ANBI status is confirmed, you will be able to verify it
                through:
              </p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground ml-4">
            <li>
              •{" "}
              <strong className="text-foreground">
                Belastingdienst ANBI Register:
              </strong>{" "}
              Search by RSIN 95-1831116 at belastingdienst.nl
            </li>
            <li>
              •{" "}
              <strong className="text-foreground">
                KvK (Chamber of Commerce):
              </strong>{" "}
              Our stichting registration is publicly searchable
            </li>
            <li>
              • <strong className="text-foreground">Geef.nl:</strong> The
              Netherlands' charity transparency platform
            </li>
            <li>
              • <strong className="text-foreground">CBF Recognition:</strong> We
              intend to pursue CBF (Centraal Bureau Fondsenwerving) recognition
              as an additional quality mark
            </li>
          </ul>
        </Card>

        {/* Disclaimer */}
        <Card className="p-6 bg-muted/30 border-border/50">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Disclaimer:</strong> G.R.A.T.I.S. Foundation's ANBI
            application is currently being processed by the Belastingdienst.
            Until official confirmation is received, the tax benefits described
            on this page are not yet in effect. Donors are encouraged to consult
            a Dutch tax advisor (<em>belastingadviseur</em>) regarding the
            deductibility of their contributions. This page is provided for
            transparency and does not constitute tax or legal advice.
          </p>
        </Card>
      </div>
    </>
  );
}
