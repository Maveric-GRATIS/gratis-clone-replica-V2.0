import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function AdminVotingResults() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold">Voting Results</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Historical Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Results dashboard coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
