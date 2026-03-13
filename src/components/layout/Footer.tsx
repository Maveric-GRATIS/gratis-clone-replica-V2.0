import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Settings } from "lucide-react";

const Column = ({
  title,
  links,
}: {
  title: string;
  links: { label: string; to: string; external?: boolean }[];
}) => (
  <div>
    <h3 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-[hsl(var(--brand-pink))]">
      {title}
    </h3>
    <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-foreground/70">
      {links.map((l) => (
        <li key={l.label}>
          {l.external ? (
            <a
              href={l.to}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[hsl(var(--brand-yellow))] story-link"
            >
              {l.label}
            </a>
          ) : (
            <Link
              to={l.to}
              className="hover:text-[hsl(var(--brand-yellow))] story-link"
            >
              {l.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const socialMediaLinks = [
    {
      label: "TikTok",
      to: "https://tiktok.com/@gratis",
      external: true,
    },
    {
      label: "Instagram",
      to: "https://instagram.com/gratis",
      external: true,
    },
    {
      label: "Pinterest",
      to: "https://pinterest.com/gratis",
      external: true,
    },
    {
      label: "Snapchat",
      to: "https://snapchat.com/add/gratis",
      external: true,
    },
    { label: "X", to: "https://x.com/gratis", external: true },
    {
      label: "Facebook",
      to: "https://facebook.com/gratis",
      external: true,
    },
    {
      label: "LinkedIn",
      to: "https://linkedin.com/company/gratis",
      external: true,
    },
    {
      label: "YouTube",
      to: "https://youtube.com/@gratis",
      external: true,
    },
  ];

  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
        <Column
          title="Giving"
          links={[
            { label: "Corporate Giving", to: "/spark/corporate-giving" },
            { label: "Honor & Memorial Gifts", to: "/spark/honor-memorial" },
            { label: "All Ways to Give (FAQ)", to: "/spark/all-ways-to-give" },
            { label: "Monthly Giving", to: "/spark/monthly-giving" },
            { label: "Phone, Mail & Crypto Donations", to: "/spark/donate" },
          ]}
        />
        <Column
          title="Reports"
          links={[
            {
              label: "Policies (Financial Policies)",
              to: "/reports/financial-policies",
            },
            { label: "Annual Reports", to: "/reports/annual-reports" },
            { label: "In-Kind Valuation", to: "/reports/in-kind-valuation" },
            { label: "Donation Policies", to: "/reports/donation-policies" },
          ]}
        />
        <Column
          title="Accreditation"
          links={[
            { label: "Compliance & Licenses", to: "/accreditation/compliance" },
            { label: "Leadership", to: "/accreditation/leadership" },
            { label: "EIN: 95-1831116", to: "/accreditation/ein" },
            { label: "ANBI Status", to: "/accreditation/anbi-status" },
            {
              label: "Rating (Charity Rating)",
              to: "/accreditation/charity-rating",
            },
          ]}
        />
        <Column
          title="Transparency"
          links={[
            { label: "Terms of Use", to: "/transparency/terms" },
            {
              label: "Rights (Brand Protection)",
              to: "/transparency/brand-protection",
            },
            {
              label: "User Privacy (Privacy Policy)",
              to: "/transparency/privacy",
            },
            { label: "Tracking (Cookie Policy)", to: "/transparency/cookies" },
            {
              label: "Help (Accessibility Policy)",
              to: "/transparency/accessibility",
            },
            {
              label: "Safety (Disclaimer & Donor Privacy)",
              to: "/transparency/safety",
            },
          ]}
        />
        <Column
          title="Information"
          links={[
            { label: "Contact", to: "/contact" },
            { label: "Organization (NGO)", to: "/tribe" },
            { label: "News", to: "/blog?tab=news" },
            { label: "NGO Partners", to: "/tribe/partners" },
            { label: "Employment (Careers)", to: "/spark/enlist" },
            { label: "Communications (Press & Media)", to: "/tribe/press" },
            { label: "Team (Programs)", to: "/tribe/team" },
          ]}
        />
        <Column title="Social media" links={socialMediaLinks} />
      </div>
      <FooterBottom currentYear={currentYear} />
    </footer>
  );
}

function FooterBottom({ currentYear }: { currentYear: number }) {
  const { user } = useAuth();
  const isEditor = user?.role === "editor" || user?.role === "admin";

  return (
    <div className="border-t border-border">
      <div className="container py-6 flex items-center justify-between text-xs text-foreground/60">
        <span>
          © {currentYear} G.R.A.T.I.S. Empower Change with Every Pack.
        </span>
        {user && isEditor && (
          <Link
            to="/cms"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Settings className="h-3.5 w-3.5" />
            CMS
          </Link>
        )}
      </div>
    </div>
  );
}
