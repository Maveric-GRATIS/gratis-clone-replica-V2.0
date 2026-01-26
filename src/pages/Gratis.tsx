import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Droplet, Sparkles, Zap, ArrowRight } from "lucide-react";

const beverageLines = [
  {
    id: "water",
    name: "W.A.T.E.R",
    subtitle: "Pure Still Water",
    description:
      "Premium natural spring water in infinitely recyclable aluminum bottles. Pure hydration, zero compromise.",
    image: "/lovable-uploads/gratis-canal-collection.jpg",
    color: "from-blue-500 to-cyan-400",
    icon: Droplet,
    route: "/gratis/water",
    status: "available",
    tagline: "Wisdom. Aqua. Thirst. Elemental. Refresh.",
  },
  {
    id: "theurgy",
    name: "THEURGY",
    subtitle: "Wellness Functional Water",
    description:
      "Mystic-positioned functional water infused with adaptogens, vitamins, and natural botanicals. Elevate your hydration ritual.",
    image: "/lovable-uploads/gratis-lifestyle-drink.jpg",
    color: "from-purple-500 to-pink-400",
    icon: Sparkles,
    route: "/gratis/theurgy",
    status: "pre-order",
    tagline: "Transform. Harmonize. Elevate. Unite. Revive. Grace. Yield.",
  },
  {
    id: "fu",
    name: "F.U.",
    subtitle: "Rebellious Functional Water",
    description:
      "Caffeine-powered energy water with rebellious attitude. For those who refuse to settle. Fuel your fire.",
    image: "/lovable-uploads/gratis-neon-tank.jpg",
    color: "from-pink-500 to-orange-400",
    icon: Zap,
    route: "/gratis/fu",
    status: "pre-order",
    tagline: "Fierce. Unleashed.",
  },
];

export default function Gratis() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="GRATIS — Premium Hydration for a Purpose"
        description="Premium natural water and functional beverages in infinitely recyclable aluminum bottles. 100% ad revenue donated to verified NGOs worldwide."
        canonical={
          typeof window !== "undefined" ? window.location.href : "/gratis"
        }
      />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/20 to-background" />

        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('/lovable-uploads/gratis-amsterdam-canal.jpg')",
          }}
        />

        <div className="relative z-10 container px-4 text-center space-y-8">
          <Badge className="mx-auto text-lg px-4 py-2">
            G.R.A.T.I.S — Giving Resources to Achieve Transformative and
            Impactful Change
          </Badge>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              PREMIUM HYDRATION
            </span>
            <br />
            <span className="text-foreground">FOR A PURPOSE</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Three revolutionary beverage lines. Infinitely recyclable aluminum
            bottles. 100% advertising revenue donated to verified NGOs
            worldwide.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8">
              <Link to="/gratis/water">
                Explore W.A.T.E.R <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg px-8"
            >
              <Link to="/spark/verve">Support the Mission</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Beverage Lines */}
      <section className="border-t border-border">
        <div className="container py-20 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold">
              Choose Your Hydration
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three distinct lines, one mission: premium beverages that fund
              real change.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {beverageLines.map((line) => {
              const Icon = line.icon;
              return (
                <Link
                  key={line.id}
                  to={line.route}
                  className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
                >
                  {/* Image Background */}
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <img
                      src={line.image}
                      alt={line.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Status Badge */}
                    <Badge
                      className="absolute top-4 right-4"
                      variant={
                        line.status === "available" ? "default" : "secondary"
                      }
                    >
                      {line.status === "available"
                        ? "Available Now"
                        : "Pre-Order"}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${line.color} text-white text-sm font-semibold`}
                    >
                      <Icon className="w-4 h-4" />
                      {line.subtitle}
                    </div>

                    <h3 className="text-3xl font-bold text-white">
                      {line.name}
                    </h3>

                    <p className="text-sm text-gray-200 leading-relaxed">
                      {line.description}
                    </p>

                    <div className="text-xs text-gray-300 italic">
                      "{line.tagline}"
                    </div>

                    <div className="flex items-center gap-2 text-white font-semibold group-hover:gap-4 transition-all">
                      Explore {line.name}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="border-t border-border bg-muted/30">
        <div className="container py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold">
              Every Sip Funds Real Change
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                GRATIS isn't just premium hydration—it's a movement. We partner
                with verified NGOs worldwide, donating 100% of advertising
                revenue to fund diverse projects across human rights,
                environment, education, and community development.
              </p>
              <p>
                Infinitely recyclable aluminum bottles. Zero plastic waste.
                Complete transparency. Every euro tracked, every claim verified,
                every bottle making an impact.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button size="lg" variant="outline" asChild>
                <Link to="/tribe/accountability">See Our Impact Dashboard</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/tribe/transparency">View Financial Reports</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-border">
        <div className="container py-20">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Droplet className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Premium Quality</h3>
              <p className="text-muted-foreground">
                Natural spring water, premium ingredients, and rigorous quality
                standards. Taste the difference.
              </p>
            </div>

            <div className="text-center space-y-4 p-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Infinitely Recyclable</h3>
              <p className="text-muted-foreground">
                Aluminum bottles that can be recycled forever. Zero plastic,
                maximum sustainability.
              </p>
            </div>

            <div className="text-center space-y-4 p-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Global Impact</h3>
              <p className="text-muted-foreground">
                47 verified NGO partners across 23 countries. Your hydration
                funds their mission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="border-t border-border bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="container py-20 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start with hydration. Fund global change. Join the GRATIS movement
            today.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8">
              <Link to="/gratis/water">Shop W.A.T.E.R</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg px-8"
            >
              <Link to="/tribe">Learn Our Story</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
