/**
 * Partner Reports Page
 *
 * Generate and download reports.
 * Part 6 - Partner Dashboard
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Eye,
} from "lucide-react";

const REPORT_TYPES = [
  {
    id: "financial",
    title: "Financial Report",
    description:
      "Detailed breakdown of donations, expenses, and financial performance",
    icon: DollarSign,
    available: true,
  },
  {
    id: "impact",
    title: "Impact Report",
    description:
      "Beneficiaries reached, projects completed, and overall impact metrics",
    icon: TrendingUp,
    available: true,
  },
  {
    id: "donor",
    title: "Donor Report",
    description: "Donor demographics, retention rates, and giving patterns",
    icon: Users,
    available: true,
  },
  {
    id: "engagement",
    title: "Engagement Report",
    description: "Website visits, project views, and user engagement metrics",
    icon: Eye,
    available: true,
  },
  {
    id: "quarterly",
    title: "Quarterly Summary",
    description: "Comprehensive quarterly performance summary",
    icon: FileText,
    available: false,
  },
  {
    id: "annual",
    title: "Annual Report",
    description: "Year-end comprehensive report for stakeholders",
    icon: Calendar,
    available: false,
  },
];

const RECENT_REPORTS = [
  {
    id: "1",
    type: "Financial Report",
    period: "January 2024",
    generatedAt: new Date("2024-02-01"),
    size: "2.3 MB",
  },
  {
    id: "2",
    type: "Impact Report",
    period: "Q4 2023",
    generatedAt: new Date("2024-01-15"),
    size: "1.8 MB",
  },
  {
    id: "3",
    type: "Donor Report",
    period: "December 2023",
    generatedAt: new Date("2024-01-05"),
    size: "1.2 MB",
  },
];

export default function PartnerReports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-gray-600">
          Generate and download performance reports
        </p>
      </div>

      {/* Report Types */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Generate New Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REPORT_TYPES.map((report) => {
            const Icon = report.icon;

            return (
              <Card key={report.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    {!report.available && (
                      <Badge variant="secondary">Coming Soon</Badge>
                    )}
                  </div>

                  <h3 className="font-semibold text-lg mb-2">{report.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {report.description}
                  </p>

                  <Button
                    variant={report.available ? "default" : "outline"}
                    className="w-full"
                    disabled={!report.available}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {RECENT_REPORTS.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>

                  <div>
                    <h4 className="font-semibold">{report.type}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span>{report.period}</span>
                      <span>•</span>
                      <span>{report.size}</span>
                      <span>•</span>
                      <span>{report.generatedAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Set up automatic report generation and delivery to your email.
          </p>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Configure Schedule
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
