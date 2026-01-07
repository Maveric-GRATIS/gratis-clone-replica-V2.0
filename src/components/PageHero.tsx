interface PageHeroProps {
  title: string;
  subtitle?: string;
  lastUpdated?: string;
}

export function PageHero({ title, subtitle, lastUpdated }: PageHeroProps) {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
      <div className="relative max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl md:text-2xl text-muted-foreground">
            {subtitle}
          </p>
        )}
        {lastUpdated && (
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: {lastUpdated}
          </p>
        )}
      </div>
    </section>
  );
}
