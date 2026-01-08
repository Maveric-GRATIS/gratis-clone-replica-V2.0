import { Droplets, Recycle, Leaf, Heart } from 'lucide-react';

const features = [
  {
    icon: Droplets,
    title: 'Natural Source',
    description: 'Sourced from pristine natural springs',
  },
  {
    icon: Recycle,
    title: '100% Recyclable',
    description: 'Tetrapack packaging, fully recyclable',
  },
  {
    icon: Leaf,
    title: 'Zero Plastic',
    description: 'No plastic pollution, ever',
  },
  {
    icon: Heart,
    title: 'Funds Clean Water',
    description: 'Every purchase funds clean water access',
  },
];

export const WaterFeatures = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Why GRATIS Water?
      </h3>
      <ul className="space-y-3">
        {features.map((feature) => (
          <li key={feature.title} className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <feature.icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{feature.title}</p>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
