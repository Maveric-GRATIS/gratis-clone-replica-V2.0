import SEO from "@/components/SEO";
import { Link } from "react-router-dom";

export default function ImpactTV() {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="GRATIS IMPACT TV" description="Stories, live events, films, shows, and clips." canonical={typeof window !== 'undefined' ? window.location.href : '/impact-tv'} />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            IMPACT TV
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Unveil. Nexus. Icon. Tales. Yarns.
          </p>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container py-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link to="/impact-tv/nexus" className="group">
            <article className="rounded-lg border border-border p-4 hover-scale">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-md" />
              <h3 className="mt-4 text-lg font-semibold group-hover:text-primary transition-colors">Nexus</h3>
              <p className="mt-2 text-sm text-muted-foreground">Discover stories, culture, and impact from around the globe.</p>
            </article>
          </Link>
          
          <Link to="/impact-tv/yarns" className="group">
            <article className="rounded-lg border border-border p-4 hover-scale">
              <div className="aspect-video bg-gradient-to-br from-accent/20 to-primary/20 rounded-md" />
              <h3 className="mt-4 text-lg font-semibold group-hover:text-primary transition-colors">Yarns</h3>
              <p className="mt-2 text-sm text-muted-foreground">Live events and replays from festivals and activations.</p>
            </article>
          </Link>
          
          <Link to="/impact-tv/unveil" className="group">
            <article className="rounded-lg border border-border p-4 hover-scale">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-md" />
              <h3 className="mt-4 text-lg font-semibold group-hover:text-primary transition-colors">Unveil</h3>
              <p className="mt-2 text-sm text-muted-foreground">Feature-length films and cinematic documentaries.</p>
            </article>
          </Link>
          
          <Link to="/impact-tv/icon" className="group">
            <article className="rounded-lg border border-border p-4 hover-scale">
              <div className="aspect-video bg-gradient-to-br from-accent/20 to-primary/20 rounded-md" />
              <h3 className="mt-4 text-lg font-semibold group-hover:text-primary transition-colors">Icon</h3>
              <p className="mt-2 text-sm text-muted-foreground">Binge-worthy series exploring cities and communities.</p>
            </article>
          </Link>
          
          <Link to="/impact-tv/tales" className="group">
            <article className="rounded-lg border border-border p-4 hover-scale">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-md" />
              <h3 className="mt-4 text-lg font-semibold group-hover:text-primary transition-colors">Tales</h3>
              <p className="mt-2 text-sm text-muted-foreground">Quick clips and bite-sized moments from our journey.</p>
            </article>
          </Link>
        </div>
      </section>
    </div>
  );
}
