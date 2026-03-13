import SEO from '@/components/SEO';
import { Card } from '@/components/ui/card';
import { PageHero } from '@/components/PageHero';
import { Link } from 'react-router-dom';

export default function Accessibility() {
  return (
    <>
      <SEO
        title="Accessibility Policy — GRATIS"
        description="GRATIS is committed to ensuring digital accessibility for people with disabilities. Learn about our WCAG compliance and accessibility standards."
      />

      <PageHero title="Accessibility Policy" lastUpdated="March 2026" />

      <div className="bg-background pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <Card className="p-8 space-y-10">

            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Our Commitment</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Stichting G.R.A.T.I.S. ("GRATIS") is committed to ensuring that our website, applications, and digital services are accessible to everyone, including people with disabilities. We believe that access to clean water and social impact should be universal — and so should access to the platforms that enable it.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We strive to conform to the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong>, as published by the World Wide Web Consortium (W3C), and to comply with applicable accessibility laws including the European Accessibility Act (Directive (EU) 2019/882), the Americans with Disabilities Act (ADA), and Section 508 of the Rehabilitation Act.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Accessibility Standards</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our Platform is designed and developed with the following WCAG 2.1 principles in mind:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/20 rounded-lg p-5 space-y-2">
                  <h3 className="font-semibold text-foreground">Perceivable</h3>
                  <p className="text-sm text-muted-foreground">Content is presented in ways that users can perceive, regardless of sensory abilities. We provide text alternatives for non-text content, captions for multimedia, and adaptable layouts.</p>
                </div>
                <div className="bg-muted/20 rounded-lg p-5 space-y-2">
                  <h3 className="font-semibold text-foreground">Operable</h3>
                  <p className="text-sm text-muted-foreground">All functionality is available via keyboard navigation. We provide sufficient time for interactions, avoid content that causes seizures, and offer clear navigation mechanisms.</p>
                </div>
                <div className="bg-muted/20 rounded-lg p-5 space-y-2">
                  <h3 className="font-semibold text-foreground">Understandable</h3>
                  <p className="text-sm text-muted-foreground">Content is readable and predictable. We use clear language, consistent navigation, and provide input assistance for forms and interactive elements.</p>
                </div>
                <div className="bg-muted/20 rounded-lg p-5 space-y-2">
                  <h3 className="font-semibold text-foreground">Robust</h3>
                  <p className="text-sm text-muted-foreground">Content is compatible with current and future assistive technologies. We use semantic HTML, ARIA landmarks, and follow progressive enhancement principles.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Specific Measures</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                GRATIS takes the following measures to ensure accessibility:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Semantic HTML:</strong> We use proper heading hierarchy, landmark regions, and meaningful link text throughout the Platform</li>
                <li><strong>Alternative Text:</strong> All informative images include descriptive alt text. Decorative images are marked appropriately</li>
                <li><strong>Color Contrast:</strong> We maintain a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text, consistent with WCAG AA requirements</li>
                <li><strong>Keyboard Navigation:</strong> All interactive elements (buttons, links, forms, menus) are fully accessible via keyboard with visible focus indicators</li>
                <li><strong>Screen Reader Support:</strong> We use ARIA labels, roles, and properties to enhance compatibility with screen readers (JAWS, NVDA, VoiceOver, TalkBack)</li>
                <li><strong>Responsive Design:</strong> The Platform adapts to different screen sizes, zoom levels (up to 200%), and viewport orientations</li>
                <li><strong>Form Accessibility:</strong> All form fields have associated labels, error messages are programmatically associated, and validation feedback is announced to assistive technologies</li>
                <li><strong>Motion Sensitivity:</strong> Users can reduce animations using the <code className="text-xs bg-muted px-1.5 py-0.5 rounded">prefers-reduced-motion</code> OS setting. Critical information is never conveyed through motion alone</li>
                <li><strong>Skip Navigation:</strong> Skip-to-content links are available to bypass repetitive navigation</li>
                <li><strong>Dark Mode:</strong> A high-contrast dark mode is available as the default theme, with a toggle for light mode</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Assistive Technology Compatibility</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                The Platform is designed to be compatible with the following assistive technologies:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-muted-foreground border border-border rounded-lg">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Technology</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Platform</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4">VoiceOver</td>
                      <td className="py-3 px-4">macOS / iOS</td>
                      <td className="py-3 px-4">Supported</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4">NVDA</td>
                      <td className="py-3 px-4">Windows</td>
                      <td className="py-3 px-4">Supported</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4">JAWS</td>
                      <td className="py-3 px-4">Windows</td>
                      <td className="py-3 px-4">Supported</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4">TalkBack</td>
                      <td className="py-3 px-4">Android</td>
                      <td className="py-3 px-4">Supported</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Dragon NaturallySpeaking</td>
                      <td className="py-3 px-4">Windows</td>
                      <td className="py-3 px-4">Partially supported</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Known Limitations</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Despite our best efforts, some areas of the Platform may have accessibility limitations:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Interactive Maps:</strong> The Mapbox-powered distribution location map may have limited screen reader support. A text-based alternative list of locations is planned</li>
                <li><strong>Third-Party Content:</strong> Embedded YouTube videos and third-party payment forms (Stripe) are governed by their respective accessibility standards</li>
                <li><strong>PDF Documents:</strong> Some downloadable reports may not yet be fully tagged for screen reader accessibility. We are working to remediate existing documents</li>
                <li><strong>User-Generated Content:</strong> Reviews and comments submitted by users may not include alt text for uploaded images</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                We actively work to identify and resolve accessibility barriers. Please report any issues you encounter.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Legal Compliance</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Our accessibility efforts are guided by the following regulations:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>European Accessibility Act (EAA):</strong> Directive (EU) 2019/882, requiring accessible products and services by June 28, 2025</li>
                <li><strong>Web Accessibility Directive:</strong> Directive (EU) 2016/2102, applicable to public sector websites and extending best practices to the private sector</li>
                <li><strong>Dutch Equal Treatment Act:</strong> Algemene wet gelijke behandeling (Awgb), prohibiting discrimination on the basis of disability</li>
                <li><strong>Americans with Disabilities Act (ADA):</strong> Title III, applying to places of public accommodation including websites</li>
                <li><strong>Section 508:</strong> Of the Rehabilitation Act, establishing accessibility standards for federal and federally funded entities</li>
                <li><strong>EN 301 549:</strong> European standard for accessibility requirements in ICT products and services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Testing & Evaluation</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We evaluate the accessibility of the Platform through:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Automated accessibility scanning using axe-core and Lighthouse</li>
                <li>Manual testing with screen readers and keyboard-only navigation</li>
                <li>Periodic third-party accessibility audits</li>
                <li>Ongoing user feedback from people with disabilities</li>
                <li>Accessibility reviews during the development and QA process for new features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Feedback & Contact</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We welcome your feedback on the accessibility of the GRATIS Platform. If you experience any accessibility barriers, need content in an alternative format, or have suggestions for improvement, please contact us via:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>
                  Our{' '}
                  <Link to="/contact" className="text-primary hover:underline">GRATIS Connect portal</Link>
                  {' '}(select "Accessibility" as the inquiry type)
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                We aim to respond to accessibility feedback within <strong>5 business days</strong> and to resolve reported barriers within <strong>30 days</strong> where technically feasible.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Continuous Improvement</h2>
              <p className="text-muted-foreground leading-relaxed">
                Accessibility is an ongoing process. We are committed to continuous improvement and regularly review our Platform to identify and address new barriers. This policy is reviewed and updated at least annually, or more frequently as standards and regulations evolve.
              </p>
            </section>

          </Card>
        </div>
      </div>
    </>
  );
}
