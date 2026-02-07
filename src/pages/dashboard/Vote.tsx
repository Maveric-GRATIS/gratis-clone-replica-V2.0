import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { db } from "@/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PageHero } from "@/components/PageHero";
import { SEO } from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Vote as VoteIcon, Loader2, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface VoteOption {
  id: string;
  label: string;
  breakdown: {
    water: number;
    arts: number;
    education: number;
  };
}

const voteOptions: VoteOption[] = [
  {
    id: "option_a",
    label: "Option A: Focus on Water",
    breakdown: { water: 50, arts: 30, education: 20 },
  },
  {
    id: "option_b",
    label: "Option B: Balance Education",
    breakdown: { water: 40, arts: 20, education: 40 },
  },
  {
    id: "option_c",
    label: "Option C: Equal Split",
    breakdown: { water: 33.3, arts: 33.3, education: 33.3 },
  },
  {
    id: "option_d",
    label: "Option D: Prioritize Water & Arts",
    breakdown: { water: 45, arts: 35, education: 20 },
  },
];

export default function Vote() {
  const { user } = useAuth();
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // User tier - will be loaded from Firestore (currently mock)
  const userTier: "explorer" | "insider" | "core" | "founder" = "insider";
  const votingWeight = userTier === "founder" ? 2 : 1;
  const canVote = userTier !== "explorer";

  // Check if active voting period (mock - replace with real data)
  const isVotingActive = true;
  const votingPeriod = "Q1 2026";
  const voteCloses = new Date(2026, 3, 1); // April 1, 2026
  const totalPool = 50000; // €50,000

  // Check if user has already voted this period
  const { data: existingVote, isLoading } = useQuery({
    queryKey: ["user-vote", user?.uid, votingPeriod],
    queryFn: async () => {
      if (!user) return null;

      const votesQuery = query(
        collection(db, "votes"),
        where("userId", "==", user.uid),
        where("period", "==", votingPeriod),
      );

      const snapshot = await getDocs(votesQuery);
      return snapshot.empty ? null : snapshot.docs[0].data();
    },
    enabled: !!user,
  });

  const handleSubmitVote = async () => {
    if (!selectedOption || !user) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "votes"), {
        userId: user.uid,
        period: votingPeriod,
        option: selectedOption,
        votingWeight,
        createdAt: Timestamp.now(),
      });

      setHasVoted(true);
      toast.success("Vote submitted successfully!");
    } catch (error) {
      console.error("Error submitting vote:", error);
      toast.error("Failed to submit vote. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canVote) {
    return (
      <>
        <SEO title="Vote | Dashboard" description="Vote on fund allocation" />
        <PageHero
          title="Vote on Impact"
          subtitle="Shape where GRATIS donations go"
        />
        <DashboardNav />

        <div className="bg-background pb-16">
          <div className="container max-w-3xl mx-auto px-4">
            <Card>
              <CardContent className="py-12 text-center">
                <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Upgrade to Vote</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Voting on fund allocation is available for Insider, Core, and
                  Founder members
                </p>
                <Link to="/tribe">
                  <Button>Upgrade Membership</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  if (!isVotingActive) {
    return (
      <>
        <SEO title="Vote | Dashboard" description="Vote on fund allocation" />
        <PageHero
          title="Vote on Impact"
          subtitle="Shape where GRATIS donations go"
        />
        <DashboardNav />

        <div className="bg-background pb-16">
          <div className="container max-w-3xl mx-auto px-4">
            <Card>
              <CardContent className="py-12 text-center">
                <VoteIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Active Vote</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Next voting period: Q2 2026
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Opens: April 1, 2026
                </p>
                <Link to="/dashboard">
                  <Button variant="outline">Back to Dashboard</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Previous Results */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Previous Results</CardTitle>
                <CardDescription>Past voting outcomes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Q4 2025 Allocation</p>
                    <p className="text-sm text-muted-foreground">
                      Option A won with 42% of votes
                    </p>
                  </div>
                  <Badge>Completed</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Q3 2025 Allocation</p>
                    <p className="text-sm text-muted-foreground">
                      Option C won with 38% of votes
                    </p>
                  </div>
                  <Badge>Completed</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  if (existingVote || hasVoted) {
    return (
      <>
        <SEO title="Vote | Dashboard" description="Vote on fund allocation" />
        <PageHero
          title="Vote on Impact"
          subtitle="Shape where GRATIS donations go"
        />
        <DashboardNav />

        <div className="bg-background pb-16">
          <div className="container max-w-3xl mx-auto px-4">
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-500" />
                <h3 className="text-2xl font-bold mb-2">Vote Submitted!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Thank you for participating in {votingPeriod} fund allocation
                </p>
                <div className="bg-muted p-4 rounded-lg max-w-sm mx-auto mb-6">
                  <p className="text-sm">
                    <strong>Your Vote:</strong>{" "}
                    {existingVote?.option || selectedOption}
                  </p>
                  <p className="text-sm mt-1">
                    <strong>Voting Weight:</strong> {votingWeight}×{" "}
                    {userTier === "founder" ? "(Founder)" : ""}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Results will be published after voting closes on{" "}
                  {voteCloses.toLocaleDateString()}
                </p>
                <Link to="/dashboard">
                  <Button variant="outline" className="mt-4">
                    Back to Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="Vote | Dashboard" description="Vote on fund allocation" />
      <PageHero
        title="Vote on Impact"
        subtitle="Shape where GRATIS donations go"
      />
      <DashboardNav />

      <div className="bg-background pb-16">
        <div className="container max-w-3xl mx-auto px-4">
          {/* Back Button */}
          <div className="mb-6">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                ← Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Vote Info */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{votingPeriod} Profit Allocation</CardTitle>
                  <CardDescription>
                    Total pool: €{totalPool.toLocaleString()}
                  </CardDescription>
                </div>
                <Badge variant="secondary">
                  Closes {voteCloses.toLocaleDateString()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <p className="text-sm mb-2">
                  <strong>Your voting power:</strong> {votingWeight}×{" "}
                  {userTier === "founder" && "(Founder bonus)"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Cast your vote to determine how this quarter's net profits are
                  distributed across our three cause areas.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Voting Options */}
          <Card>
            <CardHeader>
              <CardTitle>
                How should we distribute €{totalPool.toLocaleString()}?
              </CardTitle>
              <CardDescription>Select one option below</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedOption}
                onValueChange={setSelectedOption}
              >
                <div className="space-y-4">
                  {voteOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedOption === option.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedOption(option.id)}
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem
                          value={option.id}
                          id={option.id}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-2">
                          <Label
                            htmlFor={option.id}
                            className="text-base font-semibold cursor-pointer"
                          >
                            {option.label}
                          </Label>
                          <div className="flex gap-4 text-sm">
                            <span>💧 Water: {option.breakdown.water}%</span>
                            <span>🎨 Arts: {option.breakdown.arts}%</span>
                            <span>
                              📚 Education: {option.breakdown.education}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              <div className="flex justify-between items-center mt-6 pt-6 border-t">
                <Link to="/dashboard">
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button
                  onClick={handleSubmitVote}
                  disabled={!selectedOption || isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Vote"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Vote Info */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Votes are final and cannot be changed once submitted.</p>
            <p className="mt-1">
              Results will be published on{" "}
              {new Date(
                voteCloses.getTime() + 7 * 24 * 60 * 60 * 1000,
              ).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
