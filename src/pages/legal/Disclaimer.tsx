import { SEO } from "@/components/SEO";
import { PageHero } from "@/components/PageHero";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function Disclaimer() {
  return (
    <>
      <SEO
        title="Disclaimer"
        description="Legal disclaimer for GRATIS.NGO. Important information about website content, liability limitations, and user responsibilities."
        canonical="https://gratis.ngo/legal/disclaimer"
      />

      <div className="min-h-screen bg-background">
        <PageHero
          title="Disclaimer"
          subtitle="Important legal information about using our website and services"
        />

        <div className="container max-w-4xl py-16 px-4">
          {/* General Notice */}
          <div className="flex items-start gap-3 bg-[hsl(var(--brand-yellow))]/10 border border-[hsl(var(--brand-yellow))]/30 rounded-lg p-4 mb-8">
            <AlertTriangle className="w-5 h-5 text-[hsl(var(--brand-yellow))] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm mb-1">Important Notice</h3>
              <p className="text-sm text-muted-foreground">
                Please read this disclaimer carefully before using GRATIS.NGO.
                By accessing and using this website, you accept and agree to be
                bound by the terms and conditions set forth below.
              </p>
            </div>
          </div>

          {/* General Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>1. General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                The information provided on GRATIS.NGO is for general
                informational purposes only. All information on the site is
                provided in good faith; however, we make no representation or
                warranty of any kind, express or implied, regarding the
                accuracy, adequacy, validity, reliability, availability, or
                completeness of any information on the website.
              </p>
              <p>
                UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY
                LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF
                THE SITE OR RELIANCE ON ANY INFORMATION PROVIDED ON THE SITE.
                YOUR USE OF THE SITE AND YOUR RELIANCE ON ANY INFORMATION ON THE
                SITE IS SOLELY AT YOUR OWN RISK.
              </p>
            </CardContent>
          </Card>

          {/* External Links */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>2. External Links Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                GRATIS.NGO may contain links to external websites that are not
                provided or maintained by or in any way affiliated with us.
                Please note that we do not guarantee the accuracy, relevance,
                timeliness, or completeness of any information on these external
                websites.
              </p>
              <p>
                We have no control over the nature, content, and availability of
                those sites. The inclusion of any links does not necessarily
                imply a recommendation or endorse the views expressed within
                them.
              </p>
            </CardContent>
          </Card>

          {/* Professional Disclaimer */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>3. Professional Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                The site cannot and does not contain professional advice. The
                information is provided for general informational and
                educational purposes only and is not a substitute for
                professional advice.
              </p>
              <p>
                Accordingly, before taking any actions based upon such
                information, we encourage you to consult with the appropriate
                professionals. We do not provide any kind of professional
                advice. THE USE OR RELIANCE OF ANY INFORMATION CONTAINED ON THIS
                SITE IS SOLELY AT YOUR OWN RISK.
              </p>
            </CardContent>
          </Card>

          {/* Testimonials */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>4. Testimonials & Reviews Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                GRATIS.NGO may contain testimonials by users of our products
                and/or services. These testimonials reflect the real-life
                experiences and opinions of such users. However, the experiences
                are personal to those particular users, and may not necessarily
                be representative of all users of our products and/or services.
              </p>
              <p>
                We do not claim, and you should not assume, that all users will
                have the same experiences. YOUR INDIVIDUAL RESULTS MAY VARY.
              </p>
              <p>
                The testimonials on GRATIS.NGO are submitted in various forms
                such as text, audio and/or video, and are reviewed by us before
                being posted. They appear on GRATIS.NGO verbatim as given by the
                users, except for the correction of grammar or typing errors.
              </p>
            </CardContent>
          </Card>

          {/* Product Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>5. Product Information Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                We strive to provide accurate product descriptions, images, and
                pricing on our RIG Store. However, we do not warrant that
                product descriptions, images, pricing, or other content on
                GRATIS.NGO is accurate, complete, reliable, current, or
                error-free.
              </p>
              <p>
                In the event that a product is listed at an incorrect price or
                with incorrect information due to typographical error or error
                in pricing information received from our suppliers, we shall
                have the right to refuse or cancel any orders placed for
                products listed at the incorrect price.
              </p>
              <p>
                Product colors may appear differently on your screen due to
                monitor settings and lighting conditions.
              </p>
            </CardContent>
          </Card>

          {/* Donations & Impact */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>6. Donations & Impact Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                GRATIS operates as a social enterprise NGO. While we strive to
                maximize the impact of every donation and purchase, we cannot
                guarantee specific outcomes or results from your contributions.
              </p>
              <p>
                Impact statistics, beneficiary numbers, and geographic reach
                presented on our website represent our best estimates based on
                available data. Actual impact may vary due to factors beyond our
                control.
              </p>
              <p>
                We provide impact reports and updates to the best of our
                ability, but delays may occur in data collection and
                verification from partner organizations and field locations.
              </p>
              <p>
                All donations are final and non-refundable unless required by
                law. For refund policies on merchandise purchases, please refer
                to our Terms of Use.
              </p>
            </CardContent>
          </Card>

          {/* Volunteer & Employment */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>7. Volunteer & Employment Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Information about volunteer opportunities and employment
                positions on GRATIS.NGO is subject to change without notice.
                Positions may be filled or cancelled at any time.
              </p>
              <p>
                Applying for a volunteer position or job through our website
                does not guarantee acceptance or employment. All applications
                are subject to review, and decisions are made at our sole
                discretion.
              </p>
              <p>
                Volunteer and employment terms, including compensation,
                benefits, and responsibilities, are subject to negotiation and
                formal agreement beyond the information provided on this
                website.
              </p>
            </CardContent>
          </Card>

          {/* Technical Disclaimer */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>8. Technical & Availability Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                We make no guarantees regarding the availability, functionality,
                or uninterrupted access to GRATIS.NGO. The website may be
                unavailable from time to time due to maintenance, updates, or
                technical issues.
              </p>
              <p>
                We are not responsible for any damages or losses resulting from
                the use or inability to use our website, including but not
                limited to loss of data, interruption of service, or technical
                errors.
              </p>
              <p>
                While we implement security measures to protect your data, we
                cannot guarantee absolute security of information transmitted
                through our website. Use of our website is at your own risk.
              </p>
            </CardContent>
          </Card>

          {/* User Content */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>9. User-Generated Content Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                GRATIS.NGO may contain user-generated content, including
                reviews, comments, testimonials, and forum posts. Views
                expressed by users are their own and do not necessarily reflect
                the views or opinions of GRATIS.
              </p>
              <p>
                We do not endorse, support, represent, or guarantee the
                completeness, truthfulness, accuracy, or reliability of any
                user-generated content. You acknowledge that by using our
                website, you may be exposed to content that is offensive,
                harmful, inaccurate, or otherwise inappropriate.
              </p>
              <p>
                We reserve the right, but not the obligation, to monitor,
                review, edit, or remove user-generated content at our sole
                discretion.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Disclaimer */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>10. Changes to This Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                We may update our disclaimer from time to time. We will notify
                you of any changes by posting the new disclaimer on this page
                and updating the "Last Updated" date.
              </p>
              <p>
                You are advised to review this disclaimer periodically for any
                changes. Changes to this disclaimer are effective when they are
                posted on this page.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>11. Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                This disclaimer shall be governed by and construed in accordance
                with the laws of the Netherlands, without regard to its conflict
                of law provisions.
              </p>
              <p>
                Any disputes arising from or relating to this disclaimer shall
                be subject to the exclusive jurisdiction of the courts of
                Amsterdam, Netherlands.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>12. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                If you have any questions about this disclaimer, please contact
                us:
              </p>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div>
                  <span className="font-semibold">Email:</span>{" "}
                  <a
                    href="mailto:legal@gratis.ngo"
                    className="text-[hsl(var(--brand-yellow))] hover:underline"
                  >
                    legal@gratis.ngo
                  </a>
                </div>
                <div>
                  <span className="font-semibold">Address:</span>{" "}
                  <span>
                    GRATIS.NGO, Herengracht 123, 1015 BH Amsterdam, Netherlands
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Last Updated: <strong>January 15, 2026</strong>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
