import { PageHero } from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Coins, AlertOctagon, HeartHandshake } from "lucide-react";

export default function DonationPolicies() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHero
        title="Donation Policies & Gift Acceptance"
        subtitle="Ensuring ethical funding, AML compliance, and transparent donor relations globally."
        lastUpdated="January 2024"
      />

      <div className="container max-w-4xl mx-auto space-y-12">
        <section className="space-y-6 text-foreground/80 leading-relaxed">
          <p className="text-lg">
            G.R.A.T.I.S. relies on the generosity of individuals, corporations,
            and foundations to fuel our impact. Our Donation and Gift Acceptance
            Policy ensures that all funding aligns with our mission, protects
            our reputation, and strictly complies with international financial
            regulations including US OFAC sanctions, EU AML directives, and
            Dutch ANBI rules.
          </p>

          <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <HeartHandshake className="w-8 h-8 text-[hsl(var(--brand-pink))]" />
                <h2 className="text-2xl font-bold text-foreground">
                  1. Types of Accepted Gifts
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    Standard Acceptance
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Cash and Cash Equivalents (Fiat)</li>
                    <li>Publicly Traded Securities</li>
                    <li>Cryptocurrency (Bitcoin, Ethereum, USDC, etc.)</li>
                    <li>Bequests and Legacy Gifts</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    Requires Board Approval
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Real Estate</li>
                    <li>Closely Held Securities</li>
                    <li>Restricted Grants over $100,000</li>
                    <li>Life Insurance Policies</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <AlertOctagon className="w-8 h-8 text-[hsl(var(--brand-pink))]" />
                <h2 className="text-2xl font-bold text-foreground">
                  2. Restrictions & Refusals
                </h2>
              </div>
              <p>
                We maintain the right to refuse any gift. Specifically, we will
                not accept donations that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Are derived from illegal activities or entities on
                  international sanctions lists (OFAC, EU Consolidated List, UN
                  Security Council).
                </li>
                <li>
                  Require us to deviate from our stated mission or compromise
                  our operational independence.
                </li>
                <li>
                  Come from industries fundamentally opposed to our values
                  (e.g., arms manufacturing, forced labor).
                </li>
                <li>
                  Carry restrictions that are discriminatory or violate equal
                  opportunity laws.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <ShieldCheck className="w-8 h-8 text-[hsl(var(--brand-pink))]" />
                <h2 className="text-2xl font-bold text-foreground">
                  3. KYC/AML Compliance
                </h2>
              </div>
              <p>
                To comply with the USA PATRIOT Act, the EU Anti-Money Laundering
                Directives (AMLD), and Dutch Wwft (Wet ter voorkoming van
                witwassen en financieren van terrorisme), we enforce strict Know
                Your Customer (KYC) protocols.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Anonymous Donations:</strong> Accepted only up to
                  $5,000 / €4,500.
                </li>
                <li>
                  <strong>Identity Verification:</strong> Donations exceeding
                  $10,000 / €9,000 require formal identity verification for
                  individuals or corporate registry verification (UBO checks)
                  for companies.
                </li>
                <li>
                  <strong>Suspicious Activity:</strong> Any irregular
                  transaction patterns, especially involving cryptocurrency, are
                  subject to internal review and potential reporting to
                  financial authorities (e.g., FinCEN in the US, FIU-Nederland).
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <Coins className="w-8 h-8 text-[hsl(var(--brand-pink))]" />
                <h2 className="text-2xl font-bold text-foreground">
                  4. Donor Privacy & Tax Receipts
                </h2>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[hsl(var(--brand-yellow))]">
                  Tax Deductibility
                </h3>
                <p className="text-sm">
                  G.R.A.T.I.S. is a recognized 501(c)(3) in the United States
                  and holds ANBI status in the Netherlands. Official tax
                  receipts compliant with IRS and Belastingdienst regulations
                  are issued for all eligible donations immediately upon
                  settlement.
                </p>

                <h3 className="text-lg font-semibold text-[hsl(var(--brand-yellow))] mt-4">
                  Data Privacy (GDPR/CCPA)
                </h3>
                <p className="text-sm">
                  We respect donor privacy. Personal data is handled in strict
                  accordance with the EU General Data Protection Regulation
                  (GDPR) and the California Consumer Privacy Act (CCPA). We do
                  not sell, trade, or rent donor information. Read our full{" "}
                  <a
                    href="/tribe/privacy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
