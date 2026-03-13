import SEO from '@/components/SEO';
import { Card } from '@/components/ui/card';
import { PageHero } from '@/components/PageHero';
import { Link } from 'react-router-dom';

export default function Compliance() {
  return (
    <>
      <SEO
        title="Compliance & Licenses — GRATIS"
        description="Operational excellence meets charitable purpose. Compliance framework, licenses, certifications, and NGO partner vetting for Stichting G.R.A.T.I.S."
      />

      <PageHero
        title="Compliance & Licenses"
        subtitle="Operational excellence meets charitable purpose."
        lastUpdated="March 2026"
      />

      <div className="bg-background pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <Card className="p-8 space-y-10">

            {/* 1. Legal Status */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Legal Status & Registration</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Stichting G.R.A.T.I.S. ("GRATIS") is a non-profit foundation (<em>stichting</em>) incorporated under Dutch law and registered with the following authorities:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-muted-foreground border border-border rounded-lg">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Registration</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Authority</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4">KvK (Chamber of Commerce)</td>
                      <td className="py-3 px-4">Kamer van Koophandel</td>
                      <td className="py-3 px-4">Registered</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4">ANBI Tax-Exempt Status</td>
                      <td className="py-3 px-4">Belastingdienst (Dutch Tax Authority)</td>
                      <td className="py-3 px-4">Pending</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4">RSIN / Fiscal ID</td>
                      <td className="py-3 px-4">Belastingdienst</td>
                      <td className="py-3 px-4">95-1831116</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">501(c)(3) Equivalency</td>
                      <td className="py-3 px-4">IRS (United States)</td>
                      <td className="py-3 px-4">Pending</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4">
                GRATIS's Articles of Association define a clear governance structure with an independent board of directors, separation of duties, and statutory audit requirements.
              </p>
            </section>

            {/* 2. Operational Capabilities */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Operational Capabilities</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                GRATIS operates with infrastructure that matches commercial-grade distribution standards. Our Amsterdam-based operations center serves as the hub for free water distribution across the Netherlands and major European cities.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">5,000+</div>
                  <div className="text-xs text-muted-foreground">Distribution Points</div>
                </div>
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">1M+</div>
                  <div className="text-xs text-muted-foreground">Bottles Annually</div>
                </div>
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">10+</div>
                  <div className="text-xs text-muted-foreground">Countries Served</div>
                </div>
              </div>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Amsterdam Distribution Center</strong> — Temperature-controlled warehouse for bulk water storage and beverage distribution</li>
                <li><strong>Big 5 Train Stations</strong> — Amsterdam Centraal, Rotterdam Centraal, Utrecht Centraal, Den Haag Centraal, Eindhoven Centraal</li>
                <li><strong>European Expansion</strong> — Active distribution points in Berlin, Paris, Brussels, London, and other major cities</li>
                <li><strong>Cold Chain Capability</strong> — Refrigerated storage for premium beverages (Theurgy, FU editions)</li>
              </ul>
            </section>

            {/* 3. Product Quality */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Product Quality & Safety Standards</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Every GRATIS product — from free water to premium beverages — meets the highest quality and safety standards required by Dutch, EU, and international regulations.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Water Quality Certifications</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 text-sm">
                    <li><strong>HACCP Certified</strong> — Hazard Analysis Critical Control Points</li>
                    <li><strong>ISO 22000</strong> — Food Safety Management System</li>
                    <li><strong>EU Regulation (EC) 852/2004</strong> — Food hygiene compliance</li>
                    <li><strong>NVWA Approved</strong> — Dutch Food & Consumer Product Safety Authority</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Production Standards</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 text-sm">
                    <li><strong>Natural Ingredients</strong> — Verified natural ingredients across all beverages</li>
                    <li><strong>Batch Testing</strong> — Rigorous quality control and documentation per batch</li>
                    <li><strong>Supplier Vetting</strong> — Licensed suppliers only with full traceability</li>
                    <li><strong>Anti-Counterfeit</strong> — Verified production facilities, secure supply chain</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 4. Compliance Framework */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Compliance Framework</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                GRATIS sources products exclusively from licensed manufacturers and wholesale distributors, safeguarding against counterfeits and contraband.
              </p>
              <h3 className="text-lg font-semibold mb-3">Regulatory Oversight</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Dutch Ministry of Health, Welfare and Sport (VWS) supervision</li>
                <li>NVWA regular inspections and approvals</li>
                <li>EU General Food Law Regulation (EC) 178/2002 compliance</li>
                <li>Municipal health department approvals for distribution events</li>
                <li>GDPR compliance for all personal data processing</li>
              </ul>
              <h3 className="text-lg font-semibold mb-3">Standard Operating Procedures</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                GRATIS maintains a documented SOP framework governing:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Product sourcing, verification, and recall protocols</li>
                <li>Temperature-controlled storage and handling procedures</li>
                <li>Distribution tracking, chain-of-custody documentation</li>
                <li>Incident reporting and corrective action processes</li>
                <li>Annual internal and external quality assurance audits</li>
              </ul>
            </section>

            {/* 5. Financial Transparency */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Financial Transparency & Auditing</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                GRATIS is committed to full financial transparency. As a charitable foundation, we maintain rigorous financial controls:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li><strong>Independent Audits</strong> — Annual financial audits by a registered Dutch accountant (<em>registeraccountant</em>)</li>
                <li><strong>Public Reporting</strong> — Annual reports and financial statements published on our website</li>
                <li><strong>100% Ad Revenue Model</strong> — Real-time dashboard verifies that 100% of advertising revenue is allocated to verified NGO partners</li>
                <li><strong>ANBI Reporting</strong> — Compliance with ANBI public disclosure requirements (pending designation)</li>
                <li><strong>Donation Tracking</strong> — All donations processed via PCI-DSS compliant payment processors with full audit trails</li>
                <li><strong>7-Year Retention</strong> — Financial records retained for a minimum of seven years per Dutch fiscal law</li>
              </ul>
            </section>

            {/* 6. NGO Partner Vetting */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">6. NGO Partner Due Diligence</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                GRATIS applies a strict due diligence framework to all NGO partnerships. Funds are only disbursed to organizations that meet and maintain the following criteria:
              </p>
              <h3 className="text-lg font-semibold mb-3">Mandatory Requirements</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Valid ANBI (Netherlands) or 501(c)(3) (United States) tax-exempt status</li>
                <li>Minimum 3-year operating history</li>
                <li>Minimum 2 years of independently audited financial statements</li>
                <li>Documented track record of measurable charitable impact</li>
              </ul>
              <h3 className="text-lg font-semibold mb-3">Vetting Process</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Anti-Money Laundering (AML) and sanctions screening</li>
                <li>Board composition and governance structure review</li>
                <li>On-site visits to verify operations and beneficiary impact</li>
                <li>Reference checks with peer organizations and regulatory bodies</li>
              </ul>
              <h3 className="text-lg font-semibold mb-3">Ongoing Compliance</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Quarterly impact reports with verifiable KPIs</li>
                <li>Annual independent audit submission</li>
                <li>Annual compliance re-verification</li>
                <li>Immediate reporting of any material changes in governance, operations, or legal standing</li>
              </ul>
              <h3 className="text-lg font-semibold mb-3">Disqualification Criteria</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                The following result in immediate disqualification or termination of partnership:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Presence on international sanctions lists (EU, OFAC, UN)</li>
                <li>History of fraud, embezzlement, or misuse of charitable funds</li>
                <li>Failure to submit required financial audits or impact reports</li>
                <li>Material misrepresentation during the application or review process</li>
              </ul>
            </section>

            {/* 7. Licenses & Certifications */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Licenses & Certifications Summary</h2>
              <div className="grid sm:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Legal</h3>
                  <ul className="text-muted-foreground text-sm space-y-1">
                    <li>• Dutch Stichting Registration</li>
                    <li>• ANBI Status (pending)</li>
                    <li>• KvK Business Registration</li>
                    <li>• RSIN: 95-1831116</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Safety & Quality</h3>
                  <ul className="text-muted-foreground text-sm space-y-1">
                    <li>• NVWA Approval</li>
                    <li>• HACCP Certification</li>
                    <li>• ISO 22000 Certification</li>
                    <li>• EU Food Distribution Compliance</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Operational</h3>
                  <ul className="text-muted-foreground text-sm space-y-1">
                    <li>• Warehouse Facility Licenses</li>
                    <li>• Distribution Permits</li>
                    <li>• Municipal Health Approvals</li>
                    <li>• Liability & Product Insurance</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 8. Memberships */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Memberships & Affiliations</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { name: 'Partos', desc: 'Dutch Association for Development Cooperation' },
                  { name: 'CBF', desc: 'Central Bureau on Fundraising (pending certification)' },
                  { name: 'Dutch Food Bank Network', desc: 'Partnership Member' },
                  { name: 'European NGO Confederation', desc: 'Active Member' },
                  { name: 'Sustainable Packaging Alliance', desc: 'Sustainability Partner' },
                  { name: 'Fair Trade Certified', desc: 'Ethical Sourcing' },
                ].map((item) => (
                  <div key={item.name} className="bg-muted/30 rounded-lg p-4">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 9. Culture */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">9. A Culture of Compliance</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                GRATIS's culture of compliance drives the operational excellence required to carry out our mission: improving lives through free access to clean water and beverages, while funding critical NGO work through advertising revenue.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We welcome regular audits by Dutch, EU, and international regulatory authorities. Our commitment to transparency and accountability sets the standard for modern charitable organizations.
              </p>
            </section>

            {/* 10. Contact */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                For compliance inquiries, audit requests, or questions about our certifications, please contact us via our{' '}
                <Link to="/contact" className="text-primary hover:underline">GRATIS Connect portal</Link>
                {' '}and select "Legal — Compliance."
              </p>
            </section>

          </Card>
        </div>
      </div>
    </>
  );
}
