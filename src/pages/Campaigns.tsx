import { useState, useEffect } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Target,
  TrendingUp,
  Users,
  Heart,
  Megaphone,
  PartyPopper,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";

interface Campaign {
  id: string;
  title: string;
  description: string;
  type: string;
  imageUrl?: string;
  goal_amount?: number;
  current_amount?: number;
  start_date: any;
  end_date: any;
  cta_text?: string;
  cta_url?: string;
  active: boolean;
  featured: boolean;
  created_at: any;
}

const campaignTypeIcons: Record<string, any> = {
  fundraising: Target,
  awareness: Megaphone,
  volunteer_recruitment: Users,
  event_promotion: PartyPopper,
  product_launch: TrendingUp,
  membership_drive: Heart,
};

const campaignTypeColors: Record<string, string> = {
  fundraising: "bg-green-500",
  awareness: "bg-blue-500",
  volunteer_recruitment: "bg-purple-500",
  event_promotion: "bg-orange-500",
  product_launch: "bg-pink-500",
  membership_drive: "bg-red-500",
};

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("all");

  const types = [
    { value: "all", label: "All Campaigns" },
    { value: "fundraising", label: "Fundraising" },
    { value: "awareness", label: "Awareness" },
    { value: "volunteer_recruitment", label: "Volunteer" },
    { value: "event_promotion", label: "Events" },
    { value: "product_launch", label: "Product Launch" },
    { value: "membership_drive", label: "Membership" },
  ];

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const campaignsQuery = query(
        collection(db, "campaigns"),
        where("active", "==", true),
        orderBy("created_at", "desc")
      );

      const snapshot = await getDocs(campaignsQuery);
      const campaignsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Campaign[];

      console.log("Loaded campaigns:", campaignsData.length, campaignsData);
      setCampaigns(campaignsData);
    } catch (error) {
      console.error("Error loading campaigns:", error);
      console.error("Error details:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns =
    selectedType === "all"
      ? campaigns
      : campaigns.filter((campaign) => campaign.type === selectedType);

  const featuredCampaigns = campaigns.filter((c) => c.featured).slice(0, 2);

  const calculateProgress = (current: number = 0, goal: number = 0) => {
    if (goal === 0) return 0;
    return Math.min((current / goal) * 100, 100);
  };

  const formatCurrency = (amount: number = 0) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
    const Icon = campaignTypeIcons[campaign.type] || Target;
    const progress = calculateProgress(
      campaign.current_amount,
      campaign.goal_amount
    );

    return (
      <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
        {campaign.imageUrl && (
          <div className="relative">
            <img
              src={campaign.imageUrl}
              alt={campaign.title}
              className="w-full h-48 object-cover"
            />
            <Badge
              className={`absolute top-4 right-4 ${
                campaignTypeColors[campaign.type] || "bg-gray-500"
              }`}
            >
              <Icon className="h-3 w-3 mr-1" />
              {campaign.type.replace("_", " ")}
            </Badge>
          </div>
        )}
        <CardHeader>
          {!campaign.imageUrl && (
            <Badge
              className={`w-fit mb-2 ${
                campaignTypeColors[campaign.type] || "bg-gray-500"
              }`}
            >
              <Icon className="h-3 w-3 mr-1" />
              {campaign.type.replace("_", " ")}
            </Badge>
          )}
          <CardTitle className="line-clamp-2">{campaign.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
            {campaign.description}
          </p>

          {/* Fundraising Progress */}
          {campaign.type === "fundraising" &&
            campaign.goal_amount &&
            campaign.goal_amount > 0 && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold">
                    {formatCurrency(campaign.current_amount || 0)}
                  </span>
                  <span className="text-muted-foreground">
                    of {formatCurrency(campaign.goal_amount)}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {progress.toFixed(0)}% achieved
                </p>
              </div>
            )}

          {/* Campaign Dates */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {campaign.start_date &&
                format(campaign.start_date.toDate(), "MMM d")}
              {" - "}
              {campaign.end_date && format(campaign.end_date.toDate(), "MMM d, yyyy")}
            </span>
          </div>

          {/* CTA Button */}
          {campaign.cta_text && campaign.cta_url && (
            <Button className="w-full" asChild>
              <a
                href={campaign.cta_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {campaign.cta_text}
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Active Campaigns
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Join our movement. Support our causes. Make a real difference in the
            world.
          </p>
        </div>
      </section>

      {/* Featured Campaigns */}
      {featuredCampaigns.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-8">Featured Campaigns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </section>
      )}

      {/* Type Filter */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {types.map((type) => (
            <Badge
              key={type.value}
              variant={selectedType === type.value ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedType(type.value)}
            >
              {type.label}
            </Badge>
          ))}
        </div>

        {/* All Campaigns */}
        {loading ? (
          <div className="text-center py-12">Loading campaigns...</div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No active campaigns found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
