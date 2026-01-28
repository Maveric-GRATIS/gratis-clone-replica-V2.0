import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

export const WaterTestimonials = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      quote: t("waterPage.testimonials.review1"),
      author: t("waterPage.testimonials.review1Name"),
      location: t("waterPage.testimonials.review1Location"),
      rating: 5,
    },
    {
      quote: t("waterPage.testimonials.review2"),
      author: t("waterPage.testimonials.review2Name"),
      location: t("waterPage.testimonials.review2Location"),
      rating: 5,
    },
    {
      quote: t("waterPage.testimonials.review3"),
      author: t("waterPage.testimonials.review3Name"),
      location: t("waterPage.testimonials.review3Location"),
      rating: 5,
    },
  ];

  return (
    <section className="py-16">
      <div className="container">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            {t("waterPage.testimonials.title")}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t("waterPage.testimonials.subtitle")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="relative overflow-hidden bg-card/50 backdrop-blur"
            >
              <CardContent className="p-6">
                <Quote className="absolute -right-2 -top-2 h-16 w-16 text-primary/10" />

                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-500 text-yellow-500"
                    />
                  ))}
                </div>

                <blockquote className="relative text-sm leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.location}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
