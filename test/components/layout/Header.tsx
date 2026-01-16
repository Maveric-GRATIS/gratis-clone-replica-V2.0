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
    items: [
      { to: "/rig-store", label: "Shop All" },
      { to: "/rig-store/collection/prime-picks", label: "Prime Picks" },
      { to: "/rig-store/collection/apex-arrivals", label: "Apex Arrivals" },
      { to: "/rig-store/collection/imbued-icons", label: "Imbued Icons" },
      { to: "/rig-store/collection/dazzle-drip", label: "Dazzle Drip" },
      { to: "/rig-store/collection/charmed-cozies", label: "Charmed Cozies" },
      {
        to: "/rig-store/collection/occult-originals",
        label: "Occult Originals",
      },
      { to: "/rig-store/collection/nexus-noggin", label: "Nexus Noggin" },
      {
        to: "/rig-store/collection/nebula-novelties",
        label: "Nebula Novelties",
      },
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
  const openTimer = React.useRef<number | null>(null);
  const closeTimer = React.useRef<number | null>(null);

  const handleOpen = (key: string) => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    if (openTimer.current) window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(() => setOpenMenu(key), 80); // openDelay 80ms
  };

  const handleClose = (key: string) => {
    if (openTimer.current) {
      window.clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setOpenMenu((prev) => (prev === key ? null : prev));
    }, 120); // closeDelay 120ms
  };

  const isActivePath = (paths?: string[]) =>
    paths?.some((p) => location.pathname.startsWith(p)) ?? false;

  return (
    <header className="sticky top-0 z-[100] bg-background backdrop-blur supports-[backdrop-filter]:bg-background border-b border-border">
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
                  onMouseLeave={() => {
                    if ("items" in item) handleClose(key);
                  }}
                  onFocus={() => {
                    if ("items" in item) setOpenMenu(key);
                  }}
                  onBlur={() => {
                    if ("items" in item) setOpenMenu(null);
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

                  {"items" in item && (
                    <div
                      role="menu"
                      className={`absolute ${
                        key === "SPARK" || key === "IMPACT TV"
                          ? "right-0"
                          : "left-0"
                      } top-full mt-2 z-[200] dropdown-menu border border-border rounded-lg shadow-2xl transition-all duration-200 ease-out contain-paint ${
                        openMenu === key
                          ? "opacity-100 translate-y-0 pointer-events-auto visible will-change-transform"
                          : "opacity-0 -translate-y-1.5 pointer-events-none invisible"
                      }`}
                      style={{
                        minWidth: "min(calc(100vw - 2rem), max-content)",
                        maxWidth:
                          item.items.length <= 3
                            ? "420px"
                            : item.items.length <= 6
                              ? "580px"
                              : "720px",
                      }}
                    >
                      <div
                        className="p-5 grid gap-x-6 gap-y-3"
                        style={{
                          gridTemplateColumns:
                            item.items.length <= 3
                              ? `repeat(${item.items.length}, 1fr)`
                              : item.items.length <= 6
                                ? "repeat(2, 1fr)"
                                : item.items.length <= 9
                                  ? "repeat(3, 1fr)"
                                  : "repeat(3, 1fr)",
                        }}
                      >
                        {item.items.map((sub) => (
                          <NavLink
                            key={sub.label}
                            to={sub.to}
                            role="menuitem"
                            className={({ isActive }) =>
                              `block px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--brand-yellow))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(0_0%_6%)] ${
                                isActive
                                  ? "text-[hsl(var(--brand-yellow))] bg-[hsl(0_0%_16%)] font-semibold border border-[hsl(var(--brand-yellow)/0.3)]"
                                  : "text-foreground hover:text-[hsl(var(--brand-yellow))] hover:bg-[hsl(0_0%_14%)]"
                              }`
                            }
                            onClick={() => setOpenMenu(null)}
                          >
                            {sub.label}
                          </NavLink>
                        ))}
                      </div>
                    </div>
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
    </header>
  );
}
