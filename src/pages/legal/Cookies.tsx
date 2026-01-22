import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { PageHero } from "@/components/PageHero";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Cookies() {
  const [essentialCookies] = useState(true); // Always enabled
  const [analyticsCookies, setAnalyticsCookies] = useState(false);
  const [marketingCookies, setMarketingCookies] = useState(false);

  const handleSavePreferences = () => {
    // Save cookie preferences to localStorage
    localStorage.setItem(
      "cookieConsent",
      JSON.stringify({
        essential: true,
        analytics: analyticsCookies,
        marketing: marketingCookies,
        timestamp: new Date().toISOString(),
      }),
    );

    // Show success message or redirect
    alert("Cookie preferences saved successfully!");
  };

  return (
    <>
      <SEO
        title="Cookie Policy - G.R.A.T.I.S."
        description="G.R.A.T.I.S. Cookie Policy - Learn about the cookies we use, our compliance with ePrivacy Directive and GDPR, and how to manage your preferences."
      />

      <PageHero
        title="Cookie Policy"
        subtitle="G.R.A.T.I.S. (Giving Resources to Achieve Transformative and Impactful Change)"
        lastUpdated="January 14, 2026"
      />

      <div className="bg-background pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <Card className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                1. What Are Cookies?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small text files that are stored on your device when
                you visit a website. They help websites remember your
                preferences, improve your experience, and provide analytics
                about how the site is used.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                2. How We Use Cookies
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                GRATIS uses cookies to enhance your browsing experience,
                remember your preferences, and analyze website traffic. We use
                different types of cookies for different purposes, as detailed
                below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                3. Types of Cookies We Use
              </h2>

              <div className="space-y-6 mt-6">
                {/* Essential Cookies */}
                <div className="border rounded-lg p-6 bg-card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        Essential Cookies
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Required for the website to function. These cannot be
                        disabled.
                      </p>
                    </div>
                    <Switch
                      checked={essentialCookies}
                      disabled
                      className="ml-4"
                    />
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <strong>Purpose:</strong> Authentication, shopping cart,
                      security, session management
                    </p>
                    <p>
                      <strong>Examples:</strong>
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          auth_token
                        </code>{" "}
                        - User authentication
                      </li>
                      <li>
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          cart_id
                        </code>{" "}
                        - Shopping cart persistence
                      </li>
                      <li>
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          session_id
                        </code>{" "}
                        - Session management
                      </li>
                      <li>
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          csrf_token
                        </code>{" "}
                        - Security protection
                      </li>
                    </ul>
                    <p>
                      <strong>Duration:</strong> Session or up to 30 days
                    </p>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="border rounded-lg p-6 bg-card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        Analytics Cookies
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Help us understand how visitors interact with our
                        website.
                      </p>
                    </div>
                    <Switch
                      checked={analyticsCookies}
                      onCheckedChange={setAnalyticsCookies}
                      className="ml-4"
                    />
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <strong>Purpose:</strong> Website analytics, performance
                      monitoring, user behavior insights
                    </p>
                    <p>
                      <strong>Providers:</strong>
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>
                        <strong>Google Analytics</strong> - Traffic analysis and
                        user behavior
                      </li>
                      <li>
                        <strong>Firebase Analytics</strong> - App performance
                        and user engagement
                      </li>
                    </ul>
                    <p>
                      <strong>Data Collected:</strong> Pages visited, time
                      spent, device type, browser, location (country/city)
                    </p>
                    <p>
                      <strong>Duration:</strong> Up to 2 years
                    </p>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="border rounded-lg p-6 bg-card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        Marketing Cookies
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Used to deliver personalized content and track ad
                        performance.
                      </p>
                    </div>
                    <Switch
                      checked={marketingCookies}
                      onCheckedChange={setMarketingCookies}
                      className="ml-4"
                    />
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <strong>Purpose:</strong> Personalized advertising, social
                      media integration, retargeting
                    </p>
                    <p>
                      <strong>Providers:</strong>
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>
                        <strong>Facebook Pixel</strong> - Social media
                        advertising and analytics
                      </li>
                      <li>
                        <strong>Instagram</strong> - Social media integration
                      </li>
                      <li>
                        <strong>TikTok Pixel</strong> - TikTok advertising
                        tracking
                      </li>
                    </ul>
                    <p>
                      <strong>Duration:</strong> Up to 1 year
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <Button onClick={handleSavePreferences} size="lg">
                  Save Preferences
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setAnalyticsCookies(false);
                    setMarketingCookies(false);
                  }}
                >
                  Reject All (Except Essential)
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setAnalyticsCookies(true);
                    setMarketingCookies(true);
                  }}
                >
                  Accept All
                </Button>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                4. Third-Party Cookies
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Some cookies are set by third-party services that appear on our
                pages:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  <strong>Stripe:</strong> Payment processing (essential for
                  checkout)
                </li>
                <li>
                  <strong>Google Analytics:</strong> Website analytics and
                  performance monitoring
                </li>
                <li>
                  <strong>Firebase:</strong> Authentication and real-time
                  database services
                </li>
                <li>
                  <strong>Social Media Platforms:</strong> Facebook, Instagram,
                  TikTok (for social sharing and advertising)
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                These third parties have their own privacy policies and cookie
                policies, which we encourage you to review.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                5. How Long Do Cookies Last?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Cookies can be either session cookies or persistent cookies:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  <strong>Session Cookies:</strong> Temporary cookies that
                  expire when you close your browser
                </li>
                <li>
                  <strong>Persistent Cookies:</strong> Remain on your device
                  until they expire or you delete them. Duration varies from 24
                  hours to 2 years depending on the cookie type.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                6. Managing Your Cookie Preferences
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You have several options to manage cookies:
              </p>

              <div className="space-y-3 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    On This Website
                  </h3>
                  <p>
                    Use the cookie preference tool above to enable or disable
                    non-essential cookies. Your preferences will be saved for 12
                    months.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Browser Settings
                  </h3>
                  <p>
                    Most browsers allow you to control cookies through their
                    settings:
                  </p>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>
                      <strong>Chrome:</strong> Settings → Privacy and security →
                      Cookies and other site data
                    </li>
                    <li>
                      <strong>Firefox:</strong> Settings → Privacy & Security →
                      Cookies and Site Data
                    </li>
                    <li>
                      <strong>Safari:</strong> Preferences → Privacy → Cookies
                      and website data
                    </li>
                    <li>
                      <strong>Edge:</strong> Settings → Cookies and site
                      permissions
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Opt-Out Tools
                  </h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>
                      <a
                        href="https://tools.google.com/dlpage/gaoptout"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Google Analytics Opt-out Browser Add-on
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.youronlinechoices.eu/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Your Online Choices (EU)
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://optout.networkadvertising.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Network Advertising Initiative Opt-Out
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                7. Impact of Disabling Cookies
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Disabling cookies may affect your experience on our website:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Some features may not function properly</li>
                <li>You may need to log in more frequently</li>
                <li>Shopping cart functionality may be impaired</li>
                <li>
                  Personalized content and recommendations may not be available
                </li>
                <li>We won't be able to remember your preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                8. Do Not Track (DNT)
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Some browsers have a "Do Not Track" feature that signals to
                websites that you don't want your online activity tracked.
                Currently, there is no industry standard for responding to DNT
                signals, so we do not respond to DNT signals at this time.
                However, you can always manage your cookie preferences through
                the tools provided above.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                9. Updates to This Cookie Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Cookie Policy from time to time to reflect
                changes in our practices or for legal, operational, or
                regulatory reasons. The "Last Updated" date at the top indicates
                when this policy was last revised.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p>If you have questions about our use of cookies:</p>
                <ul className="list-none space-y-1 ml-4">
                  <li>
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:privacy@gratis.ngo"
                      className="text-primary hover:underline"
                    >
                      privacy@gratis.ngo
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
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                11. Related Policies
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                For more information about how we handle your data, please see:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>
                  <a
                    href="/legal/privacy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/legal/terms"
                    className="text-primary hover:underline"
                  >
                    Terms of Use
                  </a>
                </li>
              </ul>
            </section>
          </Card>
        </div>
      </div>
    </>
  );
}
