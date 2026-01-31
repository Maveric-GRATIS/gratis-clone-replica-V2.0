import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Shield, Users, CheckCircle2 } from "lucide-react";

export const ThreePillarsDetailed = () => {
  const { t } = useTranslation();

  const pillars = [
    {
      icon: Eye,
      title: t("aboutPage.pillars.transparency.title"),
      description: t("aboutPage.pillars.transparency.description"),
      color: "from-blue-500 to-cyan-400",
      features: [
        t("aboutPage.pillars.transparency.feature1"),
        t("aboutPage.pillars.transparency.feature2"),
        t("aboutPage.pillars.transparency.feature3"),
        t("aboutPage.pillars.transparency.feature4"),
      ],
    },
    {
      icon: Shield,
      title: t("aboutPage.pillars.verification.title"),
      description: t("aboutPage.pillars.verification.description"),
      color: "from-purple-500 to-pink-400",
      features: [
        t("aboutPage.pillars.verification.feature1"),
        t("aboutPage.pillars.verification.feature2"),
        t("aboutPage.pillars.verification.feature3"),
        t("aboutPage.pillars.verification.feature4"),
      ],
    },
    {
      icon: Users,
      title: t("aboutPage.pillars.community.title"),
      description: t("aboutPage.pillars.community.description"),
      color: "from-green-500 to-emerald-400",
      features: [
        t("aboutPage.pillars.community.feature1"),
        t("aboutPage.pillars.community.feature2"),
        t("aboutPage.pillars.community.feature3"),
        t("aboutPage.pillars.community.feature4"),
      ],
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <Badge className="mb-4">{t("aboutPage.pillars.badge")}</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {t("aboutPage.pillars.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("aboutPage.pillars.subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <Card
                key={index}
                className="p-8 hover:shadow-lg transition-shadow"
              >
                {/* Icon & Title */}
                <div className="mb-6">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${pillar.color} flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{pillar.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-3 border-t pt-6">
                  {pillar.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{feature}</p>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
