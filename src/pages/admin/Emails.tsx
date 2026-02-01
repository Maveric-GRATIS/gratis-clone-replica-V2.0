import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function AdminEmails() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Mail className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Email Campaigns</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Email Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Email campaign system coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
