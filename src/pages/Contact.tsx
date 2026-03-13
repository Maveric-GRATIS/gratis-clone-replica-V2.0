import { useState } from 'react';
import { SEO } from '@/components/SEO';
import { SocialProof } from '@/components/SocialProof';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { QualifierWizard, type QualificationData } from '@/components/contact/QualifierWizard';
import { AIChat } from '@/components/contact/AIChat';
import { Bot, Sparkles, Shield, Zap } from 'lucide-react';

const Contact = () => {
  const [qualificationData, setQualificationData] = useState<QualificationData | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Contact GRATIS — Smart Inquiry Assistant"
        description="Get instant help from GRATIS Connect, our AI-powered intake assistant. We'll guide you to the right team for partnerships, sponsorships, volunteering, or support."
        canonical="/contact"
      />

      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Bot className="h-4 w-4" />
            AI-Powered Intake
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
            {qualificationData ? 'GRATIS CONNECT' : 'HOW CAN WE HELP?'}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}>
            {qualificationData
              ? 'Chat with our AI assistant — it\'ll guide you to the right team or answer your question directly.'
              : 'Answer a few quick questions and we\'ll connect you with exactly the right person or resource.'}
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 pb-16">
        {/* Wizard or Chat */}
        <div className="mb-16">
          {!qualificationData ? (
            <ScrollReveal>
              <QualifierWizard onComplete={setQualificationData} />
            </ScrollReveal>
          ) : (
            <AIChat
              qualificationData={qualificationData}
              onRestart={() => setQualificationData(null)}
            />
          )}
        </div>

        {/* Trust badges */}
        {!qualificationData && (
          <ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
              {[
                { icon: Sparkles, label: 'Instant AI Answers', desc: 'Get help in seconds, not days' },
                { icon: Shield, label: 'Human Backup', desc: 'Request a callback anytime' },
                { icon: Zap, label: 'Smart Routing', desc: 'We match you to the right team' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{item.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* Social Proof */}
        <ScrollReveal>
          <SocialProof variant="stats" />
        </ScrollReveal>

        {/* FAQ */}
        <ScrollReveal>
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-center mb-8 text-foreground">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-2">
                <AccordionItem value="sustainability" className="bg-card border border-border rounded-lg px-6">
                  <AccordionTrigger className="font-medium text-foreground">
                    How is tetrapack more sustainable?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm">
                    Tetrapack uses 70% less plastic than traditional bottles and has a
                    significantly lower carbon footprint. Plus, they're fully recyclable
                    in most areas.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="buy" className="bg-card border border-border rounded-lg px-6">
                  <AccordionTrigger className="font-medium text-foreground">
                    Where can I buy GRATIS products?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm">
                    Our products are available online through our store and at select
                    retailers nationwide. Check our store locator for the nearest location.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="bulk" className="bg-card border border-border rounded-lg px-6">
                  <AccordionTrigger className="font-medium text-foreground">
                    Do you offer bulk orders?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm">
                    Yes! We offer bulk pricing for businesses, events, and organizations.
                    Use our AI assistant above for custom pricing and delivery options.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </ScrollReveal>
      </main>
    </div>
  );
};

export default Contact;
