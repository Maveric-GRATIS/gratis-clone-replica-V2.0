import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DonationForm } from "@/components/spark/DonationForm";
import { SEO } from "@/components/SEO";
import { Droplets, Palette, GraduationCap } from "lucide-react";

const Verve = () => {
  return (
    <>
      <SEO 
        title="VERVE: Fuel the Movement"
        description="Every sip funds clean water, art programs, and education initiatives worldwide. Donate to GRATIS and make your impact count."
        canonical="https://gratis.ngo/spark/verve"
      />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
          <div className="relative max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              VERVE: FUEL THE MOVEMENT
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Every sip funds clean water, art programs, and education initiatives worldwide.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">€127K+</div>
                <div className="text-sm text-muted-foreground">Donated</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">254K</div>
                <div className="text-sm text-muted-foreground">Liters Provided</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">89</div>
                <div className="text-sm text-muted-foreground">Communities Reached</div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Areas */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">WHERE YOUR MONEY GOES</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-primary/5 border-primary/20 hover:border-primary/40 transition-all">
                <CardHeader>
                  <Droplets className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>Clean Water Access</CardTitle>
                  <CardDescription>Fund wells, filtration systems, and distribution networks</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    40% of donations go directly to water infrastructure projects in underserved communities.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-accent/5 border-accent/20 hover:border-accent/40 transition-all">
                <CardHeader>
                  <Palette className="w-12 h-12 text-accent mb-4" />
                  <CardTitle>Art & Culture Programs</CardTitle>
                  <CardDescription>Support local artists and creative education</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    30% funds art programs, murals, music lessons, and cultural preservation initiatives.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20 hover:border-primary/40 transition-all">
                <CardHeader>
                  <GraduationCap className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>Education Initiatives</CardTitle>
                  <CardDescription>Scholarships, school supplies, teacher training</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    30% supports education through scholarships, learning materials, and educational infrastructure.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Donation Form */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">MAKE IT COUNT</h2>
            <DonationForm />
          </div>
        </section>

        {/* Transparency */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">100% TRANSPARENT</h2>
            <p className="text-lg text-muted-foreground mb-8">
              We publish quarterly impact reports showing exactly how every euro is spent. 
              No corporate BS, no hidden fees—just real impact, tracked and verified.
            </p>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-card border border-border rounded-lg">
                <div className="text-2xl font-bold text-primary">40%</div>
                <div className="text-sm text-muted-foreground">Water Projects</div>
              </div>
              <div className="p-4 bg-card border border-border rounded-lg">
                <div className="text-2xl font-bold text-accent">30%</div>
                <div className="text-sm text-muted-foreground">Arts & Culture</div>
              </div>
              <div className="p-4 bg-card border border-border rounded-lg">
                <div className="text-2xl font-bold text-primary">30%</div>
                <div className="text-sm text-muted-foreground">Education</div>
              </div>
              <div className="p-4 bg-card border border-border rounded-lg">
                <div className="text-2xl font-bold text-muted-foreground">0%</div>
                <div className="text-sm text-muted-foreground">Admin Overhead*</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              *Admin costs covered by brand partnerships and product sales
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default Verve;
