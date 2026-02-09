import SEO from "@/components/SEO";

export default function Responsibility() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Responsibility — GRATIS TRIBE"
        description="Impact tracking, diverse NGO projects, and environmental responsibility. Your reach, their support."
        canonical={
          typeof window !== "undefined"
            ? window.location.href
            : "/tribe/responsibility"
        }
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            YOUR REACH, THEIR SUPPORT
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Every bottle funds real change. Every sip supports diverse projects
            worldwide. Transparent impact, verified results.
          </p>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container py-16 space-y-16">
          <article className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              The GRATIS Impact Model
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Advertising revenue from brands → 100% donated to verified NGO
              partners → Funding diverse projects across human rights,
              environment, education, and community development.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-accent/10 rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold">Complete Transparency</h3>
                <p className="text-muted-foreground">
                  Every donation tracked publicly. Real-time dashboard shows
                  exactly where money goes and what impact it creates. No hidden
                  costs, no administrative fees deducted — 100% means 100%.
                </p>
              </div>
              <div className="bg-accent/10 rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold">Verified Impact</h3>
                <p className="text-muted-foreground">
                  All NGO partners provide quarterly impact reports. We track
                  lives changed, projects funded, communities supported. Real
                  metrics, real accountability.
                </p>
              </div>
            </div>
          </article>

          <article className="bg-muted/20 rounded-lg p-8 md:p-12 space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              Project Categories We Support
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🛡️</span>
                </div>
                <h3 className="text-lg font-semibold">Human Rights</h3>
                <p className="text-sm text-muted-foreground">
                  Free A Girl's anti-trafficking programs, survivor support, and
                  prevention education
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🌳</span>
                </div>
                <h3 className="text-lg font-semibold">Environment</h3>
                <p className="text-sm text-muted-foreground">
                  Black Jaguar Foundation reforestation, biodiversity
                  protection, climate action
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">👶</span>
                </div>
                <h3 className="text-lg font-semibold">Children & Conflict</h3>
                <p className="text-sm text-muted-foreground">
                  War Child programs supporting children affected by armed
                  conflict worldwide
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🎓</span>
                </div>
                <h3 className="text-lg font-semibold">Education</h3>
                <p className="text-sm text-muted-foreground">
                  GRATIS Scholarship programs: sports, arts, and university
                  funding for underprivileged youth
                </p>
              </div>
            </div>
          </article>

          <article className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold">Impact Metrics</h2>
              <p className="text-muted-foreground leading-relaxed">
                We're an NGO — transparency isn't optional, it's mandatory.
                Here's what your support (through brand partnerships) has
                achieved.
              </p>
              <div className="space-y-4">
                <div className="bg-muted/10 rounded-lg p-4">
                  <div className="text-2xl font-bold mb-1">€850K+</div>
                  <div className="text-sm text-muted-foreground">
                    Total donated to NGO partners (2023-2024)
                  </div>
                </div>
                <div className="bg-muted/10 rounded-lg p-4">
                  <div className="text-2xl font-bold mb-1">127</div>
                  <div className="text-sm text-muted-foreground">
                    Scholarships awarded to underprivileged students
                  </div>
                </div>
                <div className="bg-muted/10 rounded-lg p-4">
                  <div className="text-2xl font-bold mb-1">15K+</div>
                  <div className="text-sm text-muted-foreground">
                    Lives directly impacted through partner programs
                  </div>
                </div>
                <div className="bg-muted/10 rounded-lg p-4">
                  <div className="text-2xl font-bold mb-1">32</div>
                  <div className="text-sm text-muted-foreground">
                    Active projects funded across 4 continents
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold">
                NGO Partner Directory
              </h2>
              <p className="text-muted-foreground">
                Don't just take our word for it. Visit our partners directly and
                verify their work.
              </p>
              <div className="space-y-4">
                <div className="border border-border rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold">Free A Girl</h4>
                  <p className="text-sm text-muted-foreground">
                    Fighting human trafficking and supporting survivors
                    worldwide with prevention, rescue, and reintegration
                    programs.
                  </p>
                  <a
                    href="https://freeagirl.nl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Visit website →
                  </a>
                </div>
                <div className="border border-border rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold">Black Jaguar Foundation</h4>
                  <p className="text-sm text-muted-foreground">
                    Restoring the Araguaia Biodiversity Corridor in Brazil,
                    planting millions of trees and protecting endangered
                    species.
                  </p>
                  <a
                    href="https://blackjaguarfoundation.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Visit website →
                  </a>
                </div>
                <div className="border border-border rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold">War Child</h4>
                  <p className="text-sm text-muted-foreground">
                    Providing education, psychosocial support, and protection to
                    children affected by armed conflict in 15 countries.
                  </p>
                  <a
                    href="https://warchild.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Visit website →
                  </a>
                </div>
              </div>
            </div>
          </article>

          <article className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              Environmental Responsibility
            </h2>
            <p className="text-muted-foreground max-w-3xl">
              Supporting environmental NGOs means we have to walk the talk. Our
              operations minimize environmental impact while maximizing social
              good.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-accent/10 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold">FREE Water Model</h3>
                <p className="text-sm text-muted-foreground">
                  Distributing water FREE reduces waste from individually
                  purchased bottles. People take what they need, not what
                  they're forced to buy.
                </p>
                <div className="text-xs font-semibold text-primary">
                  Estimated 40% reduction in per-capita plastic waste
                </div>
              </div>
              <div className="bg-accent/10 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold">Sustainable Packaging</h3>
                <p className="text-sm text-muted-foreground">
                  100% recyclable materials, water-based inks, minimalist design
                  for easier recycling and reduced material use.
                </p>
                <div className="text-xs font-semibold text-primary">
                  Carbon footprint 60% lower than industry average
                </div>
              </div>
              <div className="bg-accent/10 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold">Local Distribution</h3>
                <p className="text-sm text-muted-foreground">
                  Regional sourcing and distribution minimize transportation
                  emissions while supporting local economies.
                </p>
                <div className="text-xs font-semibold text-primary">
                  Average delivery distance: under 200km
                </div>
              </div>
            </div>
          </article>

          <article className="bg-accent/10 rounded-lg p-8 md:p-12 space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              Transparency Dashboard
            </h2>
            <p className="text-lg text-muted-foreground">
              Live tracking of all donations and impact metrics. Public access,
              updated daily. No secrets, no spin — just facts.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-muted/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold mb-1">€47.2K</div>
                <div className="text-xs text-muted-foreground">
                  Donated this quarter
                </div>
              </div>
              <div className="bg-muted/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold mb-1">1.847</div>
                <div className="text-xs text-muted-foreground">
                  Lives impacted this month
                </div>
              </div>
              <div className="bg-muted/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold mb-1">12</div>
                <div className="text-xs text-muted-foreground">
                  New scholarships awarded
                </div>
              </div>
              <div className="bg-muted/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold mb-1">100%</div>
                <div className="text-xs text-muted-foreground">
                  Ad revenue donated
                </div>
              </div>
            </div>
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                Full impact dashboard:{" "}
                <span className="font-semibold text-primary">
                  gratis.ngo/impact
                </span>
              </p>
            </div>
          </article>

          <article className="border-t border-border pt-16 text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              Verified. Transparent. Accountable.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              GRATIS is a registered NGO committed to full transparency. Every
              claim backed by documentation. Every donation tracked publicly.
              Every impact metric verified.
            </p>
            <div className="inline-flex flex-col sm:flex-row gap-4 text-sm">
              <div className="px-4 py-2 bg-muted/20 rounded-lg">
                <span className="font-semibold">Annual Reports:</span> Published
                quarterly
              </div>
              <div className="px-4 py-2 bg-muted/20 rounded-lg">
                <span className="font-semibold">Financial Audits:</span>{" "}
                Independent review
              </div>
              <div className="px-4 py-2 bg-muted/20 rounded-lg">
                <span className="font-semibold">NGO Status:</span> Netherlands
                registered
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
