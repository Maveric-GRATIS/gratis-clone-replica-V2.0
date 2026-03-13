import SEO from "@/components/SEO";
import { PageHero } from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Compass, Megaphone } from "lucide-react";

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
            GRATIS is governed by an independent board, led by mission-driven
            founders, guided by world-class advisors, and amplified by culture
            ambassadors across the globe. Every role exists to serve one
            purpose:
            <span className="text-primary font-semibold">
              {" "}
              maximize impact, not profit.
            </span>
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {[
              { icon: Shield, label: "Board of Directors" },
              { icon: Users, label: "Founding Partners" },
              { icon: Compass, label: "Advisory Council" },
              { icon: Megaphone, label: "Global Ambassadors" },
            ].map((s) => (
              <Badge
                key={s.label}
                variant="outline"
                className="text-sm py-1.5 px-4 border-primary/30 text-primary"
              >
                <s.icon className="h-3.5 w-3.5 mr-1.5" />
                {s.label}
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
                <h2 className="text-3xl md:text-4xl font-black">
                  Board of Directors
                </h2>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                Independent governance ensuring legal compliance, financial
                accountability, and strategic oversight. No board member
                receives compensation.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boardMembers.map((m) => (
                <Card
                  key={m.name}
                  className="bg-primary/5 border-primary/20 hover:border-primary/40 transition-colors"
                >
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                        {m.initials}
                      </div>
                      <div>
                        <div className="font-bold text-foreground">
                          {m.name}
                        </div>
                        <div className="text-sm text-primary">{m.role}</div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs border-primary/30 text-muted-foreground"
                    >
                      {m.expertise}
                    </Badge>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {m.bio}
                    </p>
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
                <h2 className="text-3xl md:text-4xl font-black">
                  Founding Partners
                </h2>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                The co-founders steering GRATIS from Amsterdam to the world.
                Full-time, mission-first leadership.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {partners.map((p) => (
                <Card
                  key={p.name}
                  className="bg-primary/10 border-primary/30 hover:border-primary/50 transition-colors"
                >
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                        {p.initials}
                      </div>
                      <div>
                        <div className="font-bold text-foreground">
                          {p.name}
                        </div>
                        <div className="text-sm text-primary">{p.role}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {p.tags.map((t) => (
                        <Badge
                          key={t}
                          variant="outline"
                          className="text-xs border-primary/30 text-primary"
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {p.bio}
                    </p>
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
                <h2 className="text-3xl md:text-4xl font-black">
                  Advisory Council
                </h2>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                Strategic experts keeping us sharp, authentic, and effective.
                Pro-bono guidance from industry leaders.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {advisors.map((a) => (
                <Card
                  key={a.name}
                  className="bg-accent/10 border-accent/20 hover:border-accent/40 transition-colors"
                >
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent text-xs">
                        {a.initials}
                      </div>
                      <div>
                        <div className="font-bold text-foreground text-sm">
                          {a.name}
                        </div>
                        <div className="text-xs text-accent">{a.role}</div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {a.bio}
                    </p>
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
                <h2 className="text-3xl md:text-4xl font-black">
                  Global Ambassadors
                </h2>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                Culture-makers and community leaders bringing the GRATIS mission
                to cities worldwide.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {ambassadors.map((a) => (
                <Card
                  key={a.name}
                  className="bg-muted/30 border-border hover:border-primary/30 transition-colors"
                >
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-foreground text-xs">
                        {a.initials}
                      </div>
                      <div>
                        <div className="font-bold text-foreground text-sm">
                          {a.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {a.city} · {a.focus}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {a.bio}
                    </p>
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
                  GRATIS operates under Dutch foundation law (
                  <em>Stichtingsrecht</em>). Board members serve independently
                  and receive no financial compensation. All advisory and
                  ambassador roles are voluntary or pro-bono.
                </p>
                <p>
                  Our full Articles of Association, conflict-of-interest policy,
                  and board minutes are available upon request to donors,
                  regulators, and accreditation bodies.
                </p>
                <p>
                  GRATIS is committed to meeting the governance requirements of
                  both Dutch ANBI status and US 501(c)(3) tax-exempt
                  recognition.
                </p>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
