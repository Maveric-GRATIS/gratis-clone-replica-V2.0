import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck } from "lucide-react";

export default function AdminPartnerApplications() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <FileCheck className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Partner Applications</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Application review system coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
