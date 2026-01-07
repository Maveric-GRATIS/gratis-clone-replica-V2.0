import { SEO } from '@/components/SEO';
import { Card } from '@/components/ui/card';
import { PageHero } from '@/components/PageHero';

export default function Terms() {
  return (
    <>
      <SEO
        title="Terms of Use"
        description="Terms of Use for GRATIS - Read our terms and conditions for using our website and services."
      />
      
      <PageHero 
        title="Terms of Use" 
        lastUpdated="January 2026"
      />
      
      <div className="bg-background pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <Card className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using the GRATIS website and services, you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Use of Services</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                GRATIS provides premium tetrapack beverages and merchandise through our online platform. When using our services, you agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Provide accurate and complete information when making purchases</li>
                <li>Use our services only for lawful purposes</li>
                <li>Not interfere with the proper functioning of our website</li>
                <li>Not attempt to gain unauthorized access to our systems</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Account Registration</h2>
              <p className="text-muted-foreground leading-relaxed">
                To make purchases, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. Please notify us immediately of any unauthorized use.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Orders and Payments</h2>
              <p className="text-muted-foreground leading-relaxed">
                All orders are subject to availability and acceptance. Prices are displayed in Euros (€) and include applicable taxes within the EU. Payment is processed securely through Stripe. We reserve the right to refuse or cancel orders at our discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Shipping and Delivery</h2>
              <p className="text-muted-foreground leading-relaxed">
                We ship to locations within the European Union. Delivery times are estimates and may vary. Risk of loss passes to you upon delivery to the carrier.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Returns and Refunds</h2>
              <p className="text-muted-foreground leading-relaxed">
                You have the right to return products within 30 days of delivery in accordance with EU consumer protection laws. Products must be unused and in original packaging. Refunds will be processed within 14 days of receiving the returned items.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                All content on this website, including logos, images, text, and designs, is the property of G.R.A.T.I.S. and protected by intellectual property laws. You may not reproduce, distribute, or use our content without written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                GRATIS shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services. Our total liability is limited to the amount paid for the products or services in question.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These terms are governed by the laws of the Netherlands and the European Union. Any disputes shall be resolved in the courts of Amsterdam, Netherlands.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms of Use, please contact us at{' '}
                <a href="mailto:legal@gratis.com" className="text-primary hover:underline">
                  legal@gratis.com
                </a>
              </p>
            </section>
          </Card>
        </div>
      </div>
    </>
  );
}
