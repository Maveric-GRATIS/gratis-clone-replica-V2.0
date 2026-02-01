import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function AdminSettings() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-8 w-8 text-gray-600" />
          <h1 className="text-3xl font-bold">General Settings</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Platform Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Settings panel coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
