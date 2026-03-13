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
import { ScrollReveal } from "@/components/ScrollReveal";
import {
  Bitcoin,
  Phone,
  Mail,
  Download,
  Copy,
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Heart,
  Droplets,
  Users,
  Lock,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { CryptoCalculator } from "@/components/spark/CryptoCalculator";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const CryptoWallets = {
  BTC: {
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    icon: "₿",
    color: "text-[#F7931A]",
  },
  ETH: {
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4",
    icon: "Ξ",
    color: "text-[#627EEA]",
  },
  USDT: {
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4",
    icon: "₮",
    color: "text-[#26A17B]",
  },
};

function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, ref };
}

export default function Donate() {
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null);

  const totalDonated = useCounter(127, 2200);
  const bottlesProvided = useCounter(254, 2200);
  const ngoPartners = useCounter(89, 2000);
  const countries = useCounter(12, 1800);

  const copyToClipboard = (address: string, coin: string) => {
    navigator.clipboard.writeText(address);
    setCopiedWallet(coin);
    toast.success(`${coin} wallet address copied!`);
    setTimeout(() => setCopiedWallet(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Phone, Mail & Crypto Donations — GRATIS SPARK"
        description="Support GRATIS with cryptocurrency, phone, or mail donations. Every contribution funds clean water, art programs, and education initiatives."
        canonical={
          typeof window !== "undefined" ? window.location.href : "/spark/donate"
        }
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-sm font-semibold tracking-wider mb-6 animate-fade-in">
            SPARK / DONATE
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
            EVERY CHANNEL COUNTS
          </h1>
          <p
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in"
            style={{ animationDelay: "100ms", animationFillMode: "backwards" }}
          >
            Crypto, phone, wire transfer, or mail — choose the way that works
            for you. Same mission. Same impact. Zero admin fees.
          </p>
          <div
            className="flex flex-wrap justify-center gap-4 animate-fade-in"
            style={{ animationDelay: "200ms", animationFillMode: "backwards" }}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 text-lg px-8"
              onClick={() =>
                document
                  .getElementById("give")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Start Giving <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Link to="/spark/verve">
              <Button
                size="lg"
                variant="outline"
                className="border-primary/40 text-primary hover:bg-primary/10 text-lg px-8"
              >
                Online Donation Form
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Stats Bar */}
      <section className="border-y border-border bg-card/50 backdrop-blur-sm">
        <div
          ref={totalDonated.ref}
          className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          {[
            {
              value: `€${totalDonated.count}K+`,
              label: "Total Donated",
              icon: Heart,
            },
            {
              value: `${bottlesProvided.count}K`,
              label: "Bottles Provided",
              icon: Droplets,
            },
            {
              value: `${ngoPartners.count}`,
              label: "NGO Partners Funded",
              icon: Users,
            },
            {
              value: `${countries.count}`,
              label: "Countries Reached",
              icon: Globe,
            },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <stat.icon className="w-5 h-5 text-primary mb-1" />
              <div className="text-3xl md:text-4xl font-black text-primary">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Shield, label: "Top 3% Financial Transparency" },
              { icon: Lock, label: "100% to NGO Partners" },
              { icon: Zap, label: "Dutch ANBI Tax-Deductible" },
              { icon: Globe, label: "US 501(c)(3) Eligible" },
            ].map((badge) => (
              <div
                key={badge.label}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card/30 text-center hover:border-primary/30 transition-all"
              >
                <badge.icon className="w-6 h-6 text-accent" />
                <span className="text-xs font-medium text-muted-foreground">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section id="give" className="container py-16 max-w-6xl">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-black text-center mb-4">
            CHOOSE YOUR CHANNEL
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Whether you're paying with Bitcoin or writing a check, your donation
            directly funds clean water, art programs, and education.
          </p>
        </ScrollReveal>

        <Tabs defaultValue="crypto" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-10 h-14 bg-card border border-border">
            <TabsTrigger
              value="crypto"
              className="gap-2 text-base data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              <Bitcoin className="h-5 w-5" />
              Crypto
            </TabsTrigger>
            <TabsTrigger
              value="phone"
              className="gap-2 text-base data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              <Phone className="h-5 w-5" />
              Phone & Wire
            </TabsTrigger>
            <TabsTrigger
              value="mail"
              className="gap-2 text-base data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              <Mail className="h-5 w-5" />
              Mail
            </TabsTrigger>
          </TabsList>

          {/* CRYPTO TAB */}
          <TabsContent value="crypto" className="space-y-10">
            <ScrollReveal>
              <div className="grid md:grid-cols-2 gap-10 items-start">
                <div className="space-y-6">
                  <h3 className="text-3xl font-black">
                    Donate with{" "}
                    <span className="text-accent">Cryptocurrency</span>
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    When you donate bitcoin or crypto to GRATIS, you invest in
                    an NGO that ranks in the top 3% of charities for financial
                    responsibility, transparency, and accountability.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-primary/10 text-primary border-primary/30 hover:bg-primary/20">
                      Tax-Deductible
                    </Badge>
                    <Badge className="bg-accent/10 text-accent border-accent/30 hover:bg-accent/20">
                      Blockchain Verified
                    </Badge>
                    <Badge className="bg-[hsl(var(--brand-blue))]/10 text-[hsl(var(--brand-blue))] border-[hsl(var(--brand-blue))]/30">
                      Instant Settlement
                    </Badge>
                  </div>

                  {/* 3 Steps */}
                  <div className="space-y-4 pt-4">
                    {[
                      {
                        step: "1",
                        title: "Select Coin & Amount",
                        desc: "Bitcoin (BTC), Ethereum (ETH), or USDT",
                        color: "bg-primary/10 text-primary",
                      },
                      {
                        step: "2",
                        title: "Copy Wallet Address",
                        desc: "Use the verified addresses below",
                        color: "bg-accent/10 text-accent",
                      },
                      {
                        step: "3",
                        title: "Send & Confirm",
                        desc: "Complete transfer, receive tax receipt",
                        color:
                          "bg-[hsl(var(--brand-blue))]/10 text-[hsl(var(--brand-blue))]",
                      },
                    ].map((s) => (
                      <div key={s.step} className="flex items-start gap-4">
                        <div
                          className={`w-10 h-10 rounded-full ${s.color} flex items-center justify-center font-bold text-lg flex-shrink-0`}
                        >
                          {s.step}
                        </div>
                        <div>
                          <div className="font-bold text-foreground">
                            {s.title}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {s.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Wallet Addresses */}
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-muted-foreground tracking-wider uppercase">
                    Wallet Addresses
                  </h4>
                  {Object.entries(CryptoWallets).map(
                    ([coin, { address, icon, color }]) => (
                      <div
                        key={coin}
                        className="p-5 bg-card border border-border rounded-xl hover:border-primary/30 transition-all group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className={`text-2xl font-bold ${color}`}>
                              {icon}
                            </span>
                            <span className="font-bold text-lg text-foreground">
                              {coin}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(address, coin)}
                            className="border-primary/30 hover:bg-primary/10 hover:text-primary"
                          >
                            {copiedWallet === coin ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />{" "}
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4 mr-2" /> Copy
                              </>
                            )}
                          </Button>
                        </div>
                        <code className="text-xs text-muted-foreground break-all block font-mono bg-muted/50 p-3 rounded-lg">
                          {address}
                        </code>
                      </div>
                    ),
                  )}

                  <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-accent" />
                      <span className="text-sm font-bold text-foreground">
                        Tax & Security
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      100% tax-deductible under Dutch ANBI status. Secure
                      blockchain transactions with instant confirmation. Receipt
                      provided for all donations over €50.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Crypto Calculator */}
            <ScrollReveal>
              <CryptoCalculator />
            </ScrollReveal>
          </TabsContent>

          {/* PHONE & WIRE TAB */}
          <TabsContent value="phone" className="space-y-10">
            <ScrollReveal>
              <div className="grid md:grid-cols-2 gap-10 items-start">
                <div className="space-y-6">
                  <h3 className="text-3xl font-black">
                    Give by <span className="text-accent">Phone</span>
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Speak directly with our dedicated donation team. Process
                    one-time or recurring donations, arrange wire transfers, or
                    discuss corporate partnerships.
                  </p>

                  <div className="space-y-6">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Call Us
                      </div>
                      <a
                        href="tel:+31201234567"
                        className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                      >
                        +31 (0)20 123-4567
                      </a>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-bold text-foreground mb-1">
                          Hours
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Mon – Fri
                          <br />
                          9:00 – 17:00 CET
                        </p>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground mb-1">
                          Languages
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Dutch, English,
                          <br />
                          German, French
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-card border border-border rounded-xl space-y-3">
                    <h4 className="font-bold text-foreground">
                      Our specialists can help you:
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {[
                        "Process one-time or recurring donations",
                        "Set up wire transfers for large gifts (€1,000+)",
                        "Discuss corporate partnership opportunities",
                        "Arrange memorial or honor gifts",
                        "Provide tax documentation assistance",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Wire Transfer */}
                <div className="space-y-6">
                  <h4 className="text-2xl font-black">Wire Transfer</h4>
                  <p className="text-muted-foreground">
                    For donations of €1,000 and above, wire transfer is the most
                    efficient method.
                  </p>

                  <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="p-4 bg-primary/5 border-b border-border">
                      <span className="text-sm font-bold text-primary tracking-wider uppercase">
                        Bank Details
                      </span>
                    </div>
                    <div className="p-5 space-y-3 font-mono text-sm">
                      {[
                        { label: "Bank", value: "ING Bank Amsterdam" },
                        {
                          label: "Account",
                          value: "Stichting GRATIS Amsterdam",
                        },
                        { label: "IBAN", value: "NL XX INGB XXXX XXXX XX" },
                        { label: "BIC/SWIFT", value: "INGBNL2A" },
                        { label: "Reference", value: "[Your Name] – Donation" },
                      ].map((row) => (
                        <div
                          key={row.label}
                          className="flex justify-between items-baseline"
                        >
                          <span className="text-muted-foreground text-xs uppercase tracking-wide">
                            {row.label}
                          </span>
                          <span className="font-semibold text-foreground">
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                    <div className="text-center">
                      <div className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1">
                        €1 = 2 Bottles
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Every euro provides free water to communities in need
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </TabsContent>

          {/* MAIL TAB */}
          <TabsContent value="mail" className="space-y-10">
            <ScrollReveal>
              <div className="grid md:grid-cols-2 gap-10 items-start">
                <div className="space-y-6">
                  <h3 className="text-3xl font-black">
                    Give by <span className="text-accent">Mail</span>
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    We accept checks, money orders, and international bank
                    drafts. Every mailed donation receives a tax receipt within
                    14 business days.
                  </p>

                  {/* 3 Steps */}
                  <div className="space-y-4 pt-2">
                    {[
                      {
                        step: "1",
                        title: "Download Form",
                        desc: "Complete our mail-in donation form",
                        color: "bg-primary/10 text-primary",
                      },
                      {
                        step: "2",
                        title: "Make Payment",
                        desc: "Check, money order, or bank draft (EUR)",
                        color: "bg-accent/10 text-accent",
                      },
                      {
                        step: "3",
                        title: "Mail to Us",
                        desc: "Send to our Amsterdam office address",
                        color:
                          "bg-[hsl(var(--brand-blue))]/10 text-[hsl(var(--brand-blue))]",
                      },
                    ].map((s) => (
                      <div key={s.step} className="flex items-start gap-4">
                        <div
                          className={`w-10 h-10 rounded-full ${s.color} flex items-center justify-center font-bold text-lg flex-shrink-0`}
                        >
                          {s.step}
                        </div>
                        <div>
                          <div className="font-bold text-foreground">
                            {s.title}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {s.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary/40 text-primary hover:bg-primary/10"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Mail-In Donation Form (PDF)
                  </Button>
                </div>

                {/* Mailing Address + Info */}
                <div className="space-y-6">
                  <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="p-4 bg-accent/5 border-b border-border">
                      <span className="text-sm font-bold text-accent tracking-wider uppercase">
                        Mailing Address
                      </span>
                    </div>
                    <div className="p-6">
                      <p className="text-sm text-muted-foreground mb-4">
                        Make checks payable to:{" "}
                        <strong className="text-foreground">
                          Stichting GRATIS Amsterdam
                        </strong>
                      </p>
                      <address className="not-italic space-y-1 text-foreground">
                        <div className="font-bold text-lg">
                          GRATIS Foundation
                        </div>
                        <div className="text-muted-foreground">
                          Donations Department
                        </div>
                        <div className="text-muted-foreground">
                          P.O. Box 12345
                        </div>
                        <div className="text-muted-foreground">
                          1000 AA Amsterdam
                        </div>
                        <div className="text-muted-foreground">
                          The Netherlands
                        </div>
                      </address>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-5 bg-card border border-border rounded-xl">
                      <h4 className="font-bold text-foreground mb-2">
                        Processing Timeline
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          Processed within 7–10 business days
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          Tax receipt mailed within 14 days
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          International money orders accepted in EUR
                        </li>
                      </ul>
                    </div>

                    <div className="p-5 bg-card border border-border rounded-xl">
                      <h4 className="font-bold text-foreground mb-2">
                        Mailing Preferences
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Prefer email-only communications?
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <a
                          href="tel:+31201234567"
                          className="text-primary hover:text-primary/80 font-medium"
                        >
                          📞 +31 (0)20 123-4567
                        </a>
                        <a
                          href="mailto:donate@gratis.ngo"
                          className="text-primary hover:text-primary/80 font-medium"
                        >
                          ✉️ donate@gratis.ngo
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </TabsContent>
        </Tabs>
      </section>

      {/* CTA — Back to main giving */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              PREFER ONLINE?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Use our secure online donation form with preset amounts, impact
              visualization, and instant tax receipts.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/spark/verve">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 text-lg px-8"
                >
                  Donate Online <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/spark">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/40 text-primary hover:bg-primary/10 text-lg px-8"
                >
                  Explore All Paths
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
