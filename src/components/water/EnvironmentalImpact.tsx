import { Leaf, Droplets, Recycle, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

export const EnvironmentalImpact = () => {
  const { t } = useTranslation();

  const stats = [
    {
      icon: Droplets,
      value: "1M+",
      label: t("waterPage.environmental.liters"),
    },
    {
      icon: Recycle,
      value: "500K+",
      label: t("waterPage.environmental.bottlesAvoided"),
    },
    {
      icon: Leaf,
      value: "50 Tons",
      label: t("waterPage.environmental.co2Saved"),
    },
    {
      icon: Globe,
      value: "25+",
      label: t("waterPage.environmental.countriesReached"),
    },
  ];

  return (
    <section className="relative overflow-hidden py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            <span className="text-primary">
              {t("waterPage.environmental.title")}
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("waterPage.environmental.description")}
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-xl border bg-card p-6 text-center transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="relative">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            {t("waterPage.environmental.cta")}
          </p>
        </div>
      </div>
    </section>
  );
};
