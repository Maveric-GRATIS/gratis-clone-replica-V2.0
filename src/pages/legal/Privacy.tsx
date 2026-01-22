import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { PageHero } from "@/components/PageHero";

export default function Privacy() {
  return (
    <>
      <SEO
        title="Privacy Policy - G.R.A.T.I.S."
        description="G.R.A.T.I.S. Privacy Policy - Learn how we collect, use, and protect your personal data in compliance with GDPR, CCPA, and other privacy regulations."
      />

      <PageHero
        title="Privacy Policy"
        subtitle="G.R.A.T.I.S. (Giving Resources to Achieve Transformative and Impactful Change)"
        lastUpdated="January 14, 2026"
      />

      <div className="bg-background pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <Card className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Stichting GRATIS ("we", "our", or "us") is committed to
                protecting your privacy. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your personal data in
                accordance with the General Data Protection Regulation (GDPR)
                and other applicable privacy laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                2. Data Controller Information
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p>
                  Stichting G.R.A.T.I.S. is the data controller for personal
                  data collected through our website.
                </p>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2 mt-4">
                  <p className="font-semibold text-foreground">
                    Stichting G.R.A.T.I.S.
                  </p>
                  <p>
                    Registered Address: [Registered Address], Amsterdam,
                    Netherlands
                  </p>
                  <p>Chamber of Commerce (KVK): [To be assigned]</p>
                  <p>ANBI Status: [Pending/Approved]</p>
                  <p>
                    USA Registration: [State Registration Numbers - Pending]
                  </p>
                  <p className="pt-2 border-t border-border">
                    <strong>Data Protection Officer (DPO):</strong>{" "}
                    <a
                      href="mailto:privacy@gratis.ngo"
                      className="text-primary hover:underline"
                    >
                      privacy@gratis.ngo
                    </a>
                  </p>
                  <p>
                    <strong>General Inquiries:</strong>{" "}
                    <a
                      href="mailto:info@gratis.ngo"
                      className="text-primary hover:underline"
                    >
                      info@gratis.ngo
                    </a>
                  </p>
                  <p>
                    <strong>Legal Department:</strong>{" "}
                    <a
                      href="mailto:legal@gratis.ngo"
                      className="text-primary hover:underline"
                    >
                      legal@gratis.ngo
                    </a>
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                3. Data We Collect
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect the following categories of personal data:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  <strong>Identity Data:</strong> Name, email address, phone
                  number
                </li>
                <li>
                  <strong>Contact Data:</strong> Shipping and billing addresses
                </li>
                <li>
                  <strong>Transaction Data:</strong> Order history, payment
                  information (processed securely by Stripe)
                </li>
                <li>
                  <strong>Technical Data:</strong> IP address, browser type,
                  device information, cookies
                </li>
                <li>
                  <strong>Usage Data:</strong> How you interact with our
                  website, pages visited, time spent
                </li>
                <li>
                  <strong>Marketing Data:</strong> Your preferences for
                  receiving communications and newsletter subscriptions
                </li>
                <li>
                  <strong>Donation Data:</strong> Donation amounts, frequency,
                  and designation preferences
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                4. Legal Basis for Processing
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We process your data based on:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  <strong>Contract:</strong> To fulfill orders, process
                  donations, and provide our services
                </li>
                <li>
                  <strong>Legitimate Interest:</strong> To improve our services,
                  analyze usage, and prevent fraud
                </li>
                <li>
                  <strong>Consent:</strong> For marketing communications,
                  newsletters, and non-essential cookies
                </li>
                <li>
                  <strong>Legal Obligation:</strong> To comply with tax,
                  accounting, and regulatory requirements
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                5. How We Use Your Data
              </h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Process and fulfill your orders and donations</li>
                <li>
                  Communicate about your orders, donations, and account status
                </li>
                <li>
                  Send marketing communications and newsletters (with your
                  consent)
                </li>
                <li>Provide TRIBE membership benefits and access</li>
                <li>Improve our website, products, and services</li>
                <li>Conduct analytics and research on social impact</li>
                <li>Prevent fraud, ensure security, and enforce our terms</li>
                <li>Comply with legal and regulatory obligations</li>
                <li>Issue tax receipts for eligible donations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                6. Data Sharing and Disclosure
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We share your data only with trusted partners who help us
                operate our business:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  <strong>Stripe:</strong> Secure payment processing (PCI-DSS
                  compliant)
                </li>
                <li>
                  <strong>Firebase/Google Cloud:</strong> Data storage,
                  authentication, and hosting
                </li>
                <li>
                  <strong>Shipping Carriers:</strong> Order fulfillment and
                  delivery
                </li>
                <li>
                  <strong>Email Service Providers:</strong> Transactional and
                  marketing communications
                </li>
                <li>
                  <strong>Analytics Providers:</strong> Google Analytics for
                  usage insights
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                All third-party service providers are bound by data processing
                agreements and must comply with GDPR. We do not sell your
                personal data to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal data only as long as necessary for the
                purposes outlined in this policy:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>
                  <strong>Transaction Records:</strong> 7 years for tax and
                  legal compliance
                </li>
                <li>
                  <strong>Marketing Data:</strong> Until you unsubscribe or
                  withdraw consent
                </li>
                <li>
                  <strong>Account Data:</strong> Until you request account
                  deletion
                </li>
                <li>
                  <strong>Donation Records:</strong> 7 years for fiscal
                  transparency and reporting
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                8. Your Rights Under GDPR
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You have the following rights:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  <strong>Right to Access:</strong> Request a copy of your
                  personal data
                </li>
                <li>
                  <strong>Right to Rectification:</strong> Correct inaccurate or
                  incomplete data
                </li>
                <li>
                  <strong>Right to Erasure:</strong> Request deletion of your
                  data ("right to be forgotten")
                </li>
                <li>
                  <strong>Right to Restriction:</strong> Limit how we process
                  your data
                </li>
                <li>
                  <strong>Right to Portability:</strong> Receive your data in a
                  machine-readable format
                </li>
                <li>
                  <strong>Right to Object:</strong> Object to certain processing
                  activities
                </li>
                <li>
                  <strong>Right to Withdraw Consent:</strong> Withdraw consent
                  at any time for consent-based processing
                </li>
                <li>
                  <strong>Right to Lodge a Complaint:</strong> File a complaint
                  with your supervisory authority
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise your rights, contact us at{" "}
                <a
                  href="mailto:privacy@gratis.ngo"
                  className="text-primary hover:underline"
                >
                  privacy@gratis.ngo
                </a>
                . We will respond within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational measures
                to protect your personal data, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>SSL/TLS encryption for data in transit</li>
                <li>Encrypted storage for sensitive data at rest</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Regular security assessments and penetration testing</li>
                <li>Employee training on data protection</li>
                <li>Incident response and breach notification procedures</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                10. International Transfers
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Your data may be transferred to and stored in countries outside
                the European Economic Area (EEA), including the United States
                (Firebase/Google Cloud). We ensure appropriate safeguards are in
                place, such as:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>
                  Standard Contractual Clauses (SCCs) approved by the European
                  Commission
                </li>
                <li>Adequacy decisions where applicable</li>
                <li>Supplementary measures to ensure data protection</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                11. Cookies and Tracking
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies. For detailed
                information about the cookies we use and your choices, please
                see our{" "}
                <a
                  href="/legal/cookies"
                  className="text-primary hover:underline"
                >
                  Cookie Policy
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                12. Children's Privacy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services are not directed to individuals under 16 years of
                age. We do not knowingly collect personal data from children. If
                you believe we have collected data from a child, please contact
                us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                13. Complaints and Supervisory Authority
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have concerns about how we handle your data, please
                contact us first at{" "}
                <a
                  href="mailto:privacy@gratis.ngo"
                  className="text-primary hover:underline"
                >
                  privacy@gratis.ngo
                </a>
                . You also have the right to lodge a complaint with:
              </p>
              <div className="mt-4 text-muted-foreground">
                <p className="font-semibold">
                  Autoriteit Persoonsgegevens (Dutch DPA)
                </p>
                <p>
                  Website:{" "}
                  <a
                    href="https://autoriteitpersoonsgegevens.nl"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    autoriteitpersoonsgegevens.nl
                  </a>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                14. Updates to This Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy periodically to reflect
                changes in our practices or legal requirements. We will notify
                you of significant changes via email or through a prominent
                notice on our website. The "Last Updated" date at the top of
                this page indicates when the policy was last revised.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">15. Contact Us</h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p>
                  For any questions or concerns about this Privacy Policy or our
                  data practices:
                </p>
                <ul className="list-none space-y-1 ml-4">
                  <li>
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:privacy@gratis.ngo"
                      className="text-primary hover:underline"
                    >
                      privacy@gratis.ngo
                    </a>
                  </li>
                  <li>
                    <strong>General Inquiries:</strong>{" "}
                    <a
                      href="mailto:info@gratis.ngo"
                      className="text-primary hover:underline"
                    >
                      info@gratis.ngo
                    </a>
                  </li>
                  <li>
                    <strong>Address:</strong> Stichting GRATIS, Amsterdam,
                    Netherlands
                  </li>
                </ul>
              </div>
            </section>
          </Card>
        </div>
      </div>
    </>
  );
}
