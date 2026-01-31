import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin } from "lucide-react";

interface NGOPartner {
  id: string;
  name: string;
  category: "water" | "arts" | "education";
  location: string;
  amountReceived: number;
  projectsSupported: number;
  logo?: string;
}

export const NGOPartnersGrid = () => {
  const { t } = useTranslation();

  // Partners will come from Firestore in production
  const partners: NGOPartner[] = [
    {
      id: "1",
      name: "Water for Life Foundation",
      category: "water",
      location: t("impactPage.partners.locations.kenya"),
      amountReceived: 45000,
      projectsSupported: 12,
    },
    {
      id: "2",
      name: "Arts & Culture Initiative",
      category: "arts",
      location: t("impactPage.partners.locations.netherlands"),
      amountReceived: 32000,
      projectsSupported: 8,
    },
    {
      id: "3",
      name: "Education First Alliance",
      category: "education",
      location: t("impactPage.partners.locations.uganda"),
      amountReceived: 28000,
      projectsSupported: 15,
    },
    {
      id: "4",
      name: "Clean Water Project",
      category: "water",
      location: t("impactPage.partners.locations.tanzania"),
      amountReceived: 38000,
      projectsSupported: 10,
    },
    {
      id: "5",
      name: "Creative Communities Hub",
      category: "arts",
      location: t("impactPage.partners.locations.belgium"),
      amountReceived: 25000,
      projectsSupported: 6,
    },
    {
      id: "6",
      name: "School Building Trust",
      category: "education",
      location: t("impactPage.partners.locations.rwanda"),
      amountReceived: 42000,
      projectsSupported: 18,
    },
  ];

  const getCategoryColor = (category: NGOPartner["category"]) => {
    switch (category) {
      case "water":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-300";
      case "arts":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-300";
      case "education":
        return "bg-green-500/10 text-green-700 dark:text-green-300";
    }
  };

  const getCategoryLabel = (category: NGOPartner["category"]) => {
    return t(`impactPage.allocation.${category}`);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">
          {t("impactPage.partners.title")}
        </h2>
        <p className="text-muted-foreground">
          {t("impactPage.partners.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner) => (
          <Card key={partner.id} className="p-6 hover:shadow-lg transition-all">
            {/* Logo placeholder */}
            <div className="w-full h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-4 flex items-center justify-center">
              <div className="text-4xl font-bold text-primary/20">
                {partner.name.charAt(0)}
              </div>
            </div>

            {/* Partner info */}
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg mb-2">{partner.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{partner.location}</span>
                </div>
              </div>

              <Badge className={getCategoryColor(partner.category)}>
                {getCategoryLabel(partner.category)}
              </Badge>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {t("impactPage.partners.amountReceived")}
                  </p>
                  <p className="text-lg font-bold text-primary">
                    €{partner.amountReceived.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {t("impactPage.partners.projectsSupported")}
                  </p>
                  <p className="text-lg font-bold">
                    {partner.projectsSupported}
                  </p>
                </div>
              </div>

              {/* Learn more link */}
              <Button variant="ghost" size="sm" className="w-full mt-2" asChild>
                <Link to={`/partners/${partner.id}`}>
                  {t("impactPage.partners.learnMore")}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* View all partners CTA */}
      <div className="text-center pt-6">
        <Button variant="outline" size="lg" asChild>
          <Link to="/partners">{t("impactPage.partners.viewAll")}</Link>
        </Button>
      </div>
    </div>
  );
};
