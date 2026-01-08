import { Check } from "lucide-react";

interface TheurgyFlavor {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  color: string;
  country: string;
}

interface TheurgyFlavorGridProps {
  flavors: TheurgyFlavor[];
  selected: string | null;
  onSelect: (id: string) => void;
}

export default function TheurgyFlavorGrid({ flavors, selected, onSelect }: TheurgyFlavorGridProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Select Flavor
      </label>
      <div className="grid grid-cols-2 gap-3">
        {flavors.map((flavor) => {
          const isSelected = selected === flavor.id;
          return (
            <button
              key={flavor.id}
              onClick={() => onSelect(flavor.id)}
              className={`relative group overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                isSelected
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {/* Image */}
              <div className="aspect-square relative">
                <img
                  src={flavor.image}
                  alt={flavor.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                />
                
                {/* Color accent bar */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1"
                  style={{ backgroundColor: flavor.color }}
                />
                
                {/* Selected checkmark */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                
                {/* Country badge */}
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-xs text-white/80">
                  {flavor.country}
                </div>
              </div>
              
              {/* Text content */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                <h4 className="font-bold text-white text-sm leading-tight">
                  {flavor.name}
                </h4>
                <p className="text-white/70 text-xs mt-0.5">
                  {flavor.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
