import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Droplet, Users, Heart, Waves } from "lucide-react";

interface CryptoPrice {
  eur: number;
}

export const CryptoCalculator = () => {
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");
  const [cryptoAmount, setCryptoAmount] = useState("0.01");
  const [eurValue, setEurValue] = useState(0);
  const [cryptoPrices, setCryptoPrices] = useState<Record<string, number>>({
    bitcoin: 80000,
    ethereum: 3000,
    tether: 0.92
  });

  useEffect(() => {
    // Fetch live crypto prices from CoinGecko (free, no API key needed)
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=eur'
        );
        const data = await response.json();
        setCryptoPrices({
          bitcoin: data.bitcoin?.eur || 80000,
          ethereum: data.ethereum?.eur || 3000,
          tether: data.tether?.eur || 0.92
        });
      } catch (error) {
        console.error('Error fetching crypto prices:', error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const amount = parseFloat(cryptoAmount) || 0;
    const price = cryptoPrices[selectedCrypto] || 0;
    setEurValue(amount * price);
  }, [cryptoAmount, selectedCrypto, cryptoPrices]);

  const calculateImpact = (eur: number) => {
    return {
      bottles: Math.floor(eur * 2),
      families: Math.floor(eur / 10),
      liters: Math.floor(eur * 1.5),
      ngos: Math.floor(eur / 100)
    };
  };

  const impact = calculateImpact(eurValue);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crypto Impact Calculator</CardTitle>
        <CardDescription>See the real-world impact of your cryptocurrency donation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="crypto-select">Select Cryptocurrency</Label>
              <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                <SelectTrigger id="crypto-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                  <SelectItem value="tether">Tether (USDT)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="crypto-amount">Amount</Label>
              <Input
                id="crypto-amount"
                type="number"
                step="0.001"
                min="0"
                value={cryptoAmount}
                onChange={(e) => setCryptoAmount(e.target.value)}
                placeholder="0.01"
              />
            </div>

            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="text-sm text-muted-foreground mb-1">EUR Equivalent</div>
              <div className="text-3xl font-bold text-primary">
                €{eurValue.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Live rate: 1 {selectedCrypto.toUpperCase()} = €{cryptoPrices[selectedCrypto]?.toLocaleString('nl-NL')}
              </div>
            </div>
          </div>

          {/* Impact Visualization */}
          <div className="space-y-4">
            <div className="text-sm font-semibold text-muted-foreground mb-3">Your Impact</div>
            
            <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg border border-accent/20">
              <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Droplet className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold">{impact.bottles.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Bottles Provided</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[hsl(var(--brand-blue))]/10 rounded-lg border border-[hsl(var(--brand-blue))]/20">
              <div className="h-10 w-10 rounded-full bg-[hsl(var(--brand-blue))]/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-[hsl(var(--brand-blue))]" />
              </div>
              <div>
                <div className="text-2xl font-bold">{impact.families.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Families Supported</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Waves className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{impact.liters.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Liters of Clean Water</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[hsl(var(--brand-orange))]/10 rounded-lg border border-[hsl(var(--brand-orange))]/20">
              <div className="h-10 w-10 rounded-full bg-[hsl(var(--brand-orange))]/20 flex items-center justify-center">
                <Heart className="h-5 w-5 text-[hsl(var(--brand-orange))]" />
              </div>
              <div>
                <div className="text-2xl font-bold">{impact.ngos}</div>
                <div className="text-xs text-muted-foreground">NGO Partners Funded</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
