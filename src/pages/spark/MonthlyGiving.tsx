import SEO from "@/components/SEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Repeat,
  Heart,
  Droplets,
  Palette,
  GraduationCap,
  Shield,
  Globe,
  Quote,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setStarted(true);
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    let s = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      s += step;
      if (s >= target) {
        setCount(target);
        clearInterval(t);
      } else setCount(Math.floor(s));
    }, 16);
    return () => clearInterval(t);
  }, [started, target, duration]);
  return { count, ref };
}

// Stripe price IDs for each tier
const monthlyTiers = [
  {
    amount: "€10",
    impact: "240 bottles/year",
    desc: "Enough clean water for a family of four for an entire year.",
    icon: Droplets,
    color: "border-primary/40 bg-primary/5",
    priceId: "price_1T8vaNA75JEJwW7OzI7Mlmwo",
    tierName: "Water for Family",
  },
  {
    amount: "€25",
    impact: "Art for 3 youth/month",
    desc: "Fund creative workshops and supplies for young artists every month.",
    icon: Palette,
    color: "border-accent/40 bg-accent/5",
    priceId: "price_1T8vbSA75JEJwW7OBukNu6VA",
    tierName: "Youth Art Program",
  },
  {
    amount: "€50",
    impact: "1 student scholarship",
    desc: "Cover school supplies, books, and tuition support for one student.",
    icon: GraduationCap,
    color: "border-[hsl(var(--brand-blue))]/40 bg-[hsl(var(--brand-blue))]/5",
    priceId: "price_1T8vc9A75JEJwW7OTdVdoy0P",
    tierName: "Student Scholarship",
  },
  {
    amount: "€100",
    impact: "Community water filter",
    desc: "Install and maintain a community water filtration system every quarter.",
    icon: Heart,
    color: "border-primary/40 bg-primary/5",
    priceId: "price_1T8vdTA75JEJwW7OnPKeDA81",
    tierName: "Community Water Filter",
  },
];

export default function MonthlyGiving() {
  const donors = useCounter(4200, 2200);
  const liters = useCounter(2500, 2200);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubscribe = async (
    priceId: string,
    tierName: string,
    amount: string,
  ) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to become a monthly donor.",
        variant: "destructive",
      });
      navigate("/auth?redirect=/spark/monthly-giving");
      return;
    }

    setLoadingTier(priceId);

    try {
      const { data, error } = await supabase.functions.invoke(
        "create-monthly-subscription",
        {
          body: { priceId, tierName },
        },
      );

      if (error) throw error;
      if (!data?.url) throw new Error("No checkout URL returned");

      // Open Stripe Checkout in a new tab
      window.open(data.url, "_blank");
    } catch (err) {
      console.error("Subscription error:", err);
      toast({
        title: "Something went wrong",
        description:
          err instanceof Error
            ? err.message
            : "Unable to start subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Monthly Giving — GRATIS SPARK"
        description="Become a monthly donor and create sustained, predictable impact. Automatic recurring donations for clean water, art, and education."
        canonical="/spark/monthly-giving"
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-sm font-semibold tracking-wider mb-6 animate-fade-in">
            SPARK / MONTHLY GIVING
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
            SUSTAIN THE MOVEMENT
          </h1>
          <p
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in"
            style={{ animationDelay: "100ms", animationFillMode: "backwards" }}
          >
            Small, consistent acts create massive change. Set it once, fund
            impact forever. Cancel anytime.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 text-lg px-8 animate-fade-in"
            style={{ animationDelay: "200ms", animationFillMode: "backwards" }}
            onClick={() =>
              document
                .getElementById("tiers")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Choose Your Amount <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card/50 backdrop-blur-sm">
        <div
          ref={donors.ref}
          className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          {[
            { value: `${donors.count}+`, label: "Monthly Donors" },
            { value: `${liters.count}K`, label: "Liters/Month" },
            { value: "100%", label: "To Programs" },
            { value: "€0", label: "Admin Fees" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-black text-primary">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Monthly */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-black text-center mb-14">
              WHY GIVE MONTHLY?
            </h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Repeat,
                title: "Predictable Impact",
                desc: "Consistent funding enables long-term projects that one-time gifts can't sustain.",
              },
              {
                icon: TrendingUp,
                title: "Compounding Change",
                desc: "€10/month = €120/year = 240 bottles. Small amounts add up to transformative impact.",
              },
              {
                icon: Shield,
                title: "Full Control",
                desc: "Modify your amount, pause, or cancel anytime from your dashboard. No commitments.",
              },
            ].map((item) => (
              <ScrollReveal key={item.title}>
                <div className="p-6 rounded-xl border border-border bg-card/30 hover:border-primary/30 transition-all h-full">
                  <item.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Monthly Tiers */}
      <section id="tiers" className="py-20 px-4 bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-black text-center mb-4">
              PICK YOUR IMPACT LEVEL
            </h2>
            <p className="text-center text-muted-foreground mb-14">
              Every tier creates real, tracked, verified change.
            </p>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 gap-6">
            {monthlyTiers.map((tier) => (
              <ScrollReveal key={tier.amount}>
                <Card
                  className={`h-full border-2 ${tier.color} hover:shadow-xl transition-all`}
                >
                  <CardContent className="pt-6 pb-5 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <tier.icon className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <div className="text-3xl font-black text-foreground">
                          {tier.amount}
                          <span className="text-lg text-muted-foreground font-normal">
                            /month
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-primary">
                          {tier.impact}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{tier.desc}</p>
                    <Button
                      className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
                      onClick={() =>
                        handleSubscribe(
                          tier.priceId,
                          tier.tierName,
                          tier.amount,
                        )
                      }
                      disabled={loadingTier === tier.priceId}
                    >
                      {loadingTier === tier.priceId ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Opening Checkout...
                        </>
                      ) : (
                        <>
                          Start Giving {tier.amount}/month{" "}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <Card className="border-border/50 bg-card/80">
              <CardContent className="pt-8 pb-6 text-center">
                <Quote className="w-10 h-10 text-primary/40 mx-auto mb-6" />
                <p className="text-xl text-muted-foreground italic leading-relaxed mb-6">
                  "Monthly donors like us are proof that small, consistent acts
                  create massive change. €25/month feels like nothing - but it's
                  everything to someone without clean water."
                </p>
                <div className="font-bold text-foreground">Sophie V.</div>
                <div className="text-sm text-muted-foreground">
                  Monthly donor since 2023 • Amsterdam
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              JOIN 4,200+ MONTHLY DONORS
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start with any amount. Change anytime. Every euro counts.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 text-lg px-8"
                onClick={() =>
                  document
                    .getElementById("tiers")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Become a Monthly Donor <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Link to="/spark/all-ways-to-give">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/40 text-primary hover:bg-primary/10 text-lg px-8"
                >
                  All Ways to Give
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
