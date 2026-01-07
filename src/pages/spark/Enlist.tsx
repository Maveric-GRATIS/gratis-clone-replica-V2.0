import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { JobApplicationForm } from "@/components/spark/JobApplicationForm";
import { SEO } from "@/components/SEO";
import { Briefcase, Clock, Award, Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Enlist = () => {
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const jobs = [
    {
      id: "event-coordinator",
      title: "Event Coordinator",
      type: "Temporary",
      compensation: "€150/day stipend",
      category: "volunteer",
      description: "Coordinate logistics for festivals, pop-ups, and community events. Manage volunteers, liaise with venues, ensure smooth operations.",
      requirements: ["Event management experience", "Strong organizational skills", "Available weekends"],
    },
    {
      id: "distribution-lead",
      title: "Distribution Lead",
      type: "Temporary",
      compensation: "€120/day stipend",
      category: "volunteer",
      description: "Lead street distribution teams, manage inventory, track impact metrics, train new volunteers.",
      requirements: ["Leadership experience", "Comfortable in outdoor environments", "Valid driver's license"],
    },
    {
      id: "marketing-intern",
      title: "Marketing & Social Media Intern",
      type: "Internship",
      compensation: "€500/month",
      category: "internship",
      description: "Create content, manage social channels, analyze engagement metrics, develop campaigns.",
      requirements: ["Currently enrolled or recent graduate", "3-6 month commitment", "Portfolio of social media work"],
    },
    {
      id: "impact-intern",
      title: "Impact Analysis Intern",
      type: "Internship",
      compensation: "€500/month",
      category: "internship",
      description: "Track donation impact, compile reports, communicate with beneficiaries, maintain impact dashboard.",
      requirements: ["Data analysis skills", "Research background", "Passion for social impact"],
    },
    {
      id: "operations-manager",
      title: "Operations Manager",
      type: "Full-Time",
      compensation: "€3,200-4,000/month",
      category: "fulltime",
      description: "Oversee day-to-day NGO operations, manage supply chain, coordinate distribution networks, optimize processes.",
      requirements: ["3+ years operations experience", "NGO or logistics background", "Proven team leadership"],
    },
    {
      id: "partnerships-manager",
      title: "Partnerships Manager",
      type: "Full-Time",
      compensation: "€3,500-4,500/month",
      category: "fulltime",
      description: "Build brand partnerships, negotiate advertising deals, maintain NGO relationships, drive revenue growth.",
      requirements: ["Partnership/sales experience", "Strong negotiation skills", "Extensive network"],
    },
  ];

  return (
    <>
      <SEO 
        title="ENLIST: Build With Us"
        description="Join the GRATIS team. Open positions for volunteers, interns, full-time staff, and brand ambassadors. Get paid to make a difference."
        canonical="https://gratis.ngo/spark/enlist"
      />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-primary/10 to-background" />
          <div className="relative max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
              ENLIST: BUILD WITH US
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Join the team. Shape the future. Get paid to make a difference.
            </p>
          </div>
        </section>

        {/* Current Openings */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">CURRENT OPENINGS</h2>
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card 
                  key={job.id} 
                  className={`transition-all cursor-pointer ${
                    expandedJob === job.id 
                      ? 'border-primary/40 shadow-lg' 
                      : 'border-border hover:border-primary/20'
                  }`}
                  onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl">{job.title}</CardTitle>
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            {job.type}
                          </Badge>
                        </div>
                        <CardDescription className="text-base">{job.compensation}</CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedJob(expandedJob === job.id ? null : job.id);
                        }}
                      >
                        {expandedJob === job.id ? '−' : '+'}
                      </Button>
                    </div>
                  </CardHeader>
                  {expandedJob === job.id && (
                    <CardContent className="space-y-4 border-t border-border pt-4">
                      <div>
                        <div className="font-semibold mb-2">Description</div>
                        <p className="text-sm text-muted-foreground">{job.description}</p>
                      </div>
                      <div>
                        <div className="font-semibold mb-2">Requirements</div>
                        <ul className="space-y-1">
                          {job.requirements.map((req, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary">•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Ambassador Program */}
        <section className="py-16 px-4 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Rocket className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">GRATIS BRAND AMBASSADOR</h2>
              <Badge variant="secondary" className="bg-accent/20 text-accent-foreground text-base px-4 py-2">
                Flexible • Mission-Driven • High Impact
              </Badge>
            </div>

            <Card className="bg-card/50 backdrop-blur border-primary/30">
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-3">What You'll Do</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-primary">✓</span>
                      <span>Represent GRATIS in your city/community</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-primary">✓</span>
                      <span>Drive local brand partnerships and advertising deals</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-primary">✓</span>
                      <span>Organize community events and distribution activations</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-primary">✓</span>
                      <span>Build networks with NGOs, influencers, and local leaders</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3">Perks & Compensation</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <Award className="w-8 h-8 text-primary mb-2" />
                      <div className="font-semibold">Free Products</div>
                      <div className="text-xs text-muted-foreground">Unlimited personal supply</div>
                    </div>
                    <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                      <Briefcase className="w-8 h-8 text-accent mb-2" />
                      <div className="font-semibold">Monthly Stipend</div>
                      <div className="text-xs text-muted-foreground">€100-150/month for active ambassadors</div>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <Clock className="w-8 h-8 text-primary mb-2" />
                      <div className="font-semibold">Flexible Hours</div>
                      <div className="text-xs text-muted-foreground">Work on your terms</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-accent">•</span>
                      <span>Deep passion for GRATIS mission and values</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-accent">•</span>
                      <span>Strong local presence and network (500+ social following preferred)</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-accent">•</span>
                      <span>Entrepreneurial mindset with sales/partnership experience</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-accent">•</span>
                      <span>Self-motivated, organized, and community-oriented</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Application Form */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">APPLY NOW</h2>
            <JobApplicationForm />
          </div>
        </section>

        {/* Why Work at GRATIS */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">WHY WORK AT GRATIS?</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="p-6 bg-card rounded-lg border border-border">
                <div className="text-2xl font-bold text-primary mb-2">TRANSPARENCY</div>
                <p className="text-sm text-muted-foreground">
                  No corporate BS. Open books, honest conversations.
                </p>
              </div>
              <div className="p-6 bg-card rounded-lg border border-border">
                <div className="text-2xl font-bold text-accent mb-2">IMPACT</div>
                <p className="text-sm text-muted-foreground">
                  See your work change lives in real-time.
                </p>
              </div>
              <div className="p-6 bg-card rounded-lg border border-border">
                <div className="text-2xl font-bold text-primary mb-2">AUTHENTICITY</div>
                <p className="text-sm text-muted-foreground">
                  Be yourself. Bring your full identity to work.
                </p>
              </div>
              <div className="p-6 bg-card rounded-lg border border-border">
                <div className="text-2xl font-bold text-accent mb-2">EVERYONE WINS</div>
                <p className="text-sm text-muted-foreground">
                  Fair pay, flexible work, meaningful mission.
                </p>
              </div>
            </div>
            <div className="mt-12">
              <Link to="/tribe/team">
                <Button variant="outline" size="lg" className="border-primary/30 hover:border-primary/60">
                  Meet the Team
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Enlist;
