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
import { Menu, ChevronDown, ShoppingCart } from "lucide-react";
import React from "react";
import UserProfile from "@/components/UserProfile";
import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import logoGratis from "@/assets/logo-gratis.png";

// Navigation structure per spec (hover dropdowns)
type SubLink = { to: string; label: string };
type MenuEntry =
  | { label: string; to: string }
  | { label: string; items: SubLink[] };

const MENU: MenuEntry[] = [
  {
    label: "GRATIS",
    items: [
      { to: "/water", label: "Water" },
      { to: "/theurgy", label: "Theurgy" },
      { to: "/fu", label: "F.U." },
    ],
  },
  {
    label: "RIG",
    // Updated to point to the new rig-store page
    items: [
      { to: "/rig-store", label: "Shop All" },
      { to: "/rig-store", label: "Prime Picks" },
      { to: "/rig-store", label: "Apex Arrivals" },
      { to: "/rig-store", label: "Imbued Icons" },
      { to: "/rig-store", label: "Dazzle Drip" },
      { to: "/rig-store", label: "Charmed Cozies" },
      { to: "/rig-store", label: "Occult Originals" },
      { to: "/rig-store", label: "Nexus Noggin" },
      { to: "/rig-store", label: "Nebula Novelties" },
      { to: "/rig-store", label: "Enchanted Exclusives" },
      { to: "/rig-store", label: "Cursed Countdown" },
      { to: "/rig-store", label: "Thaumaturge Trove" },
    ],
  },
  { label: "ARCANE", to: "/arcane" },
  {
    label: "TRIBE",
    items: [
      { to: "/tribe/heritage", label: "Heritage" },
      { to: "/tribe/ethics", label: "Ethics" },
      { to: "/tribe/team", label: "Team" },
      { to: "/tribe/standards", label: "Standards" },
      { to: "/tribe/responsibility", label: "Responsibility" },
    ],
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
  },
  {
    label: "SPARK",
    items: [
      { to: "/spark/verve", label: "Verve" },
      { to: "/spark/infuse", label: "Infuse" },
      { to: "/spark/blaze", label: "Blaze" },
      { to: "/spark/enlist", label: "Enlist" },
    ],
  },
];

export default function Header() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const { totalItems, openCart } = useCart();

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
          <ThemeToggle />
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
              <Link to="/rig-store">Shop</Link>
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

      {/* Second navbar row - appears when menu is open */}
      {openMenu && (
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
    </header>
  );
}
