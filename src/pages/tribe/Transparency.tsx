import SEO from "@/components/SEO";

export default function Transparency() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Transparency — GRATIS TRIBE"
        description="Open books, public financials, and radical transparency. No secrets, no spin—just facts."
        canonical={
          typeof window !== "undefined"
            ? window.location.href
            : "/tribe/transparency"
        }
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            OPEN BOOKS. NO SECRETS.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Radical transparency isn't a marketing gimmick—it's how we operate.
            Full financial disclosure. Real-time data. Public everything.
          </p>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container py-16 space-y-16">
          {/* Transparency Philosophy */}
          <article className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              Why Radical Transparency?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Most NGOs hide behind "administrative costs" and vague impact
              reports. Not us. We publish everything—revenue, expenses,
              salaries, donations, mistakes, and all the messy details in
              between.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-accent/10 rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold">
                  Build Trust Through Truth
                </h3>
                <p className="text-muted-foreground">
                  Trust isn't built through marketing slogans—it's earned by
                  showing receipts. When you can verify every claim we make,
                  trust becomes inevitable. No corporate spin, no cherry-picked
                  data, just the full truth.
                </p>
              </div>
              <div className="bg-accent/10 rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold">
                  Accountability Through Exposure
                </h3>
                <p className="text-muted-foreground">
                  When everything is public, we're accountable to everyone.
                  Can't hide mistakes when they're published in real-time. Can't
                  spin numbers when the raw data is available for download.
                  Transparency forces excellence.
                </p>
              </div>
            </div>
          </article>

          {/* What We Publish */}
          <article className="border-t border-border pt-16 space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold">What We Publish</h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Everything. Seriously. Here's what you can access right now:
            </p>
            <div className="space-y-6">
              <div className="bg-muted/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Financial Data (Updated Daily)
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                      <span className="text-muted-foreground">
                        Total revenue by product line
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                      <span className="text-muted-foreground">
                        Advertising revenue from brand partners
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                      <span className="text-muted-foreground">
                        Merchandise sales and margins
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                      <span className="text-muted-foreground">
                        TRIBE membership revenue
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                      <span className="text-muted-foreground">
                        Operating expenses breakdown
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                      <span className="text-muted-foreground">
                        Employee salaries by role (anonymized)
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                      <span className="text-muted-foreground">
                        Marketing and advertising costs
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                      <span className="text-muted-foreground">
                        Production and logistics expenses
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Donation Tracking (Real-Time)
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                      <span className="text-muted-foreground">
                        Every donation with transaction ID
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                      <span className="text-muted-foreground">
                        Recipient NGO verification status
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                      <span className="text-muted-foreground">
                        Project allocation by cause category
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                      <span className="text-muted-foreground">
                        Cryptocurrency donations with blockchain hashes
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                      <span className="text-muted-foreground">
                        Monthly donation totals by partner
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                      <span className="text-muted-foreground">
                        Impact metrics per euro donated
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Governance & Operations
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                      <span className="text-muted-foreground">
                        Board member names and affiliations
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                      <span className="text-muted-foreground">
                        Decision-making processes
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                      <span className="text-muted-foreground">
                        Partner selection criteria
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                      <span className="text-muted-foreground">
                        Conflict of interest policies
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                      <span className="text-muted-foreground">
                        Annual meeting minutes (public)
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                      <span className="text-muted-foreground">
                        Strategic plans and roadmaps
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Live Transparency Dashboard */}
          <article className="border-t border-border pt-16 space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              Live Transparency Dashboard
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Don't just read about transparency—see it in action. Our dashboard
              updates in real-time with every transaction, donation, and
              expense.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-accent/10 rounded-lg">
                <div className="text-3xl font-bold mb-2">€247.891</div>
                <div className="text-sm text-muted-foreground">
                  Total donated (2025)
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Updated daily
                </div>
              </div>
              <div className="text-center p-6 bg-accent/10 rounded-lg">
                <div className="text-3xl font-bold mb-2">€512.403</div>
                <div className="text-sm text-muted-foreground">
                  Total revenue (2025)
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Audited quarterly
                </div>
              </div>
              <div className="text-center p-6 bg-accent/10 rounded-lg">
                <div className="text-3xl font-bold mb-2">47</div>
                <div className="text-sm text-muted-foreground">
                  NGO partners funded
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  All verified
                </div>
              </div>
              <div className="text-center p-6 bg-accent/10 rounded-lg">
                <div className="text-3xl font-bold mb-2">3.241</div>
                <div className="text-sm text-muted-foreground">
                  Individual donors
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  TRIBE members + one-time
                </div>
              </div>
            </div>
            <div className="text-center">
              <a
                href="https://gratis.ngo/impact"
                className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                View Full Dashboard →
              </a>
            </div>
          </article>

          {/* How to Access Data */}
          <article className="border-t border-border pt-16 space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              How to Access Our Data
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="text-4xl font-bold text-primary">1</div>
                <h3 className="text-xl font-semibold">Impact Dashboard</h3>
                <p className="text-muted-foreground">
                  Real-time donation tracking, revenue breakdowns, and impact
                  metrics. Public access at{" "}
                  <span className="text-primary font-medium">
                    gratis.ngo/impact
                  </span>
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-4xl font-bold text-primary">2</div>
                <h3 className="text-xl font-semibold">Financial Reports</h3>
                <p className="text-muted-foreground">
                  Annual and quarterly reports with full financial statements.
                  Download PDFs or view interactive data at{" "}
                  <span className="text-primary font-medium">
                    gratis.ngo/financials
                  </span>
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-4xl font-bold text-primary">3</div>
                <h3 className="text-xl font-semibold">Raw Data Exports</h3>
                <p className="text-muted-foreground">
                  Download CSV/JSON exports of all public data for independent
                  analysis. Available at{" "}
                  <span className="text-primary font-medium">
                    gratis.ngo/data
                  </span>
                </p>
              </div>
            </div>
          </article>

          {/* Transparency Standards */}
          <article className="border-t border-border pt-16 space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              Our Transparency Standards
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              We hold ourselves to these commitments:
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-muted/20 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">
                    Update Frequency: Daily
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Dashboard metrics refresh every 24 hours with previous day's
                    transactions
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-muted/20 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">
                    Audit Response: 30 Days
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    All independent audit reports published within 30 days of
                    completion
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-muted/20 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Data Access: Immediate</h4>
                  <p className="text-muted-foreground text-sm">
                    No login required for public dashboards. Raw data exports
                    available to anyone
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-muted/20 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">
                    Correction Policy: Public
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Any data errors corrected within 48 hours with public
                    notification and explanation
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* Footer CTA */}
          <article className="border-t border-border pt-16 text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              Questions? Request More Data.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Want specific data that's not published? Request it. If it doesn't
              compromise individual privacy or competitive strategy, we'll
              publish it within 7 days.
            </p>
            <div className="text-sm">
              <p className="text-muted-foreground">
                Data Requests:{" "}
                <a
                  href="mailto:transparency@gratis.ngo"
                  className="text-primary hover:underline"
                >
                  transparency@gratis.ngo
                </a>
              </p>
              <p className="text-muted-foreground mt-2">
                Response Time: Within 2 business days
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
