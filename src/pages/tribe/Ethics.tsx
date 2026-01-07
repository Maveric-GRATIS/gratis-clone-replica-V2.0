import SEO from "@/components/SEO";

export default function Ethics() {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Ethics — GRATIS TRIBE" 
        description="Real NGO partnerships, scholarship programs, and cultural authenticity. Everyone wins when we work together." 
        canonical={typeof window !== 'undefined' ? window.location.href : '/tribe/ethics'} 
      />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            REAL PARTNERS, REAL IMPACT
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Everyone wins when we work together. Brands get reach. Communities get FREE water. 
            NGOs get funding. No losers, only movement.
          </p>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container py-16 space-y-16">
          
          <article className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold">The GRATIS Model: Everyone Wins</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-accent/10 rounded-lg p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center font-bold text-xl">1</div>
                <h3 className="text-lg font-semibold">Brands Buy Ad Space</h3>
                <p className="text-sm text-muted-foreground">
                  Companies purchase advertising space on our premium water bottles. 
                  They get real visibility, real reach, real impact.
                </p>
              </div>
              <div className="bg-accent/10 rounded-lg p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center font-bold text-xl">2</div>
                <h3 className="text-lg font-semibold">Water Distributed FREE</h3>
                <p className="text-sm text-muted-foreground">
                  We give premium bottled water away for FREE to communities. Quality hydration 
                  shouldn't cost anything — it's a basic need.
                </p>
              </div>
              <div className="bg-accent/10 rounded-lg p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center font-bold text-xl">3</div>
                <h3 className="text-lg font-semibold">100% Revenue → NGOs</h3>
                <p className="text-sm text-muted-foreground">
                  Every euro from advertising goes directly to verified NGO partners fighting 
                  for real change worldwide.
                </p>
              </div>
            </div>
          </article>

          <article className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold">How We Choose NGO Partners</h2>
              <p className="text-muted-foreground leading-relaxed">
                We don't donate to just anyone. Every NGO partner is verified, licensed, 
                and proven effective. No fake charities, no vanity projects, no bullshit.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                  <div>
                    <h4 className="font-semibold">Registered & Licensed</h4>
                    <p className="text-sm text-muted-foreground">Must have government NGO registration and tax-exempt status</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                  <div>
                    <h4 className="font-semibold">Financial Transparency</h4>
                    <p className="text-sm text-muted-foreground">Published annual reports and verified financial statements</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                  <div>
                    <h4 className="font-semibold">Proven Track Record</h4>
                    <p className="text-sm text-muted-foreground">Documented impact and measurable outcomes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                  <div>
                    <h4 className="font-semibold">Diverse Focus Areas</h4>
                    <p className="text-sm text-muted-foreground">Supporting multiple causes from human rights to environment</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-muted/20 rounded-lg p-8 space-y-6">
              <h3 className="text-xl font-semibold">Current NGO Partners</h3>
              <div className="space-y-4">
                <div>
                  <div className="font-semibold mb-1">Free A Girl</div>
                  <p className="text-sm text-muted-foreground">Combating human trafficking and supporting survivors worldwide</p>
                  <a href="https://freeagirl.nl" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">freeagirl.nl</a>
                </div>
                <div>
                  <div className="font-semibold mb-1">Black Jaguar Foundation</div>
                  <p className="text-sm text-muted-foreground">Reforestation and biodiversity conservation in the Amazon</p>
                  <a href="https://blackjaguarfoundation.org" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">blackjaguarfoundation.org</a>
                </div>
                <div>
                  <div className="font-semibold mb-1">War Child</div>
                  <p className="text-sm text-muted-foreground">Supporting children affected by armed conflict globally</p>
                  <a href="https://warchild.org" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">warchild.org</a>
                </div>
              </div>
            </div>
          </article>

          <article className="bg-accent/10 rounded-lg p-8 md:p-12 space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold">Scholarship Program</h2>
            <p className="text-lg text-muted-foreground">
              Beyond NGO partnerships, we run direct scholarship programs supporting underprivileged 
              communities with access to sports, arts, and university education.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Sports Scholarships</h3>
                <p className="text-muted-foreground">
                  Funding athletic training, equipment, and competition fees for talented youth 
                  who can't afford access to elite sports programs.
                </p>
                <div className="text-sm font-semibold text-primary">Football, basketball, athletics, martial arts</div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Arts Programs</h3>
                <p className="text-muted-foreground">
                  Supporting creative education in music, visual arts, dance, and design for 
                  students from underrepresented communities.
                </p>
                <div className="text-sm font-semibold text-primary">Music production, graffiti, dance, digital art</div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">University Studies</h3>
                <p className="text-muted-foreground">
                  Full and partial scholarships covering tuition, books, and living expenses for 
                  first-generation university students.
                </p>
                <div className="text-sm font-semibold text-primary">All fields of study, preference to STEM and social work</div>
              </div>
            </div>
            <div className="bg-muted/20 rounded-lg p-6 mt-8">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold">127</div>
                  <div className="text-sm text-muted-foreground">Scholarships awarded</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">€340K</div>
                  <div className="text-sm text-muted-foreground">Total funding distributed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">92%</div>
                  <div className="text-sm text-muted-foreground">Program completion rate</div>
                </div>
              </div>
            </div>
          </article>

          <article className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold">Cultural Authenticity</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  GRATIS was born in the Netherlands' multicultural scene. We don't appropriate 
                  culture — we're built BY the culture, representing real diversity and authentic 
                  collaboration.
                </p>
                <div className="space-y-4">
                  <h4 className="font-semibold">Our Cultural Commitments:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span className="text-sm">Authentic collaboration with cultural creators</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span className="text-sm">Fair compensation for artists and contributors</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span className="text-sm">Platform for underrepresented voices</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span className="text-sm">No fake street credibility or cultural theft</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="bg-muted/20 rounded-lg p-6 space-y-4">
                <h4 className="font-semibold">Amsterdam Roots</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Founded in Amsterdam, one of Europe's most diverse cities, GRATIS reflects the 
                  multicultural energy of our home. Our team, advisors, and partners represent the 
                  global community that makes street culture authentic.
                </p>
                <div className="mt-4 text-xs">
                  <div className="font-semibold mb-2">Team Diversity</div>
                  <div className="space-y-1 text-muted-foreground">
                    <div>• 15+ nationalities represented</div>
                    <div>• 60%+ BIPOC leadership</div>
                    <div>• Multilingual operations (EN, NL, ES, FR, AR)</div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article className="border-t border-border pt-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Accountability & Verification</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
              We're not asking you to trust us blindly. Verify everything yourself.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-accent/10 rounded-lg">
                <div className="text-3xl font-bold mb-2">Public</div>
                <div className="text-sm text-muted-foreground">Donation tracking dashboard</div>
                <div className="text-xs text-muted-foreground mt-2">Real-time transparency for all donations</div>
              </div>
              <div className="text-center p-6 bg-accent/10 rounded-lg">
                <div className="text-3xl font-bold mb-2">Verified</div>
                <div className="text-sm text-muted-foreground">All NGO partners licensed</div>
                <div className="text-xs text-muted-foreground mt-2">Government registration confirmed</div>
              </div>
              <div className="text-center p-6 bg-accent/10 rounded-lg">
                <div className="text-3xl font-bold mb-2">Annual</div>
                <div className="text-sm text-muted-foreground">Impact reports published</div>
                <div className="text-xs text-muted-foreground mt-2">Full financial and impact transparency</div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}