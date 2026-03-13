import SEO from "@/components/SEO";
import { PageHero } from "@/components/PageHero";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Shield, Compass, Megaphone } from "lucide-react";

const boardMembers = [
  {
    name: "Amara Okafor",
    role: "Board Chair",
    initials: "AO",
    expertise: "Legal & Governance",
    bio: "15+ years in NGO law and charity governance. Former legal advisor to multiple European foundations. Ensures GRATIS meets all regulatory requirements and ethical standards.",
  },
  {
    name: "Lars van Bergen",
    role: "Board Treasurer",
    initials: "LB",
    expertise: "Finance & Audit",
    bio: "Chartered accountant with expertise in nonprofit financial management. Oversees all financial reporting, audits, and ensures 100% donation transparency.",
  },
  {
    name: "Sofia Martínez",
    role: "Board Secretary",
    initials: "SM",
    expertise: "Social Impact",
    bio: "International development specialist with 20 years in community programs across Latin America and Europe. Guides impact strategy and partner selection.",
  },
  {
    name: "Ibrahim Diallo",
    role: "Board Member",
    initials: "ID",
    expertise: "Public Health",
    bio: "WHO consultant and water sanitation specialist. Brings expertise in clean-water access programs and community health initiatives across West Africa.",
  },
  {
    name: "Mei-Lin Chen",
    role: "Board Member",
    initials: "MC",
    expertise: "Corporate Ethics",
    bio: "Former ethics officer at a Fortune 500 company. Ensures advertising partnerships align with GRATIS values and ethical standards.",
  },
];

const partners = [
  {
    name: "Daan Claassen",
    role: "Co-Founder & Executive Director",
    initials: "DC",
    tags: ["Vision", "NGO Strategy", "External Relations"],
    bio: "From Amsterdam's street scene. Sets overall direction, builds partnerships with major NGOs, and represents GRATIS publicly.",
  },
  {
    name: "Mariam Patel",
    role: "Co-Founder & Operations Director",
    initials: "MP",
    tags: ["Operations", "Logistics", "Distribution"],
    bio: "Supply chain expert. Manages day-to-day operations, ensures FREE water reaches communities, oversees production and distribution.",
  },
  {
    name: "Emmanuel Kofi",
    role: "Co-Founder & Partnerships Director",
    initials: "EK",
    tags: ["Brand Deals", "NGO Relations", "Revenue"],
    bio: "Sales and partnership background. Secures advertising deals with brands, vets new NGO partners, drives revenue growth.",
  },
];

const advisors = [
  {
    name: "Dr. Kwame Asante",
    role: "NGO Operations Advisor",
    initials: "KA",
    bio: "25 years managing aid operations in Africa. Optimizes distribution efficiency and partner vetting processes.",
  },
  {
    name: "Yasmin Al-Rahman",
    role: "Impact Measurement Advisor",
    initials: "YR",
    bio: "PhD in social impact metrics. Designs tracking systems for transparent donation reporting.",
  },
  {
    name: "Jamal Thompson",
    role: "Cultural Authenticity Advisor",
    initials: "JT",
    bio: "Amsterdam street culture leader, DJ, community organizer. Keeps GRATIS real and accountable to the culture.",
  },
  {
    name: "Nina Petrova",
    role: "Brand Partnerships Advisor",
    initials: "NP",
    bio: "Former CMO at major brands. Guides ethical advertising partnerships and revenue strategy.",
  },
  {
    name: "Dr. Henrik Lindström",
    role: "Environmental Sustainability Advisor",
    initials: "HL",
    bio: "Environmental scientist specializing in circular packaging and carbon neutrality in supply chains.",
  },
  {
    name: "Prof. Aisha Mbeki",
    role: "Education & Youth Advisor",
    initials: "AM",
    bio: "Professor of Education at University of Amsterdam. Shapes scholarship programs and youth engagement strategy.",
  },
];

const ambassadors = [
  {
    name: "Zara Kessler",
    city: "Amsterdam",
    initials: "ZK",
    focus: "Street Culture & Music",
    bio: "DJ and event curator bringing GRATIS to Amsterdam's nightlife and festival circuit. Connects youth culture with charitable action.",
  },
  {
    name: "Marcus Rivera",
    city: "New York",
    initials: "MR",
    focus: "Community Outreach",
    bio: "Brooklyn-based community organizer leading GRATIS distribution at cultural events across NYC's five boroughs.",
  },
  {
    name: "Fatou Diop",
    city: "Paris",
    initials: "FD",
    focus: "Fashion & Impact",
    bio: "Fashion designer using GRATIS merch collaborations to bridge streetwear culture with social impact across Europe.",
  },
  {
    name: "Kofi Mensah",
    city: "Accra",
    initials: "KM",
    focus: "Water Access Advocacy",
    bio: "Journalist and activist documenting clean water challenges in West Africa. Amplifies GRATIS partner impact on the ground.",
  },
  {
    name: "Lena Voss",
    city: "Berlin",
    initials: "LV",
    focus: "Art & Sustainability",
    bio: "Visual artist creating limited-edition GRATIS bottle designs. Uses art to spark conversations about sustainability and giving.",
  },
  {
    name: "Raj Patel",
    city: "London",
    initials: "RP",
    focus: "Tech & Transparency",
    bio: "Tech entrepreneur advising on digital transparency tools. Champions open-source impact reporting for the NGO sector.",
  },
];

const sections = [
  {
    icon: Shield,
    title: "Board of Directors",
    subtitle: "Independent governance ensuring legal compliance, financial accountability, and strategic oversight. No board member receives compensation.",
    color: "primary" as const,
  },
  {
    icon: Users,
    title: "Founding Partners",
    subtitle: "The co-founders steering GRATIS from Amsterdam to the world. Full-time, mission-first leadership.",
    color: "primary" as const,
  },
  {
    icon: Compass,
    title: "Advisory Council",
    subtitle: "Strategic experts keeping us sharp, authentic, and effective. Pro-bono guidance from industry leaders.",
    color: "accent" as const,
  },
  {
    icon: Megaphone,
    title: "Global Ambassadors",
    subtitle: "Culture-makers and community leaders bringing the GRATIS mission to cities worldwide.",
    color: "accent" as const,
  },
];

export default function Leadership() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Leadership — GRATIS"
        description="Meet the board, partners, advisors, and ambassadors steering GRATIS — the NGO making impact accessible through FREE water and 100% donations."
        canonical="/accreditation/leadership"
      />

      <PageHero
        title="Leadership"
        subtitle="The people behind the mission. Transparent governance, independent oversight, global reach."
        lastUpdated="March 2026"
      />

      {/* Mission Statement */}
      <section className="border-t border-border">
        <div className="container max-w-4xl mx-auto py-12 px-4 text-center space-y-4">
          <p className="text-lg text-muted-foreground leading-relaxed">
            GRATIS is governed by an independent board, led by mission-driven founders, guided by world-class advisors,
            and amplified by culture ambassadors across the globe. Every role exists to serve one purpose:
            <span className="text-primary font-semibold"> maximize impact, not profit.</span>
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {sections.map((s) => (
              <Badge key={s.title} variant="outline" className="text-sm py-1.5 px-4 border-primary/30 text-primary">
                <s.icon className="h-3.5 w-3.5 mr-1.5" />
                {s.title}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-background pb-20">
        <div className="container max-w-6xl mx-auto px-4 space-y-20">

          {/* Board of Directors */}
          <section className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                <h2 className="text-3xl md:text-4xl font-black">{sections[0].title}</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl">{sections[0].subtitle}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boardMembers.map((m) => (
                <Card key={m.name} className="bg-primary/5 border-primary/20 hover:border-primary/40 transition-colors">
                  <CardHeader className="text-center pb-3">
                    <Avatar className="w-16 h-16 mx-auto mb-3">
                      <AvatarFallback className="bg-primary/20 text-primary text-lg font-bold">{m.initials}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">{m.name}</CardTitle>
                    <CardDescription>{m.role}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">{m.expertise}</Badge>
                    <p className="text-sm text-muted-foreground leading-relaxed">{m.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Founding Partners */}
          <section className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-primary" />
                <h2 className="text-3xl md:text-4xl font-black">{sections[1].title}</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl">{sections[1].subtitle}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {partners.map((p) => (
                <Card key={p.name} className="bg-primary/10 border-primary/30 hover:border-primary/50 transition-colors">
                  <CardHeader className="text-center pb-3">
                    <Avatar className="w-20 h-20 mx-auto mb-3">
                      <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">{p.initials}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">{p.name}</CardTitle>
                    <CardDescription>{p.role}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Advisory Council */}
          <section className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Compass className="h-6 w-6 text-accent" />
                <h2 className="text-3xl md:text-4xl font-black">{sections[2].title}</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl">{sections[2].subtitle}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {advisors.map((a) => (
                <Card key={a.name} className="bg-accent/10 border-accent/20 hover:border-accent/40 transition-colors">
                  <CardHeader className="pb-3">
                    <Avatar className="w-14 h-14 mb-2">
                      <AvatarFallback className="bg-accent/20 text-accent-foreground font-semibold">{a.initials}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-base">{a.name}</CardTitle>
                    <CardDescription className="text-xs">{a.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{a.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Ambassadors */}
          <section className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Megaphone className="h-6 w-6 text-accent" />
                <h2 className="text-3xl md:text-4xl font-black">{sections[3].title}</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl">{sections[3].subtitle}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {ambassadors.map((a) => (
                <Card key={a.name} className="bg-muted/30 border-border hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-14 h-14">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">{a.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{a.name}</CardTitle>
                        <CardDescription className="text-xs">{a.city}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Badge variant="outline" className="text-xs border-accent/30 text-accent-foreground">{a.focus}</Badge>
                    <p className="text-sm text-muted-foreground leading-relaxed">{a.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Governance Note */}
          <section className="border-t border-border pt-12">
            <Card className="p-8 bg-primary/5 border-primary/20">
              <h3 className="text-xl font-bold mb-4">Governance Commitment</h3>
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  GRATIS operates under Dutch foundation law (<em>stichting</em>). Board members serve independently
                  and receive no financial compensation. All advisory and ambassador roles are voluntary or pro-bono.
                </p>
                <p>
                  Financial statements are audited annually and published publicly. Board meetings occur quarterly
                  with minutes available upon request. Our governance charter mandates a minimum of three independent
                  board members at all times.
                </p>
                <p>
                  For governance inquiries, contact us at{" "}
                  <a href="mailto:governance@gratis.com" className="text-primary hover:underline">governance@gratis.com</a>.
                </p>
              </div>
            </Card>
          </section>

        </div>
      </div>
    </div>
  );
}
