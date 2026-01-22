import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { PageHero } from "@/components/PageHero";

export default function Terms() {
  return (
    <>
      <SEO
        title="Terms of Use - G.R.A.T.I.S."
        description="G.R.A.T.I.S. Terms of Use - Read our terms and conditions including TRIBE membership, purchases, and donations."
      />

      <PageHero
        title="Terms of Use"
        subtitle="G.R.A.T.I.S. (Giving Resources to Achieve Transformative and Impactful Change)"
        lastUpdated="January 14, 2026"
      />

      <div className="bg-background pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <Card className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to GRATIS.NGO. By accessing and using this website and
                our services (including purchasing products, making donations,
                and participating in our community), you accept and agree to be
                bound by these Terms of Use and our Privacy Policy. If you do
                not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. About GRATIS</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                G.R.A.T.I.S. (Giving Resources to Achieve Transformative and
                Impactful Change) is a registered Dutch foundation (Stichting)
                based in Amsterdam, Netherlands. We operate a social enterprise
                model where advertising revenue from our free water distribution
                program funds verified NGO partners globally.
              </p>
              <div className="bg-muted/50 rounded-lg p-4 text-sm">
                <p>
                  <strong>Chamber of Commerce (KVK):</strong> [To be assigned]
                </p>
                <p>
                  <strong>ANBI Status:</strong> [Pending/Approved]
                </p>
                <p>
                  <strong>USA 501(c)(3) Status:</strong> Pending Application
                  (Expected Q2 2026)
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                3. Use of Services
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When using our services, you agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  Provide accurate, current, and complete information when
                  making purchases or donations
                </li>
                <li>Maintain the security of your account credentials</li>
                <li>Use our services only for lawful purposes</li>
                <li>
                  Not engage in any activity that interferes with or disrupts
                  our services
                </li>
                <li>
                  Not attempt to gain unauthorized access to our systems or
                  networks
                </li>
                <li>Not impersonate any person or entity</li>
                <li>Not violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                4. Account Registration
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To make purchases or access certain features (such as TRIBE
                membership), you may need to create an account. You are
                responsible for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>
                  Maintaining the confidentiality of your account credentials
                </li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>
                  Ensuring you meet the minimum age requirement (16 years or
                  older)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                4. TRIBE Membership Program
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                GRATIS offers a tiered membership program called 'TRIBE' with
                the following options:
              </p>

              <div className="overflow-x-auto mb-4">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-border">
                      <th className="text-left p-3 font-semibold">Tier</th>
                      <th className="text-left p-3 font-semibold">Price</th>
                      <th className="text-left p-3 font-semibold">Billing</th>
                      <th className="text-left p-3 font-semibold">
                        Key Benefits
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border">
                      <td className="p-3">
                        <strong>Explorer</strong>
                      </td>
                      <td className="p-3">Free</td>
                      <td className="p-3">N/A</td>
                      <td className="p-3">
                        Basic access, newsletter, community updates
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3">
                        <strong>Insider</strong>
                      </td>
                      <td className="p-3">€9.99/month</td>
                      <td className="p-3">Monthly recurring</td>
                      <td className="p-3">
                        Early access, member discounts, exclusive content
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3">
                        <strong>Core</strong>
                      </td>
                      <td className="p-3">€97/year</td>
                      <td className="p-3">Annual recurring</td>
                      <td className="p-3">
                        All Insider benefits + priority support, exclusive
                        events
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3">
                        <strong>Founder</strong>
                      </td>
                      <td className="p-3">€247 one-time</td>
                      <td className="p-3">Lifetime (one-time)</td>
                      <td className="p-3">
                        All benefits forever, founder recognition, governance
                        input
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    4.1 Subscription Terms
                  </h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                      Paid memberships automatically renew unless cancelled
                      before the renewal date
                    </li>
                    <li>
                      Monthly subscriptions renew on the same day each month
                    </li>
                    <li>
                      Annual subscriptions renew on the anniversary of your
                      subscription start date
                    </li>
                    <li>
                      Price changes will be notified at least 30 days in advance
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    4.2 Cancellation Policy
                  </h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                      You may cancel your subscription at any time through your
                      account settings
                    </li>
                    <li>
                      Cancellation takes effect at the end of the current
                      billing period
                    </li>
                    <li>
                      No prorated refunds are provided for partial periods
                    </li>
                    <li>
                      Founder memberships are non-refundable lifetime
                      memberships
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    4.3 Founder Membership Special Terms
                  </h4>
                  <p className="mb-2">
                    Founder memberships are one-time purchases granting lifetime
                    benefits:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>No refunds will be provided for Founder memberships</li>
                    <li>
                      Benefits will be honored for as long as GRATIS operates
                    </li>
                    <li>
                      Any successor organization will be encouraged to honor
                      Founder benefits
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    4.4 Benefit Modifications
                  </h4>
                  <p>
                    We reserve the right to modify membership benefits with 60
                    days notice. Core benefits (as defined at time of purchase)
                    will be maintained or replaced with equivalent value.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                5. Products and Pricing
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We offer premium beverages (GRATIS Water, Theurgy, F.U.) and
                merchandise (RIG collection). All prices are displayed in Euros
                (€) and include applicable VAT for EU customers. We reserve the
                right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>Modify prices at any time without prior notice</li>
                <li>Discontinue products or limit quantities</li>
                <li>
                  Correct pricing errors (you will be notified and given the
                  option to cancel)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                6. Orders and Payment
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All orders are subject to availability and acceptance. Payment
                is processed securely through Stripe. By placing an order, you:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  Represent that you are authorized to use the payment method
                </li>
                <li>Authorize us to charge the specified amount</li>
                <li>
                  Agree that we may cancel or refuse orders at our discretion
                </li>
                <li>
                  Will receive an order confirmation email (not a guarantee of
                  shipment)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Pre-Orders</h2>
              <p className="text-muted-foreground leading-relaxed">
                Certain products (such as Theurgy and F.U.) may be available for
                pre-order. Pre-order terms:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>Payment is charged at the time of pre-order placement</li>
                <li>
                  Estimated shipping dates are provided but not guaranteed
                </li>
                <li>You will be notified of any significant delays</li>
                <li>Pre-orders are non-refundable except as required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                8. Shipping and Delivery
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We currently ship to locations within the European Union.
                Shipping terms:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>Free shipping on orders over €50</li>
                <li>Delivery times are estimates and may vary</li>
                <li>
                  Risk of loss and title pass to you upon delivery to the
                  carrier
                </li>
                <li>
                  You are responsible for providing accurate shipping
                  information
                </li>
                <li>
                  We are not liable for delays caused by carriers or customs
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                9. Returns and Refunds
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In accordance with EU consumer protection laws, you have the
                right to return products within 30 days of delivery:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  Products must be unused, unopened, and in original packaging
                </li>
                <li>
                  Beverages cannot be returned once opened due to health and
                  safety regulations
                </li>
                <li>
                  Contact us at{" "}
                  <a
                    href="mailto:orders@gratis.ngo"
                    className="text-primary hover:underline"
                  >
                    orders@gratis.ngo
                  </a>{" "}
                  to initiate a return
                </li>
                <li>
                  Refunds will be processed within 14 days of receiving the
                  returned items
                </li>
                <li>
                  Return shipping costs are the responsibility of the customer
                  unless the product is defective
                </li>
                <li>
                  Certain items (personalized products, gift cards) are
                  non-refundable
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Donations</h2>
              <p className="text-muted-foreground leading-relaxed">
                Donations to GRATIS are voluntary contributions to support our
                charitable mission:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>Donations are non-refundable</li>
                <li>
                  Tax receipts will be provided for eligible donations in
                  compliance with Dutch tax law
                </li>
                <li>
                  We reserve the right to use donations where they are most
                  needed unless otherwise specified
                </li>
                <li>
                  Recurring donations can be canceled at any time through your
                  account settings
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                11. TRIBE Membership
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                TRIBE is our membership program offering exclusive benefits:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>
                  Membership fees are charged monthly or annually based on your
                  selected tier
                </li>
                <li>
                  Benefits vary by tier (Explorer, Insider, Core, Founder)
                </li>
                <li>
                  Memberships auto-renew unless canceled before the renewal date
                </li>
                <li>No refunds for partial membership periods</li>
                <li>We may modify benefits with 30 days' notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                12. Intellectual Property
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All content on this website is the property of Stichting GRATIS
                and protected by intellectual property laws:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  GRATIS logo, brand name, and all product names are our
                  trademarks
                </li>
                <li>
                  Website design, text, graphics, images, and code are
                  copyrighted
                </li>
                <li>
                  You may not reproduce, distribute, modify, or create
                  derivative works without written permission
                </li>
                <li>
                  Limited use for personal, non-commercial purposes is permitted
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                13. User-Generated Content
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you submit content (reviews, comments, photos), you grant us
                a non-exclusive, royalty-free, worldwide license to use,
                display, and distribute that content. You represent that:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>You own or have rights to the content</li>
                <li>
                  The content does not violate any laws or third-party rights
                </li>
                <li>
                  The content is not defamatory, offensive, or inappropriate
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                14. Disclaimer of Warranties
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services are provided "as is" without warranties of any
                kind, express or implied. We do not warrant that:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>
                  Our services will be uninterrupted, secure, or error-free
                </li>
                <li>Product descriptions are completely accurate</li>
                <li>Any errors will be corrected</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                15. Limitation of Liability
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To the fullest extent permitted by law, GRATIS shall not be
                liable for any indirect, incidental, consequential, or punitive
                damages arising from your use of our services. Our total
                liability is limited to the amount you paid for the products or
                services in question.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                16. Indemnification
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify and hold GRATIS harmless from any claims,
                damages, or expenses arising from your violation of these Terms
                or misuse of our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                17. Governing Law and Disputes
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms are governed by the laws of the Netherlands and the
                European Union. Any disputes shall be resolved in the courts of
                Amsterdam, Netherlands. For EU consumers, you may also have the
                right to use alternative dispute resolution.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                18. Changes to Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time.
                Significant changes will be communicated via email or website
                notice. Continued use of our services after changes constitutes
                acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">19. Severability</h2>
              <p className="text-muted-foreground leading-relaxed">
                If any provision of these Terms is found to be unenforceable,
                the remaining provisions will remain in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                20. Contact Information
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p>For questions about these Terms of Use:</p>
                <ul className="list-none space-y-1 ml-4">
                  <li>
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:legal@gratis.ngo"
                      className="text-primary hover:underline"
                    >
                      legal@gratis.ngo
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
