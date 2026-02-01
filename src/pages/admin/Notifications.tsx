import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

export default function AdminNotifications() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Bell className="h-8 w-8 text-yellow-600" />
          <h1 className="text-3xl font-bold">Notifications</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Push Notification Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Notification system coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
