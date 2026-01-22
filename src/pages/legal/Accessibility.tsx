import { SEO } from "@/components/SEO";
import { PageHero } from "@/components/PageHero";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Mail } from "lucide-react";

export default function Accessibility() {
  return (
    <>
      <SEO
        title="Accessibility Statement"
        description="GRATIS is committed to ensuring digital accessibility for people with disabilities. Learn about our accessibility standards and ongoing improvements."
        canonical="https://gratis.ngo/legal/accessibility"
      />

      <div className="min-h-screen bg-background">
        <PageHero
          title="Accessibility Statement"
          subtitle="Our commitment to digital accessibility for everyone"
        />

        <div className="container max-w-4xl py-16 px-4">
          {/* Commitment */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle>Our Commitment</CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-[hsl(var(--brand-yellow))]/20"
                >
                  WCAG 2.1 Level AA
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                GRATIS.NGO is committed to ensuring digital accessibility for
                people with disabilities. We are continually improving the user
                experience for everyone and applying the relevant accessibility
                standards to ensure we provide equal access to all users.
              </p>
              <p className="text-muted-foreground">
                This website strives to conform to the Web Content Accessibility
                Guidelines (WCAG) 2.1 Level AA standards. These guidelines
                explain how to make web content more accessible for people with
                disabilities and improve the user experience for all visitors.
              </p>
            </CardContent>
          </Card>

          {/* Measures */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Accessibility Measures</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                GRATIS.NGO takes the following measures to ensure accessibility:
              </p>
              <div className="space-y-3">
                {[
                  "Include accessibility as part of our mission statement",
                  "Integrate accessibility into our procurement practices",
                  "Appoint an accessibility coordinator and team",
                  "Provide continual accessibility training for our staff",
                  "Assign clear accessibility targets and responsibilities",
                  "Employ formal accessibility quality assurance methods",
                  "Use accessibility testing tools and manual reviews",
                  "Work with disabled users during development and testing",
                ].map((measure, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[hsl(var(--brand-yellow))] flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{measure}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Accessibility Features</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Our website includes the following accessibility features:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">
                    Navigation & Structure
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Semantic HTML markup</li>
                    <li>• Logical heading hierarchy</li>
                    <li>• Skip to main content link</li>
                    <li>• Keyboard navigation support</li>
                    <li>• Focus indicators</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Visual Design</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• High contrast color schemes</li>
                    <li>• Resizable text (up to 200%)</li>
                    <li>• Alternative text for images</li>
                    <li>• Clear typography</li>
                    <li>• Dark/Light mode toggle</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">
                    Interactive Elements
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• ARIA labels and roles</li>
                    <li>• Form error identification</li>
                    <li>• Clear button states</li>
                    <li>• Accessible modals & dialogs</li>
                    <li>• Screen reader compatibility</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Media & Content</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Video captions (when available)</li>
                    <li>• Audio descriptions</li>
                    <li>• Transcripts for audio content</li>
                    <li>• Descriptive link text</li>
                    <li>• Simple, clear language</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Accessibility of GRATIS.NGO relies on the following
                technologies:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• HTML5 for semantic structure</li>
                <li>• WAI-ARIA for enhanced accessibility</li>
                <li>• CSS for visual presentation</li>
                <li>• JavaScript for interactive functionality</li>
                <li>• React for component-based architecture</li>
              </ul>
              <p className="text-muted-foreground mt-4 text-sm">
                These technologies are relied upon for conformance with the
                accessibility standards used.
              </p>
            </CardContent>
          </Card>

          {/* Compatible Browsers */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                Compatible Browsers & Assistive Technologies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                GRATIS.NGO is designed to be compatible with the following
                assistive technologies:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Screen Readers</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• JAWS (Windows)</li>
                    <li>• NVDA (Windows)</li>
                    <li>• VoiceOver (macOS, iOS)</li>
                    <li>• TalkBack (Android)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Browsers</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Chrome (latest)</li>
                    <li>• Firefox (latest)</li>
                    <li>• Safari (latest)</li>
                    <li>• Edge (latest)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Limitations */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Known Limitations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Despite our best efforts, some limitations may exist:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  • <strong>Third-party content:</strong> Some embedded content
                  from external providers may not be fully accessible. We work
                  with vendors to address these issues.
                </li>
                <li>
                  • <strong>Legacy content:</strong> Older content uploaded
                  before our current accessibility standards may not fully
                  conform. We are systematically updating this content.
                </li>
                <li>
                  • <strong>User-generated content:</strong> Content uploaded by
                  users may not meet accessibility standards. We provide
                  guidelines and tools to help users create accessible content.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Feedback */}
          <Card className="mb-8 border-[hsl(var(--brand-yellow))]/30">
            <CardHeader>
              <CardTitle>Feedback & Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We welcome your feedback on the accessibility of GRATIS.NGO.
                Please let us know if you encounter accessibility barriers:
              </p>

              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold min-w-[80px]">Email:</span>
                    <a
                      href="mailto:accessibility@gratis.ngo"
                      className="text-[hsl(var(--brand-yellow))] hover:underline"
                    >
                      accessibility@gratis.ngo
                    </a>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold min-w-[80px]">Phone:</span>
                    <span className="text-muted-foreground">
                      +31 (0)20 123 4567
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold min-w-[80px]">Address:</span>
                    <span className="text-muted-foreground">
                      GRATIS.NGO Accessibility Team
                      <br />
                      Herengracht 123
                      <br />
                      1015 BH Amsterdam
                      <br />
                      Netherlands
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                We aim to respond to accessibility feedback within{" "}
                <strong>5 business days</strong> and propose a solution within{" "}
                <strong>10 business days</strong>.
              </p>

              <Button asChild>
                <a href="mailto:accessibility@gratis.ngo">
                  <Mail className="w-4 h-4 mr-2" />
                  Report Accessibility Issue
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Formal Complaints */}
          <Card>
            <CardHeader>
              <CardTitle>Formal Complaints Procedure</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you are not satisfied with our response to your accessibility
                concern, you may escalate the matter through our formal
                complaints procedure:
              </p>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>
                  Contact our Accessibility Coordinator at the email address
                  above
                </li>
                <li>If unresolved, escalate to our Director of Operations</li>
                <li>
                  As a last resort, contact the Dutch Digital Government Agency
                  (DigiCommissaris)
                </li>
              </ol>
              <p className="text-sm text-muted-foreground mt-4">
                We are also subject to oversight by the Dutch accessibility
                monitoring body for compliance with EU Web Accessibility
                Directive 2016/2102.
              </p>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              This accessibility statement was last reviewed and updated on{" "}
              <strong>January 15, 2026</strong>.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              We review and update this statement regularly to reflect ongoing
              accessibility improvements.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
