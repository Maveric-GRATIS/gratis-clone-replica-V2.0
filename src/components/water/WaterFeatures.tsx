import { Droplets, Recycle, Leaf, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

const FEATURE_COLORS = ["#3B82F6", "#10B981", "#8B5CF6", "#EC4899"];

export const WaterFeatures = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Droplets,
      color: FEATURE_COLORS[0],
      title: t("waterPage.waterFeatures.naturalSource"),
      description: t("waterPage.waterFeatures.naturalSourceDesc"),
    },
    {
      icon: Recycle,
      color: FEATURE_COLORS[1],
      title: t("waterPage.waterFeatures.recyclable"),
      description: t("waterPage.waterFeatures.recyclableDesc"),
    },
    {
      icon: Leaf,
      color: FEATURE_COLORS[2],
      title: t("waterPage.waterFeatures.zeroPlastic"),
      description: t("waterPage.waterFeatures.zeroPlasticDesc"),
    },
    {
      icon: Heart,
      color: FEATURE_COLORS[3],
      title: t("waterPage.waterFeatures.fundsWater"),
      description: t("waterPage.waterFeatures.fundsWaterDesc"),
    },
  ];

  return (
    <section className="bg-gradient-to-br from-gray-950 via-gray-900 to-black py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {t("waterPage.waterFeatures.title")}
          </h2>
          <div className="mt-3 mx-auto h-1 w-16 rounded-full bg-blue-500" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 flex flex-col gap-5 hover:border-white/25 hover:bg-white/10 hover:scale-[1.03] transition-all duration-300"
            >
              {/* glow blob */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
                style={{ backgroundColor: feature.color }}
              />
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${feature.color}22` }}
              >
                <feature.icon
                  className="h-7 w-7"
                  style={{ color: feature.color }}
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
