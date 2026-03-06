import { SEO } from "@/components/SEO";
import { PageHero } from "@/components/PageHero";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  HandshakeIcon,
  Leaf,
  Scale,
} from "lucide-react";

export default function PartnerCodeOfConduct() {
  return (
    <>
      <SEO
        title="Partner Code of Conduct — G.R.A.T.I.S."
        description="The G.R.A.T.I.S. Partner Code of Conduct outlines the standards, values, and obligations for all organisations partnering with GRATIS."
        canonical="https://gratis.ngo/legal/partner-code-of-conduct"
      />

      <div className="min-h-screen bg-background">
        <PageHero
          title="Partner Code of Conduct"
          subtitle="The standards and values every GRATIS partner commits to"
        />

        <div className="container max-w-4xl py-16 px-4 space-y-6">
          {/* Intro notice */}
          <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-lg p-4">
            <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm mb-1">
                Version 2.1 — Effective 1 January 2025
              </h3>
              <p className="text-sm text-muted-foreground">
                By ticking "I agree to the Partner Code of Conduct" during the
                partner application, your organisation accepts all provisions in
                this document in full. Non-compliance may result in suspension
                or termination of the partnership.
              </p>
            </div>
          </div>

          {/* 1. Mission Alignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                1. Mission Alignment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Partners commit to the core mission of GRATIS: making
                sustainable products accessible to everyone, regardless of
                financial situation.
              </p>
              <p>
                Partner activities must not harm the reputation or the public
                trust that GRATIS has built. Partners respect the diversity and
                inclusivity GRATIS advocates.
              </p>
            </CardContent>
          </Card>

          {/* 2. Integrity & Transparency */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                2. Integrity &amp; Transparency
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Partners communicate honestly and transparently about their
                products, services, and organisation at all times.
              </p>
              <p>
                Financial arrangements and collaboration agreements must be
                fully documented and honoured. Partners disclose any conflicts
                of interest to the GRATIS partnerships team without delay.
              </p>
              <p>
                All information provided during the application process must be
                complete and truthful. Submitting false information is grounds
                for immediate termination.
              </p>
            </CardContent>
          </Card>

          {/* 3. Data Protection & Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary" />
                3. Data Protection &amp; Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Partners comply with the GDPR (General Data Protection
                Regulation) and all applicable privacy legislation.
              </p>
              <p>
                User data obtained via GRATIS platforms may only be used for the
                agreed purposes. Partners must not sell, rent, or transfer
                GRATIS user data to third parties.
              </p>
              <p>
                Data breaches must be reported to GRATIS and the relevant
                authorities within 72 hours of discovery.
              </p>
            </CardContent>
          </Card>

          {/* 4. Sustainability & Impact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-primary" />
                4. Sustainability &amp; Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Partners actively work to reduce their ecological footprint.
                Products and services offered through GRATIS must meet minimum
                sustainability standards.
              </p>
              <p>
                Partners report annually on their sustainability efforts and
                progress. Misleading "greenwashing" claims are strictly
                prohibited.
              </p>
            </CardContent>
          </Card>

          {/* 5. Professional Conduct */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HandshakeIcon className="w-5 h-5 text-primary" />
                5. Professional Conduct
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Partners treat all GRATIS employees, users, and other partners
                with respect. Discrimination on any grounds — including race,
                gender, religion, nationality, or sexual orientation — is not
                tolerated.
              </p>
              <p>
                Harassment, bullying, or aggressive behaviour leads to immediate
                termination of the partnership without notice.
              </p>
            </CardContent>
          </Card>

          {/* 6. Prohibited Activities */}
          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-destructive" />
                6. Prohibited Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground list-none">
                {[
                  "Using the GRATIS name, logo, or brand without prior written consent.",
                  "Setting up competing platforms using insights or contacts obtained through GRATIS.",
                  "Misleading marketing or false claims about the partner relationship with GRATIS.",
                  "Activities that violate Dutch or European law and regulations.",
                  "Involvement in corruption, money laundering, or other illegal financial activities.",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 bg-destructive/5 border border-destructive/10 rounded p-2"
                  >
                    <span className="text-destructive mt-0.5 flex-shrink-0">
                      ✗
                    </span>
                    <span className="text-destructive/90">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* 7. Enforcement & Sanctions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                7. Enforcement &amp; Sanctions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Violations of this code of conduct may result in an official
                warning, temporary suspension, or permanent termination of the
                partnership.
              </p>
              <p>
                GRATIS reserves the right to terminate the partnership
                immediately and without prior notice in the event of a serious
                violation. Partners may submit a formal objection within 30 days
                of a sanction. Disputes are preferably resolved through
                mediation before legal steps are taken.
              </p>
            </CardContent>
          </Card>

          {/* 8. Amendments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                8. Amendments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                GRATIS reserves the right to amend this code of conduct with 30
                days' notice. Partners are notified by email of material
                changes. Continued participation after notification constitutes
                acceptance of the updated code. The most current version is
                always available on this page.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <div className="rounded-xl border border-border bg-muted/20 p-6 space-y-2">
            <h3 className="font-semibold text-sm">
              Questions about this Code of Conduct?
            </h3>
            <p className="text-sm text-muted-foreground">
              Contact our partnerships team at{" "}
              <a
                href="mailto:partnerships@gratis.ngo"
                className="text-primary hover:underline"
              >
                partnerships@gratis.ngo
              </a>
              .
            </p>
            <p className="text-xs text-muted-foreground pt-1">
              Last updated: 1 March 2026
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
