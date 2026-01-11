
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Ticket, Loader2, CheckCircle, XCircle, PartyPopper } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { functions } from '@/firebase';
import { httpsCallable } from 'firebase/functions';

interface GoldenTicketClaimProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GoldenTicketClaim = ({ open, onOpenChange }: GoldenTicketClaimProps) => {
  const { user } = useAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    prize?: { title: string; description: string; value: string; type: string };
    error?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to claim your prize');
      return;
    }

    if (!code.trim()) {
      toast.error('Please enter a code');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const claimPrizeCallable = httpsCallable(functions, 'claimPrize');
      const response = await claimPrizeCallable({ code: code.trim().toUpperCase() });
      const data = response.data as { 
        success: boolean; 
        prize?: { title: string; description: string; value: string; type: string; }; 
        error?: string; 
      };

      if (data.success && data.prize) {
        setResult({
          success: true,
          prize: data.prize,
        });
        toast.success('Congratulations! You won a prize!');
      } else {
        setResult({ success: false, error: data.error || 'Invalid or already claimed code' });
      }
    } catch (error: any) {
      console.error('Error claiming prize:', error);
      setResult({ success: false, error: error.message || 'An error occurred while claiming the prize.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCode('');
    setResult(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-yellow-500" />
            Claim Your Golden Ticket
          </DialogTitle>
          <DialogDescription>
            Enter the code found under your bottle cap to claim your prize.
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Prize Code</Label>
              <Input
                id="code"
                placeholder="Enter your code (e.g., GOLD-XXXX-XXXX)"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="font-mono text-center text-lg tracking-widest"
                maxLength={20}
              />
            </div>

            {!user && (
              <p className="text-sm text-destructive">
                You must be signed in to claim a prize.
              </p>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-yellow-950 hover:from-yellow-400 hover:to-yellow-500"
              disabled={loading || !user}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <Ticket className="mr-2 h-4 w-4" />
                  Claim Prize
                </>
              )}
            </Button>
          </form>
        ) : result.success && result.prize ? (
          <div className="space-y-4 text-center py-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center animate-bounce">
                <PartyPopper className="h-8 w-8 text-yellow-950" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-yellow-400">{result.prize.title}</h3>
              <p className="text-muted-foreground mt-2">{result.prize.description}</p>
              {result.prize.value && (
                <p className="mt-2 text-sm font-medium">Value: {result.prize.value}</p>
              )}
            </div>
            <Button onClick={handleClose} className="w-full">
              <CheckCircle className="mr-2 h-4 w-4" />
              Awesome!
            </Button>
          </div>
        ) : (
          <div className="space-y-4 text-center py-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-destructive/20 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold">Code Not Valid</h3>
              <p className="text-muted-foreground mt-2">{result.error}</p>
            </div>
            <Button onClick={() => setResult(null)} variant="outline" className="w-full">
              Try Again
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
