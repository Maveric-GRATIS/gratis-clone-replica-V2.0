import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { PageHero } from "@/components/PageHero";

export default function DonorPrivacy() {
  return (
    <>
      <SEO
        title="Donor Privacy Policy - GRATIS.NGO"
        description="Donor Privacy Policy for GRATIS - How we protect and use donor information in accordance with charitable giving regulations."
      />

      <PageHero title="Donor Privacy Policy" lastUpdated="January 14, 2026" />

      <div className="bg-background pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <Card className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Stichting GRATIS is committed to protecting the privacy of our
                donors. This Donor Privacy Policy explains how we collect, use,
                and safeguard donor information in accordance with GDPR, Dutch
                charitable giving regulations, and best practices in nonprofit
                transparency.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                2. Our Commitment to Donors
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                As a registered nonprofit organization, we are committed to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Protecting your personal information and donation data</li>
                <li>
                  Using donations as designated or where they are most needed
                </li>
                <li>Providing transparency about how funds are used</li>
                <li>Honoring your communication preferences</li>
                <li>Never selling or renting your personal information</li>
                <li>Complying with all applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                3. Donor Information We Collect
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When you make a donation, we collect:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  <strong>Personal Information:</strong> Name, email address,
                  phone number, postal address
                </li>
                <li>
                  <strong>Donation Details:</strong> Amount, date, frequency
                  (one-time or recurring), payment method
                </li>
                <li>
                  <strong>Designation:</strong> Any specific program or cause
                  you wish to support
                </li>
                <li>
                  <strong>Tax Information:</strong> Information needed to issue
                  tax receipts (for eligible donations)
                </li>
                <li>
                  <strong>Communication Preferences:</strong> How you wish to
                  receive updates (email, mail, none)
                </li>
                <li>
                  <strong>Memorial/Tribute Information:</strong> If donation is
                  made in honor or memory of someone
                </li>
                <li>
                  <strong>Employer Information:</strong> For corporate matching
                  gift programs
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                4. How We Use Donor Information
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use your information to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Process your donation and send confirmation receipts</li>
                <li>Issue tax receipts for eligible charitable donations</li>
                <li>Send updates about the impact of your donation</li>
                <li>
                  Communicate about programs, campaigns, and ways to get
                  involved
                </li>
                <li>Thank you for your support and stewardship</li>
                <li>Comply with legal and regulatory requirements</li>
                <li>
                  Maintain accurate donation records for financial reporting
                </li>
                <li>Process corporate matching gifts</li>
                <li>Send memorial/tribute notifications as requested</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                5. Legal Basis for Processing Donor Data
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Under GDPR, we process donor information based on:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  <strong>Contract:</strong> To process your donation and
                  fulfill our obligations to you
                </li>
                <li>
                  <strong>Legal Obligation:</strong> To comply with tax laws,
                  financial reporting, and charitable regulations
                </li>
                <li>
                  <strong>Legitimate Interest:</strong> To steward donors,
                  report on impact, and maintain donor relationships
                </li>
                <li>
                  <strong>Consent:</strong> For marketing communications beyond
                  transactional updates
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                6. Sharing Donor Information
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do NOT sell, trade, or rent donor information. We may share
                donor information only in the following limited circumstances:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  <strong>Payment Processors:</strong> Stripe (for secure
                  payment processing)
                </li>
                <li>
                  <strong>Email Service Providers:</strong> To send donation
                  receipts and impact updates
                </li>
                <li>
                  <strong>Accounting/Audit Firms:</strong> For financial
                  reporting and compliance
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or
                  legal process
                </li>
                <li>
                  <strong>Memorial/Tribute Notifications:</strong> We may share
                  your name (not amount) with honoree families if you request
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                All third-party service providers are bound by confidentiality
                agreements and GDPR-compliant data processing agreements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                7. Donor Recognition and Anonymity
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p>
                  <strong>Public Recognition:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    By default, we do not publicly list donor names or amounts
                  </li>
                  <li>
                    If you wish to be recognized publicly (e.g., in annual
                    reports, donor walls), we will request explicit consent
                  </li>
                  <li>
                    You may choose how you wish to be recognized (full name,
                    initials, anonymous)
                  </li>
                </ul>

                <p className="mt-3">
                  <strong>Anonymous Donations:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>You may request that your donation be anonymous</li>
                  <li>
                    We will still collect necessary information for tax and
                    legal compliance, but will not publicly disclose your
                    identity
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                8. Recurring Donations
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you set up recurring donations:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  Your payment method will be securely stored by our payment
                  processor (Stripe)
                </li>
                <li>We will send confirmation after each donation</li>
                <li>
                  You can modify or cancel at any time through your account
                  settings
                </li>
                <li>
                  We will notify you before processing if your payment method is
                  about to expire
                </li>
                <li>
                  Annual tax receipts will be provided summarizing all donations
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                9. Tax Receipts and Compliance
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p>
                  GRATIS is recognized as a charitable organization (ANBI status
                  in the Netherlands):
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>
                    Donations may be tax-deductible in accordance with Dutch tax
                    law
                  </li>
                  <li>
                    We will provide official tax receipts for eligible donations
                  </li>
                  <li>
                    Tax receipts are sent automatically via email (or mail upon
                    request)
                  </li>
                  <li>
                    We retain donation records for 7 years as required by law
                  </li>
                  <li>You can request duplicate receipts at any time</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                10. Communication Preferences
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We respect your communication preferences:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  <strong>Transactional Emails:</strong> Donation confirmations
                  and tax receipts (cannot opt out)
                </li>
                <li>
                  <strong>Impact Updates:</strong> Periodic updates on how your
                  donation is making a difference (opt-in)
                </li>
                <li>
                  <strong>Newsletters:</strong> General GRATIS news and
                  campaigns (opt-in)
                </li>
                <li>
                  <strong>Fundraising Appeals:</strong> Requests for additional
                  support (opt-in)
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                You can update your preferences at any time via:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                <li>Your account settings on our website</li>
                <li>Unsubscribe link in any email</li>
                <li>
                  Emailing{" "}
                  <a
                    href="mailto:donors@gratis.ngo"
                    className="text-primary hover:underline"
                  >
                    donors@gratis.ngo
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                11. Data Retention
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We retain donor information as follows:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  <strong>Donation Records:</strong> 7 years (legal requirement
                  for financial records)
                </li>
                <li>
                  <strong>Contact Information:</strong> Until you request
                  deletion or withdraw consent
                </li>
                <li>
                  <strong>Tax Receipts:</strong> 7 years (legal requirement)
                </li>
                <li>
                  <strong>Marketing Data:</strong> Until you unsubscribe or 3
                  years of inactivity
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                12. Your Rights as a Donor
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Under GDPR and Dutch law, you have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  <strong>Access:</strong> Request a copy of your donation
                  history and personal data
                </li>
                <li>
                  <strong>Rectification:</strong> Correct any inaccurate
                  information
                </li>
                <li>
                  <strong>Erasure:</strong> Request deletion of your data
                  (subject to legal retention requirements)
                </li>
                <li>
                  <strong>Restriction:</strong> Limit how we use your data
                </li>
                <li>
                  <strong>Portability:</strong> Receive your data in a portable
                  format
                </li>
                <li>
                  <strong>Object:</strong> Object to processing for direct
                  marketing
                </li>
                <li>
                  <strong>Withdraw Consent:</strong> Opt out of communications
                  at any time
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise any of these rights, contact us at{" "}
                <a
                  href="mailto:donors@gratis.ngo"
                  className="text-primary hover:underline"
                >
                  donors@gratis.ngo
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                13. Security of Donor Information
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We take the security of donor information seriously:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  All online donations are processed through PCI-DSS compliant
                  Stripe
                </li>
                <li>Payment information is never stored on our servers</li>
                <li>Data is encrypted in transit (SSL/TLS) and at rest</li>
                <li>
                  Access to donor data is restricted to authorized personnel
                  only
                </li>
                <li>Regular security audits and updates</li>
                <li>Immediate notification in case of any data breach</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">14. Refund Policy</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                While donations are generally non-refundable:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  We will honor refund requests made within 30 days if made in
                  error
                </li>
                <li>
                  Refunds will be processed to the original payment method
                </li>
                <li>Tax receipts for refunded donations will be voided</li>
                <li>
                  Contact{" "}
                  <a
                    href="mailto:donors@gratis.ngo"
                    className="text-primary hover:underline"
                  >
                    donors@gratis.ngo
                  </a>{" "}
                  for refund requests
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">15. Use of Funds</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Transparency in fund usage:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  <strong>100% of product profits</strong> go to charitable
                  programs
                </li>
                <li>
                  <strong>Direct donations</strong> are used as designated or
                  where most needed
                </li>
                <li>
                  Administrative costs are covered by operational revenue
                  (merchandise margins)
                </li>
                <li>Annual financial reports are published on our website</li>
                <li>
                  You can request detailed program information at any time
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                16. Changes to This Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Donor Privacy Policy from time to time.
                Material changes will be communicated via email to active
                donors. Continued donation after changes indicates acceptance of
                the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">17. Contact Us</h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p>
                  For questions about donor privacy or to exercise your rights:
                </p>
                <ul className="list-none space-y-1 ml-4">
                  <li>
                    <strong>Donor Services:</strong>{" "}
                    <a
                      href="mailto:donors@gratis.ngo"
                      className="text-primary hover:underline"
                    >
                      donors@gratis.ngo
                    </a>
                  </li>
                  <li>
                    <strong>Privacy Officer:</strong>{" "}
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
                    <strong>Phone:</strong> +31 (0) [to be provided]
                  </li>
                  <li>
                    <strong>Address:</strong> Stichting GRATIS, Amsterdam,
                    Netherlands
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                18. Additional Resources
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                For more information:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>
                  <a
                    href="/legal/privacy"
                    className="text-primary hover:underline"
                  >
                    General Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/legal/terms"
                    className="text-primary hover:underline"
                  >
                    Terms of Use
                  </a>
                </li>
                <li>
                  <a
                    href="/tribe/standards"
                    className="text-primary hover:underline"
                  >
                    Financial Standards & Transparency
                  </a>
                </li>
                <li>
                  <a
                    href="/spark/verve"
                    className="text-primary hover:underline"
                  >
                    Ways to Give
                  </a>
                </li>
              </ul>
            </section>
          </Card>
        </div>
      </div>
    </>
  );
}
