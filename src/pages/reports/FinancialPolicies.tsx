import { PageHero } from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, FileText, Scale, Lock, Landmark } from "lucide-react";

export default function FinancialPolicies() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHero 
        title="Financial Policies & Governance" 
        subtitle="Comprehensive financial controls ensuring compliance with USA 501(c)(3), EU Directives, and Dutch ANBI requirements."
        lastUpdated="March 2024"
      />

      <div className="container max-w-4xl mx-auto space-y-12">
        <section className="space-y-6 text-foreground/80 leading-relaxed">
          <p className="text-lg">
            G.R.A.T.I.S. operates under strict financial governance to maintain transparency, accountability, and legal compliance across our primary operational jurisdictions. These policies are designed to exceed the requirements set forth by the United States Internal Revenue Service (IRS) for 501(c)(3) organizations, the European Union's financial transparency directives, and the Dutch Tax and Customs Administration (Belastingdienst) for Public Benefit Organizations (ANBI).
          </p>

          <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <Shield className="w-8 h-8 text-[hsl(var(--brand-pink))]" />
                <h2 className="text-2xl font-bold text-foreground">1. Internal Controls & Oversight</h2>
              </div>
              <p>
                Our internal controls framework is designed to prevent fraud, protect assets, and ensure accurate financial reporting in accordance with US GAAP, IFRS, and Dutch GAAP.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Segregation of Duties:</strong> Financial transactions require dual authorization. No single individual can initiate, approve, and record a transaction.</li>
                <li><strong>Authorization Thresholds:</strong> Expenditures exceeding €5,000 / $5,500 require approval from the Executive Director. Expenditures over €25,000 / $27,500 require Board approval.</li>
                <li><strong>Regular Reconciliation:</strong> Bank accounts and crypto wallets are reconciled monthly by an independent accounting firm.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <Scale className="w-8 h-8 text-[hsl(var(--brand-pink))]" />
                <h2 className="text-2xl font-bold text-foreground">2. Conflict of Interest Policy</h2>
              </div>
              <p>
                To protect the organization's tax-exempt and ANBI status, all board members, officers, and key employees must act in the best interest of G.R.A.T.I.S. rather than personal or third-party interests.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Annual disclosure statements are mandatory for all leadership.</li>
                <li>Any potential conflict must be disclosed to the Board of Directors immediately.</li>
                <li>Individuals with a conflict are recused from participating in discussions and voting on related matters (in compliance with US intermediate sanctions rules and Dutch governance codes).</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <Landmark className="w-8 h-8 text-[hsl(var(--brand-pink))]" />
                <h2 className="text-2xl font-bold text-foreground">3. Audit & Reporting Requirements</h2>
              </div>
              <p>
                We commit to rigorous independent oversight to maintain public trust.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Annual External Audit:</strong> An independent, certified public accounting firm conducts an annual audit of our financial statements.</li>
                <li><strong>Form 990 (USA):</strong> We file the IRS Form 990 annually, which is made publicly available.</li>
                <li><strong>ANBI Publication (NL):</strong> Our financial statements, remuneration policy, and activity report are published annually on our website in accordance with Dutch ANBI transparency rules.</li>
                <li><strong>EU Transparency:</strong> We comply with EU Anti-Money Laundering (AML) directives, ensuring ultimate beneficial ownership (UBO) transparency.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <Lock className="w-8 h-8 text-[hsl(var(--brand-pink))]" />
                <h2 className="text-2xl font-bold text-foreground">4. Whistleblower & Document Retention</h2>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[hsl(var(--brand-yellow))]">Whistleblower Policy</h3>
                <p>In accordance with the US Sarbanes-Oxley Act and the EU Whistleblower Protection Directive, we provide a secure, anonymous channel for reporting suspected financial misconduct, ethical violations, or legal non-compliance without fear of retaliation.</p>
                
                <h3 className="text-lg font-semibold text-[hsl(var(--brand-yellow))]">Document Retention</h3>
                <p>Financial records, including donation receipts, contracts, and tax filings, are retained for a minimum of 7 years, satisfying both IRS and Dutch Belastingdienst requirements. Historical governance documents are retained permanently.</p>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-12 p-6 bg-muted/30 rounded-lg text-sm text-foreground/60">
            <p><strong>Legal Disclaimer:</strong> These policies are subject to annual review by the Board of Directors and legal counsel to ensure ongoing compliance with evolving international laws. Last ratified by the Board: January 2024.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
