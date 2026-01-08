import { Badge } from '@/components/ui/badge';
import { Sparkles, Globe, Users } from 'lucide-react';

interface SeriesBadgeProps {
  seriesName?: string;
  seriesCountry?: string;
  seriesMilestone?: number;
  partnershipBrand?: string;
}

export const SeriesBadge = ({ 
  seriesName, 
  seriesCountry, 
  seriesMilestone, 
  partnershipBrand 
}: SeriesBadgeProps) => {
  if (!seriesName && !seriesCountry) return null;

  return (
    <div className="space-y-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
        <span className="text-sm font-bold uppercase tracking-widest text-primary">
          Limited Edition
        </span>
      </div>
      
      <div className="space-y-2">
        {seriesName && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
              {seriesName}
            </Badge>
          </div>
        )}
        
        {seriesCountry && (
          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{seriesCountry} Edition</span>
          </div>
        )}
        
        {seriesMilestone && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              Series #{Math.floor(seriesMilestone / 100000) + 1} • 
              <span className="text-primary font-bold"> {seriesMilestone.toLocaleString()}</span> produced
            </span>
          </div>
        )}
        
        {partnershipBrand && (
          <div className="mt-3 pt-3 border-t border-primary/20">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">In partnership with</p>
            <p className="text-sm font-bold mt-1">{partnershipBrand}</p>
          </div>
        )}
      </div>
    </div>
  );
};
