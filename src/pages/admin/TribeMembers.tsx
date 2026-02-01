import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown } from "lucide-react";

export default function AdminTribeMembers() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Crown className="h-8 w-8 text-yellow-600" />
          <h1 className="text-3xl font-bold">TRIBE Members</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Premium Members</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              TRIBE membership management coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
