import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SizeOption {
  value: string;
  label: string;
  price?: number;
}

interface SizePackSelectorProps {
  label: string;
  options: SizeOption[];
  selected: string | null;
  onSelect: (value: string) => void;
}

export const SizePackSelector = ({ label, options, selected, onSelect }: SizePackSelectorProps) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={selected === option.value ? 'default' : 'outline'}
            onClick={() => onSelect(option.value)}
            className={cn(
              'min-w-[80px] transition-all',
              selected === option.value && 'ring-2 ring-primary/30'
            )}
          >
            <span>{option.label}</span>
            {option.price && (
              <span className="ml-1 text-xs text-muted-foreground">
                €{option.price.toFixed(2)}
              </span>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};
