import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Package,
  Gift,
  Vote as VoteIcon,
  UserPlus,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface Activity {
  id: string;
  type: "order" | "claim" | "vote" | "signup" | "upgrade";
  description: string;
  date: Timestamp;
  icon: any;
  color: string;
}

export function ActivityFeed() {
  const { user } = useAuth();

  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ["user-activity", user?.uid],
    queryFn: async () => {
      if (!user) return [];

      const activitiesData: Activity[] = [];

      // Fetch recent orders
      const ordersQuery = query(
        collection(db, "orders"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(5),
      );
      const ordersSnapshot = await getDocs(ordersQuery);

      ordersSnapshot.forEach((doc) => {
        const data = doc.data();
        activitiesData.push({
          id: doc.id,
          type: "claim",
          description: `Claimed ${data.productName || "GRATIS Water bottle"}`,
          date: data.createdAt,
          icon: Gift,
          color: "text-green-500",
        });
      });

      // Fetch votes (if they exist)
      try {
        const votesQuery = query(
          collection(db, "votes"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(3),
        );
        const votesSnapshot = await getDocs(votesQuery);

        votesSnapshot.forEach((doc) => {
          const data = doc.data();
          activitiesData.push({
            id: doc.id,
            type: "vote",
            description: `Voted in ${data.period || "quarterly"} allocation`,
            date: data.createdAt,
            icon: VoteIcon,
            color: "text-blue-500",
          });
        });
      } catch (error) {
        // Votes collection might not exist yet
        console.log("No votes found");
      }

      // Add signup activity from user creation
      const userDoc = await getDocs(
        query(collection(db, "users"), where("__name__", "==", user.uid)),
      );
      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data();
        activitiesData.push({
          id: "signup",
          type: "signup",
          description: `Joined TRIBE as ${userData.tribeTier || "Explorer"}`,
          date: userData.createdAt || Timestamp.now(),
          icon: UserPlus,
          color: "text-purple-500",
        });
      }

      // Sort by date
      activitiesData.sort((a, b) => b.date.seconds - a.date.seconds);

      return activitiesData.slice(0, 10);
    },
    enabled: !!user,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest actions with GRATIS</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : activities && activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const Icon = activity.icon;
              const isToday =
                format(activity.date.toDate(), "yyyy-MM-dd") ===
                format(new Date(), "yyyy-MM-dd");

              return (
                <div
                  key={activity.id + index}
                  className="flex items-start gap-4"
                >
                  <div
                    className={`p-2 rounded-full bg-muted ${activity.color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {activity.description}
                      </p>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {isToday
                        ? "Today"
                        : format(activity.date.toDate(), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No recent activity</p>
            <p className="text-xs text-muted-foreground mt-2">
              Start by claiming your first bottle!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
