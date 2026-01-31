import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Calendar } from "lucide-react";

interface Milestone {
  id: string;
  date: string;
  title: string;
  description: string;
  amount?: number;
  type: "donation" | "partner" | "milestone" | "impact";
}

export const ImpactTimeline = () => {
  const { t } = useTranslation();

  // Milestones will come from Firestore in production
  const milestones: Milestone[] = [
    {
      id: "1",
      date: "2026-01-15",
      title: t("impactPage.timeline.milestone1.title"),
      description: t("impactPage.timeline.milestone1.description"),
      amount: 50000,
      type: "milestone",
    },
    {
      id: "2",
      date: "2026-01-10",
      title: t("impactPage.timeline.milestone2.title"),
      description: t("impactPage.timeline.milestone2.description"),
      type: "partner",
    },
    {
      id: "3",
      date: "2026-01-05",
      title: t("impactPage.timeline.milestone3.title"),
      description: t("impactPage.timeline.milestone3.description"),
      amount: 25000,
      type: "donation",
    },
    {
      id: "4",
      date: "2026-01-01",
      title: t("impactPage.timeline.milestone4.title"),
      description: t("impactPage.timeline.milestone4.description"),
      type: "impact",
    },
  ];

  const getTypeColor = (type: Milestone["type"]) => {
    switch (type) {
      case "donation":
        return "bg-blue-500";
      case "partner":
        return "bg-purple-500";
      case "milestone":
        return "bg-green-500";
      case "impact":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeBadge = (type: Milestone["type"]) => {
    switch (type) {
      case "donation":
        return t("impactPage.timeline.types.donation");
      case "partner":
        return t("impactPage.timeline.types.partner");
      case "milestone":
        return t("impactPage.timeline.types.milestone");
      case "impact":
        return t("impactPage.timeline.types.impact");
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(t("common.locale"), {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">
          {t("impactPage.timeline.title")}
        </h2>
        <p className="text-muted-foreground">
          {t("impactPage.timeline.subtitle")}
        </p>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="relative">
              {/* Timeline dot */}
              <div className="absolute left-8 -translate-x-1/2 hidden md:block">
                <div
                  className={`w-4 h-4 rounded-full ${getTypeColor(milestone.type)} ring-4 ring-background`}
                />
              </div>

              {/* Content */}
              <Card className="ml-0 md:ml-20 p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg">
                        {milestone.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {formatDate(milestone.date)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {getTypeBadge(milestone.type)}
                  </Badge>
                </div>

                <p className="text-muted-foreground ml-8">
                  {milestone.description}
                </p>

                {milestone.amount && (
                  <div className="mt-4 ml-8">
                    <p className="text-2xl font-bold text-primary">
                      €{milestone.amount.toLocaleString()}
                    </p>
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
