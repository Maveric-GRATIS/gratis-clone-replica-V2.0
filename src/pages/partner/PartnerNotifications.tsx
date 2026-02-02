/**
 * Partner Notifications Page
 *
 * View partner-specific notifications and alerts.
 * Part 6 - Partner Dashboard
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Users,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Bell,
  Archive,
  Trash2,
} from "lucide-react";

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    type: "donation",
    icon: DollarSign,
    title: "New Donation Received",
    message: "Anonymous donated €500 to Clean Water for Rural Kenya",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "milestone",
    icon: CheckCircle,
    title: "Project Milestone Completed",
    message: "School Sanitation Program Uganda reached 75% funding",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "3",
    type: "alert",
    icon: AlertCircle,
    title: "Monthly Report Due",
    message: "Your monthly impact report is due in 3 days",
    time: "1 day ago",
    read: true,
  },
  {
    id: "4",
    type: "donor",
    icon: Users,
    title: "New Recurring Donor",
    message: "Sarah M. set up a monthly recurring donation of €50",
    time: "2 days ago",
    read: true,
  },
  {
    id: "5",
    type: "growth",
    icon: TrendingUp,
    title: "Fundraising Milestone",
    message: "Congratulations! You reached €200K in total funding",
    time: "3 days ago",
    read: true,
  },
];

const TYPE_CONFIG = {
  donation: {
    color: "bg-green-100 text-green-800",
    iconColor: "text-green-600",
  },
  milestone: { color: "bg-blue-100 text-blue-800", iconColor: "text-blue-600" },
  alert: {
    color: "bg-orange-100 text-orange-800",
    iconColor: "text-orange-600",
  },
  donor: {
    color: "bg-purple-100 text-purple-800",
    iconColor: "text-purple-600",
  },
  growth: {
    color: "bg-yellow-100 text-yellow-800",
    iconColor: "text-yellow-600",
  },
};

export default function PartnerNotifications() {
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-gray-600">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Archive className="w-4 h-4 mr-2" />
            Archive All
          </Button>
          <Button variant="outline">Mark All Read</Button>
        </div>
      </div>

      {/* Filter */}
      <Card className="p-4">
        <div className="flex gap-2">
          <Button variant="default" size="sm">
            All
          </Button>
          <Button variant="outline" size="sm">
            <DollarSign className="w-4 h-4 mr-1" />
            Donations
          </Button>
          <Button variant="outline" size="sm">
            <CheckCircle className="w-4 h-4 mr-1" />
            Milestones
          </Button>
          <Button variant="outline" size="sm">
            <AlertCircle className="w-4 h-4 mr-1" />
            Alerts
          </Button>
          <Button variant="outline" size="sm">
            <Users className="w-4 h-4 mr-1" />
            Donors
          </Button>
        </div>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {MOCK_NOTIFICATIONS.map((notification) => {
          const Icon = notification.icon;
          const config =
            TYPE_CONFIG[notification.type as keyof typeof TYPE_CONFIG];

          return (
            <Card
              key={notification.id}
              className={
                notification.read
                  ? "opacity-60"
                  : "border-l-4 border-l-blue-600"
              }
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 ${config.color} rounded-full flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={`w-6 h-6 ${config.iconColor}`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{notification.title}</h3>
                      {!notification.read && (
                        <Badge variant="default" className="ml-2">
                          New
                        </Badge>
                      )}
                    </div>

                    <p className="text-gray-600 mb-2">{notification.message}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {notification.time}
                      </span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Archive className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State (when no notifications) */}
      {MOCK_NOTIFICATIONS.length === 0 && (
        <Card className="p-12 text-center">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No notifications</h3>
          <p className="text-gray-600">
            You're all caught up! We'll notify you when there's something new.
          </p>
        </Card>
      )}
    </div>
  );
}
