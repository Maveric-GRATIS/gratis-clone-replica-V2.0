import SEO from "@/components/SEO";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bitcoin, Phone, Mail, Download, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { CryptoCalculator } from "@/components/spark/CryptoCalculator";
import { toast } from "sonner";

const CryptoWallets = {
  BTC: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  ETH: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4",
  USDT: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4"
};

export default function Donate() {
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null);

  const copyToClipboard = (address: string, coin: string) => {
    navigator.clipboard.writeText(address);
    setCopiedWallet(coin);
    toast.success(`${coin} wallet address copied!`);
    setTimeout(() => setCopiedWallet(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Alternative Donation Methods — GRATIS SPARK" 
        description="Support GRATIS with cryptocurrency, phone, or mail donations. Every contribution funds clean water, art programs, and education initiatives through our NGO partners."
        canonical={typeof window !== 'undefined' ? window.location.href : '/spark/donate'} 
      />
      
      {/* Hero Section */}
      <section className="relative py-16 px-4 overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            ALTERNATIVE WAYS TO GIVE
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Support GRATIS through crypto, phone, or mail donations. Every contribution powers free water distribution and funds verified NGO partners.
          </p>
          
          {/* Impact Stats */}
          <div className="flex flex-wrap justify-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">€127K+</div>
              <div className="text-sm text-muted-foreground">Total Donations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">254K</div>
              <div className="text-sm text-muted-foreground">Bottles Provided</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[hsl(var(--brand-blue))]">89</div>
              <div className="text-sm text-muted-foreground">NGO Partners Funded</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="container py-12 max-w-6xl">
        <Tabs defaultValue="crypto" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="crypto" className="gap-2">
              <Bitcoin className="h-4 w-4" />
              Crypto
            </TabsTrigger>
            <TabsTrigger value="phone" className="gap-2">
              <Phone className="h-4 w-4" />
              Phone
            </TabsTrigger>
            <TabsTrigger value="mail" className="gap-2">
              <Mail className="h-4 w-4" />
              Mail
            </TabsTrigger>
          </TabsList>

          {/* CRYPTO TAB */}
          <TabsContent value="crypto" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">Donate with Cryptocurrency</CardTitle>
                <CardDescription className="text-base">
                  Bitcoin, Ethereum, and major cryptocurrencies accepted. Tax-deductible donations that fund water, art, and education.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Top 3% Financial Transparency</Badge>
                  <Badge variant="secondary">100% to NGO Partners</Badge>
                  <Badge variant="secondary">Dutch ANBI Tax-Deductible</Badge>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground">
                    When you donate bitcoin or crypto to GRATIS, you invest in an NGO that ranks in the top 3% of charities for financial responsibility, transparency, and accountability. Your crypto donation directly funds verified NGO partners working on clean water access, youth art programs, and educational initiatives.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Calculator */}
            <CryptoCalculator />

            {/* How to Donate */}
            <Card>
              <CardHeader>
                <CardTitle>How to Donate Crypto — 3 Simple Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">1</div>
                    <h3 className="font-semibold text-lg">Select Coin & Amount</h3>
                    <p className="text-sm text-muted-foreground">Choose from Bitcoin (BTC), Ethereum (ETH), or USDT</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xl">2</div>
                    <h3 className="font-semibold text-lg">Copy Wallet Address</h3>
                    <p className="text-sm text-muted-foreground">Use the addresses below for your chosen cryptocurrency</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-12 w-12 rounded-full bg-[hsl(var(--brand-blue))]/10 flex items-center justify-center text-[hsl(var(--brand-blue))] font-bold text-xl">3</div>
                    <h3 className="font-semibold text-lg">Send & Confirm</h3>
                    <p className="text-sm text-muted-foreground">Complete transfer from your wallet and receive confirmation</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wallet Addresses */}
            <Card>
              <CardHeader>
                <CardTitle>Cryptocurrency Wallet Addresses</CardTitle>
                <CardDescription>Send your donation to the appropriate wallet address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(CryptoWallets).map(([coin, address]) => (
                  <div key={coin} className="p-4 bg-muted/50 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-lg">{coin}</div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(address, coin)}
                      >
                        {copiedWallet === coin ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                    <code className="text-xs text-muted-foreground break-all block">{address}</code>
                  </div>
                ))}
                
                <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Tax & Security:</strong> 100% tax-deductible under Dutch ANBI tax-exempt status. Secure blockchain transactions with instant confirmation. Receipt provided for all donations over €50.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PHONE TAB */}
          <TabsContent value="phone" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">Give by Phone</CardTitle>
                <CardDescription className="text-base">
                  Speak directly with our donation team. Available Monday-Friday, 9:00-17:00 CET.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Phone Number</h3>
                      <a href="tel:+31201234567" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
                        +31 (0)20 123-4567
                      </a>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Hours</h3>
                      <p className="text-muted-foreground">Monday - Friday<br/>9:00 AM - 5:00 PM CET</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Languages</h3>
                      <p className="text-muted-foreground">Dutch, English, German, French</p>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-6 rounded-lg space-y-3">
                    <h3 className="font-semibold">Our donation specialists can help you:</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Process one-time or recurring donations</li>
                      <li>• Set up wire transfers for large gifts</li>
                      <li>• Discuss corporate partnership opportunities</li>
                      <li>• Answer questions about impact and programs</li>
                      <li>• Arrange memorial or honor gifts</li>
                      <li>• Provide tax documentation assistance</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wire Transfer Information</CardTitle>
                <CardDescription>For large donations (€1,000+)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 p-6 rounded-lg space-y-3 font-mono text-sm">
                  <div><span className="text-muted-foreground">Bank:</span> <span className="font-semibold">ING Bank Amsterdam</span></div>
                  <div><span className="text-muted-foreground">Account Name:</span> <span className="font-semibold">Stichting GRATIS Amsterdam</span></div>
                  <div><span className="text-muted-foreground">IBAN:</span> <span className="font-semibold">NL XX INGB XXXX XXXX XX</span></div>
                  <div><span className="text-muted-foreground">BIC/SWIFT:</span> <span className="font-semibold">INGBNL2A</span></div>
                  <div><span className="text-muted-foreground">Reference:</span> <span className="font-semibold">[Your Name] - Donation</span></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  For wire transfers over €1,000, please call +31 (0)20 123-4567. Include your name and "Donation" in the reference field. Tax receipt will be sent within 5 business days.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold">Every €1 = 2 Bottles</div>
                  <p className="text-muted-foreground">Your phone donation provides free water to communities in need</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MAIL TAB */}
          <TabsContent value="mail" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">Give by Mail</CardTitle>
                <CardDescription className="text-base">
                  Send your donation via post. We accept checks, money orders, and international bank drafts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">1</div>
                    <h3 className="font-semibold text-lg">Download Form</h3>
                    <p className="text-sm text-muted-foreground">Complete our mail-in donation form</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xl">2</div>
                    <h3 className="font-semibold text-lg">Make Payment</h3>
                    <p className="text-sm text-muted-foreground">Check, money order, or bank draft</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-12 w-12 rounded-full bg-[hsl(var(--brand-blue))]/10 flex items-center justify-center text-[hsl(var(--brand-blue))] font-bold text-xl">3</div>
                    <h3 className="font-semibold text-lg">Mail to Us</h3>
                    <p className="text-sm text-muted-foreground">Send to our Amsterdam address</p>
                  </div>
                </div>

                <Button className="w-full md:w-auto" variant="outline" size="lg">
                  <Download className="mr-2 h-4 w-4" />
                  Download Mail-In Donation Form (PDF)
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mailing Address</CardTitle>
                <CardDescription>Make checks payable to: Stichting GRATIS Amsterdam</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-6 rounded-lg">
                  <div className="font-semibold text-lg mb-2">Mail Your Donation To:</div>
                  <address className="not-italic text-muted-foreground space-y-1">
                    <div className="font-semibold text-foreground">GRATIS Foundation</div>
                    <div>Donations Department</div>
                    <div>P.O. Box 12345</div>
                    <div>1000 AA Amsterdam</div>
                    <div>The Netherlands</div>
                  </address>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Processing Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div>• Mail donations processed within 7-10 business days</div>
                  <div>• Tax receipt sent within 14 days to provided address</div>
                  <div>• Questions? Call +31 (0)20 123-4567</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>International Donors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div>• Use international money order or bank draft in EUR</div>
                  <div>• Convert to EUR at time of sending</div>
                  <div>• IBAN available for international bank drafts</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Mailing Preferences</CardTitle>
                <CardDescription>Prefer less mail from GRATIS?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Update your preferences to receive email-only communications:
                </p>
                <div className="flex flex-wrap gap-3 text-sm">
                  <div>📞 <a href="tel:+31201234567" className="text-primary hover:text-primary/80">+31 (0)20 123-4567</a></div>
                  <div>✉️ <a href="mailto:donate@gratis.ngo" className="text-primary hover:text-primary/80">donate@gratis.ngo</a></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
