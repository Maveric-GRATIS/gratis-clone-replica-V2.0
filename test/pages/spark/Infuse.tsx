import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InvestmentForm } from "@/components/spark/InvestmentForm";
import { SEO } from "@/components/SEO";
import { GraduationCap, TrendingUp, Users, BarChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Infuse = () => {
  return (
    <>
      <SEO 
        title="INFUSE: Invest in Futures"
        description="Fund scholarships and microcredit programs that build sustainable economies. Make an investment that creates lasting change."
        canonical="https://gratis.ngo/spark/infuse"
      />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-primary/10 to-background" />
          <div className="relative max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
              INFUSE: INVEST IN FUTURES
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Fund scholarships and microcredit programs that build sustainable economies.
            </p>
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-full px-6 py-3">
              <TrendingUp className="w-5 h-5 text-accent" />
              <span className="font-semibold">Financial + Social ROI</span>
            </div>
          </div>
        </section>

        {/* Investment Opportunities */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">INVESTMENT OPPORTUNITIES</h2>
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Scholarship Fund */}
              <Card className="bg-accent/10 border-accent/20 hover:border-accent/40 transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <GraduationCap className="w-12 h-12 text-accent" />
                    <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                      Social ROI
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">Scholarship Fund</CardTitle>
                  <CardDescription className="text-base">
                    Direct investment in education for underprivileged youth
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-background/50 p-4 rounded-lg">
                    <div className="text-sm font-semibold text-muted-foreground mb-2">IMPACT PER €500</div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-accent">✓</span>
                        <span>Full-year school tuition + supplies</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent">✓</span>
                        <span>Monthly mentorship program</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent">✓</span>
                        <span>Career guidance & skill development</span>
                      </li>
                    </ul>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="text-sm font-semibold mb-2">RETURNS</div>
                    <p className="text-sm text-muted-foreground">
                      Educated youth → community leaders → systemic change. Track your scholar's progress through quarterly updates.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Microcredit Program */}
              <Card className="bg-primary/10 border-primary/20 hover:border-primary/40 transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-12 h-12 text-primary" />
                    <Badge variant="secondary" className="bg-primary/20 text-primary-foreground">
                      Financial + Social ROI
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">Microcredit Program</CardTitle>
                  <CardDescription className="text-base">
                    Small loans for entrepreneurs in developing regions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-background/50 p-4 rounded-lg">
                    <div className="text-sm font-semibold text-muted-foreground mb-2">IMPACT PER €100</div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">✓</span>
                        <span>Startup capital for local business</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">✓</span>
                        <span>Jobs created in community</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">✓</span>
                        <span>Economic growth & local supply chains</span>
                      </li>
                    </ul>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="text-sm font-semibold mb-2">RETURNS</div>
                    <p className="text-sm text-muted-foreground">
                      95% repayment rate. Repaid loans fund new entrepreneurs. Your investment recycles to create self-sustaining economies.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Investment Form */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">INFUSE IMPACT</h2>
            <InvestmentForm />
          </div>
        </section>

        {/* Impact Tracking */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <BarChart className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">TRACK YOUR IMPACT</h2>
              <p className="text-lg text-muted-foreground">
                Every investor gets access to our impact dashboard with real-time updates on funded projects, 
                scholar progress reports, and loan repayment tracking.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-accent mb-2">127</div>
                  <div className="text-sm text-muted-foreground">Scholarships Funded</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-primary mb-2">€43K</div>
                  <div className="text-sm text-muted-foreground">Microcredit Deployed</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-accent mb-2">95%</div>
                  <div className="text-sm text-muted-foreground">Loan Repayment Rate</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Infuse;
