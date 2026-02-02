/**
 * Partner Donations Page
 *
 * View and manage donations received by the partner.
 * Part 6 - Partner Dashboard
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Download,
  DollarSign,
  User,
  Calendar,
  TrendingUp,
  Filter,
} from "lucide-react";

// Mock donations data
const MOCK_DONATIONS = [
  {
    id: "1",
    donorName: "Anonymous",
    amount: 500,
    projectTitle: "Clean Water for Rural Kenya",
    date: new Date("2024-01-20"),
    recurring: false,
    status: "completed",
  },
  {
    id: "2",
    donorName: "Sarah Mitchell",
    email: "s.mitchell@email.com",
    amount: 100,
    projectTitle: "School Sanitation Program Uganda",
    date: new Date("2024-01-19"),
    recurring: true,
    status: "completed",
  },
  {
    id: "3",
    donorName: "Michael Klein",
    email: "m.klein@email.com",
    amount: 250,
    projectTitle: "Clean Water for Rural Kenya",
    date: new Date("2024-01-19"),
    recurring: false,
    status: "completed",
  },
  {
    id: "4",
    donorName: "Emma Johnson",
    email: "emma.j@email.com",
    amount: 75,
    projectTitle: "Emergency Water Relief Tanzania",
    date: new Date("2024-01-18"),
    recurring: true,
    status: "completed",
  },
];

export default function PartnerDonations() {
  const totalAmount = MOCK_DONATIONS.reduce((sum, d) => sum + d.amount, 0);
  const recurringCount = MOCK_DONATIONS.filter((d) => d.recurring).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Donations</h1>
        <p className="text-gray-600">View and manage donations received</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Received</p>
                <p className="text-3xl font-bold">€{totalAmount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Donors</p>
                <p className="text-3xl font-bold">{MOCK_DONATIONS.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recurring Donors</p>
                <p className="text-3xl font-bold">{recurringCount}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by donor name or email..."
                className="pl-10"
              />
            </div>
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </Card>

      {/* Donations List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MOCK_DONATIONS.map((donation) => (
              <div
                key={donation.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{donation.donorName}</h3>
                      {donation.recurring && (
                        <Badge variant="default">Recurring</Badge>
                      )}
                    </div>
                    {donation.email && (
                      <p className="text-sm text-gray-600 mb-1">
                        {donation.email}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 truncate">
                      {donation.projectTitle}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {donation.date.toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="text-right ml-4">
                  <p className="text-2xl font-bold text-green-600">
                    €{donation.amount}
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    {donation.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
