import { SEO } from '@/components/SEO';
import { ContactForm } from '@/components/ContactForm';
import { SocialProof } from '@/components/SocialProof';
import { Map, Phone, Mail, Clock, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Contact GRATIS — Get in Touch"
        description="Contact GRATIS for questions about our sustainable tetrapack beverages. We're here to help with orders, partnerships, and sustainability inquiries."
        canonical="/contact"
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Let's Connect
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Have questions about GRATIS? Want to partner with us? We're always excited to hear from the community.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 pb-16">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-foreground">
                Other Ways to Reach Us
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Email</h3>
                    <p className="text-muted-foreground">hello@gratis.com</p>
                    <p className="text-sm text-muted-foreground">
                      General inquiries and support
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Phone</h3>
                    <p className="text-muted-foreground">+1 (555) 123-GRATIS</p>
                    <p className="text-sm text-muted-foreground">
                      Monday - Friday, 9 AM - 6 PM PST
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Office</h3>
                    <p className="text-muted-foreground">
                      123 Sustainable Way<br />
                      San Francisco, CA 94102
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Response Time</h3>
                    <p className="text-muted-foreground">
                      We typically respond within 24 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="font-medium mb-2 text-foreground">
                Partnership Inquiries
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Interested in carrying GRATIS products or exploring a partnership? 
              </p>
              <a 
                href="mailto:partnerships@gratis.com" 
                className="text-primary hover:underline text-sm"
              >
                partnerships@gratis.com
              </a>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <SocialProof variant="stats" />

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-center mb-8 text-foreground">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="font-medium mb-2 text-foreground">
                How is tetrapack more sustainable?
              </h3>
              <p className="text-muted-foreground text-sm">
                Tetrapack uses 70% less plastic than traditional bottles and has a 
                significantly lower carbon footprint. Plus, they're fully recyclable 
                in most areas.
              </p>
            </div>

            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="font-medium mb-2 text-foreground">
                Where can I buy GRATIS products?
              </h3>
              <p className="text-muted-foreground text-sm">
                Our products are available online through our store and at select 
                retailers nationwide. Check our store locator for the nearest location.
              </p>
            </div>

            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="font-medium mb-2 text-foreground">
                Do you offer bulk orders?
              </h3>
              <p className="text-muted-foreground text-sm">
                Yes! We offer bulk pricing for businesses, events, and organizations. 
                Contact us for custom pricing and delivery options.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;