/**
 * TribeLiveStats Component
 *
 * Display live membership statistics
 */

import { Card, CardContent } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Users, DollarSign, Building2, Globe2 } from "lucide-react";

interface Stat {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const stats: Stat[] = [
  {
    label: "Active Members",
    value: 50000,
    suffix: "+",
    icon: Users,
    color: "text-blue-600",
  },
  {
    label: "Total Donated",
    value: 2.1,
    prefix: "€",
    suffix: "M",
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    label: "NGO Partners",
    value: 127,
    icon: Building2,
    color: "text-purple-600",
  },
  {
    label: "Countries Reached",
    value: 23,
    icon: Globe2,
    color: "text-orange-600",
  },
];

export function TribeLiveStats() {
  return (
    <section className="py-12 border-y bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
      <div className="container max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="border-0 shadow-none bg-transparent"
              >
                <CardContent className="p-6 text-center space-y-2">
                  <div className="flex justify-center">
                    <div className="p-3 rounded-full bg-background border">
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                  <div
                    className={`text-3xl md:text-4xl font-bold ${stat.color}`}
                  >
                    {stat.prefix}
                    <AnimatedCounter
                      end={stat.value}
                      duration={2000}
                      decimals={stat.value < 10 ? 1 : 0}
                    />
                    {stat.suffix}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
