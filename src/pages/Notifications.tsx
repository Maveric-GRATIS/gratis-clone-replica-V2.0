/**
 * Notifications Page
 *
 * Full-page view of all user notifications with filtering and management options.
 * Part 5 - Section 22: Notification System
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { notificationService } from "@/lib/services/notificationService";
import { Notification, NotificationType } from "@/types/notification";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Archive,
  Filter,
  ShoppingBag,
  Heart,
  Users,
  Gift,
  Lightbulb,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

// Icon mapping for notification types
const notificationIcons: Record<NotificationType, React.ReactNode> = {
  order: <ShoppingBag className="w-4 h-4" />,
  donation: <Heart className="w-4 h-4" />,
  tribe: <Users className="w-4 h-4" />,
  referral: <Gift className="w-4 h-4" />,
  project: <Lightbulb className="w-4 h-4" />,
  event: <Calendar className="w-4 h-4" />,
  system: <AlertCircle className="w-4 h-4" />,
};

// Color schemes for notification types
const notificationColors: Record<NotificationType, string> = {
  order: "bg-blue-500",
  donation: "bg-red-500",
  tribe: "bg-purple-500",
  referral: "bg-green-500",
  project: "bg-yellow-500",
  event: "bg-indigo-500",
  system: "bg-gray-500",
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [typeFilter, setTypeFilter] = useState<NotificationType | "all">("all");

  // Load notifications
  useEffect(() => {
    if (!user) return;

    const loadNotifications = async () => {
      try {
        setLoading(true);
        const notifs = await notificationService.getUserNotifications(
          user.uid,
          {
            unreadOnly: filter === "unread",
            types: typeFilter !== "all" ? [typeFilter] : undefined,
            limit: 100,
          },
        );
        setNotifications(notifs);
      } catch (error) {
        console.error("Failed to load notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [user, filter, typeFilter]);

  // Mark notification as read
  const handleMarkAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    if (!user) return;

    try {
      await notificationService.markAllAsRead(user.uid);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  // Archive notification
  const handleArchive = async (notificationId: string) => {
    if (!user) return;

    try {
      await notificationService.archive(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error("Failed to archive notification:", error);
    }
  };

  // Delete notification
  const handleDelete = async (notificationId: string) => {
    if (!user) return;

    try {
      await notificationService.delete(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  // Get unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="p-8 text-center">
          <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">
            Sign in to view notifications
          </h2>
          <p className="text-muted-foreground mb-4">
            You need to be logged in to access your notifications.
          </p>
          <Link to="/login">
            <Button>Sign In</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="w-8 h-8" />
            Notifications
          </h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0 ? (
              <>
                You have {unreadCount} unread notification
                {unreadCount !== 1 ? "s" : ""}
              </>
            ) : (
              <>You're all caught up!</>
            )}
          </p>
        </div>

        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="outline">
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filters */}
      <Tabs
        value={filter}
        onValueChange={(v) => setFilter(v as any)}
        className="mb-6"
      >
        <TabsList>
          <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Type Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={typeFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setTypeFilter("all")}
        >
          <Filter className="w-3 h-3 mr-1" />
          All Types
        </Button>
        {Object.entries(notificationIcons).map(([type, icon]) => (
          <Button
            key={type}
            variant={typeFilter === type ? "default" : "outline"}
            size="sm"
            onClick={() => setTypeFilter(type as NotificationType)}
            className="capitalize"
          >
            {icon}
            <span className="ml-1">{type}</span>
          </Button>
        ))}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <Card className="p-12 text-center">
          <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No notifications</h3>
          <p className="text-muted-foreground">
            {filter === "unread"
              ? "You don't have any unread notifications"
              : "You don't have any notifications yet"}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                "p-4 transition-all hover:shadow-md",
                !notification.read && "border-l-4 border-l-primary bg-muted/30",
              )}
            >
              <div className="flex gap-4">
                {/* Icon */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0",
                    notificationColors[notification.type],
                  )}
                >
                  {notificationIcons[notification.type]}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold flex items-center gap-2">
                      {notification.title}
                      {!notification.read && (
                        <Badge variant="secondary" className="text-xs">
                          New
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs capitalize">
                        {notification.type}
                      </Badge>
                    </h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(notification.createdAt, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {notification.message}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {notification.actionUrl && (
                      <Link to={notification.actionUrl}>
                        <Button size="sm" variant="default">
                          {notification.actionLabel || "View"}
                        </Button>
                      </Link>
                    )}

                    {!notification.read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Mark as read
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleArchive(notification.id)}
                    >
                      <Archive className="w-3 h-3 mr-1" />
                      Archive
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(notification.id)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Settings Link */}
      <div className="mt-8 text-center">
        <Link to="/settings/notifications">
          <Button variant="link">Manage notification preferences</Button>
        </Link>
      </div>
    </div>
  );
}
