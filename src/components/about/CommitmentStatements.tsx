import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, BarChart3, Shield, ExternalLink } from "lucide-react";

export const CommitmentStatements = () => {
  const { t } = useTranslation();

  const commitments = [
    {
      icon: FileText,
      title: t("aboutPage.commitments.transparency.title"),
      description: t("aboutPage.commitments.transparency.description"),
      link: "/impact",
      linkText: t("aboutPage.commitments.transparency.linkText"),
    },
    {
      icon: BarChart3,
      title: t("aboutPage.commitments.verification.title"),
      description: t("aboutPage.commitments.verification.description"),
      link: "/partners",
      linkText: t("aboutPage.commitments.verification.linkText"),
    },
    {
      icon: Shield,
      title: t("aboutPage.commitments.community.title"),
      description: t("aboutPage.commitments.community.description"),
      link: "/tribe",
      linkText: t("aboutPage.commitments.community.linkText"),
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <Badge className="mb-4">{t("aboutPage.commitments.badge")}</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {t("aboutPage.commitments.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("aboutPage.commitments.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {commitments.map((commitment, index) => {
            const Icon = commitment.icon;
            return (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="space-y-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold">{commitment.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {commitment.description}
                  </p>

                  {/* Link */}
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <Link to={commitment.link}>
                      {commitment.linkText}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Certifications & Compliance */}
        <div className="mt-12 text-center">
          <Card className="p-8 max-w-3xl mx-auto bg-muted/30">
            <h3 className="text-xl font-bold mb-4">
              {t("aboutPage.commitments.certifications.title")}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t("aboutPage.commitments.certifications.description")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="text-sm">
                🇳🇱 ANBI Status
              </Badge>
              <Badge variant="outline" className="text-sm">
                GDPR Compliant
              </Badge>
              <Badge variant="outline" className="text-sm">
                ISO 14001 (Environmental)
              </Badge>
              <Badge variant="outline" className="text-sm">
                B Corp Pending
              </Badge>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
