/**
 * BenefitShowcase Component
 *
 * Showcase TRIBE membership benefits with detailed cards
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Droplets,
  Vote,
  Calendar,
  Award,
  ShoppingBag,
  Gift,
} from "lucide-react";

interface BenefitCard {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  features: string[];
  color: string;
}

const benefits: BenefitCard[] = [
  {
    icon: Droplets,
    title: "Premium Water Bottles",
    description: "Free monthly water bottles delivered to your door",
    features: [
      "High-quality BPA-free bottles",
      "Multiple designs to choose from",
      "Carbon-neutral delivery",
      "Track your environmental impact",
    ],
    color: "text-blue-600",
  },
  {
    icon: Vote,
    title: "Democratic Giving",
    description: "Vote on which NGO projects receive funding",
    features: [
      "Quarterly voting periods",
      "Direct impact on fund allocation",
      "Detailed project proposals",
      "See voting results in real-time",
    ],
    color: "text-purple-600",
  },
  {
    icon: Calendar,
    title: "Exclusive Events",
    description: "Access to member-only events and experiences",
    features: [
      "Impact site visits",
      "Founder meetups",
      "Annual TRIBE summit",
      "Virtual Q&A sessions",
    ],
    color: "text-green-600",
  },
  {
    icon: Award,
    title: "Impact Recognition",
    description: "Get recognized for your contribution to the movement",
    features: [
      "Member profile badge",
      "Impact dashboard",
      "Shareable impact cards",
      "Founder wall (Founder tier)",
    ],
    color: "text-orange-600",
  },
  {
    icon: ShoppingBag,
    title: "Exclusive Merchandise",
    description: "Limited-edition GRATIS apparel and accessories",
    features: [
      "Member-only designs",
      "Sustainable materials",
      "Exclusive discounts (10-20%)",
      "Pre-launch access",
    ],
    color: "text-pink-600",
  },
  {
    icon: Gift,
    title: "Partner Perks",
    description: "Special offers from our impact partners",
    features: [
      "NGO partner discounts",
      "Sustainable brand deals",
      "Eco-friendly services",
      "Travel discounts to impact sites",
    ],
    color: "text-indigo-600",
  },
];

export function BenefitShowcase() {
  return (
    <section className="py-16 bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container max-w-6xl">
        <div className="text-center mb-12">
          <Badge className="mb-4">Member Benefits</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            More Than Just Membership
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            TRIBE members get exclusive access to benefits that amplify their
            impact and connect them with our global community
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <Card
                key={benefit.title}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Icon className={`h-6 w-6 ${benefit.color}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {benefit.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {benefit.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <div className="mt-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
