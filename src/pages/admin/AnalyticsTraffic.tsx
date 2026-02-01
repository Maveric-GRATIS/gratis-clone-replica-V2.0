import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function AdminAnalyticsTraffic() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold">Traffic Analytics</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Website Traffic</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Traffic analytics coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
