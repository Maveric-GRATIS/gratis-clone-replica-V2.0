import { useState } from "react";
import { Rocket, Palette, Heart, Users, ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FUSponsorForm from "./FUSponsorForm";

const benefits = [
  {
    icon: Palette,
    title: "Custom Flavor",
    description: "Work with our team to create your unique taste combination",
  },
  {
    icon: Rocket,
    title: "Unique Design",
    description: "Exclusive bottle artwork featuring your brand or vision",
  },
  {
    icon: Heart,
    title: "Choose Impact",
    description: "Decide where 100% of profits are donated",
  },
  {
    icon: Users,
    title: "Limited Run",
    description: "Numbered editions from 100-500 units",
  },
];

export const FUSponsorCTA = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <section className="py-20 bg-gradient-to-br from-red-950/30 via-black to-purple-950/30 border-t border-gray-800">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge
              variant="outline"
              className="mb-4 border-primary text-primary"
            >
              <Rocket className="w-3 h-3 mr-1" />
              BECOME A SPONSOR
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4">
              CREATE YOUR OWN <span className="text-primary">F.U.</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Want to create a one-of-a-kind F.U. for your brand, team, or
              event? Let's collaborate on something truly unforgettable.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="group bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center hover:border-primary/50 hover:bg-gray-900 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>

          {/* Pricing Tiers */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 text-center">
              <h4 className="text-lg font-bold text-white mb-2">Starter</h4>
              <div className="text-3xl font-black text-primary mb-2">
                100 Units
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Perfect for exclusive events
              </p>
              <div className="text-lg font-bold text-white">From €1.499</div>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 border-2 border-primary rounded-xl p-6 text-center relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                POPULAR
              </Badge>
              <h4 className="text-lg font-bold text-white mb-2">Standard</h4>
              <div className="text-3xl font-black text-primary mb-2">
                300 Units
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Ideal for brand activations
              </p>
              <div className="text-lg font-bold text-white">From €3.999</div>
            </div>
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 text-center">
              <h4 className="text-lg font-bold text-white mb-2">Premium</h4>
              <div className="text-3xl font-black text-primary mb-2">
                500 Units
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Maximum collector impact
              </p>
              <div className="text-lg font-bold text-white">From €5.999</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="group">
                  Start Your F.U. Project
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    Create Your F.U. Collaboration
                  </DialogTitle>
                  <DialogDescription>
                    Tell us about your vision. We'll work together to create a
                    one-of-a-kind F.U. with your custom flavor, unique design,
                    and chosen impact cause.
                  </DialogDescription>
                </DialogHeader>
                <FUSponsorForm onSuccess={() => setIsFormOpen(false)} />
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="lg" className="group" asChild>
              <Link to="/partners">
                <Mail className="w-4 h-4 mr-2" />
                View All Partnership Options
              </Link>
            </Button>
          </div>

          {/* Trust Note */}
          <p className="text-center text-sm text-gray-500 mt-8">
            All F.U. sponsorships include full creative collaboration, impact
            reporting, and promotional support.
          </p>
        </div>
      </div>
    </section>
  );
};
