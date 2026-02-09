import SEO from "@/components/SEO";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Bitcoin,
  Phone,
  Mail,
  Download,
  Copy,
  CheckCircle2,
  CreditCard,
  Droplets,
  Heart,
  Users,
  AlertCircle,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { CryptoCalculator } from "@/components/spark/CryptoCalculator";
import { toast } from "sonner";

const CryptoWallets = {
  BTC: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  ETH: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4",
  USDT: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4",
};

export default function Donate() {
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null);
  const [donationAmount, setDonationAmount] = useState<string>("25");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [donorName, setDonorName] = useState<string>("");
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [recognition, setRecognition] = useState<string>("anonymous");
  const [newsletter, setNewsletter] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const copyToClipboard = (address: string, coin: string) => {
    navigator.clipboard.writeText(address);
    setCopiedWallet(coin);
    toast.success(`${coin} wallet address copied!`);
    setTimeout(() => setCopiedWallet(null), 2000);
  };

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const amount =
        donationAmount === "custom"
          ? parseFloat(customAmount)
          : parseFloat(donationAmount);

      if (isNaN(amount) || amount < 5) {
        toast.error("Minimum donation amount is €5");
        setIsSubmitting(false);
        return;
      }

      // Simulate Stripe payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: Integrate actual Stripe payment
      toast.success(
        `Thank you for your €${amount} donation! Receipt sent to ${donorEmail}`,
      );

      // Reset form
      setDonationAmount("25");
      setCustomAmount("");
      setDonorName("");
      setDonorEmail("");
      setRecognition("anonymous");
      setNewsletter(false);
    } catch (error) {
      toast.error("Payment failed. Please try again or contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateImpact = () => {
    const amount =
      donationAmount === "custom"
        ? parseFloat(customAmount) || 0
        : parseFloat(donationAmount);
    return {
      bottles: Math.floor(amount * 2),
      water: Math.floor(amount * 0.4),
      arts: Math.floor(amount * 0.3),
      education: Math.floor(amount * 0.3),
    };
  };

  const impact = calculateImpact();

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Alternative Donation Methods — GRATIS SPARK"
        description="Support GRATIS with cryptocurrency, phone, or mail donations. Every contribution funds clean water, art programs, and education initiatives through our NGO partners."
        canonical={
          typeof window !== "undefined" ? window.location.href : "/spark/donate"
        }
      />

      {/* Hero Section */}
      <section className="relative py-16 px-4 overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            ALTERNATIVE WAYS TO GIVE
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Support GRATIS through crypto, phone, or mail donations. Every
            contribution powers free water distribution and funds verified NGO
            partners.
          </p>

          {/* Impact Stats */}
          <div className="flex flex-wrap justify-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">€127K+</div>
              <div className="text-sm text-muted-foreground">
                Total Donations
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">254K</div>
              <div className="text-sm text-muted-foreground">
                Bottles Provided
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[hsl(var(--brand-blue))]">
                89
              </div>
              <div className="text-sm text-muted-foreground">
                NGO Partners Funded
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="container py-12 max-w-6xl">
        <Tabs defaultValue="online" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="online" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Online
            </TabsTrigger>
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

          {/* ONLINE DONATION TAB */}
          <TabsContent value="online" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">
                  Make a One-Time Donation
                </CardTitle>
                <CardDescription className="text-base">
                  Support GRATIS with a secure online donation. 100%
                  tax-deductible (ANBI status).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Dutch ANBI Tax-Deductible</Badge>
                  <Badge variant="secondary">100% to NGO Partners</Badge>
                  <Badge variant="secondary">Secure Stripe Payments</Badge>
                  <Badge variant="secondary">Instant Receipt</Badge>
                </div>

                <form onSubmit={handleDonationSubmit} className="space-y-6">
                  {/* Amount Selection */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">
                      Select Amount
                    </Label>
                    <RadioGroup
                      value={donationAmount}
                      onValueChange={setDonationAmount}
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {["10", "25", "50", "100"].map((amount) => (
                          <div key={amount} className="relative">
                            <RadioGroupItem
                              value={amount}
                              id={`amount-${amount}`}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={`amount-${amount}`}
                              className="flex items-center justify-center h-16 rounded-lg border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                            >
                              <span className="text-xl font-bold">
                                €{amount}
                              </span>
                            </Label>
                          </div>
                        ))}
                      </div>
                      <div className="relative">
                        <RadioGroupItem
                          value="custom"
                          id="amount-custom"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="amount-custom"
                          className="flex items-center gap-3 h-16 rounded-lg border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all px-4"
                        >
                          <span className="font-semibold">Custom Amount:</span>
                          <Input
                            type="number"
                            min="5"
                            step="1"
                            placeholder="Enter amount"
                            value={customAmount}
                            onChange={(e) => {
                              setCustomAmount(e.target.value);
                              setDonationAmount("custom");
                            }}
                            className="flex-1 border-0 bg-transparent"
                            disabled={donationAmount !== "custom"}
                          />
                          <span className="text-muted-foreground">EUR</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Impact Preview */}
                  <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Heart className="h-5 w-5 text-primary" />
                        Your Impact
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Droplets className="h-5 w-5 text-primary" />
                          <span>Bottles Distributed</span>
                        </div>
                        <span className="font-bold text-2xl">
                          {impact.bottles}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>• €{impact.water} → Water Access (40%)</div>
                        <div>• €{impact.arts} → Arts Programs (30%)</div>
                        <div>• €{impact.education} → Education (30%)</div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Donor Information */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">
                      Donor Information
                    </Label>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="donor-name">Full Name *</Label>
                        <Input
                          id="donor-name"
                          type="text"
                          placeholder="John Doe"
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="donor-email">Email Address *</Label>
                        <Input
                          id="donor-email"
                          type="email"
                          placeholder="john@example.com"
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Recognition Options */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">
                      Donor Recognition
                    </Label>
                    <RadioGroup
                      value={recognition}
                      onValueChange={setRecognition}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="public"
                            id="recognition-public"
                          />
                          <Label
                            htmlFor="recognition-public"
                            className="font-normal cursor-pointer"
                          >
                            <div className="font-semibold">
                              Public Recognition
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Display my name on the donors page
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="anonymous"
                            id="recognition-anonymous"
                          />
                          <Label
                            htmlFor="recognition-anonymous"
                            className="font-normal cursor-pointer"
                          >
                            <div className="font-semibold">Anonymous</div>
                            <div className="text-sm text-muted-foreground">
                              Keep my donation private
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="honor"
                            id="recognition-honor"
                          />
                          <Label
                            htmlFor="recognition-honor"
                            className="font-normal cursor-pointer"
                          >
                            <div className="font-semibold">In Honor/Memory</div>
                            <div className="text-sm text-muted-foreground">
                              Dedicate this gift to someone
                            </div>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Newsletter Opt-in */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="newsletter"
                      checked={newsletter}
                      onCheckedChange={(checked) =>
                        setNewsletter(checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="newsletter"
                      className="font-normal cursor-pointer"
                    >
                      Send me quarterly impact updates and newsletters
                    </Label>
                  </div>

                  {/* Tax Info */}
                  <Card className="bg-accent/10 border-accent/20">
                    <CardContent className="pt-6 flex items-start gap-3">
                      <FileText className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <div className="text-sm space-y-2">
                        <p className="font-semibold">Tax-Deductible Donation</p>
                        <p className="text-muted-foreground">
                          GRATIS holds Dutch ANBI (tax-exempt charity) status.
                          Your donation is 100% tax-deductible. You will receive
                          an official tax receipt via email within 24 hours for
                          donations over €50.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting || !donorName || !donorEmail}
                  >
                    {isSubmitting ? (
                      "Processing..."
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Donate €
                        {donationAmount === "custom"
                          ? customAmount || "0"
                          : donationAmount}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Secure payment powered by Stripe. Your information is
                    encrypted and never stored.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Why Give Section */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <Droplets className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Direct Impact</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Every euro provides 2 bottles of water and funds verified NGO
                  partners working on water, arts, and education.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 text-accent mb-2" />
                  <CardTitle className="text-lg">100% Transparent</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Track your donation's impact with quarterly reports. View
                  exactly which projects your contribution funds.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CheckCircle2 className="h-8 w-8 text-[hsl(var(--brand-blue))] mb-2" />
                  <CardTitle className="text-lg">Tax Benefits</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  ANBI-certified charity means full tax deduction. Official
                  receipts provided for all donations.
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* CRYPTO TAB */}
          <TabsContent value="crypto" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">
                  Donate with Cryptocurrency
                </CardTitle>
                <CardDescription className="text-base">
                  Bitcoin, Ethereum, and major cryptocurrencies accepted.
                  Tax-deductible donations that fund water, art, and education.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    Top 3% Financial Transparency
                  </Badge>
                  <Badge variant="secondary">100% to NGO Partners</Badge>
                  <Badge variant="secondary">Dutch ANBI Tax-Deductible</Badge>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground">
                    When you donate bitcoin or crypto to GRATIS, you invest in
                    an NGO that ranks in the top 3% of charities for financial
                    responsibility, transparency, and accountability. Your
                    crypto donation directly funds verified NGO partners working
                    on clean water access, youth art programs, and educational
                    initiatives.
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
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                      1
                    </div>
                    <h3 className="font-semibold text-lg">
                      Select Coin & Amount
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Choose from Bitcoin (BTC), Ethereum (ETH), or USDT
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xl">
                      2
                    </div>
                    <h3 className="font-semibold text-lg">
                      Copy Wallet Address
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Use the addresses below for your chosen cryptocurrency
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-12 w-12 rounded-full bg-[hsl(var(--brand-blue))]/10 flex items-center justify-center text-[hsl(var(--brand-blue))] font-bold text-xl">
                      3
                    </div>
                    <h3 className="font-semibold text-lg">Send & Confirm</h3>
                    <p className="text-sm text-muted-foreground">
                      Complete transfer from your wallet and receive
                      confirmation
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wallet Addresses */}
            <Card>
              <CardHeader>
                <CardTitle>Cryptocurrency Wallet Addresses</CardTitle>
                <CardDescription>
                  Send your donation to the appropriate wallet address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(CryptoWallets).map(([coin, address]) => (
                  <div
                    key={coin}
                    className="p-4 bg-muted/50 rounded-lg space-y-2"
                  >
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
                    <code className="text-xs text-muted-foreground break-all block">
                      {address}
                    </code>
                  </div>
                ))}

                <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Tax & Security:</strong>{" "}
                    100% tax-deductible under Dutch ANBI tax-exempt status.
                    Secure blockchain transactions with instant confirmation.
                    Receipt provided for all donations over €50.
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
                  Speak directly with our donation team. Available
                  Monday-Friday, 9:00-17:00 CET.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Phone Number</h3>
                      <a
                        href="tel:+31201234567"
                        className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
                      >
                        +31 (0)20 123-4567
                      </a>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Hours</h3>
                      <p className="text-muted-foreground">
                        Monday - Friday
                        <br />
                        9:00 AM - 5:00 PM CET
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Languages</h3>
                      <p className="text-muted-foreground">
                        Dutch, English, German, French
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-6 rounded-lg space-y-3">
                    <h3 className="font-semibold">
                      Our donation specialists can help you:
                    </h3>
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
                <CardDescription>For large donations (€1.000+)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 p-6 rounded-lg space-y-3 font-mono text-sm">
                  <div>
                    <span className="text-muted-foreground">Bank:</span>{" "}
                    <span className="font-semibold">ING Bank Amsterdam</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Account Name:</span>{" "}
                    <span className="font-semibold">
                      Stichting GRATIS Amsterdam
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">IBAN:</span>{" "}
                    <span className="font-semibold">
                      NL XX INGB XXXX XXXX XX
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">BIC/SWIFT:</span>{" "}
                    <span className="font-semibold">INGBNL2A</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Reference:</span>{" "}
                    <span className="font-semibold">
                      [Your Name] - Donation
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  For wire transfers over €1.000, please call +31 (0)20
                  123-4567. Include your name and "Donation" in the reference
                  field. Tax receipt will be sent within 5 business days.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold">Every €1 = 2 Bottles</div>
                  <p className="text-muted-foreground">
                    Your phone donation provides free water to communities in
                    need
                  </p>
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
                  Send your donation via post. We accept checks, money orders,
                  and international bank drafts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                      1
                    </div>
                    <h3 className="font-semibold text-lg">Download Form</h3>
                    <p className="text-sm text-muted-foreground">
                      Complete our mail-in donation form
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xl">
                      2
                    </div>
                    <h3 className="font-semibold text-lg">Make Payment</h3>
                    <p className="text-sm text-muted-foreground">
                      Check, money order, or bank draft
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-12 w-12 rounded-full bg-[hsl(var(--brand-blue))]/10 flex items-center justify-center text-[hsl(var(--brand-blue))] font-bold text-xl">
                      3
                    </div>
                    <h3 className="font-semibold text-lg">Mail to Us</h3>
                    <p className="text-sm text-muted-foreground">
                      Send to our Amsterdam address
                    </p>
                  </div>
                </div>

                <Button
                  className="w-full md:w-auto"
                  variant="outline"
                  size="lg"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Mail-In Donation Form (PDF)
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mailing Address</CardTitle>
                <CardDescription>
                  Make checks payable to: Stichting GRATIS Amsterdam
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-6 rounded-lg">
                  <div className="font-semibold text-lg mb-2">
                    Mail Your Donation To:
                  </div>
                  <address className="not-italic text-muted-foreground space-y-1">
                    <div className="font-semibold text-foreground">
                      GRATIS Foundation
                    </div>
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
                  <div>
                    • Mail donations processed within 7-10 business days
                  </div>
                  <div>
                    • Tax receipt sent within 14 days to provided address
                  </div>
                  <div>• Questions? Call +31 (0)20 123-4567</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>International Donors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    • Use international money order or bank draft in EUR
                  </div>
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
                  <div>
                    📞{" "}
                    <a
                      href="tel:+31201234567"
                      className="text-primary hover:text-primary/80"
                    >
                      +31 (0)20 123-4567
                    </a>
                  </div>
                  <div>
                    ✉️{" "}
                    <a
                      href="mailto:donate@gratis.ngo"
                      className="text-primary hover:text-primary/80"
                    >
                      donate@gratis.ngo
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
