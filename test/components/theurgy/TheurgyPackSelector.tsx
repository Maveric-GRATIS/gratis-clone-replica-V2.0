import { Package, Percent } from "lucide-react";

interface PackOption {
  value: string;
  label: string;
  price: number;
  savings: number;
  description?: string;
}

interface TheurgyPackSelectorProps {
  packs: PackOption[];
  selected: string;
  onSelect: (value: string) => void;
}

export default function TheurgyPackSelector({ packs, selected, onSelect }: TheurgyPackSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <Package className="w-4 h-4" />
        Pack Size
        <span className="text-xs text-primary">(Min. 6-Pack)</span>
      </label>
      <div className="grid grid-cols-3 gap-2">
        {packs.map((pack) => {
          const isSelected = selected === pack.value;
          return (
            <button
              key={pack.value}
              onClick={() => onSelect(pack.value)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50 bg-card"
              }`}
            >
              {/* Savings badge */}
              {pack.savings > 0 && (
                <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-0.5">
                  <Percent className="w-3 h-3" />
                  {pack.savings}% OFF
                </div>
              )}
              
              <div className="font-bold text-foreground">
                {pack.label}
              </div>
              <div className="text-lg font-black text-primary mt-1">
                €{pack.price.toFixed(2)}
              </div>
              {pack.description && (
                <div className="text-xs text-muted-foreground mt-1">
                  {pack.description}
                </div>
              )}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground text-center">
        B2B minimum order: 6-Pack • Bulk discounts available for 50+ packs
      </p>
    </div>
  );
}
