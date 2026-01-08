import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Ticket, Sparkles, Gift } from 'lucide-react';
import { GoldenTicketClaim } from './GoldenTicketClaim';

export const GoldenTicketBanner = () => {
  const [showClaimModal, setShowClaimModal] = useState(false);

  return (
    <>
      <div className="relative overflow-hidden rounded-xl border-2 border-yellow-500/50 bg-gradient-to-r from-yellow-500/10 via-yellow-400/5 to-yellow-500/10 p-6">
        {/* Animated sparkle background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-4 top-1/2 h-24 w-24 animate-pulse rounded-full bg-yellow-400/10 blur-xl" />
          <div className="absolute -right-4 top-1/4 h-20 w-20 animate-pulse rounded-full bg-yellow-500/10 blur-xl" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/30">
              <Ticket className="h-7 w-7 text-yellow-950" />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-yellow-400">Golden Ticket Hunt</h3>
                <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
              </div>
              <p className="text-sm text-muted-foreground">
                Every <span className="font-bold text-foreground">100K Series</span> has ONE golden ticket hidden under the cap. 
                Find it and claim exclusive prizes!
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Gift className="h-4 w-4 text-yellow-500" />
                <span className="text-xs font-medium text-yellow-400/80">
                  Prizes include VIP experiences, merchandise, and more!
                </span>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowClaimModal(true)}
            className="shrink-0 bg-gradient-to-r from-yellow-500 to-yellow-600 text-yellow-950 hover:from-yellow-400 hover:to-yellow-500 shadow-lg shadow-yellow-500/30"
          >
            <Ticket className="mr-2 h-4 w-4" />
            Claim Prize
          </Button>
        </div>
      </div>

      <GoldenTicketClaim 
        open={showClaimModal} 
        onOpenChange={setShowClaimModal} 
      />
    </>
  );
};
