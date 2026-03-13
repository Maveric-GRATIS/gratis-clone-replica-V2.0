import SEO from "@/components/SEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Heart,
  Flower2,
  BookOpen,
  Droplets,
  Star,
  CheckCircle2,
  Quote,
} from "lucide-react";

const giftTypes = [
  {
    title: "Honor Gift",
    description:
      "Celebrate a birthday, wedding, retirement, or achievement by making a donation in someone's name.",
    icon: Star,
    color: "text-primary",
  },
  {
    title: "Memorial Gift",
    description:
      "Honor the memory of a loved one with a lasting contribution to clean water, art, or education.",
    icon: Flower2,
    color: "text-accent",
  },
  {
    title: "Tribute Gift",
    description:
      "Recognize a teacher, mentor, or community leader who inspired change in your life.",
    icon: BookOpen,
    color: "text-[hsl(var(--brand-blue))]",
  },
];

const testimonials = [
  {
    quote:
      "Instead of flowers at my mother's funeral, we asked for donations to GRATIS. She spent her life fighting for clean water-this was the perfect way to continue her legacy.",
    name: "Joris van D.",
    location: "Utrecht, Netherlands",
  },
  {
    quote:
      "For my 50th birthday I asked friends to donate instead of buying gifts. Together we funded 600 bottles of clean water. Best birthday ever.",
    name: "Keisha M.",
    location: "Atlanta, USA",
  },
];

export default function HonorMemorialGifts() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Honor & Memorial Gifts — GRATIS SPARK"
        description="Celebrate a life or honor a loved one with a meaningful donation to clean water, art, and education programs."
        canonical="/spark/honor-memorial"
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-sm font-semibold tracking-wider mb-6 animate-fade-in">
            SPARK / HONOR & MEMORIAL
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
            GIFTS THAT LAST
          </h1>
          <p
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in"
            style={{ animationDelay: "100ms", animationFillMode: "backwards" }}
          >
            Celebrate a life. Honor a memory. Create lasting impact in someone's
            name through clean water, art, and education.
          </p>
          <Link to="/spark/verve">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 text-lg px-8 animate-fade-in"
              style={{
                animationDelay: "200ms",
                animationFillMode: "backwards",
              }}
            >
              Make an Honor Gift <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Gift Types */}
      <section className="py-20 px-4 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-black text-center mb-14">
              TYPES OF TRIBUTE GIFTS
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {giftTypes.map((gift, i) => (
              <ScrollReveal key={gift.title}>
                <Card className="h-full border-border hover:border-primary/30 transition-all">
                  <CardContent className="pt-8 pb-6 space-y-4">
                    <gift.icon className={`w-10 h-10 ${gift.color}`} />
                    <h3 className="text-xl font-bold text-foreground">
                      {gift.title}
                    </h3>
                    <p className="text-muted-foreground">{gift.description}</p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-black text-center mb-14">
              HOW IT WORKS
            </h2>
          </ScrollReveal>

          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Choose Your Gift Type",
                desc: "Select Honor, Memorial, or Tribute and choose your donation amount.",
              },
              {
                step: "2",
                title: "Add a Personal Message",
                desc: "Include a dedication message and the name of the person being honored.",
              },
              {
                step: "3",
                title: "Notification Sent",
                desc: "We send a beautifully designed card (digital or physical) to the honoree or their family notifying them of your gift.",
              },
              {
                step: "4",
                title: "Impact Delivered",
                desc: "Your donation funds clean water, art, or education. A personalized impact report is shared with you annually.",
              },
            ].map((item) => (
              <ScrollReveal key={item.step}>
                <div className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-black text-center mb-14">
              STORIES OF TRIBUTE
            </h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t) => (
              <ScrollReveal key={t.name}>
                <Card className="h-full border-border/50 bg-card/80 hover:border-primary/30 transition-all">
                  <CardContent className="pt-6 flex flex-col h-full">
                    <Quote className="w-8 h-8 text-primary/40 mb-4 flex-shrink-0" />
                    <p className="text-muted-foreground italic leading-relaxed flex-1 mb-6">
                      "{t.quote}"
                    </p>
                    <div className="border-t border-border pt-4">
                      <div className="font-bold text-foreground">{t.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {t.location}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Impact + CTA */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <div className="grid grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: Droplets,
                  value: "€25",
                  label: "50 bottles of clean water",
                },
                {
                  icon: Heart,
                  value: "€50",
                  label: "Art supplies for 10 youth",
                },
                {
                  icon: BookOpen,
                  value: "€100",
                  label: "1 month of school for 5 students",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-4 rounded-xl border border-border bg-card/30"
                >
                  <item.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-black text-foreground">
                    {item.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              CREATE A LASTING TRIBUTE
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Every honor and memorial gift includes a personalized notification
              card and annual impact report.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/spark/verve">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 text-lg px-8"
                >
                  Give Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/40 text-primary hover:bg-primary/10 text-lg px-8"
                >
                  Questions? Contact Us
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
