import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plug } from "lucide-react";

export default function AdminSettingsIntegrations() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Plug className="h-8 w-8 text-gray-600" />
          <h1 className="text-3xl font-bold">Integrations</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Third-Party Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Integration management coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
