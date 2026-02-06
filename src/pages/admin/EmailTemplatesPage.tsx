/**
 * Email Templates Dashboard
 * Manage and preview all email templates
 */

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Search,
  Plus,
  Edit,
  Eye,
  Copy,
  Send,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

export default function EmailTemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock templates - replace with real data
  const templates = [
    {
      id: "welcome",
      name: "Welcome Email",
      subject: "Welcome to GRATIS! 🎉",
      category: "Onboarding",
      status: "active",
      lastModified: "2026-02-01",
      sends: 342,
    },
    {
      id: "tribe_welcome",
      name: "TRIBE Welcome",
      subject: "Welcome to TRIBE {{tier}}! 🌟",
      category: "Membership",
      status: "active",
      lastModified: "2026-02-05",
      sends: 89,
    },
    {
      id: "donation_thank_you",
      name: "Donation Thank You",
      subject: "Thank you for your generous donation! 💚",
      category: "Donations",
      status: "active",
      lastModified: "2026-01-28",
      sends: 1247,
    },
    {
      id: "event_registration",
      name: "Event Registration",
      subject: "You're registered: {{eventName}}",
      category: "Events",
      status: "active",
      lastModified: "2026-01-15",
      sends: 234,
    },
    {
      id: "password_reset",
      name: "Password Reset",
      subject: "Reset Your Password",
      category: "Security",
      status: "active",
      lastModified: "2026-01-10",
      sends: 156,
    },
    {
      id: "achievement_unlocked",
      name: "Achievement Unlocked",
      subject: "🏆 You've unlocked a new achievement!",
      category: "Gamification",
      status: "draft",
      lastModified: "2026-02-06",
      sends: 0,
    },
    {
      id: "weekly_digest",
      name: "Weekly Digest",
      subject: "Your weekly GRATIS update",
      category: "Newsletter",
      status: "draft",
      lastModified: "2026-02-06",
      sends: 0,
    },
    {
      id: "admin_alert",
      name: "Admin Alert",
      subject: "[{{severity}}] System Alert",
      category: "System",
      status: "active",
      lastModified: "2026-02-03",
      sends: 12,
    },
  ];

  const categories = [
    "All Templates",
    "Onboarding",
    "Membership",
    "Donations",
    "Events",
    "Security",
    "Gamification",
    "Newsletter",
    "System",
  ];

  const [selectedCategory, setSelectedCategory] = useState("All Templates");

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Templates" ||
      template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTestEmail = (templateId: string) => {
    toast.success(`Test email sent for ${templateId}`, {
      description: "Check your inbox!",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              Email Templates
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage transactional email templates
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Template
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templates.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {templates.filter((t) => t.status === "active").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Draft
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {templates.filter((t) => t.status === "draft").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Sends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {templates.reduce((sum, t) => sum + t.sends, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge
                    variant={template.status === "active" ? "default" : "outline"}
                    className="capitalize"
                  >
                    {template.status}
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    {template.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <CardDescription className="text-sm">
                  {template.subject}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Last modified: {template.lastModified}</p>
                    <p>Total sends: {template.sends.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-1">
                      <Eye className="w-4 h-4" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 gap-1">
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1"
                      onClick={() => handleTestEmail(template.id)}
                    >
                      <Send className="w-4 h-4" />
                      Test
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 gap-1">
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No templates found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
