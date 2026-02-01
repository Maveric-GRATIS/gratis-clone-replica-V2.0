import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function AdminAnalyticsImpact() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Heart className="h-8 w-8 text-pink-600" />
          <h1 className="text-3xl font-bold">Impact Analytics</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Social Impact Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Impact analytics coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
