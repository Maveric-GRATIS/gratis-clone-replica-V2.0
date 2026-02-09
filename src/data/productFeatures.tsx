import { CheckCircle, Recycle, Heart, Leaf, Flame, Palette } from "lucide-react";
import { Feature } from "@/components/ProductFeatures";

export const waterFeatures: Feature[] = [
  {
    icon: <CheckCircle className="w-8 h-8" />,
    title: "Pure Mountain Source",
    description:
      "Sourced from pristine mountain aquifers, naturally filtered through ancient rock formations.",
    stat: "100%",
  },
  {
    icon: <Recycle className="w-8 h-8" />,
    title: "Sustainable Packaging",
    description:
      "100% recyclable tetrapacks with 50% less carbon footprint than plastic bottles.",
    stat: "50%",
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Social Impact",
    description:
      "Every purchase provides 1 day of clean drinking water to communities in need.",
    stat: "1 Day",
  },
  {
    icon: <Leaf className="w-8 h-8" />,
    title: "Zero Waste",
    description: "Renewable energy production and plastic-free supply chain.",
    stat: "0",
  },
];

export const theurgySparks: Feature[] = [
  {
    icon: <CheckCircle className="w-8 h-8" />,
    title: "Real Fruit Flavors",
    description:
      "Authentic citrus, hibiscus, and dragonfruit - no artificial anything.",
    stat: "100%",
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Cultural Inspiration",
    description:
      "Each flavor celebrates global traditions and cultural rituals.",
    stat: "∞",
  },
  {
    icon: <Leaf className="w-8 h-8" />,
    title: "Art & Music Support",
    description:
      "5% of sales fund creative programs in underserved communities.",
    stat: "5%",
  },
  {
    icon: <Recycle className="w-8 h-8" />,
    title: "Sparkling Perfection",
    description: "Perfect carbonation that enhances every natural flavor note.",
    stat: "Perfect",
  },
];

export const fuFeatures: Feature[] = [
  {
    icon: <Flame className="w-8 h-8" />,
    title: "Extreme Flavors",
    description:
      "Spicy lime, frozen mint, mystery drops. Flavors that challenge convention and aren't for the faint of heart.",
    stat: "10+",
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: "Artist Collaborations",
    description:
      "Limited designs from renowned street artists. Each bottle is a canvas, every edition is collectible.",
    stat: "500",
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Youth Empowerment",
    description:
      "Runs art workshops for at-risk youth. Each bottle purchase funds creative mentorship.",
    stat: "1.000+",
  },
  {
    icon: <Recycle className="w-8 h-8" />,
    title: "Experimental Sustainability",
    description:
      "Pushing boundaries: biodegradable packaging, carbon-negative shipping.",
    stat: "120%",
  },
];
