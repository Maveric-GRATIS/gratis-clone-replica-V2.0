import { Link } from "react-router-dom";

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

  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-8 sm:py-10 md:py-12 px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8">
        <Column
          title="Follow GRATIS"
          links={[
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
          ]}
        />
        <Column
          title="Giving"
          links={[
            { label: "Corporate Giving", to: "/spark" },
            { label: "Honor & Memorial Gifts", to: "/spark" },
            { label: "All Ways to Give (FAQ)", to: "/spark" },
            { label: "Monthly Giving", to: "/spark" },
            { label: "Phone, Mail & Crypto Donations", to: "/spark/donate" },
          ]}
        />
        <Column
          title="Reports"
          links={[
            { label: "Policies (Financial Policies)", to: "/tribe/standards" },
            { label: "Annual Reports", to: "/tribe/responsibility" },
            { label: "In-Kind Valuation", to: "/tribe/standards" },
            { label: "Donation Policies", to: "/spark" },
          ]}
        />
        <Column
          title="Accreditation"
          links={[
            { label: "Compliance & Licenses", to: "/tribe/compliance" },
            { label: "Leadership", to: "/tribe/team" },
            { label: "EIN: 95-1831116", to: "/tribe/compliance" },
            { label: "ANBI Status", to: "/tribe/compliance" },
            { label: "Rating (Charity Rating)", to: "/tribe/responsibility" },
          ]}
        />
        <Column
          title="Transparency"
          links={[
            { label: "Terms of Use", to: "/legal/terms" },
            { label: "Privacy Policy", to: "/legal/privacy" },
            { label: "Cookie Policy", to: "/legal/cookies" },
            { label: "Donor Privacy", to: "/legal/donor-privacy" },
            { label: "Brand Protection", to: "/tribe/standards" },
            { label: "Accessibility", to: "/tribe/standards" },
          ]}
        />
        <Column
          title="Information"
          links={[
            { label: "Contact", to: "/contact" },
            { label: "Organization (NGO)", to: "/tribe" },
            { label: "News", to: "/impact-tv" },
            { label: "Network (Partners)", to: "/partners" },
            { label: "Employment (Careers)", to: "/spark/enlist" },
            { label: "Communications (Press & Media)", to: "/contact" },
            { label: "Team (Programs)", to: "/tribe/team" },
          ]}
        />
      </div>
      <div className="border-t border-border">
        <div className="container py-6 text-xs text-foreground/60">
          © {currentYear} G.R.A.T.I.S. Empower Change with Every Pack.
        </div>
      </div>
    </footer>
  );
}
