/**
 * RecurringDonationManager Component
 * Manage active recurring donations - view, pause, resume, update, cancel
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  CreditCard,
  Pause,
  Play,
  Edit,
  Trash2,
  Download,
  Heart,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import jsPDF from "jspdf";

interface RecurringDonation {
  id: string;
  amount: number;
  frequency: "monthly" | "quarterly" | "annually";
  status: "active" | "paused" | "cancelled";
  startDate: Date;
  nextCharge: Date;
  paymentMethod: {
    type: string;
    last4: string;
  };
  allocation: {
    cleanWater: number;
    education: number;
    healthcare: number;
    environment: number;
  };
  totalDonated: number;
  donationCount: number;
}

export function RecurringDonationManager() {
  const [donations, setDonations] = useState<RecurringDonation[]>([
    {
      id: "sub_1234567890",
      amount: 50,
      frequency: "monthly",
      status: "active",
      startDate: new Date("2024-01-15"),
      nextCharge: new Date("2026-03-01"),
      paymentMethod: {
        type: "Visa",
        last4: "4242",
      },
      allocation: {
        cleanWater: 40,
        education: 30,
        healthcare: 20,
        environment: 10,
      },
      totalDonated: 650,
      donationCount: 13,
    },
  ]);

  const [selectedDonation, setSelectedDonation] =
    useState<RecurringDonation | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const { toast } = useToast();

  // Mock donation history data
  const donationHistory = [
    { month: "Sep 2025", amount: 50 },
    { month: "Oct 2025", amount: 50 },
    { month: "Nov 2025", amount: 50 },
    { month: "Dec 2025", amount: 50 },
    { month: "Jan 2026", amount: 50 },
    { month: "Feb 2026", amount: 50 },
  ];

  const handlePause = (donationId: string) => {
    setDonations(
      donations.map((d) =>
        d.id === donationId ? { ...d, status: "paused" as const } : d,
      ),
    );
    toast({
      title: "Donation Paused",
      description:
        "Your recurring donation has been paused. You can resume it anytime.",
    });
  };

  const handleResume = (donationId: string) => {
    setDonations(
      donations.map((d) =>
        d.id === donationId ? { ...d, status: "active" as const } : d,
      ),
    );
    toast({
      title: "Donation Resumed",
      description: "Your recurring donation is now active again.",
    });
  };

  const handleUpdate = (donationId: string, newAmount: number) => {
    setDonations(
      donations.map((d) =>
        d.id === donationId ? { ...d, amount: newAmount } : d,
      ),
    );
    setIsEditDialogOpen(false);
    toast({
      title: "Donation Updated",
      description: `Your donation amount has been updated to €${newAmount}/${selectedDonation?.frequency}.`,
    });
  };

  const handleCancel = (donationId: string) => {
    setDonations(
      donations.map((d) =>
        d.id === donationId ? { ...d, status: "cancelled" as const } : d,
      ),
    );
    setIsCancelDialogOpen(false);
    toast({
      title: "Donation Cancelled",
      description:
        "Your recurring donation has been cancelled. Thank you for your past support.",
    });
  };

  const downloadDonationHistory = (donation: RecurringDonation) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("GRATIS Foundation", 20, 20);
    doc.setFontSize(16);
    doc.text("Donation History Report", 20, 30);

    doc.setFontSize(12);
    doc.text(`Subscription ID: ${donation.id}`, 20, 50);
    doc.text(`Status: ${donation.status}`, 20, 60);
    doc.text(`Amount: €${donation.amount}/${donation.frequency}`, 20, 70);
    doc.text(`Total Donated: €${donation.totalDonated}`, 20, 80);
    doc.text(`Number of Donations: ${donation.donationCount}`, 20, 90);

    doc.text("Recent Donations:", 20, 110);
    let y = 120;
    donationHistory.forEach((record) => {
      doc.text(`${record.month}: €${record.amount}`, 30, y);
      y += 10;
    });

    doc.setFontSize(10);
    doc.text("Generated on: " + new Date().toLocaleDateString(), 20, 200);

    doc.save(`GRATIS_Donation_History_${donation.id}.pdf`);

    toast({
      title: "History Downloaded",
      description: "Your donation history has been saved as PDF.",
    });
  };

  const activeDonations = donations.filter((d) => d.status !== "cancelled");
  const totalMonthlyImpact = activeDonations
    .filter((d) => d.status === "active")
    .reduce((sum, d) => {
      if (d.frequency === "monthly") return sum + d.amount;
      if (d.frequency === "quarterly") return sum + d.amount / 3;
      if (d.frequency === "annually") return sum + d.amount / 12;
      return sum;
    }, 0);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Heart className="h-8 w-8 text-primary" />
            Recurring Donations
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your active recurring donations
          </p>
        </div>
        <Button asChild>
          <a href="/spark/donate">New Donation</a>
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Impact</p>
                <p className="text-3xl font-bold">
                  €{totalMonthlyImpact.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Active Subscriptions
                </p>
                <p className="text-3xl font-bold">
                  {activeDonations.filter((d) => d.status === "active").length}
                </p>
              </div>
              <Heart className="h-10 w-10 text-primary opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Contributed
                </p>
                <p className="text-3xl font-bold">
                  €{donations.reduce((sum, d) => sum + d.totalDonated, 0)}
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Donation History Chart */}
      {activeDonations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Donation History</CardTitle>
            <CardDescription>
              Your giving journey over the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={donationHistory}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Active Donations List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Subscriptions</h2>
        {activeDonations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground opacity-20 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No Active Donations
              </h3>
              <p className="text-muted-foreground mb-4">
                Start making a recurring impact today
              </p>
              <Button asChild>
                <a href="/spark/donate">Create Recurring Donation</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          activeDonations.map((donation) => (
            <Card
              key={donation.id}
              className={donation.status === "paused" ? "opacity-60" : ""}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Main Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold">
                            €{donation.amount}
                            <span className="text-sm font-normal text-muted-foreground">
                              /{donation.frequency}
                            </span>
                          </h3>
                          <Badge
                            variant={
                              donation.status === "active"
                                ? "default"
                                : donation.status === "paused"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {donation.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Member since {donation.startDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Next Charge</p>
                        <p className="font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {donation.nextCharge.toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Payment Method</p>
                        <p className="font-medium flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          {donation.paymentMethod.type} ••••{" "}
                          {donation.paymentMethod.last4}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Donated</p>
                        <p className="font-medium">€{donation.totalDonated}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Donations Made</p>
                        <p className="font-medium">{donation.donationCount}</p>
                      </div>
                    </div>

                    {/* Allocation */}
                    <div>
                      <p className="text-sm font-medium mb-2">
                        Impact Allocation
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Clean Water
                          </span>
                          <span className="font-medium">
                            {donation.allocation.cleanWater}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Education
                          </span>
                          <span className="font-medium">
                            {donation.allocation.education}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Healthcare
                          </span>
                          <span className="font-medium">
                            {donation.allocation.healthcare}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Environment
                          </span>
                          <span className="font-medium">
                            {donation.allocation.environment}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    {donation.status === "active" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePause(donation.id)}
                      >
                        <Pause className="mr-2 h-4 w-4" />
                        Pause
                      </Button>
                    ) : donation.status === "paused" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResume(donation.id)}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Resume
                      </Button>
                    ) : null}

                    <Dialog
                      open={isEditDialogOpen}
                      onOpenChange={setIsEditDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedDonation(donation)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Amount
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Donation Amount</DialogTitle>
                          <DialogDescription>
                            Change your recurring donation amount
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="newAmount">New Amount (€)</Label>
                            <Input
                              id="newAmount"
                              type="number"
                              min="5"
                              step="5"
                              defaultValue={selectedDonation?.amount}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              const input = document.getElementById(
                                "newAmount",
                              ) as HTMLInputElement;
                              handleUpdate(
                                donation.id,
                                parseFloat(input.value),
                              );
                            }}
                          >
                            Update
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadDonationHistory(donation)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download History
                    </Button>

                    <Dialog
                      open={isCancelDialogOpen}
                      onOpenChange={setIsCancelDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setSelectedDonation(donation)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Cancel Recurring Donation?</DialogTitle>
                          <DialogDescription>
                            This will stop your recurring donation. You can
                            always create a new one later.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="text-sm text-muted-foreground">
                            You've donated €{selectedDonation?.totalDonated} so
                            far. Thank you for your support!
                          </p>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsCancelDialogOpen(false)}
                          >
                            Keep Donation
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() =>
                              selectedDonation &&
                              handleCancel(selectedDonation.id)
                            }
                          >
                            Cancel Donation
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
