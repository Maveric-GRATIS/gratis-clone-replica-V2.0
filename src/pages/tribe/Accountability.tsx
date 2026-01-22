import SEO from "@/components/SEO";

export default function Accountability() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Accountability — GRATIS TRIBE"
        description="Real-time tracking, verified impact, and independent audits. Every euro accounted for. Every claim verified."
        canonical={
          typeof window !== "undefined"
            ? window.location.href
            : "/tribe/accountability"
        }
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            TRUST, BUT VERIFY
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Real-time donation tracking. Independent audits. Public financial
            statements. We don't just promise accountability—we prove it.
          </p>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container py-16 space-y-16">
          {/* Accountability Framework */}
          <article className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              How We Stay Accountable
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Accountability isn't a buzzword—it's our operating system. Every
              euro donated, every project funded, every claim made is tracked,
              verified, and published for anyone to see.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-accent/10 rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold">Real-Time Dashboard</h3>
                <p className="text-muted-foreground">
                  Live tracking of all donations with full transaction history.
                  See exactly where every euro goes, updated daily with
                  blockchain-verified records for cryptocurrency donations and
                  bank statements for traditional payments.
                </p>
                <div className="text-sm text-primary font-medium">
                  Public access: gratis.ngo/impact
                </div>
              </div>
              <div className="bg-accent/10 rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold">Independent Audits</h3>
                <p className="text-muted-foreground">
                  Annual financial audits by certified Dutch accountants.
                  Quarterly reviews by independent NGO oversight bodies. All
                  reports published publicly within 30 days of completion—no
                  redactions, no exceptions.
                </p>
                <div className="text-sm text-primary font-medium">
                  Latest audit: Q4 2025 (pending)
                </div>
              </div>
            </div>
          </article>

          {/* Public Reporting */}
          <article className="border-t border-border pt-16 space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              Public Financial Reporting
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Full transparency means anyone can verify our claims. Here's what
              we publish:
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                  <div>
                    <h4 className="font-semibold">Annual Reports</h4>
                    <p className="text-sm text-muted-foreground">
                      Complete financial statements with revenue, expenses, and
                      impact metrics
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                  <div>
                    <h4 className="font-semibold">Quarterly Updates</h4>
                    <p className="text-sm text-muted-foreground">
                      Project progress reports and donation allocations by cause
                      category
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                  <div>
                    <h4 className="font-semibold">Monthly Dashboards</h4>
                    <p className="text-sm text-muted-foreground">
                      Live data feeds showing real-time donation flows and
                      impact metrics
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Verification Methods */}
          <article className="border-t border-border pt-16 space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              How to Verify Our Claims
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Don't take our word for it. Verify everything yourself:
            </p>
            <div className="space-y-6">
              <div className="bg-muted/20 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold">
                  1. Check NGO Registrations
                </h3>
                <p className="text-muted-foreground">
                  All partner NGOs must have verified government registration
                  and tax-exempt status. We publish registration numbers and
                  provide direct links to government databases (Dutch KVK, US
                  IRS 501(c)(3) registry, etc.).
                </p>
              </div>
              <div className="bg-muted/20 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold">
                  2. Review Financial Statements
                </h3>
                <p className="text-muted-foreground">
                  Download complete annual reports with certified accountant
                  signatures. Cross-reference donation amounts with partner NGO
                  public records. All discrepancies investigated and explained
                  publicly.
                </p>
              </div>
              <div className="bg-muted/20 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold">
                  3. Track Individual Donations
                </h3>
                <p className="text-muted-foreground">
                  Every donation generates a unique transaction ID. Use the
                  public dashboard to verify your contribution reached the
                  intended recipient. Cryptocurrency donations include
                  blockchain transaction hashes for independent verification.
                </p>
              </div>
            </div>
          </article>

          {/* Impact Metrics */}
          <article className="border-t border-border pt-16 space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              Accountability by the Numbers
            </h2>
            <p className="text-lg text-muted-foreground">
              Real data, updated daily. No spin, no marketing fluff.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-accent/10 rounded-lg">
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-sm text-muted-foreground">
                  Ad revenue donated
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Verified by independent auditors
                </div>
              </div>
              <div className="text-center p-6 bg-accent/10 rounded-lg">
                <div className="text-3xl font-bold mb-2">€247K</div>
                <div className="text-sm text-muted-foreground">
                  Total donated (2025)
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Audited & published
                </div>
              </div>
              <div className="text-center p-6 bg-accent/10 rounded-lg">
                <div className="text-3xl font-bold mb-2">47</div>
                <div className="text-sm text-muted-foreground">
                  Verified NGO partners
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  All with government registration
                </div>
              </div>
              <div className="text-center p-6 bg-accent/10 rounded-lg">
                <div className="text-3xl font-bold mb-2">4</div>
                <div className="text-sm text-muted-foreground">
                  Independent audits
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Annual + quarterly reviews
                </div>
              </div>
            </div>
          </article>

          {/* Legal Accountability */}
          <article className="border-t border-border pt-16 space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold">Legal Framework</h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              We're legally bound to maintain transparency and accountability:
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  Dutch Foundation (Stichting)
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                    <span className="text-muted-foreground">
                      Required annual reporting to Dutch government
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                    <span className="text-muted-foreground">
                      ANBI status pending (tax-exempt charity designation)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                    <span className="text-muted-foreground">
                      KVK registration number published publicly
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                    <span className="text-muted-foreground">
                      Mandatory financial audits by certified accountants
                    </span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  USA 501(c)(3) Application
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                    <span className="text-muted-foreground">
                      IRS tax-exempt status application pending (Q2 2026)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                    <span className="text-muted-foreground">
                      Form 990 public disclosure requirements
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                    <span className="text-muted-foreground">
                      Annual financial reporting to IRS
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                    <span className="text-muted-foreground">
                      Public charity operating restrictions
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </article>

          {/* Footer CTA */}
          <article className="border-t border-border pt-16 text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              Questions? Verify Everything.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See something that doesn't add up? Contact our Data Protection
              Officer. We respond to all accountability inquiries within 2
              business days.
            </p>
            <div className="text-sm">
              <p className="text-muted-foreground">
                DPO Contact:{" "}
                <a
                  href="mailto:dpo@gratis.ngo"
                  className="text-primary hover:underline"
                >
                  dpo@gratis.ngo
                </a>
              </p>
              <p className="text-muted-foreground mt-2">
                Impact Dashboard:{" "}
                <a
                  href="https://gratis.ngo/impact"
                  className="text-primary hover:underline"
                >
                  gratis.ngo/impact
                </a>
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
