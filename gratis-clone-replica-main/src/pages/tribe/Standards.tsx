import SEO from "@/components/SEO";

export default function Standards() {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Standards — GRATIS TRIBE" 
        description="NGO compliance, financial transparency, and partner verification. Every euro accounted for. Every claim backed by registration." 
        canonical={typeof window !== 'undefined' ? window.location.href : '/tribe/standards'} 
      />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            TRUST, VERIFIED
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Every euro accounted for. Every partner verified. Every claim backed by registration.
          </p>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container py-16 space-y-16">
          
          <article className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold">NGO Registration & Compliance</h2>
              <p className="text-muted-foreground leading-relaxed">
                GRATIS is a registered non-profit organization operating under Dutch charity law. 
                We're not just inspired by the movement — we ARE the movement, legally structured 
                to maximize impact.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                No corporate greenwashing. No fake charity claims. Just verified NGO status with 
                full regulatory compliance and public accountability.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                  <div>
                    <h4 className="font-semibold">Netherlands NGO Registration</h4>
                    <p className="text-sm text-muted-foreground">KvK number verified, tax-exempt status granted</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                  <div>
                    <h4 className="font-semibold">Annual Independent Audits</h4>
                    <p className="text-sm text-muted-foreground">Financial statements reviewed by certified auditors</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                  <div>
                    <h4 className="font-semibold">Public Financial Reporting</h4>
                    <p className="text-sm text-muted-foreground">Complete transparency on all revenue and donations</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-muted/20 rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-4">By the Numbers</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ad revenue to NGOs</span>
                  <span className="font-semibold">100%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Financial transparency</span>
                  <span className="font-semibold">Total</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Annual audits</span>
                  <span className="font-semibold">Independent</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Public reports</span>
                  <span className="font-semibold">Quarterly</span>
                </div>
              </div>
            </div>
          </article>

          <article className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold">Financial Transparency</h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              The GRATIS model is simple: brands buy advertising space on our bottles. We distribute 
              water FREE to communities. 100% of advertising revenue goes directly to verified NGO partners.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-accent/10 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold">Revenue Flow</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>Brands purchase ad space on bottles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>Water distributed FREE to communities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>100% ad revenue → NGO partners</span>
                  </div>
                </div>
              </div>
              <div className="bg-accent/10 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold">Donation Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time public dashboard shows every euro donated to each partner NGO. 
                  Complete transparency, no hidden fees.
                </p>
                <div className="text-xs font-semibold text-primary mt-4">
                  Live tracking: gratis.ngo/impact
                </div>
              </div>
              <div className="bg-accent/10 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold">Annual Reports</h3>
                <p className="text-sm text-muted-foreground">
                  Published financial statements verified by independent auditors. 
                  Full breakdown of revenue, donations, and operational costs.
                </p>
                <div className="text-xs font-semibold text-primary mt-4">
                  Reports available publicly
                </div>
              </div>
            </div>
          </article>

          <article className="bg-muted/20 rounded-lg p-8 md:p-12 space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold">Partner NGO Vetting Process</h2>
            <p className="text-lg text-muted-foreground">
              We don't donate to just anyone. Every NGO partner must meet strict verification 
              standards and maintain ongoing transparency.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Selection Criteria</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                    <div>
                      <div className="font-semibold">Verified Registration</div>
                      <div className="text-sm text-muted-foreground">Must be registered NGO/non-profit with government</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                    <div>
                      <div className="font-semibold">Financial Transparency</div>
                      <div className="text-sm text-muted-foreground">Public financial statements and annual reports required</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                    <div>
                      <div className="font-semibold">Proven Impact</div>
                      <div className="text-sm text-muted-foreground">Documented track record of measurable outcomes</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                    <div>
                      <div className="font-semibold">Ethical Operations</div>
                      <div className="text-sm text-muted-foreground">No corruption, exploitation, or appropriation</div>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Ongoing Verification</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-border pb-2">
                    <span>Impact report reviews</span>
                    <span className="font-semibold">Quarterly</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span>Financial audits</span>
                    <span className="font-semibold">Annual</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span>Community feedback</span>
                    <span className="font-semibold">Continuous</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span>Performance evaluation</span>
                    <span className="font-semibold">Bi-annual</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold">Product Quality Standards</h2>
            <p className="text-muted-foreground max-w-3xl">
              Just because we give water away FREE doesn't mean we compromise on quality. 
              Premium hydration matters — your health matters.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-muted/10 rounded-lg p-6 text-center space-y-3">
                <div className="w-16 h-16 bg-primary/20 rounded-lg mx-auto flex items-center justify-center">
                  <span className="text-xs font-bold">HACCP</span>
                </div>
                <div className="text-sm font-semibold">HACCP Certified</div>
                <div className="text-xs text-muted-foreground">Hazard Analysis Critical Control</div>
              </div>
              <div className="bg-muted/10 rounded-lg p-6 text-center space-y-3">
                <div className="w-16 h-16 bg-primary/20 rounded-lg mx-auto flex items-center justify-center">
                  <span className="text-xs font-bold">ISO</span>
                </div>
                <div className="text-sm font-semibold">ISO 22000</div>
                <div className="text-xs text-muted-foreground">Food Safety Management</div>
              </div>
              <div className="bg-muted/10 rounded-lg p-6 text-center space-y-3">
                <div className="w-16 h-16 bg-primary/20 rounded-lg mx-auto flex items-center justify-center">
                  <span className="text-xs font-bold">EU</span>
                </div>
                <div className="text-sm font-semibold">EU Compliant</div>
                <div className="text-xs text-muted-foreground">European Safety Standards</div>
              </div>
              <div className="bg-muted/10 rounded-lg p-6 text-center space-y-3">
                <div className="w-16 h-16 bg-primary/20 rounded-lg mx-auto flex items-center justify-center">
                  <span className="text-xs font-bold">NL</span>
                </div>
                <div className="text-sm font-semibold">NVWA Approved</div>
                <div className="text-xs text-muted-foreground">Dutch Food Authority</div>
              </div>
            </div>
          </article>

          <article className="border-t border-border pt-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Transparency Report</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
              Real accountability means public data. Here's what we track and publish for anyone to verify.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-accent/10 rounded-lg">
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Ad revenue donated to NGOs</div>
                <div className="text-xs text-muted-foreground mt-2">Verified by independent auditors</div>
              </div>
              <div className="text-center p-6 bg-accent/10 rounded-lg">
                <div className="text-3xl font-bold mb-2">Real-Time</div>
                <div className="text-sm text-muted-foreground">Donation tracking dashboard</div>
                <div className="text-xs text-muted-foreground mt-2">Public access, updated daily</div>
              </div>
              <div className="text-center p-6 bg-accent/10 rounded-lg">
                <div className="text-3xl font-bold mb-2">Quarterly</div>
                <div className="text-sm text-muted-foreground">Published financial reports</div>
                <div className="text-xs text-muted-foreground mt-2">Full breakdown, no hidden costs</div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}