import { Building2, Users, Gift, Truck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const benefits = [
  {
    icon: Building2,
    title: "Custom Branding",
    description: "Your logo on every can for corporate events and hospitality",
  },
  {
    icon: Users,
    title: "Employee Wellness",
    description: "Healthy hydration programs for your team",
  },
  {
    icon: Gift,
    title: "VIP Packages",
    description: "Exclusive golden ticket odds for partner orders",
  },
  {
    icon: Truck,
    title: "Direct Delivery",
    description: "Scheduled deliveries to your office or venue",
  },
];

export default function TheurgyB2BCTA() {
  return (
    <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 border-y border-border">
      <div className="container">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-primary/20 text-primary text-sm font-bold rounded-full mb-4">
            B2B PARTNERSHIPS
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            PARTNER WITH GRATIS
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Premium flavored sparkling water for hotels, restaurants, corporate offices, 
            and events. Custom branding available for orders of 500+ units.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg px-8">
            <Link to="/partners">
              Become a Partner
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8">
            <Link to="/contact">
              Request Quote
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
