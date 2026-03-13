import SEO from "@/components/SEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Heart,
  Bitcoin,
  Phone,
  Mail,
  Building2,
  CreditCard,
  Repeat,
  Gift,
  Globe,
  HelpCircle,
  Droplets,
  Palette,
  GraduationCap,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const givingMethods = [
  {
    icon: CreditCard,
    title: "Online Donation",
    desc: "Secure one-time or recurring donations via our website.",
    link: "/spark/verve",
    cta: "Donate Online",
  },
  {
    icon: Bitcoin,
    title: "Cryptocurrency",
    desc: "Bitcoin, Ethereum, and USDT accepted with instant settlement.",
    link: "/spark/donate",
    cta: "Crypto Donations",
  },
  {
    icon: Phone,
    title: "Phone & Wire",
    desc: "Call our team or wire transfer for large gifts.",
    link: "/spark/donate",
    cta: "Phone & Wire",
  },
  {
    icon: Mail,
    title: "Mail",
    desc: "Send checks, money orders, or international bank drafts.",
    link: "/spark/donate",
    cta: "Mail a Donation",
  },
  {
    icon: Building2,
    title: "Corporate Giving",
    desc: "Partnership tiers from €5K to €100K+ with co-branding.",
    link: "/spark/corporate-giving",
    cta: "Corporate Programs",
  },
  {
    icon: Gift,
    title: "Honor & Memorial",
    desc: "Celebrate a life or honor a memory with a tribute gift.",
    link: "/spark/honor-memorial",
    cta: "Tribute Gifts",
  },
  {
    icon: Repeat,
    title: "Monthly Giving",
    desc: "Sustained impact with automatic recurring donations.",
    link: "/spark/monthly-giving",
    cta: "Give Monthly",
  },
  {
    icon: Globe,
    title: "International",
    desc: "Give from anywhere-ANBI (NL), 501(c)(3) (US), EU compliant.",
    link: "/spark/verve",
    cta: "Learn More",
  },
];

const faqs = [
  {
    q: "Is my donation tax-deductible?",
    a: "Yes. GRATIS holds Dutch ANBI status and US 501(c)(3) recognition. Donations are tax-deductible in the Netherlands, the United States, and many EU countries. We provide official receipts for all donations over €50.",
  },
  {
    q: "Where does my money go?",
    a: "100% of donations go directly to programs: 40% Clean Water, 30% Art & Culture, 30% Education. Admin costs are fully covered by brand partnerships and product sales - never by your donation.",
  },
  {
    q: "Can I donate from outside the Netherlands or US?",
    a: "Absolutely. We accept international bank transfers, cryptocurrency, and online payments from anywhere in the world. Wire transfer details are available on our Phone & Wire page.",
  },
  {
    q: "How do I get a tax receipt?",
    a: "For online donations, receipts are emailed automatically. For crypto, phone, wire, and mail donations, receipts are sent within 5-14 business days depending on the method.",
  },
  {
    q: "Can I specify where my donation goes?",
    a: "By default, donations are split across our three pillars (Water, Art, Education). For donations of €1,000+ you can request allocation to a specific pillar. Contact our team for restricted gifts.",
  },
  {
    q: "What is the minimum donation amount?",
    a: "The minimum online donation is €5. There is no minimum for mail or crypto donations, though we provide tax receipts only for gifts of €50 and above.",
  },
  {
    q: "Can I cancel or change my monthly donation?",
    a: "Yes, you can modify or cancel your monthly recurring donation at any time through your account dashboard or by contacting us at donate@gratis.ngo.",
  },
  {
    q: "Does GRATIS accept stock or securities?",
    a: "Yes. We accept publicly traded securities. For closely held securities, real estate, or other complex gifts, please contact our team for a consultation.",
  },
  {
    q: "How do corporate matching gifts work?",
    a: "Many employers match charitable contributions. Check with your HR department. We provide all necessary documentation. If your company isn't listed, contact us and we'll help get GRATIS registered.",
  },
  {
    q: "How is impact measured and reported?",
    a: "We publish quarterly impact reports and annual audited financials. All data is verified by independent auditors and aligned with UN SDG reporting frameworks.",
  },
];

export default function AllWaysToGive() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="All Ways to Give (FAQ) — GRATIS SPARK"
        description="Explore every way to support GRATIS - online, crypto, phone, mail, corporate, monthly, and tribute gifts. Plus answers to all your giving questions."
        canonical="/spark/all-ways-to-give"
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-sm font-semibold tracking-wider mb-6 animate-fade-in">
            SPARK / FAQ
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
            ALL WAYS TO GIVE
          </h1>
          <p
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-4 animate-fade-in"
            style={{ animationDelay: "100ms", animationFillMode: "backwards" }}
          >
            Eight channels to create impact. One transparent mission. Find the
            way that works for you.
          </p>
        </div>
      </section>

      {/* Giving Methods Grid */}
      <section className="py-20 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-black text-center mb-14">
              CHOOSE YOUR PATH
            </h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {givingMethods.map((method, i) => (
              <ScrollReveal key={method.title}>
                <Link to={method.link}>
                  <Card className="h-full border-border hover:border-primary/40 transition-all group cursor-pointer">
                    <CardContent className="pt-6 pb-5 space-y-3">
                      <method.icon className="w-8 h-8 text-primary group-hover:text-accent transition-colors" />
                      <h3 className="font-bold text-foreground">
                        {method.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {method.desc}
                      </p>
                      <div className="flex items-center text-sm text-primary font-medium group-hover:gap-2 gap-1 transition-all pt-1">
                        {method.cta} <ArrowRight className="w-3 h-3" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Allocation */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-black mb-8">
              WHERE YOUR MONEY GOES
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  pct: "40%",
                  label: "Water Projects",
                  icon: Droplets,
                  color: "text-primary",
                },
                {
                  pct: "30%",
                  label: "Arts & Culture",
                  icon: Palette,
                  color: "text-accent",
                },
                {
                  pct: "30%",
                  label: "Education",
                  icon: GraduationCap,
                  color: "text-[hsl(var(--brand-blue))]",
                },
                {
                  pct: "0%",
                  label: "Admin Overhead*",
                  icon: Heart,
                  color: "text-muted-foreground",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-6 bg-card border border-border rounded-xl hover:border-primary/30 transition-all"
                >
                  <item.icon className={`w-6 h-6 ${item.color} mx-auto mb-2`} />
                  <div className={`text-3xl font-black ${item.color}`}>
                    {item.pct}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-6">
              *Admin costs are fully covered by brand partnerships and product
              sales
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center justify-center gap-3 mb-4">
              <HelpCircle className="w-8 h-8 text-accent" />
              <h2 className="text-3xl md:text-4xl font-black">
                FREQUENTLY ASKED
              </h2>
            </div>
            <p className="text-center text-muted-foreground mb-12">
              Everything you need to know about giving to GRATIS.
            </p>
          </ScrollReveal>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-border rounded-xl px-6 bg-card/30 hover:border-primary/20 transition-all"
              >
                <AccordionTrigger className="text-left font-bold text-foreground hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              READY TO GIVE?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Choose your preferred method and start creating real, measurable
              impact today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/spark/verve">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 text-lg px-8"
                >
                  Donate Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/40 text-primary hover:bg-primary/10 text-lg px-8"
                >
                  Still Have Questions?
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
