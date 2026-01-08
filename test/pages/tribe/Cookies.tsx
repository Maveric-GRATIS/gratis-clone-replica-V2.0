import { SEO } from '@/components/SEO';
import { Card } from '@/components/ui/card';
import { PageHero } from '@/components/PageHero';

export default function Cookies() {
  return (
    <>
      <SEO
        title="Cookie Policy"
        description="Cookie Policy for GRATIS - Learn how we use cookies and similar technologies on our website."
      />
      
      <PageHero 
        title="Cookie Policy" 
        lastUpdated="January 2026"
      />
      
      <div className="bg-background pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <Card className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies?</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small text files placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, analyzing how you use our site, and enabling certain features.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Types of Cookies We Use</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-2">Essential Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    These cookies are necessary for the website to function properly. They enable core functionality like user authentication, shopping cart, and checkout. You cannot opt out of these cookies.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">Functional Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    These cookies remember your preferences and choices, such as language settings and theme preferences (light/dark mode), to provide a more personalized experience.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">Analytics Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We use analytics cookies to understand how visitors interact with our website. This helps us improve our services and user experience. These cookies collect anonymized data.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">Marketing Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Marketing cookies are used to track visitors across websites to display relevant advertisements. We only use these cookies with your explicit consent.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Cookies We Use</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-muted-foreground">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-semibold text-foreground">Cookie Name</th>
                      <th className="text-left py-2 font-semibold text-foreground">Purpose</th>
                      <th className="text-left py-2 font-semibold text-foreground">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">gratis-theme</td>
                      <td className="py-2">Stores your theme preference (light/dark)</td>
                      <td className="py-2">1 year</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">sb-*</td>
                      <td className="py-2">Authentication session (Supabase)</td>
                      <td className="py-2">Session</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">gratis-cart</td>
                      <td className="py-2">Stores shopping cart items</td>
                      <td className="py-2">30 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Third-Party Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Some cookies are placed by third-party services that appear on our pages:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Stripe:</strong> Payment processing and fraud prevention</li>
                <li><strong>Mapbox:</strong> Interactive maps on our distribution locations page</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Managing Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You can control and manage cookies in several ways:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Browser Settings:</strong> Most browsers allow you to refuse or delete cookies through settings</li>
                <li><strong>Our Cookie Banner:</strong> When you first visit our site, you can choose which non-essential cookies to accept</li>
                <li><strong>Opt-Out Links:</strong> Many third-party services provide opt-out mechanisms</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Note: Disabling certain cookies may affect the functionality of our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Browser-Specific Instructions</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Microsoft Edge</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Updates to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about our use of cookies, please contact us at{' '}
                <a href="mailto:privacy@gratis.com" className="text-primary hover:underline">
                  privacy@gratis.com
                </a>
              </p>
            </section>
          </Card>
        </div>
      </div>
    </>
  );
}
