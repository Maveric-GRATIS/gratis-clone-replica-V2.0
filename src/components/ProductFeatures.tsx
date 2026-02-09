import {
  CheckCircle,
  Leaf,
  Recycle,
  Heart,
  Flame,
  Palette,
  Hash,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  stat?: string;
}

interface ProductFeaturesProps {
  features: Feature[];
  title: string;
  subtitle: string;
}

export default function ProductFeatures({
  features,
  title,
  subtitle,
}: ProductFeaturesProps) {
  const { t } = useTranslation();

  return (
    <section className="bg-gradient-to-br from-gray-900 to-black py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center hover-scale transition-all duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-black transition-transform duration-500 group-hover:scale-110">
                {feature.icon}
              </div>

              {/* Stat */}
              {feature.stat && (
                <div className="text-4xl font-black text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                  {feature.stat}
                </div>
              )}

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-20 text-center">
          <div className="inline-block bg-gradient-to-r from-primary to-accent p-8 rounded-3xl">
            <h3 className="text-3xl font-black text-black mb-4">
              {t("home.features.cta.title")}
            </h3>
            <p className="text-black/80 mb-6 max-w-2xl">
              {t("home.features.cta.subtitle")}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="bg-black/20 backdrop-blur-sm rounded-full px-6 py-3 text-black font-bold">
                ✓ {t("home.features.cta.guarantee")}
              </div>
              <div className="bg-black/20 backdrop-blur-sm rounded-full px-6 py-3 text-black font-bold">
                ✓ {t("home.features.cta.freeShipping")}
              </div>
              <div className="bg-black/20 backdrop-blur-sm rounded-full px-6 py-3 text-black font-bold">
                ✓ {t("home.features.cta.impactTracking")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
