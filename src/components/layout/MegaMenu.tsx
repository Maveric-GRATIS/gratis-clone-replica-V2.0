import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export interface MegaMenuSection {
  title: string;
  description?: string;
  links: Array<{
    to: string;
    label: string;
    description?: string;
    badge?: string;
    image?: string;
  }>;
}

export interface MegaMenuProps {
  sections: MegaMenuSection[];
  featured?: {
    title: string;
    description: string;
    image: string;
    link: string;
    badge?: string;
  };
  onClose?: () => void;
}

export function MegaMenu({ sections, featured, onClose }: MegaMenuProps) {
  return (
    <div className="absolute left-0 right-0 top-full bg-background/95 backdrop-blur-xl border-t border-white/10 shadow-2xl">
      <div className="container py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Main sections */}
          <div
            className={`${featured ? "col-span-8" : "col-span-12"} grid gap-8 ${sections.length === 1 ? "grid-cols-1" : sections.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}
          >
            {sections.map((section, idx) => (
              <div key={idx}>
                {section.title && (
                  <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/70 mb-4 px-1">
                    {section.title}
                  </h3>
                )}
                {section.description && (
                  <p className="text-xs text-muted-foreground mb-3 px-1">
                    {section.description}
                  </p>
                )}
                <ul className="space-y-1">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link
                        to={link.to}
                        onClick={onClose}
                        className="group flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 hover:backdrop-blur-sm transition-all"
                      >
                        {link.image && (
                          <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={link.image}
                              alt={link.label}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-semibold text-sm group-hover:text-[hsl(var(--brand-yellow))] transition-colors">
                              {link.label}
                            </span>
                            {link.badge && (
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[hsl(var(--brand-yellow))]/20 text-[hsl(var(--brand-yellow))]">
                                {link.badge}
                              </span>
                            )}
                          </div>
                          {link.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {link.description}
                            </p>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Featured section */}
          {featured && (
            <div className="col-span-4">
              <Link
                to={featured.link}
                onClick={onClose}
                className="group block"
              >
                <Card className="overflow-hidden border-2 border-white/20 hover:border-[hsl(var(--brand-yellow))]/50 transition-all bg-background/40 backdrop-blur-sm">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted/50">
                    <img
                      src={featured.image}
                      alt={featured.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {featured.badge && (
                      <div className="absolute top-3 right-3 bg-[hsl(var(--brand-yellow))] text-background font-bold text-xs px-3 py-1 rounded-full">
                        {featured.badge}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-lg mb-2 group-hover:text-[hsl(var(--brand-yellow))] transition-colors">
                      {featured.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {featured.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm font-semibold text-[hsl(var(--brand-yellow))]">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
