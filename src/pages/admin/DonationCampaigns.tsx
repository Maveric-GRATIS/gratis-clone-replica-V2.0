import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

export default function AdminDonationCampaigns() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Target className="h-8 w-8 text-pink-600" />
          <h1 className="text-3xl font-bold">Donation Campaigns</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Donation campaign management coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
