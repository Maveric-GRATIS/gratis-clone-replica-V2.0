/**
 * Partner Settings Page
 *
 * Manage partner organization settings and preferences.
 * Part 6 - Partner Dashboard
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Building2,
  User,
  Globe,
  Bell,
  Lock,
  CreditCard,
  Save,
} from "lucide-react";

export default function PartnerSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600">
          Manage your organization settings and preferences
        </p>
      </div>

      <Tabs defaultValue="organization">
        <TabsList>
          <TabsTrigger value="organization">
            <Building2 className="w-4 h-4 mr-2" />
            Organization
          </TabsTrigger>
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="w-4 h-4 mr-2" />
            Billing
          </TabsTrigger>
        </TabsList>

        {/* Organization Tab */}
        <TabsContent value="organization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="orgName">Organization Name</Label>
                <Input id="orgName" defaultValue="Clean Water Foundation" />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  defaultValue="https://cleanwaterfoundation.org"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  defaultValue="We work with local communities to build sustainable water infrastructure..."
                />
              </div>

              <div>
                <Label htmlFor="address">Headquarters Address</Label>
                <Input
                  id="address"
                  defaultValue="Museumplein 1, 1071 DJ Amsterdam, Netherlands"
                />
              </div>

              <Button>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Public Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Make profile public</Label>
                  <p className="text-sm text-gray-600">
                    Allow your organization to be discovered on GRATIS
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Show team members</Label>
                  <p className="text-sm text-gray-600">
                    Display team members on your public profile
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Show donation statistics</Label>
                  <p className="text-sm text-gray-600">
                    Display total donations and donor count publicly
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div>
                <Label>Social Media Links</Label>
                <div className="space-y-2 mt-2">
                  <Input placeholder="Facebook URL" />
                  <Input placeholder="Twitter URL" />
                  <Input placeholder="LinkedIn URL" />
                </div>
              </div>

              <Button>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email notifications</Label>
                  <p className="text-sm text-gray-600">
                    Receive updates via email
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>New donation alerts</Label>
                  <p className="text-sm text-gray-600">
                    Get notified when you receive donations
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Project milestone reminders</Label>
                  <p className="text-sm text-gray-600">
                    Reminders for upcoming milestones
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Weekly summary reports</Label>
                  <p className="text-sm text-gray-600">
                    Receive weekly performance summaries
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Marketing emails</Label>
                  <p className="text-sm text-gray-600">
                    Tips, best practices, and updates from GRATIS
                  </p>
                </div>
                <Switch />
              </div>

              <Button>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Change Password</Label>
                <div className="space-y-2 mt-2">
                  <Input type="password" placeholder="Current password" />
                  <Input type="password" placeholder="New password" />
                  <Input type="password" placeholder="Confirm new password" />
                </div>
                <Button className="mt-2">Update Password</Button>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-factor authentication</Label>
                    <p className="text-sm text-gray-600">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Label>Active Sessions</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-gray-600">
                        Amsterdam, Netherlands • Chrome
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Revoke
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Payments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  ✓ GRATIS is 100% free for NGO partners
                </p>
                <p className="text-sm text-green-700 mt-1">
                  No subscription fees, no commission on donations. We exist to
                  amplify your impact.
                </p>
              </div>

              <div>
                <Label>Payout Account</Label>
                <p className="text-sm text-gray-600 mb-2">
                  Bank account where donations will be transferred
                </p>
                <div className="p-4 border rounded-lg">
                  <p className="font-medium">ABN AMRO Bank</p>
                  <p className="text-sm text-gray-600">••••••4321</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Update Account
                  </Button>
                </div>
              </div>

              <div>
                <Label>Payout Schedule</Label>
                <p className="text-sm text-gray-600 mb-2">
                  Monthly automatic payouts
                </p>
                <Button variant="outline">Configure Schedule</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
