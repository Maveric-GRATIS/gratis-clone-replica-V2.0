import SEO from "@/components/SEO";

export default function Heritage() {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Heritage — GRATIS TRIBE" 
        description="The origin story of GRATIS water. Born from street culture and authentic urban experiences." 
        canonical={typeof window !== 'undefined' ? window.location.href : '/tribe/heritage'} 
      />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            GRATIS WON'T SAVE THE WORLD
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            But we'll keep you hydrated while funding NGOs and supporting diverse 
            projects worldwide. Because every sip counts.
          </p>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container py-16 space-y-20">
          
          {/* Opening Statement */}
          <article className="max-w-4xl space-y-6">
            <p className="text-lg md:text-xl leading-relaxed">
              GRATIS will not solve all the world's problems. But make no mistake, our infinitely 
              recyclable bottles of premium water will absolutely <strong>quench your thirst</strong> while 
              donating earnings to NGO partners fighting for clean water, education, arts, environment, 
              and community programs worldwide.
            </p>
            <p className="text-lg md:text-xl leading-relaxed">
              Why? Because for decades, all the coolest brands kept 100% of profits while pretending 
              to care with token "charity initiatives." But those days are over.
            </p>
          </article>

          {/* Origin Story */}
          <article className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-extrabold">Born in Amsterdam</h2>
              <p className="text-muted-foreground leading-relaxed">
                GRATIS started in the Netherlands with a simple question from a multicultural crew 
                who'd seen enough corporate BS: <em>What if premium water could fund real causes, 
                taste incredible, AND look fire?</em>
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We grew up in one of the most diverse cities on earth. We learned that diversity 
                makes everything better — ideas, culture, impact. So why should our giving be boring 
                and one-dimensional?
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We're not reinventing charity. We're just making it accessible, transparent, and 
                actually fun. No guilt trips. No corporate virtue signaling. Just real impact through 
                something you already do: stay hydrated.
              </p>
            </div>
            <div className="bg-accent/20 rounded-lg p-8 md:p-12 space-y-6">
              <h3 className="text-xl font-bold">The Multicultural Edge</h3>
              <p className="text-muted-foreground">
                Our backgrounds taught us to see problems from different angles and support diverse 
                solutions. That's why we partner with NGOs across sectors — clean water in one region, 
                arts education in another, environmental restoration somewhere else.
              </p>
              <p className="text-muted-foreground font-medium">
                Everyone wins. That's the movement.
              </p>
            </div>
          </article>

          {/* How We Roll */}
          <article className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-extrabold">How We Roll</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4 bg-primary/5 p-6 rounded-lg">
                <div className="text-4xl font-bold text-primary">01</div>
                <h3 className="text-xl font-semibold">You Buy GRATIS</h3>
                <p className="text-muted-foreground">
                  Premium water that tastes good, looks good, and makes you feel good about your choice.
                </p>
              </div>
              <div className="space-y-4 bg-primary/5 p-6 rounded-lg">
                <div className="text-4xl font-bold text-primary">02</div>
                <h3 className="text-xl font-semibold">We Partner With NGOs</h3>
                <p className="text-muted-foreground">
                  We don't pretend to be experts at everything. We team up with established organizations 
                  who know their sectors.
                </p>
              </div>
              <div className="space-y-4 bg-primary/5 p-6 rounded-lg">
                <div className="text-4xl font-bold text-primary">03</div>
                <h3 className="text-xl font-semibold">Earnings Go to Impact</h3>
                <p className="text-muted-foreground">
                  Clean water projects, education programs, arts initiatives, environmental restoration. 
                  Diverse impact for a diverse world.
                </p>
              </div>
            </div>
          </article>

          {/* Transparency Section */}
          <article className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-8 md:p-12 space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold">Real Recognize Real</h2>
            <p className="text-lg leading-relaxed">
              We don't keep everything. We share everything. Our earnings support NGO partners fighting 
              for causes that matter. We're transparent about where the money goes because that's what 
              real people demand.
            </p>
            <p className="text-lg leading-relaxed">
              No fake charity flex. No boardroom philanthropy theater. Just direct partnerships with 
              organizations making real change. You hydrate, causes get funded, communities get support. 
              <strong className="block mt-4">Everyone. Wins.</strong>
            </p>
          </article>

          {/* The Fun Part */}
          <article className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 bg-muted/20 rounded-lg p-8 md:p-12">
              <blockquote className="text-xl font-bold leading-relaxed">
                "Making impact shouldn't feel like homework. It should feel like the most natural thing 
                in the world — because it is."
              </blockquote>
              <cite className="text-sm text-muted-foreground mt-6 block">— GRATIS Founders, Amsterdam</cite>
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-extrabold">The Fun Part</h2>
              <p className="text-muted-foreground leading-relaxed">
                We make impact accessible and enjoyable. Not guilt-driven. Not performative. Just real.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Street culture taught us: authenticity beats everything. You can't fake being real. 
                You can't fake caring. So we built a model where your everyday choice — grabbing water — 
                becomes contribution without even thinking about it.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The Netherlands taught us diversity makes us stronger. Multicultural perspectives drive 
                better solutions. Supporting one cause is good. Supporting diverse causes across sectors 
                and communities? That's the movement.
              </p>
            </div>
          </article>

          {/* Vision */}
          <article className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-extrabold">The GRATIS Vision</h2>
            <p className="text-xl leading-relaxed">
              Soon, every bottle of water will fund good causes. Every hydration choice will be a vote 
              for the world you want to see. Every sip will support communities, education, clean water, 
              arts, and environment.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              But enough about us and our story.
            </p>
            <p className="text-2xl font-bold mt-8">
              Join the movement. Make your sip count.
            </p>
          </article>

        </div>
      </section>
    </div>
  );
}