import { PageHero } from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Box, Calculator, FileCheck, Scale } from "lucide-react";

export default function InKindValuation() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHero
        title="In-Kind Valuation Policy"
        subtitle="Guidelines for the acceptance, valuation, and reporting of non-cash contributions."
        lastUpdated="February 2024"
      />

      <div className="container max-w-4xl mx-auto space-y-12">
        <section className="space-y-6 text-foreground/80 leading-relaxed">
          <p className="text-lg">
            G.R.A.T.I.S. regularly accepts non-cash gifts, including products,
            professional services, and digital assets. Proper valuation and
            reporting of these in-kind contributions are essential for tax
            compliance under US IRS regulations, Dutch Belastingdienst rules,
            and international accounting standards.
          </p>

          <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <Box className="w-8 h-8 text-[hsl(var(--brand-pink))]" />
                <h2 className="text-2xl font-bold text-foreground">
                  1. Definition of In-Kind Gifts
                </h2>
              </div>
              <p>
                In-kind gifts include tangible personal property (e.g., apparel,
                equipment, technology), intangible personal property (e.g.,
                patents, copyrights, cryptocurrency), and specialized
                professional services.
              </p>
              <div className="p-4 bg-muted/30 rounded border border-border">
                <p className="text-sm">
                  <strong>Note on Volunteer Time:</strong> General volunteer
                  time is highly valued but cannot be recorded as a financial
                  contribution or tax deduction under IRS or Dutch tax laws.
                  Only specialized services (e.g., legal, accounting) that would
                  otherwise need to be purchased are recorded in financial
                  statements.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <Calculator className="w-8 h-8 text-[hsl(var(--brand-pink))]" />
                <h2 className="text-2xl font-bold text-foreground">
                  2. Valuation Methods
                </h2>
              </div>
              <p>
                Valuation is determined by Fair Market Value (FMV) at the time
                of the donation.
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <strong className="text-foreground">Tangible Goods:</strong>{" "}
                  Valued based on verifiable retail prices, wholesale cost (for
                  manufacturer donations), or independent appraisals.
                </li>
                <li>
                  <strong className="text-foreground">
                    Professional Services:
                  </strong>{" "}
                  Valued at the standard hourly or project rate of the
                  professional providing the service, provided the service
                  requires specialized skills and is provided by individuals
                  possessing those skills.
                </li>
                <li>
                  <strong className="text-foreground">
                    Digital Assets & Crypto:
                  </strong>{" "}
                  Valued at the recognized exchange rate on the exact date and
                  time the transfer is completed to our wallets.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <Scale className="w-8 h-8 text-[hsl(var(--brand-pink))]" />
                <h2 className="text-2xl font-bold text-foreground">
                  3. Legal Compliance & Thresholds
                </h2>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-[hsl(var(--brand-yellow))]">
                  United States (IRS)
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>
                    For gifts over $500, the donor must file IRS Form 8283.
                  </li>
                  <li>
                    For gifts over $5,000, a qualified independent appraisal is
                    required (obtained and paid for by the donor). G.R.A.T.I.S.
                    will sign Part IV of Form 8283 acknowledging receipt.
                  </li>
                  <li>
                    We provide written acknowledgment describing the items but
                    do NOT state the cash value on the receipt—valuation for tax
                    deduction purposes is the responsibility of the donor.
                  </li>
                </ul>

                <h3 className="font-semibold text-lg text-[hsl(var(--brand-yellow))] mt-4">
                  Netherlands (Belastingdienst) & EU
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>
                    Gifts in kind (giften in natura) must have an assignable
                    economic value in the Netherlands.
                  </li>
                  <li>
                    For corporate donors, VAT (BTW) implications must be
                    assessed; normally, giving away goods requires VAT
                    accounting by the donor unless specific relief applies.
                  </li>
                  <li>
                    We provide an official receipt specifying the exact goods
                    received and the date of receipt to support the donor's
                    corporate tax (Vpb) deductions.
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <FileCheck className="w-8 h-8 text-[hsl(var(--brand-pink))]" />
                <h2 className="text-2xl font-bold text-foreground">
                  4. Acceptance Criteria
                </h2>
              </div>
              <p>
                G.R.A.T.I.S. reserves the right to decline any in-kind donation.
                Contributions will be declined if:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>They conflict with our mission or ethical standards.</li>
                <li>
                  They would create an undue administrative, storage, or
                  financial burden.
                </li>
                <li>
                  The value is highly speculative or cannot be reasonably
                  utilized or liquidated.
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
