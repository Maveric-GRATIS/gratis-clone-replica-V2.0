// src/pages/UserMFASettings.tsx
// User-facing MFA settings page

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Shield,
  CheckCircle,
  XCircle,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
} from "lucide-react";
import { MFASetup } from "@/components/auth/MFASetup";
import { useMFA } from "@/hooks/useMFA";
import { MFAService } from "@/lib/auth/mfa-service";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function UserMFASettings() {
  const { user } = useAuth();
  const { mfaConfig, isEnabled, loading, refresh } = useMFA();
  const [showSetup, setShowSetup] = useState(false);
  const [showDisable, setShowDisable] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [disableCode, setDisableCode] = useState("");
  const [regenerateCode, setRegenerateCode] = useState("");
  const [newBackupCodes, setNewBackupCodes] = useState<string[]>([]);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleDisableMFA = async () => {
    if (!user || !disableCode) return;

    setActionLoading(true);
    try {
      const success = await MFAService.disableMFA(user.uid, disableCode);
      if (success) {
        toast.success("MFA has been disabled");
        setShowDisable(false);
        setDisableCode("");
        refresh();
      } else {
        toast.error("Invalid verification code");
      }
    } catch (error) {
      toast.error("Failed to disable MFA");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRegenerateBackupCodes = async () => {
    if (!user || !regenerateCode) return;

    setActionLoading(true);
    try {
      const codes = await MFAService.regenerateBackupCodes(
        user.uid,
        regenerateCode,
      );
      if (codes) {
        setNewBackupCodes(codes);
        toast.success("Backup codes regenerated");
        setRegenerateCode("");
        refresh();
      } else {
        toast.error("Invalid verification code");
      }
    } catch (error) {
      toast.error("Failed to regenerate backup codes");
    } finally {
      setActionLoading(false);
    }
  };

  const copyBackupCodes = async () => {
    await navigator.clipboard.writeText(newBackupCodes.join("\n"));
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 2000);
    toast.success("Backup codes copied to clipboard");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center py-12">Loading MFA settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Security Settings</h1>
          <p className="text-muted-foreground">
            Manage your two-factor authentication settings
          </p>
        </div>

        {/* MFA Status Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-lg ${
                    isEnabled
                      ? "bg-green-100 dark:bg-green-900"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  <Shield
                    className={`w-6 h-6 ${
                      isEnabled
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <div>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    {isEnabled
                      ? "Your account is protected with 2FA"
                      : "Add an extra layer of security"}
                  </CardDescription>
                </div>
              </div>
              <div>
                {isEnabled ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : (
                  <XCircle className="w-8 h-8 text-gray-300" />
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEnabled ? (
              <>
                <Alert>
                  <CheckCircle className="w-4 h-4" />
                  <AlertDescription>
                    Two-factor authentication is active. You'll be asked for a
                    verification code when signing in.
                  </AlertDescription>
                </Alert>

                {mfaConfig && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium text-green-600">
                        Enabled
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Methods:</span>
                      <span className="font-medium">
                        {mfaConfig.methods
                          .filter((m) => m.enabled)
                          .map((m) => m.method.toUpperCase())
                          .join(", ")}
                      </span>
                    </div>
                    {mfaConfig.lastVerifiedAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Last verified:
                        </span>
                        <span className="font-medium">
                          {new Date(mfaConfig.lastVerifiedAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Backup codes:
                      </span>
                      <span className="font-medium">
                        {mfaConfig.backupCodes.filter((c) => !c.usedAt).length}{" "}
                        unused
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setShowBackupCodes(true)}
                    variant="outline"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate Backup Codes
                  </Button>
                  <Button
                    onClick={() => setShowDisable(true)}
                    variant="destructive"
                  >
                    Disable 2FA
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Alert>
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription>
                    Your account is not protected with two-factor
                    authentication. We recommend enabling it for enhanced
                    security.
                  </AlertDescription>
                </Alert>
                <Button onClick={() => setShowSetup(true)}>
                  <Shield className="w-4 h-4 mr-2" />
                  Enable Two-Factor Authentication
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>What is Two-Factor Authentication?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Two-factor authentication (2FA) adds an extra layer of security to
              your account by requiring a verification code in addition to your
              password when signing in.
            </p>
            <p>
              You'll need an authenticator app like Google Authenticator, Authy,
              or 1Password to generate verification codes.
            </p>
            <p>
              We also provide backup codes that you can use if you lose access
              to your authenticator app.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Setup Dialog */}
      <Dialog open={showSetup} onOpenChange={setShowSetup}>
        <DialogContent className="max-w-2xl">
          <MFASetup
            onComplete={() => {
              setShowSetup(false);
              refresh();
              toast.success("Two-factor authentication enabled!");
            }}
            onCancel={() => setShowSetup(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Disable Dialog */}
      <Dialog open={showDisable} onOpenChange={setShowDisable}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Enter a verification code from your authenticator app to disable
              2FA
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                Disabling 2FA will make your account less secure
              </AlertDescription>
            </Alert>
            <Input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={disableCode}
              onChange={(e) =>
                setDisableCode(e.target.value.replace(/\D/g, ""))
              }
              placeholder="000000"
              className="text-center text-2xl tracking-widest font-mono"
            />
            <div className="flex gap-3">
              <Button
                onClick={handleDisableMFA}
                disabled={actionLoading || disableCode.length < 6}
                variant="destructive"
                className="flex-1"
              >
                Disable 2FA
              </Button>
              <Button
                onClick={() => {
                  setShowDisable(false);
                  setDisableCode("");
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Regenerate Backup Codes Dialog */}
      <Dialog open={showBackupCodes} onOpenChange={setShowBackupCodes}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Regenerate Backup Codes</DialogTitle>
            <DialogDescription>
              {newBackupCodes.length === 0
                ? "Enter a verification code to generate new backup codes"
                : "Save these new backup codes in a safe place"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {newBackupCodes.length === 0 ? (
              <>
                <Alert>
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription>
                    This will invalidate all your existing backup codes
                  </AlertDescription>
                </Alert>
                <Input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={regenerateCode}
                  onChange={(e) =>
                    setRegenerateCode(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="000000"
                  className="text-center text-2xl tracking-widest font-mono"
                />
                <div className="flex gap-3">
                  <Button
                    onClick={handleRegenerateBackupCodes}
                    disabled={actionLoading || regenerateCode.length < 6}
                    className="flex-1"
                  >
                    Generate New Codes
                  </Button>
                  <Button
                    onClick={() => {
                      setShowBackupCodes(false);
                      setRegenerateCode("");
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2 p-4 bg-muted rounded-lg font-mono text-sm">
                  {newBackupCodes.map((code, i) => (
                    <div key={i} className="text-center py-1">
                      {code}
                    </div>
                  ))}
                </div>
                <Button
                  onClick={copyBackupCodes}
                  variant="outline"
                  className="w-full"
                >
                  {copiedCodes ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy All Codes
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setShowBackupCodes(false);
                    setNewBackupCodes([]);
                  }}
                  className="w-full"
                >
                  Done
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
