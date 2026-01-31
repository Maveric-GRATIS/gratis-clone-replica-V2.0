import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { ArrowRight, ShoppingCart, Globe, TrendingUp } from "lucide-react";

export const HowItWorksVisual = () => {
  const { t } = useTranslation();

  const steps = [
    {
      number: 1,
      icon: ShoppingCart,
      title: t("aboutPage.howItWorks.step1.title"),
      description: t("aboutPage.howItWorks.step1.description"),
      color: "from-blue-500 to-cyan-400",
    },
    {
      number: 2,
      icon: Globe,
      title: t("aboutPage.howItWorks.step2.title"),
      description: t("aboutPage.howItWorks.step2.description"),
      color: "from-purple-500 to-pink-400",
    },
    {
      number: 3,
      icon: TrendingUp,
      title: t("aboutPage.howItWorks.step3.title"),
      description: t("aboutPage.howItWorks.step3.description"),
      color: "from-green-500 to-emerald-400",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {t("aboutPage.howItWorks.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("aboutPage.howItWorks.subtitle")}
          </p>
        </div>

        {/* Desktop Flow */}
        <div className="hidden lg:flex items-center justify-center gap-4 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="flex items-center gap-4">
                <Card className="p-8 flex-1 hover:shadow-lg transition-shadow">
                  <div className="text-center space-y-4">
                    {/* Step Number */}
                    <div
                      className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-2xl font-bold`}
                    >
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="w-12 h-12 mx-auto">
                      <Icon className="w-full h-full text-primary" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </Card>

                {/* Arrow */}
                {index < steps.length - 1 && (
                  <ArrowRight className="w-8 h-8 text-primary flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Stack */}
        <div className="lg:hidden space-y-6 max-w-md mx-auto">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number}>
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Step Number */}
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}
                    >
                      {step.number}
                    </div>

                    <div className="flex-1 space-y-3">
                      {/* Icon */}
                      <Icon className="w-8 h-8 text-primary" />

                      {/* Content */}
                      <h3 className="text-lg font-bold">{step.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Down Arrow */}
                {step.number < steps.length && (
                  <div className="flex justify-center py-2">
                    <ArrowRight className="w-6 h-6 text-primary rotate-90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
