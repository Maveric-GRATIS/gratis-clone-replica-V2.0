import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  Users,
  Award,
  TrendingUp,
  Package,
  Palette,
  CheckCircle2,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

export default function Corporate() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    companySize: "",
    interest: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success(t("corporatePage.form.successMessage"));
      setFormData({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        companySize: "",
        interest: "",
        message: "",
      });
    } catch (error) {
      toast.error(t("corporatePage.form.errorMessage"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const pricingTiers = [
    {
      name: t("corporatePage.pricing.starter.name"),
      minOrder: "500",
      price: t("corporatePage.pricing.starter.price"),
      features: [
        t("corporatePage.pricing.starter.feature1"),
        t("corporatePage.pricing.starter.feature2"),
        t("corporatePage.pricing.starter.feature3"),
        t("corporatePage.pricing.starter.feature4"),
      ],
      badge: null,
    },
    {
      name: t("corporatePage.pricing.growth.name"),
      minOrder: "2.000",
      price: t("corporatePage.pricing.growth.price"),
      features: [
        t("corporatePage.pricing.growth.feature1"),
        t("corporatePage.pricing.growth.feature2"),
        t("corporatePage.pricing.growth.feature3"),
        t("corporatePage.pricing.growth.feature4"),
        t("corporatePage.pricing.growth.feature5"),
      ],
      badge: t("corporatePage.pricing.popular"),
    },
    {
      name: t("corporatePage.pricing.enterprise.name"),
      minOrder: "5.000+",
      price: t("corporatePage.pricing.enterprise.price"),
      features: [
        t("corporatePage.pricing.enterprise.feature1"),
        t("corporatePage.pricing.enterprise.feature2"),
        t("corporatePage.pricing.enterprise.feature3"),
        t("corporatePage.pricing.enterprise.feature4"),
        t("corporatePage.pricing.enterprise.feature5"),
        t("corporatePage.pricing.enterprise.feature6"),
      ],
      badge: null,
    },
  ];

  const benefits = [
    {
      icon: Award,
      title: t("corporatePage.benefits.brand.title"),
      description: t("corporatePage.benefits.brand.description"),
    },
    {
      icon: Users,
      title: t("corporatePage.benefits.employees.title"),
      description: t("corporatePage.benefits.employees.description"),
    },
    {
      icon: TrendingUp,
      title: t("corporatePage.benefits.impact.title"),
      description: t("corporatePage.benefits.impact.description"),
    },
    {
      icon: Package,
      title: t("corporatePage.benefits.flexible.title"),
      description: t("corporatePage.benefits.flexible.description"),
    },
  ];

  const caseStudies = [
    {
      company: t("corporatePage.caseStudies.case1.company"),
      industry: t("corporatePage.caseStudies.case1.industry"),
      orderSize: t("corporatePage.caseStudies.case1.orderSize"),
      result: t("corporatePage.caseStudies.case1.result"),
      quote: t("corporatePage.caseStudies.case1.quote"),
      logo: "🏢",
    },
    {
      company: t("corporatePage.caseStudies.case2.company"),
      industry: t("corporatePage.caseStudies.case2.industry"),
      orderSize: t("corporatePage.caseStudies.case2.orderSize"),
      result: t("corporatePage.caseStudies.case2.result"),
      quote: t("corporatePage.caseStudies.case2.quote"),
      logo: "🎯",
    },
    {
      company: t("corporatePage.caseStudies.case3.company"),
      industry: t("corporatePage.caseStudies.case3.industry"),
      orderSize: t("corporatePage.caseStudies.case3.orderSize"),
      result: t("corporatePage.caseStudies.case3.result"),
      quote: t("corporatePage.caseStudies.case3.quote"),
      logo: "💼",
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t("corporatePage.meta.title")}</title>
        <meta
          name="description"
          content={t("corporatePage.meta.description")}
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <Badge className="mb-4">
                <Building2 className="w-4 h-4 mr-2" />
                {t("corporatePage.hero.badge")}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold">
                {t("corporatePage.hero.title")}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t("corporatePage.hero.subtitle")}
              </p>
              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <Button
                  size="lg"
                  onClick={() =>
                    document
                      .getElementById("contact-form")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  {t("corporatePage.hero.cta")}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline">
                  {t("corporatePage.hero.downloadBrochure")}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                {t("corporatePage.benefits.title")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("corporatePage.benefits.subtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card
                    key={index}
                    className="p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Program Features */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  {t("corporatePage.features.title")}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {t("corporatePage.features.subtitle")}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Bulk Ordering */}
                <Card className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">
                        {t("corporatePage.features.bulkOrdering.title")}
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>
                            {t("corporatePage.features.bulkOrdering.point1")}
                          </span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>
                            {t("corporatePage.features.bulkOrdering.point2")}
                          </span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>
                            {t("corporatePage.features.bulkOrdering.point3")}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card>

                {/* Custom Branding */}
                <Card className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <Palette className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">
                        {t("corporatePage.features.customBranding.title")}
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>
                            {t("corporatePage.features.customBranding.point1")}
                          </span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>
                            {t("corporatePage.features.customBranding.point2")}
                          </span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>
                            {t("corporatePage.features.customBranding.point3")}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                {t("corporatePage.pricing.title")}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t("corporatePage.pricing.subtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {pricingTiers.map((tier, index) => (
                <Card
                  key={index}
                  className={`p-8 ${tier.badge ? "border-2 border-primary shadow-lg" : ""}`}
                >
                  {tier.badge && <Badge className="mb-4">{tier.badge}</Badge>}
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">{tier.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    {t("corporatePage.pricing.minOrder")}: {tier.minOrder}{" "}
                    {t("corporatePage.pricing.bottles")}
                  </p>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={tier.badge ? "default" : "outline"}
                  >
                    {t("corporatePage.pricing.getQuote")}
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <Badge className="mb-4">
                {t("corporatePage.caseStudies.badge")}
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                {t("corporatePage.caseStudies.title")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("corporatePage.caseStudies.subtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {caseStudies.map((study, index) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="text-5xl mb-4">{study.logo}</div>
                  <h3 className="text-xl font-bold mb-2">{study.company}</h3>
                  <Badge variant="secondary" className="mb-4">
                    {study.industry}
                  </Badge>
                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("corporatePage.caseStudies.orderSize")}
                      </p>
                      <p className="font-semibold">{study.orderSize}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t("corporatePage.caseStudies.result")}
                      </p>
                      <p className="font-semibold">{study.result}</p>
                    </div>
                  </div>
                  <blockquote className="text-sm italic text-muted-foreground border-l-4 border-primary pl-4">
                    "{study.quote}"
                  </blockquote>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact-form" className="py-20 bg-background">
          <div className="container max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                {t("corporatePage.form.title")}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t("corporatePage.form.subtitle")}
              </p>
            </div>

            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">
                      {t("corporatePage.form.companyName")}
                    </Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          companyName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactName">
                      {t("corporatePage.form.contactName")}
                    </Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      {t("corporatePage.form.email")}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      {t("corporatePage.form.phone")}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companySize">
                      {t("corporatePage.form.companySize")}
                    </Label>
                    <Input
                      id="companySize"
                      placeholder={t(
                        "corporatePage.form.companySizePlaceholder",
                      )}
                      value={formData.companySize}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          companySize: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interest">
                      {t("corporatePage.form.interest")}
                    </Label>
                    <Input
                      id="interest"
                      placeholder={t("corporatePage.form.interestPlaceholder")}
                      value={formData.interest}
                      onChange={(e) =>
                        setFormData({ ...formData, interest: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">
                    {t("corporatePage.form.message")}
                  </Label>
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder={t("corporatePage.form.messagePlaceholder")}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? t("corporatePage.form.submitting")
                    : t("corporatePage.form.submit")}
                </Button>
              </form>

              <div className="mt-8 pt-8 border-t">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold mb-1">
                        {t("corporatePage.form.emailUs")}
                      </p>
                      <a
                        href="mailto:corporate@gratis.ngo"
                        className="text-sm text-primary hover:underline"
                      >
                        corporate@gratis.ngo
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold mb-1">
                        {t("corporatePage.form.callUs")}
                      </p>
                      <a
                        href="tel:+31201234567"
                        className="text-sm text-primary hover:underline"
                      >
                        +31 20 123 4567
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}
