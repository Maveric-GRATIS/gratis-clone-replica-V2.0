import { RecurringDonationManager } from "@/components/donation/RecurringDonationManager";
import SEO from "@/components/SEO";

export default function ManageRecurringDonations() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Manage Recurring Donations - GRATIS Foundation"
        description="View and manage your active recurring donations. Update amounts, pause, resume, or cancel subscriptions."
        canonical={
          typeof window !== "undefined"
            ? window.location.href
            : "/spark/donate/manage"
        }
      />
      <RecurringDonationManager />
    </div>
  );
}
