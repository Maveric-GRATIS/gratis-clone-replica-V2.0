import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VolunteerForm } from "@/components/spark/VolunteerForm";
import { SEO } from "@/components/SEO";
import { PartyPopper, UserPlus, DollarSign, Megaphone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Blaze = () => {
  const testimonials = [
    {
      name: "Maya Chen",
      role: "Event Volunteer",
      quote: "Handing out free water at festivals and seeing people's reactions—that's what it's about. You feel the impact immediately.",
      avatar: "MC",
    },
    {
      name: "Jamal Williams",
      role: "Street Distribution",
      quote: "Every Saturday morning, I'm out there. The conversations I have with strangers? That's where the movement grows.",
      avatar: "JW",
    },
  ];

  return (
    <>
      <SEO 
        title="BLAZE: Ignite Change"
        description="Volunteer with GRATIS. Your time, your energy, your presence—that's what fuels the movement. Join us at events, street distribution, fundraising."
        canonical="https://gratis.ngo/spark/blaze"
      />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
          <div className="relative max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              BLAZE: IGNITE CHANGE
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Your time, your energy, your presence—that's what fuels the movement.
            </p>
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-6 py-3">
              <UserPlus className="w-5 h-5 text-primary" />
              <span className="font-semibold">342 Active Volunteers</span>
            </div>
          </div>
        </section>

        {/* Volunteer Opportunities */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">HOW YOU CAN HELP</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <Card className="bg-primary/5 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <CardHeader>
                  <PartyPopper className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>Event Support</CardTitle>
                  <CardDescription>Help at festivals, pop-ups, and community gatherings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">
                    Set up booths, engage crowds, distribute products, capture content.
                  </div>
                  <div className="text-xs font-semibold text-primary">
                    COMMITMENT: 1-3 days per event
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-accent/5 border-accent/20 hover:border-accent/40 transition-all hover:shadow-lg">
                <CardHeader>
                  <UserPlus className="w-12 h-12 text-accent mb-4" />
                  <CardTitle>Street Distribution</CardTitle>
                  <CardDescription>Hand out free water, spread the mission, connect</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">
                    Hit the streets, parks, transit hubs. Every bottle is a conversation.
                  </div>
                  <div className="text-xs font-semibold text-accent">
                    COMMITMENT: 2-4 hours weekly
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <CardHeader>
                  <DollarSign className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>Fundraising</CardTitle>
                  <CardDescription>Run campaigns, organize drives, mobilize supporters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">
                    Create fundraising events, online campaigns, corporate partnerships.
                  </div>
                  <div className="text-xs font-semibold text-primary">
                    COMMITMENT: Flexible, project-based
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-accent/5 border-accent/20 hover:border-accent/40 transition-all hover:shadow-lg">
                <CardHeader>
                  <Megaphone className="w-12 h-12 text-accent mb-4" />
                  <CardTitle>Mission Ambassadors</CardTitle>
                  <CardDescription>Be the voice of GRATIS in your community</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">
                    Represent the brand, host local events, build community networks.
                  </div>
                  <div className="text-xs font-semibold text-accent">
                    COMMITMENT: Ongoing representation
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Volunteer Form */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">JOIN THE CREW</h2>
            <VolunteerForm />
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">VOICES FROM THE MOVEMENT</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-card border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="w-12 h-12 border-2 border-primary/30">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                    <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Volunteer */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">WHY VOLUNTEER WITH GRATIS?</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="p-6 bg-card rounded-lg border border-border">
                <div className="text-2xl font-bold text-primary mb-2">REAL IMPACT</div>
                <p className="text-sm text-muted-foreground">
                  See the direct results of your work. Every interaction matters.
                </p>
              </div>
              <div className="p-6 bg-card rounded-lg border border-border">
                <div className="text-2xl font-bold text-accent mb-2">BUILD COMMUNITY</div>
                <p className="text-sm text-muted-foreground">
                  Connect with like-minded people who care about making a difference.
                </p>
              </div>
              <div className="p-6 bg-card rounded-lg border border-border">
                <div className="text-2xl font-bold text-primary mb-2">GROW SKILLS</div>
                <p className="text-sm text-muted-foreground">
                  Gain experience in event management, community organizing, and social impact.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Blaze;
