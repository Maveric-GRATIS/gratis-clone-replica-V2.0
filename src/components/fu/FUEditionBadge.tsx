import { Shield, Award, Users, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FUEditionBadgeProps {
  seriesNumber: number;
  editionSize: number;
  remainingUnits: number;
  collaborator?: string | null;
  isWinnerCreation?: boolean;
  impactProject?: string;
}

export const FUEditionBadge = ({
  seriesNumber,
  editionSize,
  remainingUnits,
  collaborator,
  isWinnerCreation,
  impactProject,
}: FUEditionBadgeProps) => {
  const soldUnits = editionSize - remainingUnits;
  const percentageSold = Math.round((soldUnits / editionSize) * 100);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700 rounded-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Authenticated Edition
          </span>
        </div>
        <Badge 
          variant="secondary" 
          className={`font-black ${
            isWinnerCreation 
              ? 'bg-yellow-500 text-black' 
              : collaborator 
                ? 'bg-purple-500 text-white'
                : 'bg-red-500 text-white'
          }`}
        >
          SERIES #{String(seriesNumber).padStart(2, '0')}
        </Badge>
      </div>

      {/* Edition Counter */}
      <div className="text-center py-3 border-y border-gray-700">
        <div className="text-3xl font-black text-foreground">
          {remainingUnits} <span className="text-muted-foreground">/ {editionSize}</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">Units Remaining</div>
        
        {/* Progress Bar */}
        <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
            style={{ width: `${percentageSold}%` }}
          />
        </div>
        <div className="text-[10px] text-muted-foreground mt-1">
          {percentageSold}% Claimed
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3">
        {collaborator && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="text-muted-foreground">Collab:</span>
            <span className="text-foreground font-medium">{collaborator}</span>
          </div>
        )}
        
        {isWinnerCreation && (
          <div className="flex items-center gap-2 text-sm col-span-2">
            <Award className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-medium">Golden Ticket Winner Creation</span>
          </div>
        )}
        
        {impactProject && (
          <div className="flex items-center gap-2 text-sm col-span-2">
            <Target className="w-4 h-4 text-green-400" />
            <span className="text-muted-foreground">Impact:</span>
            <span className="text-green-400 font-medium">{impactProject}</span>
          </div>
        )}
      </div>

      {/* Authentication Seal */}
      <div className="flex items-center justify-center gap-2 pt-2 border-t border-gray-700">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
          <span className="text-white font-black text-xs">F.U.</span>
        </div>
        <div className="text-[10px] text-muted-foreground">
          Verified Authentic • Numbered Edition • Fully Collectible
        </div>
      </div>
    </div>
  );
};
