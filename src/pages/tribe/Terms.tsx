import { SEO } from '@/components/SEO';
import { Card } from '@/components/ui/card';
import { PageHero } from '@/components/PageHero';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <>
      <SEO
        title="Terms of Use"
        description="Terms of Use for GRATIS — Governing your use of our website and services under Dutch and United States law."
      />
      
      <PageHero 
        title="Terms of Use" 
        lastUpdated="March 2026"
      />
      
      <div className="bg-background pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <Card className="p-8 space-y-10">

            {/* 1 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction & Acceptance</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                These Terms of Use ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and Stichting G.R.A.T.I.S., a non-profit foundation (stichting) incorporated under the laws of the Kingdom of the Netherlands, with registered offices in Amsterdam, KvK number [pending], and ANBI status granted by the Dutch Tax Authority ("GRATIS," "we," "us," or "our").
              </p>
              <p className="text-muted-foreground leading-relaxed mb-3">
                By accessing or using the GRATIS website at gratis.com and any associated sub-domains, mobile applications, or services (collectively, the "Platform"), you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree, you must immediately discontinue use of the Platform.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                These Terms are effective as of March 1, 2026, and supersede all prior agreements or understandings regarding your use of the Platform.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Eligibility</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You must be at least 16 years of age (the minimum age under the Dutch General Data Protection Regulation implementation, Uitvoeringswet AVG) to use the Platform. If you are a resident of the United States, you must be at least 13 years of age, or the minimum age required by your state of residence, whichever is greater.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                To make purchases through our merchandise store ("Rig Store") or Hydration Store, you must be at least 18 years of age or the age of majority in your jurisdiction. By placing an order, you represent and warrant that you meet these requirements.
              </p>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Dual-Jurisdiction Scope</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                GRATIS operates under a dual-jurisdiction framework:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-3">
                <li><strong>Netherlands / European Union:</strong> GRATIS is a Dutch stichting subject to Book 2 of the Dutch Civil Code (Burgerlijk Wetboek), the Dutch Consumer Protection Act (Wet handhaving consumentenbescherming), the EU Consumer Rights Directive 2011/83/EU, Regulation (EU) 2019/1150 (Platform-to-Business Regulation), the General Data Protection Regulation (EU) 2016/679 ("GDPR"), and the Dutch implementation thereof (Uitvoeringswet AVG).</li>
                <li><strong>United States:</strong> For users in the United States, GRATIS is recognized as a tax-exempt charitable organization under Section 501(c)(3) of the Internal Revenue Code (EIN: 95-1831116). U.S. users are additionally protected by the Federal Trade Commission Act (15 U.S.C. §§ 41–58), applicable state consumer protection statutes (including but not limited to California's Consumer Legal Remedies Act, Cal. Civ. Code §§ 1750–1784; New York General Business Law § 349), and the CAN-SPAM Act (15 U.S.C. § 7701 et seq.).</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Where Dutch/EU and U.S. laws provide different levels of protection, we apply the standard most favorable to the user in the applicable jurisdiction.
              </p>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Account Registration & Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Certain features of the Platform require you to create an account. When registering, you agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-3">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information to keep it accurate</li>
                <li>Maintain the security and confidentiality of your login credentials</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately at <Link to="/contact" className="text-primary hover:underline">gratis.com/contact</Link> of any unauthorized access</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to suspend or terminate accounts that violate these Terms, contain false information, or are used for fraudulent purposes, in accordance with Article 6:265 of the Dutch Civil Code (right to dissolve) and applicable U.S. law.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Products, Orders & Pricing</h2>
              
              <h3 className="text-xl font-medium mb-2 mt-4">5.1 Product Descriptions</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We make reasonable efforts to ensure product descriptions, images, and pricing are accurate. However, we do not warrant that descriptions are error-free. In the event of a material error, we will notify you and offer the option to confirm or cancel your order, in compliance with Article 6:228 BW (error/dwaling) and Article 6:230m BW (information requirements for distance contracts).
              </p>

              <h3 className="text-xl font-medium mb-2 mt-4">5.2 Pricing</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                All prices on the Platform are displayed in Euros (€). For EU customers, prices include Value Added Tax (BTW/VAT) at the applicable Dutch rate (currently 21% standard, 9% reduced for beverages). For U.S. customers, applicable sales tax will be calculated at checkout based on the delivery address, in compliance with South Dakota v. Wayfair, Inc., 585 U.S. 162 (2018), and applicable state nexus laws.
              </p>

              <h3 className="text-xl font-medium mb-2 mt-4">5.3 Order Formation</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Under Dutch law (Article 6:217 BW), a binding contract is formed when we send you an order confirmation email. Your order constitutes an offer; our confirmation constitutes acceptance. We reserve the right to refuse any order for reasons including stock availability, pricing errors, or suspected fraud.
              </p>

              <h3 className="text-xl font-medium mb-2 mt-4">5.4 Payment Processing</h3>
              <p className="text-muted-foreground leading-relaxed">
                Payments are processed securely by Stripe, Inc. and/or Stripe Payments Europe, Ltd. (as applicable). We do not store full payment card details. By submitting payment, you authorize us to charge the applicable amount. All transactions are subject to Stripe's terms of service and our <Link to="/tribe/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Shipping & Delivery</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We currently ship to addresses within the European Economic Area (EEA) and the United States. Delivery timeframes are estimates only and are not guaranteed. Under Dutch law, if delivery exceeds the agreed timeframe by more than a reasonable period, the buyer may set a final deadline (ingebrekestelling, Article 6:82 BW) and cancel if delivery still does not occur.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Risk of loss for physical products passes to you upon delivery to the carrier (for U.S. shipments, per UCC § 2-509) or upon receipt by you (for EU shipments, per Article 6:273g BW, implementing the Consumer Rights Directive).
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Right of Withdrawal & Returns</h2>
              
              <h3 className="text-xl font-medium mb-2 mt-4">7.1 EU Right of Withdrawal</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                If you are a consumer within the European Union, you have the right to withdraw from a distance purchase within <strong>14 calendar days</strong> of receiving the goods, without giving any reason, in accordance with Articles 6:230o–6:230s of the Dutch Civil Code (implementing Directive 2011/83/EU). To exercise this right, you must notify us via our <Link to="/contact" className="text-primary hover:underline">contact form</Link> using a clear statement. You must return the goods within 14 days of notification, at your own cost, in original condition.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-3">
                <strong>Exceptions:</strong> The right of withdrawal does not apply to sealed beverages that have been opened after delivery (Article 6:230p(1)(e) BW), perishable goods, or personalized items.
              </p>

              <h3 className="text-xl font-medium mb-2 mt-4">7.2 U.S. Returns</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                For U.S. customers, GRATIS offers a <strong>30-day return policy</strong> from the date of delivery. Products must be unused, in original packaging, and in resalable condition. Refunds will be issued to the original payment method within 10 business days of receiving the return, minus shipping costs unless the return is due to our error.
              </p>

              <h3 className="text-xl font-medium mb-2 mt-4">7.3 Defective Products</h3>
              <p className="text-muted-foreground leading-relaxed">
                Under Dutch law, you have the right to a conforming product (conformiteit, Article 7:17 BW). If a product is defective, you are entitled to repair, replacement, or a price reduction. In the U.S., implied warranties of merchantability and fitness for a particular purpose apply under the Uniform Commercial Code (UCC §§ 2-314, 2-315) and the Magnuson-Moss Warranty Act (15 U.S.C. §§ 2301–2312).
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Free Water Distribution</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                GRATIS distributes free water as part of its charitable mission. Free water distribution is not a commercial transaction and does not create a contractual obligation. All distributed water meets EU food safety regulations (Regulation (EC) No 178/2002, Regulation (EC) No 852/2004) and is approved by the Dutch Food and Consumer Product Safety Authority (NVWA). In the U.S., distributed water complies with FDA regulations (21 CFR Part 129 – Processing and Bottling of Bottled Drinking Water) and applicable state health codes.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                GRATIS makes no express or implied warranties regarding the suitability of free water for any specific medical condition. Consumers with health concerns should consult a medical professional.
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                All content on the Platform — including but not limited to the GRATIS name, logo, trade dress, product designs, bottle series designs, event photography, video content, text, graphics, user interface design, and software — is the property of Stichting G.R.A.T.I.S. or its licensors and is protected by:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-3">
                <li>Dutch Copyright Act (Auteurswet, Aw)</li>
                <li>Benelux Convention on Intellectual Property (BCIP/BVIE) for trademarks and designs</li>
                <li>EU Trade Mark Regulation (EUTMR) 2017/1001</li>
                <li>U.S. Copyright Act (17 U.S.C. §§ 101–810)</li>
                <li>U.S. Trademark Act (Lanham Act, 15 U.S.C. §§ 1051–1141n)</li>
                <li>Digital Millennium Copyright Act (DMCA, 17 U.S.C. § 512)</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                You may not reproduce, distribute, modify, create derivative works of, publicly display, or commercially exploit any content without prior written permission. Limited personal, non-commercial use (e.g., sharing links on social media) is permitted.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Prohibited Conduct</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Use the Platform for any unlawful purpose or in violation of any applicable law</li>
                <li>Engage in fraud, impersonation, or misrepresentation</li>
                <li>Attempt to gain unauthorized access to any part of the Platform, other accounts, or our systems (in violation of Article 138ab Dutch Criminal Code / U.S. Computer Fraud and Abuse Act, 18 U.S.C. § 1030)</li>
                <li>Introduce viruses, malware, or other harmful code</li>
                <li>Scrape, crawl, or harvest data from the Platform without written authorization</li>
                <li>Interfere with or disrupt the integrity or performance of the Platform</li>
                <li>Use automated means (bots, scripts) to access the Platform except as expressly permitted</li>
                <li>Resell free water or merchandise obtained through promotional programs for profit</li>
                <li>Submit false donation claims or fraudulent charitable contribution requests</li>
              </ul>
            </section>

            {/* 11 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Donations & Charitable Contributions</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Donations made through the Platform are voluntary and non-refundable. GRATIS is a registered ANBI in the Netherlands, meaning donations may be tax-deductible for Dutch taxpayers under Article 6.32 of the Dutch Income Tax Act (Wet inkomstenbelasting 2001). In the United States, GRATIS is a 501(c)(3) organization (EIN: 95-1831116); contributions are deductible to the extent permitted by Section 170 of the Internal Revenue Code.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                GRATIS complies with state charitable solicitation registration requirements where applicable, including but not limited to New York Executive Law Article 7-A, California Government Code §§ 12580–12599.7, and other state registration laws. Donation receipts are provided for all contributions exceeding applicable thresholds.
              </p>
            </section>

            {/* 12 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Third-Party Links & Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Platform may contain links to third-party websites or services (including Stripe for payments, Mapbox for location services, and social media platforms). We are not responsible for the content, privacy practices, or terms of third-party services. Your use of such services is at your own risk and subject to their respective terms.
              </p>
            </section>

            {/* 13 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                <strong>For U.S. users:</strong> THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR VIRUS-FREE.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>For EU users:</strong> This disclaimer does not affect your statutory rights under applicable consumer protection legislation, including the Dutch Consumer Protection Act and the EU Consumer Rights Directive. Nothing in these Terms limits or excludes liability that cannot be limited or excluded under applicable law.
              </p>
            </section>

            {/* 14 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">14. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                <strong>For U.S. users:</strong> TO THE MAXIMUM EXTENT PERMITTED BY LAW, GRATIS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE PLATFORM. OUR TOTAL AGGREGATE LIABILITY SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNTS PAID BY YOU IN THE 12 MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED U.S. DOLLARS ($100).
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>For EU users:</strong> Under Dutch law (Article 6:74 BW et seq.), our liability is limited to direct damages caused by an attributable failure (toerekenbare tekortkoming) in the performance of these Terms. We shall not be liable for consequential damages (gevolgschade) unless caused by willful misconduct (opzet) or gross negligence (grove schuld). This limitation does not affect mandatory consumer rights under Dutch and EU law.
              </p>
            </section>

            {/* 15 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">15. Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify, defend, and hold harmless GRATIS, its board members, officers, employees, agents, and partners from and against any claims, liabilities, damages, losses, and expenses (including reasonable attorney's fees) arising out of or related to: (a) your use of the Platform; (b) your violation of these Terms; (c) your violation of any third-party rights; or (d) any content you submit to the Platform. This indemnification obligation survives termination of these Terms. For EU consumers, this clause applies only to the extent permitted by applicable mandatory consumer protection law.
              </p>
            </section>

            {/* 16 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">16. Governing Law & Dispute Resolution</h2>
              
              <h3 className="text-xl font-medium mb-2 mt-4">16.1 For EU Users</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                These Terms are governed by the laws of the Netherlands. Disputes shall be submitted to the exclusive jurisdiction of the competent court in Amsterdam. However, if you are a consumer habitually resident in another EU Member State, you retain the right to invoke the jurisdiction of the courts of your habitual residence under Regulation (EU) No 1215/2012 (Brussels I Recast). You may also use the EU Online Dispute Resolution platform at{' '}
                <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  ec.europa.eu/consumers/odr
                </a>.
              </p>

              <h3 className="text-xl font-medium mb-2 mt-4">16.2 For U.S. Users</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                For users in the United States, these Terms are governed by the laws of the State of New York, without regard to conflict of law principles. Any dispute not resolved informally within 30 days shall be resolved by binding arbitration administered by the American Arbitration Association ("AAA") under its Consumer Arbitration Rules. Arbitration shall take place in New York, NY, or remotely at the option of the claimant. The arbitrator's award shall be final and binding.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>CLASS ACTION WAIVER:</strong> TO THE FULLEST EXTENT PERMITTED BY LAW, YOU AND GRATIS AGREE THAT ANY PROCEEDINGS TO RESOLVE DISPUTES WILL BE CONDUCTED SOLELY ON AN INDIVIDUAL BASIS. NEITHER YOU NOR GRATIS WILL SEEK TO HAVE ANY DISPUTE HEARD AS A CLASS ACTION, REPRESENTATIVE ACTION, OR PRIVATE ATTORNEY GENERAL ACTION. This waiver does not apply where prohibited by applicable law.
              </p>
            </section>

            {/* 17 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">17. Privacy & Data Protection</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your use of the Platform is also governed by our{' '}
                <Link to="/tribe/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                {' '}and{' '}
                <Link to="/tribe/cookies" className="text-primary hover:underline">Cookie Policy</Link>
                , which are incorporated by reference into these Terms. Please review them carefully.
              </p>
            </section>

            {/* 18 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">18. Modifications to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update these Terms from time to time. Material changes will be communicated via email or a prominent notice on the Platform at least 30 days before they take effect. Continued use after the effective date constitutes acceptance. If you do not agree to the revised Terms, you must stop using the Platform. The "last updated" date at the top of this page indicates the latest revision.
              </p>
            </section>

            {/* 19 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">19. Severability</h2>
              <p className="text-muted-foreground leading-relaxed">
                If any provision of these Terms is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions shall remain in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable, consistent with the intent of these Terms (Article 3:41 BW).
              </p>
            </section>

            {/* 20 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">20. Entire Agreement & Contact</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                These Terms, together with our Privacy Policy, Cookie Policy, and any order-specific terms, constitute the entire agreement between you and GRATIS regarding your use of the Platform.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms, please reach out via our{' '}
                <Link to="/contact" className="text-primary hover:underline">
                  GRATIS Connect portal
                </Link>
                .
              </p>
              <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                <p><strong>Stichting G.R.A.T.I.S.</strong></p>
                <p>Amsterdam, the Netherlands</p>
                <p>KvK: [pending registration]</p>
                <p>RSIN/EIN: 95-1831116</p>
                <p>ANBI Registered</p>
              </div>
            </section>

          </Card>
        </div>
      </div>
    </>
  );
}
