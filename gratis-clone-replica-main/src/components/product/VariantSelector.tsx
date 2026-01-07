import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface VariantSelectorProps {
  label: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string) => void;
  type?: 'size' | 'color' | 'material';
  disabled?: string[];
}

export const VariantSelector = ({
  label,
  options,
  selected,
  onSelect,
  type = 'size',
  disabled = [],
}: VariantSelectorProps) => {
  if (!options || options.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        {selected && (
          <span className="text-sm text-muted-foreground">
            {type === 'color' ? 'Color:' : 'Selected:'} {selected}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected === option;
          const isDisabled = disabled.includes(option);

          if (type === 'color') {
            return (
              <button
                key={option}
                onClick={() => !isDisabled && onSelect(option)}
                disabled={isDisabled}
                className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/20 scale-110'
                    : 'border-muted hover:border-muted-foreground'
                } ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                style={{ backgroundColor: option.toLowerCase() }}
                title={option}
              >
                {isDisabled && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-destructive rotate-45" />
                  </div>
                )}
              </button>
            );
          }

          return (
            <Button
              key={option}
              variant={isSelected ? 'default' : 'outline'}
              onClick={() => !isDisabled && onSelect(option)}
              disabled={isDisabled}
              className={`min-w-[60px] ${isDisabled ? 'opacity-50' : ''}`}
            >
              {option}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
