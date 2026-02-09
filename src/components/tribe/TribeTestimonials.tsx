import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

export function TribeTestimonials() {
  const { t } = useTranslation();

  const testimonials = [
    {
      id: 1,
      name: t("tribePage.testimonials.testimonial1.name"),
      role: t("tribePage.testimonials.testimonial1.role"),
      tier: t("tribePage.testimonials.testimonial1.tier"),
      quote: t("tribePage.testimonials.testimonial1.quote"),
      avatar: "👨‍💼",
    },
    {
      id: 2,
      name: t("tribePage.testimonials.testimonial2.name"),
      role: t("tribePage.testimonials.testimonial2.role"),
      tier: t("tribePage.testimonials.testimonial2.tier"),
      quote: t("tribePage.testimonials.testimonial2.quote"),
      avatar: "👩‍🎨",
    },
    {
      id: 3,
      name: t("tribePage.testimonials.testimonial3.name"),
      role: t("tribePage.testimonials.testimonial3.role"),
      tier: t("tribePage.testimonials.testimonial3.tier"),
      quote: t("tribePage.testimonials.testimonial3.quote"),
      avatar: "👨‍🔬",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
            <Quote className="mr-1 h-3 w-3" />
            {t("tribePage.testimonials.badge")}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            {t("tribePage.testimonials.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t("tribePage.testimonials.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6 relative overflow-hidden">
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-10">
                <Quote className="h-16 w-16" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-4 w-4 fill-yellow-500 text-yellow-500"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-muted-foreground mb-6 relative z-10">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div>
                  <div className="font-bold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {testimonial.tier}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
          <div className="text-center">
            <div className="text-4xl font-black text-primary mb-2">5.000+</div>
            <div className="text-sm text-muted-foreground">
              {t("tribePage.testimonials.stat1")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-primary mb-2">4,9/5</div>
            <div className="text-sm text-muted-foreground">
              {t("tribePage.testimonials.stat2")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-primary mb-2">98%</div>
            <div className="text-sm text-muted-foreground">
              {t("tribePage.testimonials.stat3")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-primary mb-2">25+</div>
            <div className="text-sm text-muted-foreground">
              {t("tribePage.testimonials.stat4")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
