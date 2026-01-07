import { SEO } from '@/components/SEO';
import { Card } from '@/components/ui/card';
import { PageHero } from '@/components/PageHero';

export default function Privacy() {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="Privacy Policy for GRATIS - Learn how we collect, use, and protect your personal data in compliance with GDPR."
      />
      
      <PageHero 
        title="Privacy Policy" 
        lastUpdated="January 2026"
      />
      
      <div className="bg-background pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <Card className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                G.R.A.T.I.S. ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal data in accordance with the General Data Protection Regulation (GDPR) and other applicable privacy laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Data Controller</h2>
              <p className="text-muted-foreground leading-relaxed">
                G.R.A.T.I.S. is the data controller for personal data collected through our website. Contact our Data Protection Officer at{' '}
                <a href="mailto:privacy@gratis.com" className="text-primary hover:underline">
                  privacy@gratis.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Data We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">We collect the following categories of personal data:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Identity Data:</strong> Name, email address, phone number</li>
                <li><strong>Contact Data:</strong> Shipping and billing addresses</li>
                <li><strong>Transaction Data:</strong> Order history, payment information (processed securely by Stripe)</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
                <li><strong>Usage Data:</strong> How you interact with our website</li>
                <li><strong>Marketing Data:</strong> Your preferences for receiving communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Legal Basis for Processing</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">We process your data based on:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Contract:</strong> To fulfill orders and provide our services</li>
                <li><strong>Legitimate Interest:</strong> To improve our services and prevent fraud</li>
                <li><strong>Consent:</strong> For marketing communications and non-essential cookies</li>
                <li><strong>Legal Obligation:</strong> To comply with tax and regulatory requirements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. How We Use Your Data</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Communicate about your orders and account</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Prevent fraud and ensure security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Data Sharing</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We share your data only with trusted partners who help us operate our business:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Stripe:</strong> Payment processing</li>
                <li><strong>Shipping carriers:</strong> Order delivery</li>
                <li><strong>Cloud providers:</strong> Data storage and hosting</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                All partners are bound by data processing agreements and must comply with GDPR.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal data only as long as necessary for the purposes outlined in this policy, typically for 7 years for tax and legal compliance, or until you request deletion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">Under GDPR, you have the right to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Rectification:</strong> Correct inaccurate data</li>
                <li><strong>Erasure:</strong> Request deletion of your data</li>
                <li><strong>Restriction:</strong> Limit how we process your data</li>
                <li><strong>Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Object:</strong> Object to certain processing activities</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise your rights, contact us at{' '}
                <a href="mailto:privacy@gratis.com" className="text-primary hover:underline">
                  privacy@gratis.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal data, including encryption, access controls, and regular security assessments.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. International Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your data may be transferred to countries outside the EEA. We ensure appropriate safeguards are in place, such as Standard Contractual Clauses approved by the European Commission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Complaints</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have concerns about how we handle your data, please contact us first. You also have the right to lodge a complaint with the Dutch Data Protection Authority (Autoriteit Persoonsgegevens).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Updates to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy periodically. We will notify you of significant changes via email or through our website.
              </p>
            </section>
          </Card>
        </div>
      </div>
    </>
  );
}
