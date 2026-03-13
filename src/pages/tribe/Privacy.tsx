import { SEO } from '@/components/SEO';
import { Card } from '@/components/ui/card';
import { PageHero } from '@/components/PageHero';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="Privacy Policy for GRATIS — How we collect, use, and protect your personal data under GDPR, CCPA, and other applicable privacy laws."
      />
      
      <PageHero 
        title="Privacy Policy" 
        lastUpdated="March 2026"
      />
      
      <div className="bg-background pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <Card className="p-8 space-y-10">

            {/* 1 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Stichting G.R.A.T.I.S. ("GRATIS," "we," "us," or "our"), a non-profit foundation registered in Amsterdam, the Netherlands, is committed to protecting your privacy. This Privacy Policy describes how we collect, use, disclose, and safeguard your personal data in accordance with:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-3">
                <li>The General Data Protection Regulation (EU) 2016/679 ("GDPR")</li>
                <li>The Dutch GDPR Implementation Act (Uitvoeringswet AVG)</li>
                <li>The EU ePrivacy Directive 2002/58/EC (as amended)</li>
                <li>The California Consumer Privacy Act of 2018, as amended by the California Privacy Rights Act of 2020 (collectively "CCPA/CPRA," Cal. Civ. Code §§ 1798.100–1798.199.100)</li>
                <li>The Virginia Consumer Data Protection Act (Va. Code §§ 59.1-575–59.1-585)</li>
                <li>The Colorado Privacy Act (C.R.S. §§ 6-1-1301–6-1-1313)</li>
                <li>The Connecticut Data Privacy Act (Conn. Gen. Stat. §§ 42-515–42-525)</li>
                <li>Other applicable U.S. state privacy laws</li>
                <li>The Children's Online Privacy Protection Act (COPPA, 15 U.S.C. §§ 6501–6506)</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                This policy applies to all personal data collected through our website (gratis.com), sub-domains, applications, events, and services.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Data Controller</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                The data controller responsible for your personal data is:
              </p>
              <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground mb-3">
                <p><strong>Stichting G.R.A.T.I.S.</strong></p>
                <p>Amsterdam, the Netherlands</p>
                <p>KvK: [pending registration]</p>
                <p>RSIN: 95-1831116</p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Our Data Protection Officer (DPO), appointed in accordance with Article 37 GDPR, can be reached via our{' '}
                <Link to="/contact" className="text-primary hover:underline">GRATIS Connect portal</Link>
                {' '}(select "Privacy & Data Protection" as the inquiry type).
              </p>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Categories of Personal Data We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">We collect the following categories of personal data:</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-muted-foreground border border-border rounded-lg">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Examples</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">CCPA Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 font-medium">Identity Data</td>
                      <td className="py-3 px-4">Name, email, phone number</td>
                      <td className="py-3 px-4">Identifiers</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 font-medium">Contact Data</td>
                      <td className="py-3 px-4">Shipping/billing addresses</td>
                      <td className="py-3 px-4">Personal information (Cal. Civ. Code § 1798.80(e))</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 font-medium">Transaction Data</td>
                      <td className="py-3 px-4">Order history, amounts paid, payment method type</td>
                      <td className="py-3 px-4">Commercial information</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 font-medium">Technical Data</td>
                      <td className="py-3 px-4">IP address, browser type, device ID, OS</td>
                      <td className="py-3 px-4">Internet/electronic network activity</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 font-medium">Usage Data</td>
                      <td className="py-3 px-4">Pages visited, clicks, time on site</td>
                      <td className="py-3 px-4">Internet/electronic network activity</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 font-medium">Geolocation Data</td>
                      <td className="py-3 px-4">Approximate location from IP, precise location (if consented)</td>
                      <td className="py-3 px-4">Geolocation data</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 font-medium">Donation Data</td>
                      <td className="py-3 px-4">Donation amounts, frequency, chosen causes</td>
                      <td className="py-3 px-4">Commercial information</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Communication Data</td>
                      <td className="py-3 px-4">Inquiry transcripts, AI chat logs, preferences</td>
                      <td className="py-3 px-4">Inferences / Internet activity</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Legal Bases for Processing (GDPR Article 6)</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-3">
                <li><strong>Performance of contract (Art. 6(1)(b)):</strong> Processing orders, managing your account, delivering products, processing returns.</li>
                <li><strong>Consent (Art. 6(1)(a)):</strong> Marketing communications, non-essential cookies, analytics, AI chat interactions.</li>
                <li><strong>Legitimate interest (Art. 6(1)(f)):</strong> Fraud prevention, platform security, service improvement, internal analytics. We conduct legitimate interest assessments (LIAs) for each such purpose.</li>
                <li><strong>Legal obligation (Art. 6(1)(c)):</strong> Tax record keeping (Dutch General Tax Act, Algemene wet inzake rijksbelastingen), anti-money laundering compliance (Wwft), responding to lawful government requests.</li>
                <li><strong>Vital interests (Art. 6(1)(d)):</strong> In emergency situations during water distribution events.</li>
              </ul>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">5. How We Use Your Data</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Process and fulfill orders placed through the Rig Store and Hydration Store</li>
                <li>Manage your account and provide customer support via GRATIS Connect</li>
                <li>Process donations and issue tax-deductible receipts</li>
                <li>Send transactional communications (order confirmations, shipping updates)</li>
                <li>Send marketing communications (only with your explicit opt-in consent)</li>
                <li>Personalize your experience (e.g., product recommendations, recently viewed items)</li>
                <li>Operate our AI-powered intake and qualification system</li>
                <li>Analyze website performance and usage patterns (aggregated/anonymized)</li>
                <li>Prevent fraud, abuse, and unauthorized access</li>
                <li>Comply with legal and regulatory obligations</li>
                <li>Administer events, volunteer programs, and NGO partnerships</li>
              </ul>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Data Sharing & Third-Party Processors</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We share personal data only with trusted third parties who process data on our behalf under written Data Processing Agreements (DPAs) compliant with GDPR Article 28:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-muted-foreground border border-border rounded-lg">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Processor</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Purpose</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Transfer Mechanism</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4">Stripe (EU/US)</td>
                      <td className="py-3 px-4">Payment processing, fraud prevention</td>
                      <td className="py-3 px-4">EU-US Data Privacy Framework</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4">Supabase (US)</td>
                      <td className="py-3 px-4">Backend infrastructure, authentication, database</td>
                      <td className="py-3 px-4">Standard Contractual Clauses (SCCs)</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4">Mapbox (US)</td>
                      <td className="py-3 px-4">Interactive maps for distribution locations</td>
                      <td className="py-3 px-4">Standard Contractual Clauses</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4">Shipping carriers</td>
                      <td className="py-3 px-4">Order delivery</td>
                      <td className="py-3 px-4">DPA / EU adequate</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">AI model providers</td>
                      <td className="py-3 px-4">GRATIS Connect AI qualifier</td>
                      <td className="py-3 px-4">Standard Contractual Clauses</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We do <strong>not sell</strong> your personal data. Under CCPA/CPRA, we confirm: we have not sold or shared (for cross-context behavioral advertising) the personal information of consumers in the preceding 12 months.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">7. International Data Transfers</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Your data may be transferred to countries outside the European Economic Area (EEA). We ensure lawful transfer through:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>EU-US Data Privacy Framework:</strong> For certified U.S. recipients (adequacy decision per Article 45 GDPR, Commission Implementing Decision (EU) 2023/1795)</li>
                <li><strong>Standard Contractual Clauses (SCCs):</strong> EU Commission-approved clauses per Decision 2021/914, supplemented by Transfer Impact Assessments (TIAs) where required</li>
                <li><strong>Adequacy decisions:</strong> For transfers to countries with EU-recognized adequate protection</li>
                <li><strong>Your explicit consent:</strong> Where no other mechanism applies (Article 49(1)(a) GDPR)</li>
              </ul>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-muted-foreground border border-border rounded-lg">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Data Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Retention Period</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Legal Basis</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4">Account data</td>
                      <td className="py-3 px-4">Duration of account + 30 days</td>
                      <td className="py-3 px-4">Contract performance</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4">Transaction records</td>
                      <td className="py-3 px-4">7 years from transaction</td>
                      <td className="py-3 px-4">Dutch General Tax Act (Art. 52 AWR); IRS requirements</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4">Donation records</td>
                      <td className="py-3 px-4">7 years</td>
                      <td className="py-3 px-4">Tax compliance (NL & US)</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4">Marketing consent records</td>
                      <td className="py-3 px-4">Duration of consent + 3 years</td>
                      <td className="py-3 px-4">Accountability (Art. 5(2) GDPR)</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4">AI chat logs</td>
                      <td className="py-3 px-4">90 days (or until inquiry resolved + 30 days)</td>
                      <td className="py-3 px-4">Legitimate interest / contract</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Analytics data</td>
                      <td className="py-3 px-4">26 months (aggregated/anonymized)</td>
                      <td className="py-3 px-4">Legitimate interest</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Your Rights — EU/EEA Residents (GDPR)</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">Under the GDPR, you have the following rights:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li><strong>Right of Access (Art. 15):</strong> Obtain confirmation and a copy of your personal data</li>
                <li><strong>Right to Rectification (Art. 16):</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Right to Erasure (Art. 17):</strong> Request deletion ("right to be forgotten") where applicable</li>
                <li><strong>Right to Restriction (Art. 18):</strong> Restrict processing in certain circumstances</li>
                <li><strong>Right to Data Portability (Art. 20):</strong> Receive your data in a structured, machine-readable format</li>
                <li><strong>Right to Object (Art. 21):</strong> Object to processing based on legitimate interest, including profiling</li>
                <li><strong>Right Not to Be Subject to Automated Decision-Making (Art. 22):</strong> Right not to be subject to decisions based solely on automated processing with legal or significant effects</li>
                <li><strong>Right to Withdraw Consent (Art. 7(3)):</strong> Withdraw consent at any time without affecting the lawfulness of prior processing</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                We respond to all valid requests within <strong>one month</strong> (extendable by two months for complex requests). Requests can be submitted via our{' '}
                <Link to="/contact" className="text-primary hover:underline">GRATIS Connect portal</Link>.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Your Rights — California Residents (CCPA/CPRA)</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">If you are a California resident, you have the following rights under the CCPA/CPRA:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li><strong>Right to Know:</strong> Request disclosure of the categories and specific pieces of personal information we have collected, the sources, purposes, and third parties with whom we share data</li>
                <li><strong>Right to Delete:</strong> Request deletion of personal information (subject to exceptions)</li>
                <li><strong>Right to Correct:</strong> Request correction of inaccurate personal information</li>
                <li><strong>Right to Opt-Out of Sale/Sharing:</strong> We do not sell or share your personal information for cross-context behavioral advertising</li>
                <li><strong>Right to Limit Use of Sensitive Personal Information:</strong> Limit the use and disclosure of sensitive personal information to purposes permitted by the CPRA</li>
                <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising any of these rights</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                To exercise these rights, submit a verifiable consumer request via our{' '}
                <Link to="/contact" className="text-primary hover:underline">GRATIS Connect portal</Link>
                . We will verify your identity before processing. We respond within <strong>45 days</strong> (extendable by an additional 45 days with notice). You may designate an authorized agent with written authorization.
              </p>
            </section>

            {/* 11 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Your Rights — Other U.S. States</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Residents of Virginia, Colorado, Connecticut, Utah, Texas, Oregon, Montana, and other states with comprehensive privacy laws have similar rights including access, correction, deletion, data portability, and the right to opt out of targeted advertising and profiling.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                If your request is denied, you have the right to appeal. Appeals can be submitted via our{' '}
                <Link to="/contact" className="text-primary hover:underline">GRATIS Connect portal</Link>
                . If the appeal is denied, you may contact your state Attorney General.
              </p>
            </section>

            {/* 12 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                <strong>COPPA Compliance:</strong> We do not knowingly collect personal information from children under 13 years of age in the United States. If we discover we have collected data from a child under 13, we will delete it promptly. Parents or guardians who believe we have collected information from a child under 13 should contact us immediately.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>GDPR (EU):</strong> Under Article 8 GDPR and Article 5 Uitvoeringswet AVG, we require consent from a parent or guardian for children under 16 in the Netherlands. The age threshold may vary by EU Member State (minimum 13).
              </p>
            </section>

            {/* 13 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We implement appropriate technical and organizational measures (Article 32 GDPR) to protect your data, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>TLS 1.3 encryption for all data in transit</li>
                <li>AES-256 encryption for data at rest</li>
                <li>Role-based access controls (RBAC) with principle of least privilege</li>
                <li>Multi-factor authentication for administrative access</li>
                <li>Regular penetration testing and vulnerability assessments</li>
                <li>Incident response plan with 72-hour breach notification (Article 33 GDPR)</li>
                <li>Annual security audits by independent assessors</li>
              </ul>
            </section>

            {/* 14 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">14. AI & Automated Processing</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Our GRATIS Connect system uses AI-powered tools to qualify inquiries and route them to the appropriate department or form. This processing:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-3">
                <li>Does not result in decisions with legal or similarly significant effects on you</li>
                <li>Is used to improve response times and accuracy</li>
                <li>Always allows escalation to a human representative</li>
                <li>Processes conversation data that is retained for 90 days maximum</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Under Article 22 GDPR, you have the right to object to solely automated decision-making. Under CCPA/CPRA, you have the right to opt out of automated decision-making technology. Contact us to exercise these rights.
              </p>
            </section>

            {/* 15 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">15. Do Not Track (DNT) Signals</h2>
              <p className="text-muted-foreground leading-relaxed">
                We honor the Global Privacy Control (GPC) signal as a valid opt-out of sale/sharing under the CCPA/CPRA. We currently do not respond to Do Not Track (DNT) browser signals, as there is no uniform industry standard for DNT compliance. For cookie preferences, please see our{' '}
                <Link to="/tribe/cookies" className="text-primary hover:underline">Cookie Policy</Link>.
              </p>
            </section>

            {/* 16 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">16. Safety — Disclaimer & Donor Privacy</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">16.1 General Disclaimer</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                All information, products, and services provided by Stichting G.R.A.T.I.S. through the Platform are offered on an <strong>"as is" and "as available"</strong> basis. While we strive for accuracy, we make no warranties or representations, express or implied, regarding:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>The completeness, reliability, or accuracy of content published on the Platform</li>
                <li>The suitability of our products or services for any particular purpose</li>
                <li>Uninterrupted or error-free operation of the Platform</li>
                <li>The outcomes or impact of any specific charitable project or initiative</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mb-3">
                GRATIS shall not be held liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of the Platform, reliance on any content, or participation in any programs, to the maximum extent permitted by Dutch law (Book 6, Dutch Civil Code) and applicable U.S. law.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">16.2 Limitation of Liability for Charitable Activities</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                GRATIS operates water distribution, environmental, and social impact programs in collaboration with verified NGO partners. While we exercise due diligence in partner selection and project oversight:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>We do not guarantee specific outcomes for any charitable project</li>
                <li>Impact metrics (e.g., liters funded, carbon saved) are estimates based on partner-reported data and may be subject to variance</li>
                <li>Participation in events, volunteer programs, or distribution activities is at the participant's own risk</li>
                <li>GRATIS is not responsible for the independent actions or omissions of NGO partners, volunteers, or third-party event organizers</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">16.3 Financial & Tax Disclaimer</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Nothing on the Platform constitutes financial, tax, investment, or legal advice. Donations made to GRATIS may qualify for tax deductions depending on your jurisdiction:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li><strong>Netherlands:</strong> Stichting G.R.A.T.I.S. operates as an ANBI (Algemeen Nut Beogende Instelling) — pending formal ANBI designation by the Belastingdienst</li>
                <li><strong>United States:</strong> Tax-deductibility is subject to IRS determination under Section 501(c)(3) of the Internal Revenue Code — pending determination letter</li>
                <li>Donors are advised to consult their own tax advisor regarding the deductibility of contributions</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Information about investments, the Spark program, or social enterprise activities on the Platform is provided for informational purposes only and does not constitute an offer to sell securities or a solicitation of investment.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">16.4 Donor Privacy & Bill of Rights</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                GRATIS adheres to the <strong>Association of Fundraising Professionals (AFP) Donor Bill of Rights</strong> and the <strong>CBF (Centraal Bureau Fondsenwerving)</strong> code of conduct. As a donor, you have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Be informed of GRATIS's mission, how funds are used, and our capacity to use donations effectively</li>
                <li>Be informed of the identity of those serving on the Foundation's board and to expect the board to exercise prudent stewardship</li>
                <li>Have access to GRATIS's most recent financial statements and annual reports</li>
                <li>Be assured your gifts will be used for the purposes for which they were given</li>
                <li>Receive appropriate acknowledgement and recognition for your contributions</li>
                <li>Be assured that information about your donation is handled with respect and confidentiality</li>
                <li>Expect that all relationships with individuals representing GRATIS will be professional</li>
                <li>Be informed whether those seeking donations are volunteers, employees, or hired solicitors</li>
                <li>Have the opportunity to opt out of future solicitations at any time</li>
                <li>Make anonymous donations — we respect your choice not to be publicly identified</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">16.5 Donor Data Protection</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We apply enhanced protections to donor personal data:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li><strong>No Sale or Sharing:</strong> We will never sell, trade, rent, or share your donor information (name, contact details, donation amounts, payment information) with any third party for their marketing purposes</li>
                <li><strong>Minimal Disclosure:</strong> Donor data is shared only with payment processors (Stripe) to process transactions, and with tax authorities when legally required</li>
                <li><strong>Access Restrictions:</strong> Donor records are accessible only to authorized GRATIS personnel with a legitimate need-to-know, enforced through role-based access controls</li>
                <li><strong>Encryption:</strong> All donation transactions are processed over TLS 1.3. Payment card data is handled exclusively by Stripe (PCI DSS Level 1 certified) and is never stored on GRATIS systems</li>
                <li><strong>Anonymization:</strong> Aggregate donation statistics used in impact reports are anonymized and cannot be traced to individual donors</li>
                <li><strong>Retention:</strong> Donor records are retained for 7 years for tax compliance (see Section 8). After the retention period, records are securely deleted or anonymized</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">16.6 Refund & Donation Reversal Policy</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Donations to GRATIS are generally non-refundable. However, if you believe a donation was made in error, was unauthorized, or was processed incorrectly, please contact us within <strong>30 days</strong> via our{' '}
                <Link to="/contact" className="text-primary hover:underline">GRATIS Connect portal</Link>
                . We will investigate and, where appropriate, process a full or partial refund.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">16.7 Third-Party Links & Content</h3>
              <p className="text-muted-foreground leading-relaxed">
                The Platform may contain links to third-party websites, NGO partner sites, or external resources. GRATIS is not responsible for the privacy practices, content, or accuracy of information on third-party sites. We encourage you to review the privacy policies of any external sites you visit. Inclusion of a link does not imply endorsement of the linked site or its operators.
              </p>
            </section>

            {/* 17 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">17. Complaints & Supervisory Authorities</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                <strong>EU/EEA:</strong> You have the right to lodge a complaint with the Dutch Data Protection Authority:
              </p>
              <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground mb-4">
                <p><strong>Autoriteit Persoonsgegevens</strong></p>
                <p>Bezuidenhoutseweg 30</p>
                <p>2594 AV Den Haag, Netherlands</p>
                <p><a href="https://autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">autoriteitpersoonsgegevens.nl</a></p>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-3">
                If you reside in another EU Member State, you may lodge a complaint with the supervisory authority in your country of habitual residence, place of work, or place of the alleged infringement (Article 77 GDPR).
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>United States:</strong> You may contact your state Attorney General or the Federal Trade Commission (FTC) at <a href="https://reportfraud.ftc.gov" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">reportfraud.ftc.gov</a>.
              </p>
            </section>

            {/* 18 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">18. Updates to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy periodically. Material changes will be communicated via email or a prominent notice on the Platform at least 30 days before they take effect. The "last updated" date at the top of this page indicates the latest revision. We encourage you to review this policy regularly.
              </p>
            </section>

            {/* 19 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">19. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                For privacy-related inquiries, data subject requests, or to contact our DPO, please use our{' '}
                <Link to="/contact" className="text-primary hover:underline">GRATIS Connect portal</Link>
                {' '}and select "Privacy & Data Protection."
              </p>
            </section>

          </Card>
        </div>
      </div>
    </>
  );
}
