import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AdvertisingPartnerForm from '@/components/AdvertisingPartnerForm';

import { CheckCircle2, Package, Heart, Target, TrendingUp, Users, Download, ArrowRight } from 'lucide-react';
import { SEO } from '@/components/SEO';

const Partners = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const benefits = [
    {
      icon: Package,
      title: 'Free Distribution',
      description: 'Your brand on products given away at festivals and street events'
    },
    {
      icon: Heart,
      title: 'Purpose-Driven',
      description: '100% profits fund clean water projects globally'
    },
    {
      icon: Target,
      title: 'Engaged Audience',
      description: 'Reach conscious consumers who value impact'
    },
    {
      icon: TrendingUp,
      title: 'Transparent Metrics',
      description: 'Track impressions, distribution, and real impact'
    },
    {
      icon: Users,
      title: 'Global Reach',
      description: 'Events, retail, and online distribution channels'
    }
  ];

  const tiers = [
    {
      name: 'Starter Pack',
      price: '€5,000',
      packs: '10,000 packs',
      features: [
        'Logo placement on packaging',
        'Distribution at major events',
        'Monthly impact report',
        'Social media mentions'
      ]
    },
    {
      name: 'Impact Pack',
      price: '€20,000',
      packs: '50,000 packs',
      features: [
        'Custom design collaboration',
        'Premium event distribution',
        'Dedicated case study',
        'Quarterly strategy sessions',
        'Partner spotlight feature'
      ],
      highlighted: true
    },
    {
      name: 'Movement Pack',
      price: '€50,000+',
      packs: '100,000+ packs',
      features: [
        'Full branding integration',
        'Exclusive campaign creation',
        'Year-round partnership',
        'Co-branded content',
        'VIP event access',
        'Custom impact dashboard'
      ]
    }
  ];

  const processSteps = [
    {
      number: '01',
      title: 'Apply',
      description: 'Submit your partnership inquiry through our application form'
    },
    {
      number: '02',
      title: 'Consult',
      description: 'Campaign consultation and custom design planning'
    },
    {
      number: '03',
      title: 'Produce',
      description: 'Production and quality assurance of branded products'
    },
    {
      number: '04',
      title: 'Distribute',
      description: 'Strategic distribution at events and retail locations'
    },
    {
      number: '05',
      title: 'Track',
      description: 'Real-time impact tracking and quarterly reports'
    }
  ];

  return (
    <>
      <SEO 
        title="Brand Partnerships - Partner With GRATIS"
        description="Join the brands making advertising meaningful. Partner with GRATIS to reach engaged audiences while funding clean water projects worldwide. 100% profits to NGOs."
      />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-background via-background to-primary/5">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6" variant="secondary">Brand Partnerships</Badge>
              <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                PARTNER WITH GRATIS
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-4">
                Your Brand. Our Mission. Real Impact.
              </p>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join the brands making advertising meaningful. Reach conscious consumers while funding clean water projects worldwide.
              </p>
              
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button size="xl" className="gap-2">
                    Become a Partner <ArrowRight className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Partner Application</DialogTitle>
                    <DialogDescription>
                      Tell us about your brand and campaign goals. We'll get back to you within 48 hours.
                    </DialogDescription>
                  </DialogHeader>
                  <AdvertisingPartnerForm onSuccess={() => setIsFormOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        {/* Impact Stats Banner */}
        <section className="py-12 bg-gradient-to-r from-primary/20 to-accent/20">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-black text-foreground mb-2">2.5M+</div>
                <div className="text-sm text-muted-foreground">Liters Funded</div>
              </div>
              <div>
                <div className="text-4xl font-black text-foreground mb-2">150+</div>
                <div className="text-sm text-muted-foreground">Events Reached</div>
              </div>
              <div>
                <div className="text-4xl font-black text-foreground mb-2">50K+</div>
                <div className="text-sm text-muted-foreground">Direct Impressions</div>
              </div>
              <div>
                <div className="text-4xl font-black text-foreground mb-2">25+</div>
                <div className="text-sm text-muted-foreground">Communities Served</div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Partner With GRATIS */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Why Advertise With GRATIS?
              </h2>
              <p className="text-lg text-muted-foreground">
                Transform your marketing budget into meaningful impact while reaching engaged, conscious consumers.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Partnership Tiers */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Partnership Tiers
              </h2>
              <p className="text-lg text-muted-foreground">
                Choose the partnership level that fits your brand's goals and budget.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {tiers.map((tier, index) => (
                <Card 
                  key={index} 
                  className={`relative ${tier.highlighted ? 'border-primary border-2 shadow-lg scale-105' : 'border-2'}`}
                >
                  {tier.highlighted && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <div className="text-3xl font-black text-primary mt-2">{tier.price}</div>
                    <CardDescription className="text-base font-semibold">{tier.packs}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {tier.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                How It Works
              </h2>
              <p className="text-lg text-muted-foreground">
                From application to impact, we make the process seamless.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {processSteps.map((step, index) => (
                  <div key={index} className="flex gap-6 items-start">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-black text-primary">{step.number}</span>
                    </div>
                    <div className="flex-1 pt-3">
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Partners Placeholder */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Our Partners
              </h2>
              <p className="text-lg text-muted-foreground">
                Join the brands making a difference.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-dashed">
                <CardContent className="py-20 text-center">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Be Our First Partner</h3>
                  <p className="text-muted-foreground mb-6">
                    Your brand logo could be featured here, inspiring others to join the movement.
                  </p>
                  <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                      <Button size="lg">Apply Now</Button>
                    </DialogTrigger>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/10 to-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-black mb-6">
                Ready to Make Advertising Meaningful?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Let's create a campaign that grows your brand while funding clean water worldwide.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                  <DialogTrigger asChild>
                    <Button size="xl" className="gap-2">
                      Apply Now <ArrowRight className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                </Dialog>
                
                <Button size="xl" variant="outline" className="gap-2">
                  <Download className="h-5 w-5" />
                  Download Media Kit
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Partners;
