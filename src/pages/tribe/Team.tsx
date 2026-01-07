import SEO from "@/components/SEO";
import InquiryForm from "@/components/InquiryForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Team() {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Team — GRATIS TRIBE" 
        description="From Amsterdam with purpose. The NGO movement making impact accessible through FREE water and 100% donations to verified partners." 
        canonical={typeof window !== 'undefined' ? window.location.href : '/tribe/team'} 
      />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            FROM AMSTERDAM WITH PURPOSE
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            We're not a brand pretending to care. We're a registered NGO built to fund real change 
            through the most democratic product on earth: FREE water.
          </p>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container py-16 space-y-16">
          
          <article className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold">The Origin Story</h2>
              <p className="text-muted-foreground leading-relaxed">
                GRATIS was born in Amsterdam's multicultural scene where diverse communities taught 
                us one truth: real impact happens when everyone wins together.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We asked a simple question: What if premium water could be FREE for communities AND 
                fund NGOs fighting for real change? What if we flipped the entire beverage industry 
                on its head?
              </p>
              <p className="text-muted-foreground leading-relaxed">
                So we built an NGO that sells advertising space on bottles, distributes water for 
                FREE, and donates 100% of ad revenue to verified NGO partners. No corporate profits. 
                No shareholders. Just movement.
              </p>
            </div>
            <div className="bg-muted/20 rounded-lg p-8 space-y-6">
              <h3 className="text-xl font-semibold">Why We're an NGO</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                  <div>
                    <div className="font-semibold">Maximum Impact</div>
                    <div className="text-muted-foreground">100% of revenue to partners—no profit extraction</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                  <div>
                    <div className="font-semibold">Legal Accountability</div>
                    <div className="text-muted-foreground">Regulated by Dutch charity law with mandatory audits</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                  <div>
                    <div className="font-semibold">Public Transparency</div>
                    <div className="text-muted-foreground">Financial statements published, donations tracked publicly</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="inline-block mt-1.5 h-2 w-2 rounded-full bg-primary"></span>
                  <div>
                    <div className="font-semibold">Tax Efficiency</div>
                    <div className="text-muted-foreground">Tax-exempt status means more money to impact</div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Team Structure Section */}
          <article className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-extrabold">WHO MAKES IT HAPPEN</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Transparency is everything. Meet the people building GRATIS—from governance to ground-level operations.
              </p>
            </div>

            {/* Board of Directors */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Board of Directors</h3>
              <p className="text-muted-foreground max-w-2xl">
                Independent governance ensuring legal compliance, financial accountability, and strategic oversight.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Amara Okafor</CardTitle>
                    <CardDescription>Board Chair</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">Legal & Governance</Badge>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      15+ years in NGO law and charity governance. Former legal advisor to multiple European foundations. 
                      Ensures GRATIS meets all regulatory requirements and ethical standards.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Lars van Bergen</CardTitle>
                    <CardDescription>Board Treasurer</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">Finance & Audit</Badge>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Chartered accountant with expertise in nonprofit financial management. Oversees all financial 
                      reporting, audits, and ensures 100% donation transparency.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Sofia Martínez</CardTitle>
                    <CardDescription>Board Member</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">Social Impact</Badge>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      International development specialist with 20 years in community programs across Latin America 
                      and Europe. Guides impact strategy and partner selection.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Advisory Council */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Advisory Council</h3>
              <p className="text-muted-foreground max-w-2xl">
                Strategic experts keeping us sharp, authentic, and effective.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="bg-accent/10 border-accent/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Dr. Kwame Asante</CardTitle>
                    <CardDescription className="text-xs">NGO Operations Advisor</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      25 years managing aid operations in Africa. Optimizes distribution efficiency and partner vetting.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-accent/10 border-accent/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Yasmin Al-Rahman</CardTitle>
                    <CardDescription className="text-xs">Impact Measurement Advisor</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      PhD in social impact metrics. Designs tracking systems for transparent donation reporting.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-accent/10 border-accent/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Jamal Thompson</CardTitle>
                    <CardDescription className="text-xs">Cultural Authenticity Advisor</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Amsterdam street culture leader, DJ, community organizer. Keeps GRATIS real and accountable to the culture.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-accent/10 border-accent/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Nina Petrova</CardTitle>
                    <CardDescription className="text-xs">Brand Partnerships Advisor</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Former CMO at major brands. Guides ethical advertising partnerships and revenue strategy.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-accent/10 border-accent/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Dr. Henrik Lindström</CardTitle>
                    <CardDescription className="text-xs">Environmental Sustainability Advisor</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Environmental scientist specializing in circular packaging and carbon neutrality in supply chains.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Core Team - 8 FTEs */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Core Team (8 FTEs)</h3>
              <p className="text-muted-foreground max-w-2xl">
                The full-time crew making FREE water and NGO funding happen every single day.
              </p>

              {/* Founders & Leadership */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold flex items-center gap-2">
                  Founders & Leadership
                  <Badge className="bg-primary text-primary-foreground">3 FTEs</Badge>
                </h4>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="bg-primary/10 border-primary/30">
                    <CardHeader className="text-center pb-3">
                      <Avatar className="w-20 h-20 mx-auto mb-3">
                        <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">DC</AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-lg">Daan Claassen</CardTitle>
                      <CardDescription>Co-Founder & Executive Director</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="secondary" className="text-xs">Vision</Badge>
                        <Badge variant="secondary" className="text-xs">NGO Strategy</Badge>
                        <Badge variant="secondary" className="text-xs">External Relations</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        From Amsterdam street scene. Sets overall direction, builds partnerships with major NGOs, 
                        represents GRATIS publicly.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-primary/10 border-primary/30">
                    <CardHeader className="text-center pb-3">
                      <Avatar className="w-20 h-20 mx-auto mb-3">
                        <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">MP</AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-lg">Mariam Patel</CardTitle>
                      <CardDescription>Co-Founder & Operations Director</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="secondary" className="text-xs">Operations</Badge>
                        <Badge variant="secondary" className="text-xs">Logistics</Badge>
                        <Badge variant="secondary" className="text-xs">Distribution</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Supply chain expert. Manages day-to-day operations, ensures FREE water reaches communities, 
                        oversees production and distribution.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-primary/10 border-primary/30">
                    <CardHeader className="text-center pb-3">
                      <Avatar className="w-20 h-20 mx-auto mb-3">
                        <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">EK</AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-lg">Emmanuel Kofi</CardTitle>
                      <CardDescription>Co-Founder & Partnerships Director</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="secondary" className="text-xs">Brand Deals</Badge>
                        <Badge variant="secondary" className="text-xs">NGO Relations</Badge>
                        <Badge variant="secondary" className="text-xs">Revenue</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Sales and partnership background. Secures advertising deals with brands, vets new NGO partners, 
                        drives revenue growth.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* NGO Operations */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold flex items-center gap-2">
                  NGO Operations
                  <Badge className="bg-secondary text-secondary-foreground">5 FTEs</Badge>
                </h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="bg-accent/10 border-accent/20">
                    <CardHeader className="pb-3">
                      <Avatar className="w-16 h-16 mb-2">
                        <AvatarFallback className="bg-accent/20 text-lg font-semibold">TN</AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-base">Tara Nguyen</CardTitle>
                      <CardDescription className="text-xs">Impact Manager</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Vets NGO partners, tracks donations, manages scholarship program, ensures impact transparency.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-accent/10 border-accent/20">
                    <CardHeader className="pb-3">
                      <Avatar className="w-16 h-16 mb-2">
                        <AvatarFallback className="bg-accent/20 text-lg font-semibold">JB</AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-base">Javier Bernal</CardTitle>
                      <CardDescription className="text-xs">Brand Partnerships Manager</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Sells advertising space, manages brand relationships, negotiates contracts, ensures ethical partnerships.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-accent/10 border-accent/20">
                    <CardHeader className="pb-3">
                      <Avatar className="w-16 h-16 mb-2">
                        <AvatarFallback className="bg-accent/20 text-lg font-semibold">LW</AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-base">Lotte de Wit</CardTitle>
                      <CardDescription className="text-xs">Distribution & Logistics Coordinator</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Coordinates FREE water distribution, manages supply chain, handles event logistics and inventory.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-accent/10 border-accent/20">
                    <CardHeader className="pb-3">
                      <Avatar className="w-16 h-16 mb-2">
                        <AvatarFallback className="bg-accent/20 text-lg font-semibold">ZM</AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-base">Zara Mensah</CardTitle>
                      <CardDescription className="text-xs">Marketing & Community Manager</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Runs social media, builds community engagement, creates content, organizes cultural events and activations.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-accent/10 border-accent/20">
                    <CardHeader className="pb-3">
                      <Avatar className="w-16 h-16 mb-2">
                        <AvatarFallback className="bg-accent/20 text-lg font-semibold">RJ</AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-base">Ravi Joshi</CardTitle>
                      <CardDescription className="text-xs">Finance & Compliance Officer</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Manages financial reporting, ensures regulatory compliance, coordinates audits, tracks all donations.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </article>

          <article className="bg-accent/10 rounded-lg p-8 md:p-12 space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold">The GRATIS Movement Philosophy</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Making Impact Accessible</h3>
                <p className="text-muted-foreground">
                  We reject guilt-driven charity. GRATIS is about making helping fun, accessible, 
                  and part of everyday life. FREE water + NGO funding = everyone wins.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Street Culture Mentality</h3>
                <p className="text-muted-foreground">
                  Real recognize real. No corporate BS, no fake activism. We're built by 
                  multicultural communities who taught us authenticity matters more than marketing.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Fun Activism</h3>
                <p className="text-muted-foreground">
                  Hydration shouldn't be boring. Impact shouldn't be preachy. We combine culture, 
                  creativity, and purpose into something people actually want to be part of.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Everyone Wins Model</h3>
                <p className="text-muted-foreground">
                  Brands get visibility. Communities get FREE water. NGOs get funding. No exploitation, 
                  no losers—just collaborative impact.
                </p>
              </div>
            </div>
          </article>

          <article className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Advisory & Operations</h2>
            <p className="text-lg text-muted-foreground max-w-3xl">
              GRATIS is guided by experts in NGO operations, impact measurement, cultural authenticity, 
              and social enterprise to ensure we stay accountable and effective.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-muted/10 rounded-lg p-6 space-y-3">
                <h4 className="font-semibold">NGO Leadership</h4>
                <p className="text-sm text-muted-foreground">
                  Experienced directors with backgrounds in international development, charity 
                  operations, and social impact.
                </p>
              </div>
              <div className="bg-muted/10 rounded-lg p-6 space-y-3">
                <h4 className="font-semibold">Impact Advisors</h4>
                <p className="text-sm text-muted-foreground">
                  Experts in measuring social impact, vetting NGO partners, and ensuring transparent 
                  donation flows.
                </p>
              </div>
              <div className="bg-muted/10 rounded-lg p-6 space-y-3">
                <h4 className="font-semibold">Cultural Board</h4>
                <p className="text-sm text-muted-foreground">
                  Community leaders, artists, and organizers keeping us authentic and accountable 
                  to the culture.
                </p>
              </div>
            </div>
          </article>

          <article className="border-t border-border pt-16 space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold">The Vision</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We're building a world where every sip contributes to positive change. Where FREE 
                  premium water is accessible to everyone. Where NGOs get sustainable funding through 
                  creative partnerships.
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>Scale FREE water distribution across Europe and beyond</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>Expand NGO partnerships to support more diverse causes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>Grow scholarship program to hundreds of students annually</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>Prove consumption can = contribution when structured right</span>
                  </div>
                </div>
              </div>
              <div className="bg-primary/10 rounded-lg p-8 space-y-4">
                <h3 className="text-xl font-semibold">2026 Goals</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-border pb-2">
                    <span>Total NGO donations</span>
                    <span className="font-semibold">€2M+</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span>Scholarships awarded</span>
                    <span className="font-semibold">250+</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span>FREE bottles distributed</span>
                    <span className="font-semibold">5M+</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span>NGO partners</span>
                    <span className="font-semibold">10+</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article className="text-center space-y-6 bg-accent/10 rounded-lg p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold">Join the Movement</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              GRATIS is always looking for authentic people who share our values—whether you want 
              to work with us, partner with us, or apply for scholarships.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-sm mb-8">
              <div className="bg-background rounded-lg p-4">
                <div className="font-semibold mb-2">Brand Partners</div>
                <div className="text-muted-foreground">Advertise on bottles, fund real change</div>
              </div>
              <div className="bg-background rounded-lg p-4">
                <div className="font-semibold mb-2">NGO Partners</div>
                <div className="text-muted-foreground">Apply to receive funding support</div>
              </div>
              <div className="bg-background rounded-lg p-4">
                <div className="font-semibold mb-2">Scholarships</div>
                <div className="text-muted-foreground">Apply for sports, arts, university funding</div>
              </div>
            </div>
            <InquiryForm />
          </article>
        </div>
      </section>
    </div>
  );
}