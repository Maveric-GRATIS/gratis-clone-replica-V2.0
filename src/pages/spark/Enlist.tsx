import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { JobApplicationForm } from "@/components/spark/JobApplicationForm";
import { SEO } from "@/components/SEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Briefcase, Clock, Award, Rocket, ArrowRight, ChevronDown, ChevronUp, MapPin, Users, Zap, Heart, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
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
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, ref };
}

const jobs = [
  {
    id: "event-coordinator",
    title: "Event Coordinator",
    type: "Temporary",
    compensation: "-150/day stipend",
    description: "Coordinate logistics for festivals, pop-ups, and community events. Manage volunteers, liaise with venues, ensure smooth operations.",
    requirements: ["Event management experience", "Strong organizational skills", "Available weekends"],
  },
  {
    id: "distribution-lead",
    title: "Distribution Lead",
    type: "Temporary",
    compensation: "-120/day stipend",
    description: "Lead street distribution teams, manage inventory, track impact metrics, train new volunteers.",
    requirements: ["Leadership experience", "Comfortable in outdoor environments", "Valid driver's license"],
  },
  {
    id: "marketing-intern",
    title: "Marketing & Social Media Intern",
    type: "Internship",
    compensation: "-500/month",
    description: "Create content, manage social channels, analyze engagement metrics, develop campaigns.",
    requirements: ["Currently enrolled or recent graduate", "3-6 month commitment", "Portfolio of social media work"],
  },
  {
    id: "impact-intern",
    title: "Impact Analysis Intern",
    type: "Internship",
    compensation: "-500/month",
    description: "Track donation impact, compile reports, communicate with beneficiaries, maintain impact dashboard.",
    requirements: ["Data analysis skills", "Research background", "Passion for social impact"],
  },
  {
    id: "operations-manager",
    title: "Operations Manager",
    type: "Full-Time",
    compensation: "-3,200-4,000/month",
    description: "Oversee day-to-day NGO operations, manage supply chain, coordinate distribution networks, optimize processes.",
    requirements: ["3+ years operations experience", "NGO or logistics background", "Proven team leadership"],
  },
  {
    id: "partnerships-manager",
    title: "Partnerships Manager",
    type: "Full-Time",
    compensation: "-3,500-4,500/month",
    description: "Build brand partnerships, negotiate advertising deals, maintain NGO relationships, drive revenue growth.",
    requirements: ["Partnership/sales experience", "Strong negotiation skills", "Extensive network"],
  },
];

const values = [
  { title: "TRANSPARENCY", description: "No corporate BS. Open books, honest conversations.", icon: Shield, color: "text-primary" },
  { title: "IMPACT", description: "See your work change lives in real-time.", icon: Zap, color: "text-accent" },
  { title: "AUTHENTICITY", description: "Be yourself. Bring your full identity to work.", icon: Heart, color: "text-primary" },
  { title: "EVERYONE WINS", description: "Fair pay, flexible work, meaningful mission.", icon: Users, color: "text-accent" },
];

const Enlist = () => {
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const teamSize = useCounter(28, 1800);
  const openings = useCounter(6, 1200);
  const cities = useCounter(4, 1000);

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case "Full-Time": return "bg-primary/20 text-primary border-primary/30";
      case "Internship": return "bg-accent/20 text-accent border-accent/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <>
      <SEO
        title="ENLIST: Build With Us | GRATIS"
        description="Join the GRATIS team. Open positions for volunteers, interns, full-time staff, and brand ambassadors. Get paid to make a difference."
        canonical="https://gratis.ngo/spark/enlist"
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
          <div className="relative max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-sm font-semibold tracking-wider mb-6 animate-fade-in">
              SPARK / ENLIST
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
              BUILD WITH US
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}>
              Join the team. Shape the future. Get paid to make a difference-from internships to full-time roles.
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 text-lg px-8"
                onClick={() => document.getElementById("openings")?.scrollIntoView({ behavior: "smooth" })}>
                View Openings <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 text-lg px-8"
                onClick={() => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })}>
                Apply Now
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="border-y border-border bg-card/50 backdrop-blur-sm">
          <div ref={teamSize.ref} className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-3 gap-6 text-center">
            {[
              { value: `${teamSize.count}`, label: "Team Members", icon: Users },
              { value: `${openings.count}`, label: "Open Positions", icon: Briefcase },
              { value: `${cities.count}`, label: "Office Cities", icon: MapPin },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <stat.icon className="w-5 h-5 text-accent mb-1" />
                <div className="text-3xl md:text-4xl font-black text-accent">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Current Openings */}
        <section id="openings" className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-black text-center mb-4">CURRENT OPENINGS</h2>
              <p className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto">
                Every role at GRATIS is designed to create impact. Find the one that fits your skills and passion.
              </p>
            </ScrollReveal>

            <div className="space-y-4">
              {jobs.map((job, i) => (
                <ScrollReveal key={job.id}>
                  <Card
                    className={`transition-all duration-300 cursor-pointer ${
                      expandedJob === job.id
                        ? "border-primary/40 shadow-lg shadow-primary/5"
                        : "border-border/50 hover:border-primary/20"
                    }`}
                    style={{ animationDelay: `${i * 80}ms` }}
                    onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <CardTitle className="text-lg">{job.title}</CardTitle>
                            <Badge className={getTypeBadgeClass(job.type)}>{job.type}</Badge>
                          </div>
                          <CardDescription className="text-base font-semibold">{job.compensation}</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" className="flex-shrink-0"
                          onClick={(e) => { e.stopPropagation(); setExpandedJob(expandedJob === job.id ? null : job.id); }}>
                          {expandedJob === job.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </Button>
                      </div>
                    </CardHeader>
                    {expandedJob === job.id && (
                      <CardContent className="space-y-4 border-t border-border pt-4 animate-fade-in">
                        <div>
                          <div className="font-bold text-sm mb-2">DESCRIPTION</div>
                          <p className="text-sm text-muted-foreground">{job.description}</p>
                        </div>
                        <div>
                          <div className="font-bold text-sm mb-2">REQUIREMENTS</div>
                          <ul className="space-y-1.5">
                            {job.requirements.map((req) => (
                              <li key={req} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-primary mt-0.5">-</span>
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Button size="sm" className="bg-gradient-to-r from-accent to-primary text-primary-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
                          }}>
                          Apply for this role <ArrowRight className="ml-1.5 w-4 h-4" />
                        </Button>
                      </CardContent>
                    )}
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Ambassador Program */}
        <section className="py-20 px-4 bg-muted/20">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-10">
                <Rocket className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-black mb-3">BRAND AMBASSADOR PROGRAM</h2>
                <Badge className="bg-accent/20 text-accent border-accent/30 text-sm px-4 py-1.5">
                  Flexible - Mission-Driven - High Impact
                </Badge>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <Card className="bg-card/80 backdrop-blur border-primary/20">
                <CardContent className="pt-6 space-y-8">
                  <div>
                    <h3 className="font-black text-lg mb-4">WHAT YOU'LL DO</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        "Represent GRATIS in your city/community",
                        "Drive local brand partnerships and ad deals",
                        "Organize community events and activations",
                        "Build networks with NGOs and local leaders",
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-0.5">?</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-black text-lg mb-4">PERKS & COMPENSATION</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {[
                        { icon: Award, title: "Free Products", desc: "Unlimited personal supply", color: "primary" },
                        { icon: Briefcase, title: "Monthly Stipend", desc: "-100-150/month for active", color: "accent" },
                        { icon: Clock, title: "Flexible Hours", desc: "Work on your terms", color: "primary" },
                      ].map((perk) => (
                        <div key={perk.title} className={`p-4 bg-${perk.color}/5 rounded-xl border border-${perk.color}/20`}>
                          <perk.icon className={`w-7 h-7 text-${perk.color} mb-2`} />
                          <div className="font-bold text-sm">{perk.title}</div>
                          <div className="text-xs text-muted-foreground">{perk.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </section>

        {/* Why Work Here */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-black text-center mb-14">WHY WORK AT GRATIS?</h2>
            </ScrollReveal>
            <div className="grid md:grid-cols-4 gap-6">
              {values.map((v, i) => (
                <ScrollReveal key={v.title}>
                  <div className="p-6 bg-card rounded-xl border border-border hover:border-primary/30 transition-all text-center"
                    style={{ animationDelay: `${i * 100}ms` }}>
                    <v.icon className={`w-8 h-8 ${v.color} mx-auto mb-3`} />
                    <div className={`text-lg font-black mb-2 ${v.color}`}>{v.title}</div>
                    <p className="text-sm text-muted-foreground">{v.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            <div className="text-center mt-12">
              <ScrollReveal>
                <Link to="/tribe/team">
                  <Button variant="outline" size="lg" className="border-primary/30 hover:border-primary/60">
                    Meet the Team <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section id="apply" className="py-20 px-4 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <ScrollReveal>
                <div className="sticky top-24">
                  <h2 className="text-3xl md:text-4xl font-black mb-4">APPLY NOW</h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Tell us who you are and what role excites you. We respond to every application within 5 business days.
                  </p>

                  <div className="space-y-4">
                    {[
                      { step: "01", text: "Fill out the application form" },
                      { step: "02", text: "Our team reviews within 5 days" },
                      { step: "03", text: "Video call to get to know each other" },
                      { step: "04", text: "Trial period or onboarding begins" },
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-black text-accent">{item.step}</span>
                        </div>
                        <div className="text-sm text-muted-foreground pt-2.5">{item.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <JobApplicationForm />
              </ScrollReveal>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Enlist;
