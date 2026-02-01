import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vote } from "lucide-react";

export default function AdminVoting() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Vote className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold">Voting Management</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Voting Period</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Voting management coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
