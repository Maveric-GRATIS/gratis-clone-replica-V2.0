import { Check, Flame, Snowflake, Sparkles, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FUFlavor {
  id: string;
  name: string;
  subtitle: string;
  seriesNumber: number;
  editionSize: number;
  remainingUnits: number;
  price: number;
  image: string;
  description: string;
  collaborator: string | null;
  isWinnerCreation: boolean;
}

interface FUFlavorGridProps {
  flavors: FUFlavor[];
  selected: string | null;
  onSelect: (id: string) => void;
}

const getFlavorIcon = (id: string) => {
  switch (id) {
    case 'inferno':
      return <Flame className="w-4 h-4" />;
    case 'ice-storm':
      return <Snowflake className="w-4 h-4" />;
    case 'rebel-drop':
      return <Sparkles className="w-4 h-4" />;
    case 'winners-choice':
      return <Trophy className="w-4 h-4" />;
    default:
      return <Flame className="w-4 h-4" />;
  }
};

const getFlavorColor = (id: string) => {
  switch (id) {
    case 'inferno':
      return 'border-red-500 bg-red-500/20';
    case 'ice-storm':
      return 'border-blue-500 bg-blue-500/20';
    case 'rebel-drop':
      return 'border-purple-500 bg-purple-500/20';
    case 'winners-choice':
      return 'border-yellow-500 bg-yellow-500/20';
    default:
      return 'border-primary bg-primary/20';
  }
};

export const FUFlavorGrid = ({ flavors, selected, onSelect }: FUFlavorGridProps) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Select Series
      </label>
      <div className="grid grid-cols-2 gap-3">
        {flavors.map((flavor) => {
          const isSelected = selected === flavor.id;
          const soldOut = flavor.remainingUnits === 0;
          
          return (
            <button
              key={flavor.id}
              onClick={() => !soldOut && onSelect(flavor.id)}
              disabled={soldOut}
              className={`relative group rounded-xl border-2 p-3 text-left transition-all duration-300 ${
                isSelected
                  ? `${getFlavorColor(flavor.id)} ring-2 ring-offset-2 ring-offset-background`
                  : 'border-border bg-card hover:border-muted-foreground/50'
              } ${soldOut ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {/* Series Badge */}
              <div className="absolute -top-2 -right-2 z-10">
                <Badge 
                  variant="secondary" 
                  className={`text-[10px] font-bold ${
                    flavor.isWinnerCreation 
                      ? 'bg-yellow-500 text-black' 
                      : flavor.collaborator 
                        ? 'bg-purple-500 text-white'
                        : 'bg-red-500 text-white'
                  }`}
                >
                  #{String(flavor.seriesNumber).padStart(2, '0')}
                </Badge>
              </div>

              {/* Image */}
              <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-muted">
                <img
                  src={flavor.image}
                  alt={flavor.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {getFlavorIcon(flavor.id)}
                  <h4 className="font-black text-sm text-foreground">{flavor.name}</h4>
                </div>
                <p className="text-xs text-muted-foreground">{flavor.subtitle}</p>
                
                {/* Edition Info */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <span className="text-[10px] text-muted-foreground">
                    {soldOut ? 'SOLD OUT' : `${flavor.remainingUnits}/${flavor.editionSize}`}
                  </span>
                  <span className="text-xs font-bold text-primary">€{flavor.price}</span>
                </div>

                {/* Collaborator Badge */}
                {flavor.collaborator && (
                  <Badge variant="outline" className="text-[10px] mt-1">
                    × {flavor.collaborator}
                  </Badge>
                )}
                {flavor.isWinnerCreation && (
                  <Badge variant="outline" className="text-[10px] mt-1 border-yellow-500 text-yellow-500">
                    🏆 Winner Creation
                  </Badge>
                )}
              </div>

              {/* Selected Checkmark */}
              {isSelected && (
                <div className="absolute top-3 left-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
