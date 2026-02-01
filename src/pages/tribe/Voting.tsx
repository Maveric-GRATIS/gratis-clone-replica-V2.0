import { QuarterlyVoting } from "@/components/tribe/QuarterlyVoting";
import SEO from "@/components/SEO";

export default function TribeVoting() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Quarterly Voting - TRIBE Members - GRATIS Foundation"
        description="Use your voting credits to influence our next community initiatives and shape the future of GRATIS."
        canonical={
          typeof window !== "undefined" ? window.location.href : "/tribe/voting"
        }
      />
      <QuarterlyVoting />
    </div>
  );
}
