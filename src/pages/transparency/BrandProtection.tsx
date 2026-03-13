import SEO from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { PageHero } from "@/components/PageHero";
import { Link } from "react-router-dom";

export default function BrandProtection() {
  return (
    <>
      <SEO
        title="Rights & Brand Protection — GRATIS"
        description="Intellectual property rights, trademarks, and brand usage guidelines for Stichting G.R.A.T.I.S."
      />

      <PageHero title="Rights & Brand Protection" lastUpdated="March 2026" />

      <div className="bg-background pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <Card className="p-8 space-y-10">
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                1. Intellectual Property Ownership
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                All intellectual property associated with Stichting G.R.A.T.I.S.
                ("GRATIS"), including but not limited to trademarks, logos,
                trade dress, product designs, website content, software,
                editorial content, photography, video, and creative assets, is
                the exclusive property of Stichting G.R.A.T.I.S. or its
                licensors.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-3">
                This includes, without limitation:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-3">
                <li>The GRATIS word mark, logo, and any variations thereof</li>
                <li>Product names: GRATIS Water, Theurgy, FU, Arcane</li>
                <li>
                  Sub-brand names: Impact TV, Spark, TRIBE, RIG Store, Hydration
                  Store
                </li>
                <li>Series names: Nexus, Yarns, Unveil, Icon, Tales</li>
                <li>
                  Taglines: "Empower Change with Every Pack," "Free Water, Real
                  Impact"
                </li>
                <li>The GRATIS bottle design, label design, and trade dress</li>
                <li>Website design, UI elements, and original code</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                All rights are reserved under applicable Dutch intellectual
                property law (Benelux Convention on Intellectual Property,
                BCIP), EU intellectual property regulations, and the laws of
                other jurisdictions where GRATIS operates.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                2. Trademark Registrations
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                GRATIS trademarks are registered or pending registration with
                the following offices:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-muted-foreground border border-border rounded-lg">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Mark
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Office
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4">GRATIS (word)</td>
                      <td className="py-3 px-4">BOIP (Benelux)</td>
                      <td className="py-3 px-4">Pending</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4">GRATIS (logo)</td>
                      <td className="py-3 px-4">EUIPO (EU-wide)</td>
                      <td className="py-3 px-4">Pending</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4">GRATIS (word)</td>
                      <td className="py-3 px-4">USPTO (United States)</td>
                      <td className="py-3 px-4">Pending</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">GRATIS bottle design</td>
                      <td className="py-3 px-4">BOIP / EUIPO</td>
                      <td className="py-3 px-4">Pending</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The "™" symbol denotes trademarks pending registration. The
                "®" symbol will be applied upon successful registration.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Permitted Use</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                The following uses of GRATIS brand assets are permitted{" "}
                <strong>without prior written authorization</strong>:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>
                  Editorial or journalistic references to GRATIS, provided the
                  context is factual and not misleading
                </li>
                <li>
                  Personal, non-commercial social media sharing of GRATIS
                  content with proper attribution
                </li>
                <li>
                  Academic or research references with appropriate citation
                </li>
                <li>
                  Reviews and commentary constituting fair use under applicable
                  law
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                For press and media use, official brand assets are available
                through our{" "}
                <Link
                  to="/tribe/press"
                  className="text-primary hover:underline"
                >
                  Press & Media page
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Prohibited Use</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                The following uses of GRATIS intellectual property are{" "}
                <strong>strictly prohibited</strong> without express written
                consent:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  Use of the GRATIS name, logo, or any marks in connection with
                  any product or service not officially affiliated with GRATIS
                </li>
                <li>
                  Modification, distortion, or alteration of any GRATIS logo,
                  mark, or design element
                </li>
                <li>
                  Use of GRATIS marks in a manner that implies endorsement,
                  sponsorship, or affiliation where none exists
                </li>
                <li>
                  Registration of domain names, social media handles, or
                  business names that incorporate GRATIS marks
                </li>
                <li>
                  Use of GRATIS marks in meta tags, AdWords, SEO keywords, or
                  other digital advertising mechanisms without authorization
                </li>
                <li>
                  Reproduction of GRATIS editorial content, photography, or
                  video beyond fair use provisions
                </li>
                <li>
                  Counterfeiting, imitation, or knock-off production of GRATIS
                  products or packaging
                </li>
                <li>
                  Use of GRATIS brand assets to promote political campaigns,
                  discriminatory content, or illegal activities
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                5. Partner & Advertiser Brand Usage
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Advertising partners whose brands appear on GRATIS water bottles
                or marketing materials are granted a limited, non-exclusive,
                non-transferable license to use their placement for the duration
                of the advertising agreement. Partners may:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>
                  Reference their GRATIS partnership in their own marketing with
                  prior approval of messaging
                </li>
                <li>
                  Use the "GRATIS Partner" badge as provided in partner brand
                  guidelines
                </li>
                <li>
                  Share GRATIS co-branded assets distributed through official
                  channels
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                All partner brand usage must comply with the GRATIS Partner
                Brand Guidelines provided upon signing of the advertising
                agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                6. NGO Partner Brand Usage
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Verified NGO partners listed on the GRATIS Platform may:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>
                  Display the "Supported by GRATIS" badge on their website and
                  marketing materials
                </li>
                <li>
                  Reference their GRATIS partnership in grant applications and
                  annual reports
                </li>
                <li>
                  Use co-branded impact statistics as verified and approved by
                  GRATIS
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                NGO partners may not imply that GRATIS endorses any activities,
                positions, or initiatives beyond the scope of the verified
                partnership agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                7. User-Generated Content
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                By submitting reviews, comments, photos, or other content to the
                GRATIS Platform, you grant GRATIS a non-exclusive, worldwide,
                royalty-free, perpetual, irrevocable license to use, reproduce,
                modify, adapt, publish, translate, and distribute such content
                across any medium.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You retain ownership of your original content. You represent and
                warrant that your submissions do not infringe the intellectual
                property rights of any third party.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                8. DMCA & Takedown Procedures
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                GRATIS respects the intellectual property rights of others. If
                you believe your copyrighted work has been used on our Platform
                in a way that constitutes infringement, please submit a takedown
                notice via our{" "}
                <Link to="/contact" className="text-primary hover:underline">
                  GRATIS Connect portal
                </Link>{" "}
                (select "Legal — Copyright / IP" as the inquiry type) including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-3">
                <li>
                  Identification of the copyrighted work claimed to have been
                  infringed
                </li>
                <li>
                  Identification of the material that is claimed to be
                  infringing, with sufficient detail to locate it
                </li>
                <li>
                  Your contact information (name, address, telephone, email)
                </li>
                <li>
                  A statement that you have a good faith belief the use is not
                  authorized by the copyright owner
                </li>
                <li>
                  A statement, under penalty of perjury, that the information is
                  accurate and you are authorized to act on behalf of the owner
                </li>
                <li>Your physical or electronic signature</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                We comply with the U.S. Digital Millennium Copyright Act (DMCA,
                17 U.S.C. § 512) and the EU Directive on Copyright in the
                Digital Single Market (Directive 2019/790).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Enforcement</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                GRATIS actively monitors and enforces its intellectual property
                rights. Unauthorized use of GRATIS marks, content, or brand
                assets may result in:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-3">
                <li>Cease-and-desist correspondence</li>
                <li>
                  Formal takedown requests to hosting providers and platforms
                </li>
                <li>
                  Domain dispute proceedings under the Uniform Domain-Name
                  Dispute-Resolution Policy (UDRP)
                </li>
                <li>
                  Civil litigation for trademark infringement, unfair
                  competition, or copyright infringement under applicable Dutch,
                  EU, and U.S. law
                </li>
                <li>
                  Reporting to law enforcement in cases of counterfeiting or
                  fraud
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                To report suspected misuse of GRATIS intellectual property,
                please contact us via our{" "}
                <Link to="/contact" className="text-primary hover:underline">
                  GRATIS Connect portal
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                For brand licensing inquiries, press asset requests, or
                intellectual property questions, please contact us via our{" "}
                <Link to="/contact" className="text-primary hover:underline">
                  GRATIS Connect portal
                </Link>{" "}
                and select "Legal — Brand & IP."
              </p>
            </section>
          </Card>
        </div>
      </div>
    </>
  );
}
