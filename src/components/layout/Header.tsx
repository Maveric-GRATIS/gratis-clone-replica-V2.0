import { Link, NavLink, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Menu, ChevronDown, ShoppingCart, Search } from "lucide-react";
import React from "react";
import UserProfile from "@/components/UserProfile";
import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import logoGratis from "@/assets/logo-gratis.png";
import { MegaMenu, MegaMenuSection } from "./MegaMenu";
import { SearchModal } from "@/components/SearchModal";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { NotificationCenter } from "@/components/NotificationCenter";

// Navigation structure with mega menu configurations
type SubLink = {
  to: string;
  label: string;
  description?: string;
  badge?: string;
  image?: string;
};
type MenuEntry =
  | { label: string; to: string }
  | {
      label: string;
      items: SubLink[];
      megaMenu?: { sections: MegaMenuSection[]; featured?: any };
    };

const MENU: MenuEntry[] = [
  {
    label: "GRATIS",
    items: [
      {
        to: "/gratis",
        label: "Shop All",
        description: "All beverage lines",
      },
      {
        to: "/gratis/water",
        label: "W.A.T.E.R",
        description: "Pure Still Water",
      },
      {
        to: "/gratis/theurgy",
        label: "THEURGY",
        description: "Wellness Functional Water",
        badge: "PRE-ORDER",
      },
      {
        to: "/gratis/fu",
        label: "F.U.",
        description: "Rebellious Functional Water",
        badge: "PRE-ORDER",
      },
    ],
    megaMenu: {
      sections: [
        {
          title: "Beverage Lines — G.R.A.T.I.S",
          links: [
            {
              to: "/gratis/water",
              label: "W.A.T.E.R",
              description: "Pure natural spring water",
            },
            {
              to: "/gratis/theurgy",
              label: "THEURGY",
              description: "Wellness functional water",
              badge: "PRE-ORDER",
            },
            {
              to: "/gratis/fu",
              label: "F.U.",
              description: "Rebellious energy water",
              badge: "PRE-ORDER",
            },
          ],
        },
      ],
      featured: {
        title: "Premium Hydration for a Purpose",
        description:
          "100% ad revenue donated to verified NGOs worldwide. Infinitely recyclable aluminum bottles.",
        image:
          "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
        link: "/gratis",
        badge: "Mission-Driven",
      },
    },
  },
  {
    label: "RIG",
    items: [
      {
        to: "/rig",
        label: "Shop All",
        description: "Explore all collections",
      },
      {
        to: "/rig/prime-picks",
        label: "Prime Picks",
        badge: "NEW",
      },
      {
        to: "/rig/apex-arrivals",
        label: "Apex Arrivals",
        badge: "NEW",
      },
      { to: "/rig/imbued-icons", label: "Imbued Icons" },
      { to: "/rig/dazzle-drip", label: "Dazzle Drip" },
      { to: "/rig/charmed-cozies", label: "Charmed Cozies" },
      {
        to: "/rig/occult-originals",
        label: "Occult Originals",
      },
      { to: "/rig/nexus-noggin", label: "Nexus Noggin" },
      {
        to: "/rig/nebula-novelties",
        label: "Nebula Novelties",
      },
    ],
    megaMenu: {
      sections: [
        {
          title: "Collections",
          links: [
            {
              to: "/rig/prime-picks",
              label: "Prime Picks",
              description: "Premium essentials",
              badge: "NEW",
              image:
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop",
            },
            {
              to: "/rig/apex-arrivals",
              label: "Apex Arrivals",
              description: "Just landed",
              badge: "NEW",
              image:
                "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100&h=100&fit=crop",
            },
            {
              to: "/rig/imbued-icons",
              label: "Imbued Icons",
              description: "Iconic designs",
              image:
                "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=100&h=100&fit=crop",
            },
            {
              to: "/rig/dazzle-drip",
              label: "Dazzle Drip",
              description: "Statement pieces",
              image:
                "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=100&h=100&fit=crop",
            },
          ],
        },
        {
          title: "More Styles",
          links: [
            {
              to: "/rig/charmed-cozies",
              label: "Charmed Cozies",
              description: "Comfort wear",
              image:
                "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100&h=100&fit=crop",
            },
            {
              to: "/rig/occult-originals",
              label: "Occult Originals",
              description: "Unique finds",
              image:
                "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=100&h=100&fit=crop",
            },
            {
              to: "/rig/nexus-noggin",
              label: "Nexus Noggin",
              description: "Headwear",
              image:
                "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=100&h=100&fit=crop",
            },
            {
              to: "/rig/nebula-novelties",
              label: "Nebula Novelties",
              description: "Fun extras",
              image:
                "https://images.unsplash.com/photo-1513094735237-8f2714d57c13?w=100&h=100&fit=crop",
            },
          ],
        },
      ],
      featured: {
        title: "Spring Collection 2026",
        description:
          "Fresh designs that make a difference. Shop the latest drops.",
        image:
          "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&h=400&fit=crop",
        link: "/rig",
        badge: "New Arrivals",
      },
    },
  },
  { label: "ARCANE", to: "/arcane" },
  {
    label: "TRIBE",
    items: [
      { to: "/tribe", label: "About TRIBE" },
      { to: "/tribe/heritage", label: "Heritage" },
      { to: "/tribe/ethics", label: "Ethics" },
      { to: "/tribe/accountability", label: "Accountability" },
      { to: "/tribe/team", label: "Team" },
      { to: "/tribe/standards", label: "Standards" },
      { to: "/tribe/responsibility", label: "Responsibility" },
      { to: "/tribe/transparency", label: "Transparency" },
      { to: "/tribe/signup", label: "Join TRIBE", badge: "Membership" },
    ],
    megaMenu: {
      sections: [
        {
          title: "About Us - HEART",
          description: "Heritage, Ethics, Actions, Responsibility, Trust",
          links: [
            {
              to: "/tribe",
              label: "About TRIBE",
              description: "Learn about our mission",
            },
            {
              to: "/tribe/heritage",
              label: "Heritage",
              description: "Our story and mission",
            },
            {
              to: "/tribe/ethics",
              label: "Ethics",
              description: "How we operate",
            },
            {
              to: "/tribe/accountability",
              label: "Accountability",
              description: "Verified impact tracking",
            },
            { to: "/tribe/team", label: "Team", description: "Meet the crew" },
          ],
        },
        {
          title: "Transparency & Trust",
          links: [
            {
              to: "/tribe/standards",
              label: "Standards",
              description: "Quality & compliance",
            },
            {
              to: "/tribe/responsibility",
              label: "Responsibility",
              description: "Environmental impact",
            },
            {
              to: "/tribe/transparency",
              label: "Transparency",
              description: "Open books & data",
            },
            {
              to: "/tribe/signup",
              label: "Join TRIBE",
              description: "Become a member",
              badge: "Membership",
            },
          ],
        },
      ],
    },
  },
  {
    label: "IMPACT TV",
    items: [
      { to: "/impact-tv/yarns", label: "Yarns" },
      { to: "/impact-tv/unveil", label: "Unveil" },
      { to: "/impact-tv/icon", label: "Icon" },
      { to: "/impact-tv/tales", label: "Tales" },
      { to: "/impact-tv/nexus", label: "Nexus" },
    ],
    megaMenu: {
      sections: [
        {
          title: "Stories & Impact - UNITY",
          description: "Unveil, Narrate, Inspire, Tell, Yours",
          links: [
            {
              to: "/impact-tv/yarns",
              label: "Yarns",
              description: "Community stories",
            },
            {
              to: "/impact-tv/unveil",
              label: "Unveil",
              description: "Behind the scenes",
            },
            {
              to: "/impact-tv/icon",
              label: "Icon",
              description: "Featured changemakers",
            },
            {
              to: "/impact-tv/tales",
              label: "Tales",
              description: "Impact narratives",
            },
            {
              to: "/impact-tv/nexus",
              label: "Nexus",
              description: "Connect with us",
            },
          ],
        },
      ],
    },
  },
  {
    label: "SPARK",
    items: [
      { to: "/spark/verve", label: "Verve" },
      { to: "/spark/infuse", label: "Infuse" },
      { to: "/spark/blaze", label: "Blaze" },
      { to: "/spark/enlist", label: "Enlist" },
    ],
    megaMenu: {
      sections: [
        {
          title: "Get Involved - VIBE",
          description: "Verve, Infuse, Blaze, Enlist",
          links: [
            {
              to: "/spark/verve",
              label: "Verve (Donate)",
              description: "Fuel the movement with donations",
            },
            {
              to: "/spark/infuse",
              label: "Infuse (Invest)",
              description: "Invest in sustainable futures",
            },
            {
              to: "/spark/blaze",
              label: "Blaze (Volunteer)",
              description: "Ignite change with your time",
            },
            {
              to: "/spark/enlist",
              label: "Enlist (Careers)",
              description: "Join the team",
            },
          ],
        },
      ],
      featured: {
        title: "Make Your Impact",
        description:
          "Every action counts. Donate, invest, volunteer, or join us full-time.",
        image:
          "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop",
        link: "/spark/verve",
        badge: "Start Today",
      },
    },
  },
  {
    label: "MORE",
    items: [
      { to: "/community", label: "Community" },
      { to: "/leaderboard", label: "Leaderboard" },
      { to: "/volunteer", label: "Volunteer" },
      { to: "/partners", label: "Partners" },
      { to: "/corporate", label: "Corporate" },
      { to: "/press", label: "Press & Media" },
      { to: "/impact", label: "Our Impact" },
      { to: "/impact/projects", label: "Impact Projects" },
      { to: "/events", label: "Events" },
      { to: "/videos", label: "Videos" },
      { to: "/ngo-application", label: "NGO Application" },
      { to: "/contact", label: "Contact" },
      { to: "/faq", label: "FAQ" },
      { to: "/part8-test", label: "Part 8 Features" },
      { to: "/part9-test", label: "Part 9 Features" },
      { to: "/part10-test", label: "Part 10 Features" },
      { to: "/part11-test", label: "Part 11 Enterprise" },
      { to: "/part12-test", label: "Part 12 DevOps" },
      { to: "/part13-test", label: "Part 13 Infrastructure" },
    ],
    megaMenu: {
      sections: [
        {
          title: "Resources",
          links: [
            {
              to: "/partners",
              label: "Partners",
              description: "Our network of changemakers",
            },
            {
              to: "/corporate",
              label: "Corporate Partnerships",
              description: "Business collaboration opportunities",
            },
            {
              to: "/press",
              label: "Press & Media",
              description: "Press releases and media kit",
            },
            {
              to: "/impact",
              label: "Our Impact",
              description: "Real-time impact dashboard",
            },
          ],
        },
        {
          title: "Connect",
          links: [
            {
              to: "/events",
              label: "Events",
              description: "Upcoming events and gatherings",
            },
            {
              to: "/videos",
              label: "Videos",
              description: "Watch our impact stories",
            },
            {
              to: "/ngo-application",
              label: "NGO Application",
              description: "Apply to receive support",
            },
            {
              to: "/contact",
              label: "Contact",
              description: "Get in touch with us",
            },
            {
              to: "/faq",
              label: "FAQ",
              description: "Frequently asked questions",
            },
          ],
        },
      ],
    },
  },
];

export default function Header() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const { totalItems, openCart } = useCart();
  const [showSearch, setShowSearch] = React.useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = React.useState(false);

  const [openMenu, setOpenMenu] = React.useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const openTimer = React.useRef<number | null>(null);
  const closeTimer = React.useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Altijd zichtbaar bij de top
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else {
        // Toon navbar bij omhoog scrollen, verberg bij omlaag scrollen
        if (currentScrollY < lastScrollY) {
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false);
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleOpen = (key: string) => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    if (openTimer.current) window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(() => setOpenMenu(key), 80); // openDelay 80ms
  };

  const handleClose = () => {
    if (openTimer.current) {
      window.clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setOpenMenu(null);
    }, 300); // closeDelay 300ms - longer delay
  };

  const isActivePath = (paths?: string[]) =>
    paths?.some((p) => location.pathname.startsWith(p)) ?? false;

  // Check if we're at top of page
  const isAtTop = lastScrollY < 50;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${
        isHeaderHovered || openMenu || !isAtTop
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95 border-b border-border"
          : "bg-transparent"
      }`}
      onMouseEnter={() => {
        setIsHeaderHovered(true);
        if (closeTimer.current) {
          window.clearTimeout(closeTimer.current);
          closeTimer.current = null;
        }
      }}
      onMouseLeave={() => {
        setIsHeaderHovered(false);
        handleClose();
      }}
    >
      <div
        className="container flex items-center justify-between"
        style={{ height: "72px" }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={logoGratis}
            alt="GRATIS - Home"
            className="h-14 w-auto object-contain hover:opacity-80 transition-opacity"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:block">
          <ul role="menubar" className="flex items-stretch">
            {MENU.map((item) => {
              const key = item.label;
              let active = false;
              if ("items" in item) {
                active = isActivePath(item.items.map((i) => i.to));
              } else {
                active = location.pathname.startsWith(item.to);
              }

              return (
                <li
                  key={key}
                  role="none"
                  className="relative flex items-center px-5 static md:relative"
                  onMouseEnter={() => {
                    if ("items" in item) handleOpen(key);
                  }}
                >
                  {"items" in item ? (
                    <button
                      className={`uppercase font-bold tracking-[0.04em] text-sm transition-colors hover:text-[hsl(var(--brand-yellow))] ${
                        active || openMenu === key
                          ? "text-[hsl(var(--brand-yellow))]"
                          : "text-foreground/90"
                      } flex items-center gap-1 ${openMenu === key ? "opacity-100" : "opacity-90"}`}
                      aria-haspopup="true"
                      aria-expanded={openMenu === key}
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-3.5 w-3.5 opacity-80 transition-transform duration-200 ${
                          openMenu === key ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>
                  ) : (
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `uppercase font-bold tracking-[0.04em] text-sm transition-colors hover:text-[hsl(var(--brand-yellow))] ${
                          isActive
                            ? "text-[hsl(var(--brand-yellow))]"
                            : "text-foreground/90"
                        }`
                      }
                      role="menuitem"
                    >
                      {item.label}
                    </NavLink>
                  )}

                  {active && (
                    <span className="pointer-events-none absolute left-0 right-0 -bottom-px h-[2px] bg-[hsl(var(--brand-blue))]" />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowGlobalSearch(true)}
            className="hidden md:flex"
            title="Search (⌘K)"
          >
            <Search className="h-5 w-5" />
          </Button>
          <ThemeToggle />
          <LanguageSwitcher />
          <NotificationCenter />
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={openCart}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {totalItems}
              </Badge>
            )}
          </Button>
          <UserProfile />
          <div className="hidden md:block">
            <Button variant="hero" size={isMobile ? "sm" : "default"} asChild>
              <Link to="/rig">Shop</Link>
            </Button>
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85%] sm:w-[360px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center">
                    <img
                      src={logoGratis}
                      alt="GRATIS - Home"
                      className="h-12 w-auto object-contain"
                    />
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                    <span className="text-sm font-medium text-foreground/70">
                      Theme
                    </span>
                    <ThemeToggle />
                  </div>
                  <Accordion type="multiple" className="w-full">
                    {MENU.map((item) => {
                      if ("items" in item) {
                        return (
                          <AccordionItem key={item.label} value={item.label}>
                            <AccordionTrigger className="uppercase text-sm font-bold tracking-[0.04em]">
                              {item.label}
                            </AccordionTrigger>
                            <AccordionContent>
                              <ul className="py-1">
                                {item.items.map((sub) => (
                                  <li key={sub.label}>
                                    <NavLink
                                      to={sub.to}
                                      className={({ isActive }) =>
                                        `block px-1.5 py-2 text-sm ${
                                          isActive
                                            ? "text-[hsl(var(--brand-yellow))]"
                                            : "text-foreground/90 hover:text-[hsl(var(--brand-yellow))]"
                                        }`
                                      }
                                    >
                                      {sub.label}
                                    </NavLink>
                                  </li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      }
                      return (
                        <div key={item.label} className="py-1">
                          <NavLink
                            to={item.to}
                            className={({ isActive }) =>
                              `block py-2 uppercase text-sm font-bold tracking-[0.04em] ${
                                isActive
                                  ? "text-[hsl(var(--brand-yellow))]"
                                  : "text-foreground/90 hover:text-[hsl(var(--brand-yellow))]"
                              }`
                            }
                          >
                            {item.label}
                          </NavLink>
                        </div>
                      );
                    })}
                  </Accordion>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Mega Menu - appears when menu is open */}
      {openMenu &&
        MENU.find((m) => m.label === openMenu) &&
        "megaMenu" in MENU.find((m) => m.label === openMenu)! && (
          <MegaMenu
            sections={
              (MENU.find((m) => m.label === openMenu) as any).megaMenu.sections
            }
            featured={
              (MENU.find((m) => m.label === openMenu) as any).megaMenu.featured
            }
          />
        )}

      {/* Fallback second navbar row for menus without mega menu */}
      {openMenu &&
        MENU.find((m) => m.label === openMenu) &&
        !("megaMenu" in MENU.find((m) => m.label === openMenu)!) && (
          <div className="border-t border-border bg-background/95 backdrop-blur">
            <div className="w-full px-4">
              <nav className="flex items-center justify-center gap-0.5 py-3 flex-wrap max-w-full">
                {MENU.find((m) => m.label === openMenu) &&
                  "items" in MENU.find((m) => m.label === openMenu)! &&
                  (
                    MENU.find((m) => m.label === openMenu) as {
                      label: string;
                      items: SubLink[];
                    }
                  ).items.map((sub) => (
                    <NavLink
                      key={sub.label}
                      to={sub.to}
                      className={({ isActive }) =>
                        `px-3 py-2 text-sm font-semibold uppercase tracking-wide whitespace-nowrap transition-colors rounded-md ${
                          isActive
                            ? "text-[hsl(var(--brand-yellow))] bg-[hsl(0_0%_16%)]"
                            : "text-foreground/80 hover:text-[hsl(var(--brand-yellow))] hover:bg-[hsl(0_0%_10%)]"
                        }`
                      }
                      onClick={() => setOpenMenu(null)}
                    >
                      {sub.label}
                    </NavLink>
                  ))}
              </nav>
            </div>
          </div>
        )}

      {/* Search Modal */}
      <SearchModal open={showSearch} onOpenChange={setShowSearch} />

      {/* Global Search (Part 7) */}
      <GlobalSearch
        open={showGlobalSearch}
        onOpenChange={setShowGlobalSearch}
      />
    </header>
  );
}
