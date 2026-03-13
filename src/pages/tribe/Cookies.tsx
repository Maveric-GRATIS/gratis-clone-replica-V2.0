import { SEO } from '@/components/SEO';
import { Card } from '@/components/ui/card';
import { PageHero } from '@/components/PageHero';
import { Link } from 'react-router-dom';

export default function Cookies() {
  return (
    <>
      <SEO
        title="Cookie Policy"
        description="Cookie Policy for GRATIS — How we use cookies and similar technologies, compliant with EU ePrivacy Directive, GDPR, and U.S. state laws."
      />
      
      <PageHero 
        title="Cookie Policy" 
        lastUpdated="March 2026"
      />
      
      <div className="bg-background pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <Card className="p-8 space-y-10">

            {/* 1 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                This Cookie Policy explains how Stichting G.R.A.T.I.S. ("GRATIS," "we," "us," or "our") uses cookies and similar tracking technologies on our website (gratis.com) and associated services. This policy should be read together with our{' '}
                <Link to="/tribe/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This policy complies with:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                <li>EU ePrivacy Directive 2002/58/EC (as amended by 2009/136/EC), Article 5(3)</li>
                <li>Dutch Telecommunications Act (Telecommunicatiewet), Article 11.7a</li>
                <li>General Data Protection Regulation (GDPR), Articles 6 and 7</li>
                <li>California Consumer Privacy Act / California Privacy Rights Act (CCPA/CPRA)</li>
                <li>Colorado Privacy Act, Connecticut Data Privacy Act, and other applicable U.S. state laws</li>
              </ul>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">2. What Are Cookies & Similar Technologies?</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                <strong>Cookies</strong> are small text files stored on your device when you visit a website. They enable the website to remember your actions and preferences over time.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We also use similar technologies including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Local Storage / Session Storage:</strong> Browser storage mechanisms that persist data locally (e.g., shopping cart contents, theme preferences)</li>
                <li><strong>Pixels / Web Beacons:</strong> Tiny transparent images used to track whether content has been viewed or an email has been opened</li>
                <li><strong>Fingerprinting:</strong> We do <strong>not</strong> use browser fingerprinting techniques</li>
              </ul>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Cookie Categories & Consent</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Under Article 11.7a of the Dutch Telecommunications Act and the ePrivacy Directive, we are required to obtain your informed consent before placing non-essential cookies. Under the GDPR, consent must be freely given, specific, informed, and unambiguous (Article 4(11)).
              </p>

              <h3 className="text-xl font-medium mb-3 mt-6">3.1 Strictly Necessary Cookies (No Consent Required)</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                These cookies are essential for the website to function and cannot be switched off. They are exempt from consent requirements under Article 5(3) of the ePrivacy Directive.
              </p>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm text-muted-foreground border border-border rounded-lg">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-2 px-3 font-semibold text-foreground">Cookie/Storage</th>
                      <th className="text-left py-2 px-3 font-semibold text-foreground">Purpose</th>
                      <th className="text-left py-2 px-3 font-semibold text-foreground">Duration</th>
                      <th className="text-left py-2 px-3 font-semibold text-foreground">Provider</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-2 px-3">sb-*-auth-token</td>
                      <td className="py-2 px-3">Authentication session management</td>
                      <td className="py-2 px-3">Session / 1 hour</td>
                      <td className="py-2 px-3">First-party (via Supabase)</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-2 px-3">gratis-cart (localStorage)</td>
                      <td className="py-2 px-3">Shopping cart persistence</td>
                      <td className="py-2 px-3">Persistent (until cleared)</td>
                      <td className="py-2 px-3">First-party</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">cookie-consent</td>
                      <td className="py-2 px-3">Records your cookie consent choices</td>
                      <td className="py-2 px-3">1 year</td>
                      <td className="py-2 px-3">First-party</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-medium mb-3">3.2 Functional Cookies (Consent Required)</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                These cookies enhance your experience by remembering preferences. They are non-essential and require your consent.
              </p>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm text-muted-foreground border border-border rounded-lg">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-2 px-3 font-semibold text-foreground">Cookie/Storage</th>
                      <th className="text-left py-2 px-3 font-semibold text-foreground">Purpose</th>
                      <th className="text-left py-2 px-3 font-semibold text-foreground">Duration</th>
                      <th className="text-left py-2 px-3 font-semibold text-foreground">Provider</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-2 px-3">gratis-theme (localStorage)</td>
                      <td className="py-2 px-3">Light/dark mode preference</td>
                      <td className="py-2 px-3">Persistent</td>
                      <td className="py-2 px-3">First-party</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">recently-viewed (localStorage)</td>
                      <td className="py-2 px-3">Recently viewed products</td>
                      <td className="py-2 px-3">Persistent</td>
                      <td className="py-2 px-3">First-party</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-medium mb-3">3.3 Analytics Cookies (Consent Required)</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                These cookies help us understand how visitors interact with our website by collecting anonymized and aggregated data.
              </p>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm text-muted-foreground border border-border rounded-lg">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-2 px-3 font-semibold text-foreground">Cookie</th>
                      <th className="text-left py-2 px-3 font-semibold text-foreground">Purpose</th>
                      <th className="text-left py-2 px-3 font-semibold text-foreground">Duration</th>
                      <th className="text-left py-2 px-3 font-semibold text-foreground">Provider</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 px-3">Web Vitals (in-memory)</td>
                      <td className="py-2 px-3">Core Web Vitals performance metrics</td>
                      <td className="py-2 px-3">Session only</td>
                      <td className="py-2 px-3">First-party</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-medium mb-3">3.4 Marketing Cookies (Consent Required)</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Marketing cookies track visitors across websites to display relevant advertisements. We only place these cookies with your explicit, prior consent. Currently, GRATIS does not use third-party advertising cookies. If this changes, this policy will be updated and consent re-obtained.
              </p>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Third-Party Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Some third-party services integrated into our Platform may set their own cookies:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-muted-foreground border border-border rounded-lg">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-2 px-3 font-semibold text-foreground">Service</th>
                      <th className="text-left py-2 px-3 font-semibold text-foreground">Purpose</th>
                      <th className="text-left py-2 px-3 font-semibold text-foreground">Privacy Policy</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-2 px-3">Stripe</td>
                      <td className="py-2 px-3">Payment processing, fraud detection (PCI-DSS compliant)</td>
                      <td className="py-2 px-3"><a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">stripe.com/privacy</a></td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">Mapbox</td>
                      <td className="py-2 px-3">Interactive distribution location maps</td>
                      <td className="py-2 px-3"><a href="https://www.mapbox.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com/legal/privacy</a></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Stripe cookies are classified as strictly necessary for payment processing and fraud prevention under Article 5(3) of the ePrivacy Directive. Mapbox cookies are loaded only when you visit pages containing maps.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">5. How to Manage Cookies</h2>

              <h3 className="text-xl font-medium mb-2 mt-4">5.1 Cookie Consent Banner</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When you first visit our website, a cookie consent banner allows you to accept or reject non-essential cookies by category. You can change your preferences at any time by clicking the cookie settings link in the footer. Under Dutch law and the GDPR, we treat silence or pre-ticked boxes as non-consent (Planet49 ruling, CJEU C-673/17).
              </p>

              <h3 className="text-xl font-medium mb-2">5.2 Browser Settings</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You can also manage cookies through your browser settings:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Apple Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Microsoft Edge</a></li>
              </ul>

              <h3 className="text-xl font-medium mb-2">5.3 Global Privacy Control (GPC)</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We honor the <a href="https://globalprivacycontrol.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Global Privacy Control (GPC)</a> signal. If your browser sends a GPC signal, we treat it as a valid opt-out of non-essential cookies and, for California residents, as a valid opt-out of sale/sharing under CCPA/CPRA.
              </p>

              <h3 className="text-xl font-medium mb-2">5.4 Opt-Out for U.S. Users</h3>
              <p className="text-muted-foreground leading-relaxed">
                Under the CCPA/CPRA and other U.S. state privacy laws, you have the right to opt out of the use of cookies and similar technologies for purposes of targeted advertising or profiling. GRATIS does not currently use cookies for targeted advertising. Should this change, we will provide a clear opt-out mechanism. You may also visit{' '}
                <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">DAA Opt-Out</a>
                {' '}or{' '}
                <a href="https://optout.networkadvertising.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">NAI Opt-Out</a>
                {' '}for industry-wide opt-out options.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Consent Records</h2>
              <p className="text-muted-foreground leading-relaxed">
                In accordance with GDPR Article 7(1) accountability requirements, we maintain records of cookie consent including the date, time, consent choices, and the version of this policy presented. These records are retained for the duration of your consent plus 3 years to demonstrate compliance in case of a supervisory authority inquiry.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Impact of Disabling Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                Disabling strictly necessary cookies may prevent core functionality (e.g., authentication, shopping cart). Disabling functional cookies means preferences like theme settings will not persist. Disabling analytics cookies will not affect your browsing experience but limits our ability to improve the Platform based on usage data.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Updates to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Cookie Policy from time to time. Material changes (e.g., adding new cookie categories or third-party services) will be communicated via an updated consent banner. The "last updated" date at the top indicates the latest revision. Where changes require renewed consent under the ePrivacy Directive or GDPR, we will re-prompt you.
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about our use of cookies or to exercise your rights, please use our{' '}
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
