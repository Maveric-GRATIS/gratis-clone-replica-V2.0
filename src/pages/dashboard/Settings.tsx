import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { db } from "@/firebase";
import { doc, updateDoc, deleteDoc, getDoc, setDoc } from "firebase/firestore";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from "firebase/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PageHero } from "@/components/PageHero";
import { SEO } from "@/components/SEO";
import { User, CreditCard, Bell, Shield, Loader2, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
    country: "NL",
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notifications state
  const [notifications, setNotifications] = useState({
    bottleShipped: true,
    votingReminders: true,
    impactReports: true,
    gratisNews: false,
  });

  // User tier data from Firestore
  const [userTier, setUserTier] = useState<string>("explorer");
  const [memberSince, setMemberSince] = useState<string>("Loading...");
  const [bottlesClaimed, setBottlesClaimed] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from Firestore on mount
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();

          // Update profile data
          setProfileData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: user.email || "",
            phone: data.phone || "",
            street: data.defaultShippingAddress?.street || "",
            city: data.defaultShippingAddress?.city || "",
            postalCode: data.defaultShippingAddress?.postalCode || "",
            country: data.defaultShippingAddress?.country || "NL",
          });

          // Update notifications
          if (data.notifications) {
            setNotifications(data.notifications);
          }

          // Update tier info
          setUserTier(data.tribeTier || "explorer");
          setBottlesClaimed(data.bottlesClaimed || 0);

          // Format member since date
          if (data.createdAt) {
            const date = data.createdAt.toDate();
            setMemberSince(
              date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
            );
          }
        } else {
          // Create user document if it doesn't exist
          console.log("User document does not exist, creating...");
          const now = new Date();
          await setDoc(userRef, {
            email: user.email || "",
            firstName: "",
            lastName: "",
            phone: "",
            tribeTier: "explorer",
            bottlesClaimed: 0,
            bottlesLimit: 1,
            totalImpact: 0,
            notifications: {
              bottleShipped: true,
              votingReminders: true,
              impactReports: true,
              gratisNews: false,
            },
            createdAt: now,
            updatedAt: now,
          });

          // Set default values
          setProfileData({
            firstName: "",
            lastName: "",
            email: user.email || "",
            phone: "",
            street: "",
            city: "",
            postalCode: "",
            country: "NL",
          });
          setMemberSince(
            now.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          );
          toast.info("Welcome! Please complete your profile.");
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (!user) throw new Error("No user");

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        defaultShippingAddress: {
          street: profileData.street,
          city: profileData.city,
          postalCode: profileData.postalCode,
          country: profileData.country,
        },
        updatedAt: new Date(),
      });

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsSaving(true);

    try {
      if (!user || !user.email) throw new Error("No user");

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordData.currentPassword,
      );
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, passwordData.newPassword);

      // Clear form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success("Password changed successfully");
    } catch (error: any) {
      console.error("Error changing password:", error);
      if (error.code === "auth/wrong-password") {
        toast.error("Current password is incorrect");
      } else {
        toast.error("Failed to change password");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);

    try {
      if (!user) throw new Error("No user");

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        notifications,
        updatedAt: new Date(),
      });

      toast.success("Notification preferences saved");
    } catch (error) {
      console.error("Error updating notifications:", error);
      toast.error("Failed to save preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (!user) throw new Error("No user");

      // Delete user document from Firestore
      await deleteDoc(doc(db, "users", user.uid));

      // Delete authentication account
      await deleteUser(user);

      toast.success("Account deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(
        "Failed to delete account. Please re-authenticate and try again.",
      );
    }
  };

  return (
    <>
      <SEO
        title="Settings | Dashboard"
        description="Manage your account settings"
      />
      <PageHero
        title="Settings"
        subtitle="Manage your account and preferences"
      />
      <DashboardNav />

      <div className="bg-background pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Back Button */}
          <div className="mb-6">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                ← Back to Dashboard
              </Button>
            </Link>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="membership">
                <CreditCard className="h-4 w-4 mr-2" />
                Membership
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* PROFILE TAB */}
            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={profileData.firstName}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                firstName: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={profileData.lastName}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                lastName: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          disabled
                        />
                        <p className="text-xs text-muted-foreground">
                          Email cannot be changed. Contact support if needed.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone (Optional)</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="pt-4 border-t">
                        <h3 className="font-semibold mb-4">
                          Default Shipping Address
                        </h3>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="street">Street Address</Label>
                            <Input
                              id="street"
                              value={profileData.street}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  street: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="city">City</Label>
                              <Input
                                id="city"
                                value={profileData.city}
                                onChange={(e) =>
                                  setProfileData({
                                    ...profileData,
                                    city: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="postalCode">Postal Code</Label>
                              <Input
                                id="postalCode"
                                value={profileData.postalCode}
                                onChange={(e) =>
                                  setProfileData({
                                    ...profileData,
                                    postalCode: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Select
                              value={profileData.country}
                              onValueChange={(value) =>
                                setProfileData({
                                  ...profileData,
                                  country: value,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="NL">Netherlands</SelectItem>
                                <SelectItem value="DE">Germany</SelectItem>
                                <SelectItem value="BE">Belgium</SelectItem>
                                <SelectItem value="FR">France</SelectItem>
                                <SelectItem value="US">
                                  United States
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isSaving}>
                          {isSaving ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="mr-2 h-4 w-4" />
                          )}
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* MEMBERSHIP TAB */}
            <TabsContent value="membership" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Membership</CardTitle>
                  <CardDescription>
                    Manage your TRIBE subscription
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Current Tier
                      </p>
                      <Badge className="mt-1 bg-blue-500 text-white">
                        {userTier.toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Member Since
                      </p>
                      <p className="font-medium mt-1">{memberSince}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Bottles Claimed
                      </p>
                      <p className="font-medium mt-1">{bottlesClaimed} total</p>
                    </div>
                  </div>

                  {userTier !== "founder" && (
                    <>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">
                            Upgrade Your Membership
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Get more bottles and additional benefits
                          </p>
                        </div>
                        <Link to="/tribe">
                          <Button>Upgrade</Button>
                        </Link>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">Manage Subscription</h4>
                          <p className="text-sm text-muted-foreground">
                            Update payment method or cancel subscription
                          </p>
                        </div>
                        <Button variant="outline">Manage on Stripe</Button>
                      </div>
                    </>
                  )}

                  {userTier === "founder" && (
                    <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Founder Member 👑</h4>
                      <p className="text-sm">
                        You have lifetime access to all GRATIS benefits. Thank
                        you for being a Founding Member!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* NOTIFICATIONS TAB */}
            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>
                    Choose what updates you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="bottleShipped">
                          Bottle Shipped Updates
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when your bottle ships and when it's
                          delivered
                        </p>
                      </div>
                      <Switch
                        id="bottleShipped"
                        checked={notifications.bottleShipped}
                        onCheckedChange={(checked) =>
                          setNotifications({
                            ...notifications,
                            bottleShipped: checked,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="votingReminders">
                          Voting Period Reminders
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Reminders when new voting periods open
                        </p>
                      </div>
                      <Switch
                        id="votingReminders"
                        checked={notifications.votingReminders}
                        onCheckedChange={(checked) =>
                          setNotifications({
                            ...notifications,
                            votingReminders: checked,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="impactReports">Impact Reports</Label>
                        <p className="text-sm text-muted-foreground">
                          Quarterly impact reports and transparency updates
                        </p>
                      </div>
                      <Switch
                        id="impactReports"
                        checked={notifications.impactReports}
                        onCheckedChange={(checked) =>
                          setNotifications({
                            ...notifications,
                            impactReports: checked,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="gratisNews">
                          GRATIS News & Updates
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Product launches, partnerships, and company news
                        </p>
                      </div>
                      <Switch
                        id="gratisNews"
                        checked={notifications.gratisNews}
                        onCheckedChange={(checked) =>
                          setNotifications({
                            ...notifications,
                            gratisNews: checked,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <Button
                      onClick={handleSaveNotifications}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="mr-2 h-4 w-4" />
                      )}
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SECURITY TAB */}
            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={isSaving}>
                        {isSaving && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Change Password
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Sessions</CardTitle>
                  <CardDescription>
                    Manage your logged-in devices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-muted-foreground">
                          Windows • Chrome • Amsterdam, NL
                        </p>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={signOut}
                    >
                      Log Out All Devices
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">
                    Danger Zone
                  </CardTitle>
                  <CardDescription>Irreversible actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove all your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Yes, Delete My Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
