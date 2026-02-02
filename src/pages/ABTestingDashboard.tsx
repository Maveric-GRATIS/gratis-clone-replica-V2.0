/**
 * A/B Testing Dashboard
 * Part 9 - Section 44: Experiment management and results
 */

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlayCircle,
  PauseCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Users,
  Target,
  Award,
  Flag,
  Beaker,
} from "lucide-react";
import type {
  Experiment,
  ExperimentResults,
  VariantResult,
} from "@/types/experiments";

const MOCK_EXPERIMENTS: Experiment[] = [
  {
    id: "1",
    name: "Donation Button Color Test",
    description: "Testing primary vs. green donation buttons",
    hypothesis: "Green buttons will increase conversion by 15%",
    status: "running",
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    variants: [
      {
        id: "control",
        name: "Blue Button (Control)",
        weight: 50,
        isControl: true,
        config: { color: "blue" },
      },
      {
        id: "variant-a",
        name: "Green Button",
        weight: 50,
        isControl: false,
        config: { color: "green" },
      },
    ],
    trafficAllocation: 100,
    metrics: [
      {
        id: "m1",
        name: "Donation Conversions",
        event: "donation_completed",
        type: "conversion",
        isPrimary: true,
      },
      {
        id: "m2",
        name: "Avg Donation Amount",
        event: "donation_completed",
        type: "numeric",
        aggregation: "avg",
        isPrimary: false,
      },
    ],
    primaryMetricId: "m1",
    tags: ["donation", "ui", "conversion"],
    createdBy: "user-1",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    name: "Homepage Hero Copy",
    description: "Testing different hero section headlines",
    hypothesis: "Action-oriented copy will increase signups",
    status: "completed",
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    variants: [
      {
        id: "control",
        name: "Original Copy",
        weight: 33,
        isControl: true,
        config: {},
      },
      {
        id: "variant-a",
        name: "Action-Oriented",
        weight: 33,
        isControl: false,
        config: {},
      },
      {
        id: "variant-b",
        name: "Emotional Appeal",
        weight: 34,
        isControl: false,
        config: {},
      },
    ],
    trafficAllocation: 100,
    metrics: [
      {
        id: "m1",
        name: "Signup Conversions",
        event: "signup_completed",
        type: "conversion",
        isPrimary: true,
      },
    ],
    primaryMetricId: "m1",
    tags: ["homepage", "copywriting", "acquisition"],
    createdBy: "user-1",
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
];

const MOCK_RESULTS: Record<string, ExperimentResults> = {
  "2": {
    experimentId: "2",
    experimentName: "Homepage Hero Copy",
    status: "completed",
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    duration: 23,
    totalParticipants: 12458,
    variants: [
      {
        variantId: "control",
        variantName: "Original Copy",
        isControl: true,
        participants: 4152,
        metrics: [
          {
            metricId: "m1",
            metricName: "Signup Conversions",
            value: 498,
            sampleSize: 4152,
            conversionRate: 12.0,
            confidenceInterval: [11.1, 12.9],
            isSignificant: false,
          },
        ],
      },
      {
        variantId: "variant-a",
        variantName: "Action-Oriented",
        isControl: false,
        participants: 4103,
        metrics: [
          {
            metricId: "m1",
            metricName: "Signup Conversions",
            value: 579,
            sampleSize: 4103,
            conversionRate: 14.1,
            confidenceInterval: [13.2, 15.0],
            pValue: 0.012,
            improvement: 17.5,
            isSignificant: true,
          },
        ],
      },
      {
        variantId: "variant-b",
        variantName: "Emotional Appeal",
        isControl: false,
        participants: 4203,
        metrics: [
          {
            metricId: "m1",
            metricName: "Signup Conversions",
            value: 521,
            sampleSize: 4203,
            conversionRate: 12.4,
            confidenceInterval: [11.5, 13.3],
            pValue: 0.58,
            improvement: 3.3,
            isSignificant: false,
          },
        ],
      },
    ],
    winner: "variant-a",
    confidence: 95.2,
    isSignificant: true,
    recommendation:
      "Deploy variant A (Action-Oriented) - shows 17.5% improvement with 95% confidence",
  },
};

export default function ABTestingDashboard() {
  const [filter, setFilter] = useState<"all" | "running" | "completed">("all");
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(
    null,
  );

  const filteredExperiments = MOCK_EXPERIMENTS.filter(
    (exp) => filter === "all" || exp.status === filter,
  );

  const selectedResults = selectedExperiment
    ? MOCK_RESULTS[selectedExperiment]
    : null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Running
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Completed
          </Badge>
        );
      case "paused":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Paused
          </Badge>
        );
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Beaker className="h-8 w-8" />
          A/B Testing Dashboard
        </h1>
        <p className="text-muted-foreground">
          Run experiments to optimize user experience and conversions
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Experiments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {MOCK_EXPERIMENTS.filter((e) => e.status === "running").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently testing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Experiments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{MOCK_EXPERIMENTS.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">67%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Significant winners
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Lift
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">+12.3%</div>
            <p className="text-xs text-muted-foreground mt-1">
              From winning variants
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="experiments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="experiments">Experiments</TabsTrigger>
          <TabsTrigger value="flags">Feature Flags</TabsTrigger>
        </TabsList>

        <TabsContent value="experiments" className="space-y-6">
          {/* Filter */}
          <div className="flex items-center justify-between">
            <Select
              value={filter}
              onValueChange={(value: any) => setFilter(value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Experiments</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Button>
              <PlayCircle className="mr-2 h-4 w-4" />
              New Experiment
            </Button>
          </div>

          {/* Experiments List */}
          <div className="grid gap-4">
            {filteredExperiments.map((experiment) => (
              <Card
                key={experiment.id}
                className="hover:border-primary cursor-pointer transition"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {experiment.name}
                        </h3>
                        {getStatusBadge(experiment.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {experiment.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>
                          {experiment.trafficAllocation}% traffic allocation
                        </span>
                        <span className="mx-2">•</span>
                        <span>{experiment.variants.length} variants</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {experiment.status === "running" ? (
                        <Button variant="outline" size="sm">
                          <PauseCircle className="mr-2 h-4 w-4" />
                          Pause
                        </Button>
                      ) : experiment.status === "completed" ? (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => setSelectedExperiment(experiment.id)}
                        >
                          <BarChart3 className="mr-2 h-4 w-4" />
                          View Results
                        </Button>
                      ) : null}
                    </div>
                  </div>

                  {/* Variants */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {experiment.variants.map((variant) => (
                      <div
                        key={variant.id}
                        className="p-3 rounded-lg border bg-card"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">
                            {variant.name}
                          </span>
                          {variant.isControl && (
                            <Badge variant="outline" className="text-xs">
                              Control
                            </Badge>
                          )}
                        </div>
                        <Progress value={variant.weight} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {variant.weight}% traffic
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {experiment.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Results Modal */}
          {selectedResults && (
            <Card className="border-2 border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                      {selectedResults.experimentName} - Results
                    </CardTitle>
                    <CardDescription>
                      Ran for {selectedResults.duration} days with{" "}
                      {selectedResults.totalParticipants.toLocaleString()}{" "}
                      participants
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedExperiment(null)}
                  >
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Winner Announcement */}
                {selectedResults.isSignificant && selectedResults.winner && (
                  <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-green-900">
                        Winner Detected!
                      </h4>
                    </div>
                    <p className="text-sm text-green-800 mb-2">
                      {selectedResults.recommendation}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <Target className="h-4 w-4" />
                      <span>
                        {selectedResults.confidence.toFixed(1)}% confidence
                        level
                      </span>
                    </div>
                  </div>
                )}

                {/* Variant Comparison */}
                <div className="grid gap-4">
                  {selectedResults.variants.map((variant) => {
                    const metric = variant.metrics[0];
                    const isWinner =
                      variant.variantId === selectedResults.winner;

                    return (
                      <div
                        key={variant.variantId}
                        className={`p-4 rounded-lg border-2 ${
                          isWinner
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">
                              {variant.variantName}
                            </h4>
                            {variant.isControl && (
                              <Badge variant="outline">Control</Badge>
                            )}
                            {isWinner && (
                              <Badge className="bg-green-600">Winner</Badge>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {variant.participants.toLocaleString()} participants
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Conversion Rate
                            </p>
                            <p className="text-2xl font-bold">
                              {metric.conversionRate?.toFixed(1)}%
                            </p>
                          </div>

                          {!variant.isControl &&
                            metric.improvement !== undefined && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">
                                  Improvement
                                </p>
                                <div className="flex items-center gap-1">
                                  {metric.improvement > 0 ? (
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                  ) : metric.improvement < 0 ? (
                                    <TrendingDown className="h-5 w-5 text-red-600" />
                                  ) : (
                                    <Minus className="h-5 w-5 text-gray-600" />
                                  )}
                                  <p
                                    className={`text-2xl font-bold ${
                                      metric.improvement > 0
                                        ? "text-green-600"
                                        : metric.improvement < 0
                                          ? "text-red-600"
                                          : "text-gray-600"
                                    }`}
                                  >
                                    {metric.improvement > 0 ? "+" : ""}
                                    {metric.improvement.toFixed(1)}%
                                  </p>
                                </div>
                              </div>
                            )}

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Statistical Significance
                            </p>
                            <Badge
                              variant={
                                metric.isSignificant ? "default" : "secondary"
                              }
                            >
                              {metric.isSignificant
                                ? "Significant"
                                : "Not Significant"}
                            </Badge>
                            {metric.pValue !== undefined && (
                              <p className="text-xs text-muted-foreground mt-1">
                                p-value: {metric.pValue.toFixed(3)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="flags" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5" />
                Feature Flags
              </CardTitle>
              <CardDescription>
                Control feature rollouts and experimentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Feature flags management coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Trophy({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
