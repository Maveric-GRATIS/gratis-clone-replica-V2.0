import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Rocket, Users, TrendingUp } from "lucide-react";

export const StoryTimeline = () => {
  const { t } = useTranslation();

  const timelineEvents = [
    {
      date: t("aboutPage.timeline.event1.date"),
      title: t("aboutPage.timeline.event1.title"),
      description: t("aboutPage.timeline.event1.description"),
      icon: Rocket,
      color: "from-blue-500 to-cyan-400",
    },
    {
      date: t("aboutPage.timeline.event2.date"),
      title: t("aboutPage.timeline.event2.title"),
      description: t("aboutPage.timeline.event2.description"),
      icon: Users,
      color: "from-purple-500 to-pink-400",
    },
    {
      date: t("aboutPage.timeline.event3.date"),
      title: t("aboutPage.timeline.event3.title"),
      description: t("aboutPage.timeline.event3.description"),
      icon: TrendingUp,
      color: "from-green-500 to-emerald-400",
    },
    {
      date: t("aboutPage.timeline.event4.date"),
      title: t("aboutPage.timeline.event4.title"),
      description: t("aboutPage.timeline.event4.description"),
      icon: Rocket,
      color: "from-orange-500 to-red-400",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <Badge className="mb-4">{t("aboutPage.timeline.badge")}</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {t("aboutPage.timeline.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("aboutPage.timeline.subtitle")}
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line (desktop) */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

          <div className="space-y-12">
            {timelineEvents.map((event, index) => {
              const Icon = event.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 hidden md:block">
                    <div
                      className={`w-4 h-4 rounded-full bg-gradient-to-br ${event.color} ring-4 ring-background`}
                    />
                  </div>

                  {/* Content */}
                  <div
                    className={`w-full md:w-[calc(50%-2rem)] ${isEven ? "md:pr-12" : "md:pl-12"}`}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div
                          className={`w-12 h-12 rounded-full bg-gradient-to-br ${event.color} flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>

                        <div className="flex-1 space-y-2">
                          {/* Date */}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{event.date}</span>
                          </div>

                          {/* Title & Description */}
                          <h3 className="text-xl font-bold">{event.title}</h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
