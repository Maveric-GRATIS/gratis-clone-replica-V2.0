/**
 * Quarterly Voting Interface
 * Complete voting system for TRIBE members with real-time results
 */

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Vote,
  TrendingUp,
  Clock,
  CheckCircle2,
  Award,
  Users,
  Target,
  Heart,
  Leaf,
  GraduationCap,
  Droplet,
  Zap,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface VotingInitiative {
  id: string;
  title: string;
  description: string;
  category: "environment" | "education" | "health" | "social";
  budget: number;
  timeline: string;
  beneficiaries: number;
  totalVotes: number;
  myVotes: number;
  details: {
    goals: string[];
    impact: string;
    partners: string[];
  };
  status: "active" | "upcoming" | "completed";
}

interface VotingPeriod {
  id: string;
  quarter: string;
  startDate: Date;
  endDate: Date;
  status: "active" | "upcoming" | "completed";
  totalVotes: number;
  participation: number;
}

const categoryIcons = {
  environment: Leaf,
  education: GraduationCap,
  health: Heart,
  social: Users,
};

const categoryColors = {
  environment: "#10b981",
  education: "#3b82f6",
  health: "#f59e0b",
  social: "#ec4899",
};

export function QuarterlyVoting() {
  const [initiatives, setInitiatives] = useState<VotingInitiative[]>([
    {
      id: "vote-2024-q1-1",
      title: "Solar Panel Installation Program",
      description:
        "Install 100 solar panels in rural communities to provide clean, renewable energy",
      category: "environment",
      budget: 50000,
      timeline: "6 months",
      beneficiaries: 500,
      totalVotes: 234,
      myVotes: 0,
      details: {
        goals: [
          "Install 100 solar panels across 20 communities",
          "Train 50 local technicians for maintenance",
          "Reduce carbon emissions by 200 tons annually",
          "Provide electricity to 500 households",
        ],
        impact:
          "This initiative will bring clean energy to remote areas, reducing dependency on diesel generators and lowering carbon emissions while creating local jobs.",
        partners: [
          "SolarAid",
          "Local Energy Cooperative",
          "Ministry of Energy",
        ],
      },
      status: "active",
    },
    {
      id: "vote-2024-q1-2",
      title: "School Water Filter Systems",
      description:
        "Provide clean water filtration systems to 50 schools serving 15,000 students",
      category: "health",
      budget: 35000,
      timeline: "4 months",
      beneficiaries: 15000,
      totalVotes: 189,
      myVotes: 2,
      details: {
        goals: [
          "Install water filters in 50 schools",
          "Train teachers on maintenance and hygiene",
          "Provide 15,000 students with clean drinking water",
          "Reduce waterborne diseases by 70%",
        ],
        impact:
          "Clean water access will improve student health, reduce absenteeism, and enhance learning outcomes while preventing waterborne illnesses.",
        partners: ["WaterAid", "Ministry of Education", "Local Health Clinics"],
      },
      status: "active",
    },
    {
      id: "vote-2024-q1-3",
      title: "Community Garden & Food Security",
      description:
        "Establish 20 community gardens to promote local food production and nutrition",
      category: "social",
      budget: 28000,
      timeline: "5 months",
      beneficiaries: 800,
      totalVotes: 156,
      myVotes: 1,
      details: {
        goals: [
          "Create 20 community gardens",
          "Train 200 families in sustainable farming",
          "Produce 10 tons of fresh vegetables annually",
          "Establish seed sharing networks",
        ],
        impact:
          "Community gardens will improve food security, nutrition, and social cohesion while teaching sustainable agriculture practices.",
        partners: [
          "Local Food Bank",
          "Agriculture Extension Office",
          "Community Centers",
        ],
      },
      status: "active",
    },
    {
      id: "vote-2024-q1-4",
      title: "Digital Literacy Training Program",
      description:
        "Provide computer training and internet access to 1,000 youth in underserved areas",
      category: "education",
      budget: 42000,
      timeline: "8 months",
      beneficiaries: 1000,
      totalVotes: 143,
      myVotes: 0,
      details: {
        goals: [
          "Set up 10 computer labs",
          "Train 1,000 youth in digital skills",
          "Provide certifications for job readiness",
          "Establish ongoing mentorship programs",
        ],
        impact:
          "Digital literacy will open employment opportunities, bridge the digital divide, and empower youth with 21st-century skills.",
        partners: [
          "Tech Foundation",
          "Local Libraries",
          "Job Training Centers",
        ],
      },
      status: "active",
    },
  ]);

  const [votingCredits, setVotingCredits] = useState(3);
  const [selectedInitiative, setSelectedInitiative] =
    useState<VotingInitiative | null>(null);
  const { toast } = useToast();

  const currentPeriod: VotingPeriod = {
    id: "q1-2024",
    quarter: "Q1 2024",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-03-31"),
    status: "active",
    totalVotes: 722,
    participation: 67,
  };

  const daysRemaining = Math.ceil(
    (currentPeriod.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  const handleVote = (initiativeId: string) => {
    if (votingCredits === 0) {
      toast({
        variant: "destructive",
        title: "No Credits Available",
        description: "You've used all your voting credits for this quarter.",
      });
      return;
    }

    setInitiatives((prev) =>
      prev.map((init) =>
        init.id === initiativeId
          ? {
              ...init,
              totalVotes: init.totalVotes + 1,
              myVotes: init.myVotes + 1,
            }
          : init,
      ),
    );
    setVotingCredits((prev) => prev - 1);

    toast({
      title: "Vote Recorded!",
      description: "Your vote has been successfully submitted.",
    });
  };

  const handleRemoveVote = (initiativeId: string) => {
    const initiative = initiatives.find((i) => i.id === initiativeId);
    if (!initiative || initiative.myVotes === 0) return;

    setInitiatives((prev) =>
      prev.map((init) =>
        init.id === initiativeId
          ? {
              ...init,
              totalVotes: init.totalVotes - 1,
              myVotes: init.myVotes - 1,
            }
          : init,
      ),
    );
    setVotingCredits((prev) => prev + 1);

    toast({
      title: "Vote Removed",
      description: "Your vote has been removed. You can redistribute it.",
    });
  };

  const totalVotes = initiatives.reduce(
    (sum, init) => sum + init.totalVotes,
    0,
  );
  const votingData = initiatives.map((init) => ({
    name: init.title.split(" ").slice(0, 2).join(" "),
    votes: init.totalVotes,
    percentage: ((init.totalVotes / totalVotes) * 100).toFixed(1),
  }));

  const categoryDistribution = Object.entries(
    initiatives.reduce(
      (acc, init) => {
        acc[init.category] = (acc[init.category] || 0) + init.totalVotes;
        return acc;
      },
      {} as Record<string, number>,
    ),
  ).map(([category, votes]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: votes,
    color: categoryColors[category as keyof typeof categoryColors],
  }));

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Vote className="h-8 w-8 text-primary" />
            Quarterly Voting
          </h1>
          <p className="text-muted-foreground mt-1">
            Use your votes to shape our next initiatives
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Target className="mr-2 h-4 w-4" />
          {votingCredits} Credits Left
        </Badge>
      </div>

      {/* Voting Period Info */}
      <Card className="border-primary">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time Remaining</p>
                <p className="text-xl font-bold">{daysRemaining} days</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Vote className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Votes</p>
                <p className="text-xl font-bold">{totalVotes}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Participation</p>
                <p className="text-xl font-bold">
                  {currentPeriod.participation}%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">My Votes</p>
                <p className="text-xl font-bold">{3 - votingCredits}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="vote" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vote">Cast Votes</TabsTrigger>
          <TabsTrigger value="results">Live Results</TabsTrigger>
          <TabsTrigger value="history">Past Votes</TabsTrigger>
        </TabsList>

        {/* Voting Tab */}
        <TabsContent value="vote" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {initiatives.map((initiative) => {
              const CategoryIcon = categoryIcons[initiative.category];
              const categoryColor = categoryColors[initiative.category];

              return (
                <Card
                  key={initiative.id}
                  className={`relative ${
                    initiative.myVotes > 0 ? "border-primary border-2" : ""
                  }`}
                >
                  {initiative.myVotes > 0 && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="default" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {initiative.myVotes} vote
                        {initiative.myVotes > 1 ? "s" : ""}
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start gap-3 mb-2">
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${categoryColor}20` }}
                      >
                        <CategoryIcon
                          className="h-5 w-5"
                          style={{ color: categoryColor }}
                        />
                      </div>
                      <div className="flex-1">
                        <Badge
                          variant="outline"
                          className="mb-2"
                          style={{
                            borderColor: categoryColor,
                            color: categoryColor,
                          }}
                        >
                          {initiative.category}
                        </Badge>
                        <CardTitle className="text-xl">
                          {initiative.title}
                        </CardTitle>
                      </div>
                    </div>
                    <CardDescription>{initiative.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Budget</p>
                        <p className="font-semibold">
                          €{initiative.budget.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Timeline</p>
                        <p className="font-semibold">{initiative.timeline}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Beneficiaries</p>
                        <p className="font-semibold">
                          {initiative.beneficiaries.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">
                          Current Votes
                        </span>
                        <span className="font-semibold">
                          {initiative.totalVotes}
                        </span>
                      </div>
                      <Progress
                        value={(initiative.totalVotes / totalVotes) * 100}
                        className="h-2"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setSelectedInitiative(initiative)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          {selectedInitiative && (
                            <>
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-3">
                                  <div
                                    className="h-10 w-10 rounded-full flex items-center justify-center"
                                    style={{
                                      backgroundColor: `${
                                        categoryColors[
                                          selectedInitiative.category
                                        ]
                                      }20`,
                                    }}
                                  >
                                    <CategoryIcon
                                      className="h-5 w-5"
                                      style={{
                                        color:
                                          categoryColors[
                                            selectedInitiative.category
                                          ],
                                      }}
                                    />
                                  </div>
                                  {selectedInitiative.title}
                                </DialogTitle>
                                <DialogDescription>
                                  {selectedInitiative.description}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold mb-2">
                                    Project Goals
                                  </h4>
                                  <ul className="space-y-2">
                                    {selectedInitiative.details.goals.map(
                                      (goal, i) => (
                                        <li
                                          key={i}
                                          className="flex items-start gap-2 text-sm"
                                        >
                                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                          {goal}
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">
                                    Expected Impact
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedInitiative.details.impact}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">
                                    Partner Organizations
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedInitiative.details.partners.map(
                                      (partner) => (
                                        <Badge
                                          key={partner}
                                          variant="secondary"
                                        >
                                          {partner}
                                        </Badge>
                                      ),
                                    )}
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </DialogContent>
                      </Dialog>
                      {initiative.myVotes > 0 ? (
                        <Button
                          variant="outline"
                          onClick={() => handleRemoveVote(initiative.id)}
                          className="flex-1"
                        >
                          Remove Vote
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleVote(initiative.id)}
                          disabled={votingCredits === 0}
                          className="flex-1"
                        >
                          <Vote className="mr-2 h-4 w-4" />
                          Vote
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Votes by Initiative</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={votingData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="votes" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle>Current Rankings</CardTitle>
              <CardDescription>
                Initiatives ranked by total votes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...initiatives]
                  .sort((a, b) => b.totalVotes - a.totalVotes)
                  .map((init, index) => {
                    const CategoryIcon = categoryIcons[init.category];
                    return (
                      <div
                        key={init.id}
                        className="flex items-center gap-4 p-4 border rounded-lg"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 font-bold">
                          {index + 1}
                        </div>
                        <CategoryIcon
                          className="h-6 w-6"
                          style={{ color: categoryColors[init.category] }}
                        />
                        <div className="flex-1">
                          <p className="font-medium">{init.title}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <Progress
                              value={(init.totalVotes / totalVotes) * 100}
                              className="flex-1 h-2"
                            />
                            <span className="text-sm text-muted-foreground w-16">
                              {init.totalVotes} votes
                            </span>
                          </div>
                        </div>
                        {init.myVotes > 0 && (
                          <Badge variant="outline">Your vote</Badge>
                        )}
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Past Voting Periods</CardTitle>
              <CardDescription>
                View results from previous quarters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    quarter: "Q4 2023",
                    winner: "Urban Tree Planting Initiative",
                    votes: 567,
                    participation: 72,
                  },
                  {
                    quarter: "Q3 2023",
                    winner: "Mobile Health Clinics",
                    votes: 489,
                    participation: 68,
                  },
                ].map((period) => (
                  <div key={period.quarter} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{period.quarter}</h4>
                        <p className="text-sm text-muted-foreground">
                          {period.winner}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        <Award className="mr-1 h-3 w-3" />
                        Winner
                      </Badge>
                    </div>
                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Total Votes:{" "}
                        </span>
                        <span className="font-medium">{period.votes}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Participation:{" "}
                        </span>
                        <span className="font-medium">
                          {period.participation}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
