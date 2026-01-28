import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { useTranslation } from "react-i18next";

export default function Tribe() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={t("tribePage.title")}
        description={t("tribePage.description")}
        canonical={
          typeof window !== "undefined" ? window.location.href : "/tribe"
        }
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            TRIBE
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            {t("tribePage.subtitle")}
          </p>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container py-16 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              {t("tribePage.whatWeStandFor")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("tribePage.description2")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: t("tribePage.heritage.title"),
                body: t("tribePage.heritage.description"),
                to: "/tribe/heritage",
              },
              {
                title: t("tribePage.ethics.title"),
                body: t("tribePage.ethics.description"),
                to: "/tribe/ethics",
              },
              {
                title: t("tribePage.accountability.title"),
                body: t("tribePage.accountability.description"),
                to: "/tribe/accountability",
              },
              {
                title: t("tribePage.team.title"),
                body: t("tribePage.team.description"),
                to: "/tribe/team",
              },
              {
                title: t("tribePage.standards.title"),
                body: t("tribePage.standards.description"),
                to: "/tribe/standards",
              },
              {
                title: t("tribePage.responsibility.title"),
                body: t("tribePage.responsibility.description"),
                to: "/tribe/responsibility",
              },
              {
                title: t("tribePage.transparency.title"),
                body: t("tribePage.transparency.description"),
                to: "/tribe/transparency",
              },
            ].map((section) => (
              <Link
                key={section.title}
                to={section.to}
                className="group bg-muted/10 hover:bg-muted/20 rounded-lg p-6 transition-colors space-y-4"
              >
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                  {section.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {section.body}
                </p>
                <div className="text-sm font-medium text-primary">
                  {t("common.viewMore")} →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
