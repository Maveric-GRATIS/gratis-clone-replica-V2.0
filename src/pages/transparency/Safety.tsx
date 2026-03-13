import SEO from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { PageHero } from "@/components/PageHero";
import { Link } from "react-router-dom";

export default function Safety() {
  return (
    <>
      <SEO
        title="Safety — Disclaimer & Donor Privacy — GRATIS"
        description="Disclaimers, liability limitations, donor privacy rights, and data protection standards for Stichting G.R.A.T.I.S."
      />

      <PageHero
        title="Safety — Disclaimer & Donor Privacy"
        lastUpdated="March 2026"
      />

      <div className="bg-background pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <Card className="p-8 space-y-10">
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                1. General Disclaimer
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                All information, products, and services provided by Stichting
                G.R.A.T.I.S. ("GRATIS," "we," "us," or "our") through the
                Platform (gratis.com, sub-domains, and mobile applications) are
                offered on an <strong>"as is" and "as available"</strong> basis.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-3">
                While we strive for accuracy and completeness, we make no
                warranties or representations, express or implied, regarding:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>
                  The completeness, reliability, accuracy, or timeliness of
                  content published on the Platform
                </li>
                <li>
                  The suitability of our products, services, or programs for any
                  particular purpose
                </li>
                <li>
                  Uninterrupted, error-free, or secure operation of the Platform
                </li>
                <li>
                  The outcomes, results, or impact of any specific charitable
                  project, initiative, or campaign
                </li>
                <li>
                  The accuracy of third-party information or content linked from
                  the Platform
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                To the maximum extent permitted by Dutch law (Book 6, Dutch
                Civil Code), EU consumer protection law, and applicable U.S.
                state and federal law, GRATIS shall not be held liable for any
                direct, indirect, incidental, consequential, special, or
                punitive damages arising from your use of the Platform, reliance
                on any content, or participation in any programs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                2. Limitation of Liability — Charitable Activities
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                GRATIS operates free water distribution, environmental
                restoration, and social impact programs in collaboration with
                verified NGO partners. While we exercise due diligence in
                partner selection, program design, and project oversight:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>
                  We do not guarantee specific outcomes for any charitable
                  project, campaign, or initiative
                </li>
                <li>
                  Impact metrics (e.g., liters funded, carbon offset,
                  beneficiaries reached) are estimates based on partner-reported
                  data and methodologies, and may be subject to variance
                </li>
                <li>
                  Participation in GRATIS events, volunteer programs, water
                  distribution activities, or community initiatives is at the
                  participant's own risk
                </li>
                <li>
                  GRATIS is not responsible for the independent actions,
                  omissions, representations, or performance of NGO partners,
                  volunteers, advertisers, or third-party event organizers
                </li>
                <li>
                  Distribution schedules, event dates, and program availability
                  are subject to change without notice
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Participants in GRATIS programs acknowledge that they assume
                personal responsibility for their own safety during events and
                activities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                3. Product Safety & Disclaimers
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                All GRATIS water products are produced in compliance with
                applicable food safety regulations, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>EU Regulation (EC) No 178/2002 (General Food Law)</li>
                <li>EU Regulation (EC) No 852/2004 (Hygiene of Foodstuffs)</li>
                <li>Dutch Commodities Act (Warenwet) and associated decrees</li>
                <li>
                  NVWA (Netherlands Food and Consumer Product Safety Authority)
                  standards
                </li>
                <li>
                  FDA regulations (21 CFR Part 165) for distribution in the
                  United States
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                GRATIS water is not a medical product and is not intended to
                diagnose, treat, cure, or prevent any disease. Health claims on
                the Platform relate solely to general hydration benefits.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                4. Financial & Tax Disclaimer
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Nothing on the Platform constitutes financial, tax, investment,
                or legal advice.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>
                  <strong>Netherlands:</strong> Stichting G.R.A.T.I.S. is
                  structured as a Stichting (foundation) and is applying for
                  ANBI (Algemeen Nut Beogende Instelling) status with the
                  Belastingdienst. Tax deductibility of donations is subject to
                  formal ANBI designation
                </li>
                <li>
                  <strong>United States:</strong> GRATIS is pursuing recognition
                  as a tax-exempt organization under Section 501(c)(3) of the
                  Internal Revenue Code. Tax deductibility of contributions is
                  subject to IRS determination
                </li>
                <li>
                  Donors are strongly advised to consult their own qualified tax
                  advisor regarding the deductibility of contributions in their
                  jurisdiction
                </li>
                <li>
                  Donation receipts issued by GRATIS are for informational
                  purposes and do not constitute tax advice
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Information about investments, the Spark program, or social
                enterprise activities on the Platform is provided for
                informational purposes only and does not constitute an offer to
                sell securities, a solicitation of investment, or financial
                advice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                5. Donor Bill of Rights
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                GRATIS adheres to the{" "}
                <strong>
                  Association of Fundraising Professionals (AFP) Donor Bill of
                  Rights
                </strong>{" "}
                and the <strong>CBF (Centraal Bureau Fondsenwerving)</strong>{" "}
                code of conduct for fundraising organizations in the
                Netherlands. As a donor, you have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  Be informed of GRATIS's mission, the way the organization
                  intends to use donated resources, and its capacity to use
                  donations effectively for their intended purposes
                </li>
                <li>
                  Be informed of the identity of those serving on the
                  Foundation's board and to expect the board to exercise prudent
                  judgment in its stewardship responsibilities
                </li>
                <li>
                  Have access to GRATIS's most recent financial statements and
                  annual impact reports
                </li>
                <li>
                  Be assured that your gifts will be used for the purposes for
                  which they were given
                </li>
                <li>
                  Receive appropriate acknowledgement and recognition for your
                  contributions
                </li>
                <li>
                  Be assured that information about your donation is handled
                  with respect and with confidentiality to the extent provided
                  by law
                </li>
                <li>
                  Expect that all relationships with individuals representing
                  GRATIS will be professional in nature
                </li>
                <li>
                  Be informed whether those seeking donations are volunteers,
                  employees of the organization, or hired solicitors
                </li>
                <li>
                  Have the opportunity to have your name removed from mailing
                  lists and to opt out of future solicitations
                </li>
                <li>
                  Feel free to ask questions when making a donation and to
                  receive prompt, truthful, and forthright answers
                </li>
                <li>
                  Make anonymous donations — GRATIS fully respects your right
                  not to be publicly identified as a donor
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                6. Donor Data Protection
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We apply enhanced protections to donor personal data, above and
                beyond our general{" "}
                <Link
                  to="/transparency/privacy"
                  className="text-primary hover:underline"
                >
                  Privacy Policy
                </Link>
                :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  <strong>No Sale or Sharing:</strong> We will never sell,
                  trade, rent, or share your donor information (name, contact
                  details, donation amounts, payment information) with any third
                  party for their own marketing or commercial purposes
                </li>
                <li>
                  <strong>Minimal Disclosure:</strong> Donor data is shared only
                  with payment processors (Stripe, PCI DSS Level 1 certified) to
                  execute transactions, and with tax authorities when legally
                  required
                </li>
                <li>
                  <strong>Strict Access Controls:</strong> Donor records are
                  accessible only to authorized GRATIS personnel with a
                  legitimate operational need, enforced through role-based
                  access controls (RBAC) with audit logging
                </li>
                <li>
                  <strong>Encryption:</strong> All donation transactions are
                  processed over TLS 1.3. Payment card data is handled
                  exclusively by Stripe and is never stored, processed, or
                  transmitted through GRATIS systems
                </li>
                <li>
                  <strong>Anonymization:</strong> Aggregate donation statistics
                  used in impact reports, marketing materials, and public
                  dashboards are fully anonymized and cannot be traced to
                  individual donors
                </li>
                <li>
                  <strong>Retention:</strong> Donor records are retained for 7
                  years for tax and audit compliance (Dutch General Tax Act,
                  Art. 52 AWR; IRS requirements). After the retention period,
                  records are securely deleted or irreversibly anonymized
                </li>
                <li>
                  <strong>Breach Response:</strong> In the event of a data
                  breach affecting donor information, we will notify affected
                  individuals and the Dutch Data Protection Authority
                  (Autoriteit Persoonsgegevens) within 72 hours as required
                  under GDPR Article 33
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                7. Donation Refund & Reversal Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Donations to GRATIS are generally non-refundable, as funds may
                be allocated to programs and partner organizations upon receipt.
                However, we understand that errors and exceptional circumstances
                occur.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-3">
                If you believe a donation was made in error, was unauthorized,
                or was processed incorrectly, please contact us within{" "}
                <strong>30 days</strong> via our{" "}
                <Link to="/contact" className="text-primary hover:underline">
                  GRATIS Connect portal
                </Link>{" "}
                (select "Donations — Refund Request"). We will investigate and,
                where appropriate, process a full or partial refund within 10
                business days.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Recurring donations can be cancelled at any time through your
                account dashboard or by contacting us. Cancellation takes effect
                before the next scheduled charge.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                8. Third-Party Links & Content
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                The Platform may contain links to third-party websites, NGO
                partner sites, news outlets, social media platforms, or external
                resources. GRATIS:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-3">
                <li>
                  Is not responsible for the privacy practices, content,
                  accuracy, or availability of third-party sites
                </li>
                <li>
                  Does not endorse the content, products, or services offered on
                  linked third-party sites unless explicitly stated
                </li>
                <li>
                  Recommends that you review the privacy policies and terms of
                  use of any external site you visit
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Inclusion of a link on the Platform does not imply endorsement,
                sponsorship, or affiliation with the linked site or its
                operators.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                9. Indemnification
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify and hold harmless Stichting G.R.A.T.I.S.,
                its board members, officers, employees, agents, and partners
                from any claims, damages, losses, liabilities, costs, or
                expenses (including reasonable legal fees) arising from your use
                of the Platform, violation of these terms, or infringement of
                any third-party rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                This Disclaimer and Donor Privacy Policy is governed by the laws
                of the Netherlands, without regard to conflict of law
                provisions. For EU consumers, mandatory consumer protection
                provisions of your country of residence apply.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Any disputes arising under this policy shall be submitted to the
                exclusive jurisdiction of the courts in Amsterdam, the
                Netherlands, unless applicable law requires otherwise.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about this policy, donor privacy, or to exercise
                your rights, please contact us via our{" "}
                <Link to="/contact" className="text-primary hover:underline">
                  GRATIS Connect portal
                </Link>{" "}
                and select "Legal" or "Donations" as the inquiry type.
              </p>
            </section>
          </Card>
        </div>
      </div>
    </>
  );
}
