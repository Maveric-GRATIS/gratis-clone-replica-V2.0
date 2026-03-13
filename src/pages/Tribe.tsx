import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function Tribe() {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="GRATIS TRIBE — Our Values" description="Heritage, Ethics, Responsibility, Team, Standards." canonical="/tribe" />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
            TRIBE
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}>
            Born from the belief that every sip should serve a greater purpose.
          </p>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container py-16 space-y-12">
          <ScrollReveal>
            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold">What We Stand For</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                GRATIS isn't just water. It's a movement built on authenticity, respect, and responsibility. 
                Explore the values that drive everything we do.
              </p>
            </div>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                title: 'Heritage', 
                body: 'Born from street culture. Built on authenticity. Discover the origin story that shaped our mission.',
                to: '/tribe/heritage'
              },
              { 
                title: 'Ethics', 
                body: 'Fair trade, cultural respect, and community investment. Our commitment to doing right by everyone.',
                to: '/tribe/ethics'
              },
              { 
                title: 'Team', 
                body: 'Meet the diverse crew building GRATIS. Real people from the culture, creating something authentic.',
                to: '/tribe/team'
              },
              { 
                title: 'Standards', 
                body: 'Quality without compromise. Safety you can trust. Excellence in every bottle we produce.',
                to: '/tribe/standards'
              },
              { 
                title: 'Responsibility', 
                body: 'Environmental commitments that protect the planet that sustains us all. Action over words.',
                to: '/tribe/responsibility'
              },
            ].map((section, index) => (
              <ScrollReveal key={section.title} delay={index * 100}>
                <Link 
                  to={section.to}
                  className="group bg-muted/10 hover:bg-muted/20 rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 space-y-4 block h-full"
                >
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.body}
                  </p>
                  <div className="text-sm font-medium text-primary">
                    Learn more ?
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}