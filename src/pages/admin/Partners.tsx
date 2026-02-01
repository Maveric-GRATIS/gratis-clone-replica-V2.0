import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";

export default function AdminPartners() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Building className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">NGO Partners</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Partner Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Partner management coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
