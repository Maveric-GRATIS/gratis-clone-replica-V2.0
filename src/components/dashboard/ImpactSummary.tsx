import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Droplet, Palette, BookOpen, ArrowRight } from "lucide-react";
import { formatEuro } from "@/lib/currency";

interface ImpactSummaryProps {
  totalImpact: number;
  breakdown?: {
    water: number;
    arts: number;
    education: number;
  };
}

export function ImpactSummary({ totalImpact, breakdown }: ImpactSummaryProps) {
  // Default breakdown if not provided (40/30/30 split)
  const impactBreakdown = breakdown || {
    water: totalImpact * 0.4,
    arts: totalImpact * 0.3,
    education: totalImpact * 0.3,
  };

  const categories = [
    {
      icon: Droplet,
      label: "Clean Water",
      amount: impactBreakdown.water,
      color: "bg-blue-500",
      percentage: 40,
    },
    {
      icon: Palette,
      label: "Arts & Culture",
      amount: impactBreakdown.arts,
      color: "bg-magenta-500",
      percentage: 30,
    },
    {
      icon: BookOpen,
      label: "Education",
      amount: impactBreakdown.education,
      color: "bg-orange-500",
      percentage: 30,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your Impact Breakdown</CardTitle>
            <CardDescription>Where your contribution goes</CardDescription>
          </div>
          <Link to="/impact">
            <Button variant="ghost" size="sm">
              View Full Impact <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Total Impact Display */}
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">
              Total Contribution
            </p>
            <p className="text-3xl font-bold">{formatEuro(totalImpact)}</p>
          </div>

          {/* Category Breakdown */}
          <div className="space-y-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1.5 rounded ${category.color} bg-opacity-10`}
                      >
                        <Icon
                          className={`h-4 w-4 ${category.color.replace("bg-", "text-")}`}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {category.label}
                      </span>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatEuro(category.amount)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={category.percentage} className="h-2" />
                    <span className="text-xs text-muted-foreground min-w-[3ch]">
                      {category.percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="pt-4 border-t">
            <p className="text-xs text-center text-muted-foreground">
              Track detailed impact metrics and see exactly where your support
              goes
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
