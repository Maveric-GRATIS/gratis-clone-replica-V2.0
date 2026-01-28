import { Droplets, Recycle, Leaf, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

export const WaterFeatures = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Droplets,
      title: t("waterPage.waterFeatures.naturalSource"),
      description: t("waterPage.waterFeatures.naturalSourceDesc"),
    },
    {
      icon: Recycle,
      title: t("waterPage.waterFeatures.recyclable"),
      description: t("waterPage.waterFeatures.recyclableDesc"),
    },
    {
      icon: Leaf,
      title: t("waterPage.waterFeatures.zeroPlastic"),
      description: t("waterPage.waterFeatures.zeroPlasticDesc"),
    },
    {
      icon: Heart,
      title: t("waterPage.waterFeatures.fundsWater"),
      description: t("waterPage.waterFeatures.fundsWaterDesc"),
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
        {t("waterPage.waterFeatures.title")}
      </h3>
      <ul className="space-y-3">
        {features.map((feature) => (
          <li key={feature.title} className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <feature.icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{feature.title}</p>
              <p className="text-xs text-muted-foreground">
                {feature.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
