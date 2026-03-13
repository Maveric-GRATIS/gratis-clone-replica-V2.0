import { PageHero } from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, TrendingUp, Globe } from "lucide-react";

export default function AnnualReports() {
  const reports = [
    { year: 2023, size: "4.2 MB", date: "April 15, 2024" },
    { year: 2022, size: "3.8 MB", date: "April 12, 2023" },
    { year: 2021, size: "3.5 MB", date: "April 10, 2022" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHero 
        title="Annual Reports" 
        subtitle="Transparent financial reporting and impact metrics aligned with international standards."
        lastUpdated="April 2024"
      />

      <div className="container max-w-4xl mx-auto space-y-12">
        <section className="space-y-6 text-foreground/80 leading-relaxed">
          <p className="text-lg">
            Transparency is a core value at G.R.A.T.I.S. We publish comprehensive annual reports detailing our financial health, operational impact, and strategic direction. These reports are prepared to satisfy the disclosure requirements of the IRS (USA), the Belastingdienst (Netherlands ANBI), and EU transparency frameworks.
          </p>

          <Card className="bg-card/50 border-white/10 backdrop-blur-sm mb-12">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Globe className="w-6 h-6 text-[hsl(var(--brand-pink))]" />
                Reporting Standards
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg text-[hsl(var(--brand-yellow))] mb-2">United States (501c3)</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>IRS Form 990 publicly available</li>
                    <li>GAAP compliant financial statements</li>
                    <li>Independent Auditor's Report</li>
                    <li>Schedule of functional expenses</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-[hsl(var(--brand-yellow))] mb-2">Netherlands (ANBI)</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Standardized ANBI publication form</li>
                    <li>Remuneration policy disclosure</li>
                    <li>Balance sheet and statement of income</li>
                    <li>Management activity report</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-3xl font-bold text-foreground mt-12 mb-6">Download Reports</h2>
          <div className="grid gap-4">
            {reports.map((report) => (
              <div key={report.year} className="flex items-center justify-between p-6 bg-card/30 border border-border rounded-lg hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-muted rounded-full">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">G.R.A.T.I.S. {report.year} Annual Report</h3>
                    <p className="text-sm text-muted-foreground">Published: {report.date} • PDF • {report.size}</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-full transition-colors font-medium">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            ))}
          </div>

          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-[hsl(var(--brand-pink))]" />
              Key Metrics Overview (2023)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-6 bg-muted/20 rounded-lg text-center">
                <div className="text-3xl font-black text-foreground mb-1">89%</div>
                <div className="text-sm text-muted-foreground">Program Efficiency</div>
              </div>
              <div className="p-6 bg-muted/20 rounded-lg text-center">
                <div className="text-3xl font-black text-foreground mb-1">$4.2M</div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
              </div>
              <div className="p-6 bg-muted/20 rounded-lg text-center">
                <div className="text-3xl font-black text-foreground mb-1">12</div>
                <div className="text-sm text-muted-foreground">Countries Reached</div>
              </div>
              <div className="p-6 bg-muted/20 rounded-lg text-center">
                <div className="text-3xl font-black text-foreground mb-1">Clean</div>
                <div className="text-sm text-muted-foreground">Audit Opinion</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic mt-4">
              * Program efficiency is calculated as program expenses divided by total functional expenses. Detailed breakdowns are available in the full reports.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
