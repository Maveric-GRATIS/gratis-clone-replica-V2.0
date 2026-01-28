import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Heart,
  TrendingUp,
  Users,
  Briefcase,
  Droplets,
  Palette,
  GraduationCap,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Spark() {
  const { t } = useTranslation();

  const sparkPaths = [
    {
      title: t("sparkPage.verve.title"),
      subtitle: t("sparkPage.verve.subtitle"),
      description: t("sparkPage.verve.description"),
      icon: Heart,
      href: "/spark/verve",
      color: "from-pink-500 to-rose-500",
    },
    {
      title: t("sparkPage.infuse.title"),
      subtitle: t("sparkPage.infuse.subtitle"),
      description: t("sparkPage.infuse.description"),
      icon: TrendingUp,
      href: "/spark/infuse",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: t("sparkPage.blaze.title"),
      subtitle: t("sparkPage.blaze.subtitle"),
      description: t("sparkPage.blaze.description"),
      icon: Users,
      href: "/spark/blaze",
      color: "from-orange-500 to-amber-500",
    },
    {
      title: t("sparkPage.enlist.title"),
      subtitle: t("sparkPage.enlist.subtitle"),
      description: t("sparkPage.enlist.description"),
      icon: Briefcase,
      href: "/spark/enlist",
      color: "from-blue-500 to-cyan-500",
    },
  ];

  const impactStats = [
    {
      value: "2.5M+",
      label: t("sparkPage.impactStats.litersFunded"),
      icon: Droplets,
    },
    {
      value: "150+",
      label: t("sparkPage.impactStats.artPrograms"),
      icon: Palette,
    },
    {
      value: "1,000+",
      label: t("sparkPage.impactStats.studentsSupported"),
      icon: GraduationCap,
    },
    {
      value: "500+",
      label: t("sparkPage.impactStats.activeVolunteers"),
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={t("sparkPage.title")}
        description={t("sparkPage.subtitle")}
        canonical={
          typeof window !== "undefined" ? window.location.href : "/spark"
        }
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-primary/10 to-background" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
            SPARK
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4">
            {t("sparkPage.subtitle")}
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("sparkPage.description")}
          </p>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-12 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-black text-foreground mb-1">
                  {value}
                </div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Paths Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Choose Your Path
            </h2>
            <p className="text-lg text-muted-foreground">
              Four ways to make an impact. Each path contributes to our mission
              of creating positive change.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {sparkPaths.map(
              ({ title, subtitle, description, icon: Icon, href, color }) => (
                <Link key={title} to={href}>
                  <Card className="h-full border-2 hover:border-primary/50 transition-all hover:shadow-xl group">
                    <CardHeader>
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        {title}
                        <span className="text-base font-normal text-muted-foreground">
                          ({subtitle})
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base mb-4">
                        {description}
                      </CardDescription>
                      <div className="flex items-center text-primary font-medium group-hover:gap-3 gap-2 transition-all">
                        Learn More <ArrowRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="space-y-4">
              <h2 className="text-3xl font-black">Impact-First Philosophy</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Every action you take through SPARK directly fuels clean water
                initiatives, art and culture programs, and education
                opportunities worldwide. Your contribution creates ripples of
                positive change.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  100% of donations go directly to programs
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Transparent impact tracking and reporting
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Verified partner organizations
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-black">Join the Movement</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Whether you contribute time, money, or skills, you become part
                of a global community committed to making the world better.
                Every volunteer hour, every donation, every investment matters.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link to="/spark/verve">
                  <Button variant="hero" className="group">
                    Start Giving
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/spark/blaze">
                  <Button variant="outline">Volunteer Now</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
