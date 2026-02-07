// src/components/auth/MFASetup.tsx
// MFA setup wizard component

import { useState } from "react";
import { Shield, Copy, Check, AlertTriangle, Loader2 } from "lucide-react";
import { MFAService } from "@/lib/auth/mfa-service";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MFASetupProps {
  onComplete: () => void;
  onCancel: () => void;
}

type Step = "intro" | "qr" | "verify" | "backup" | "done";

export function MFASetup({ onComplete, onCancel }: MFASetupProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("intro");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);

  const startSetup = async () => {
    if (!user) return;

    setLoading(true);
    setError("");
    try {
      const setup = await MFAService.setupTOTP(user.uid, user.email || "");
      setQrCode(setup.qrCode);
      setSecret(setup.secret);
      setBackupCodes(setup.backupCodes);
      setStep("qr");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Setup failed");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (code.length < 6) {
      setError("Enter a 6-digit code");
      return;
    }

    if (!user) return;

    setLoading(true);
    setError("");
    try {
      const result = await MFAService.verifySetup(user.uid, code);
      if (!result.success) {
        throw new Error(result.error);
      }
      setStep("backup");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: "secret" | "codes") => {
    await navigator.clipboard.writeText(text);
    if (type === "secret") setCopiedSecret(true);
    else setCopiedCodes(true);
    setTimeout(() => {
      if (type === "secret") setCopiedSecret(false);
      else setCopiedCodes(false);
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto bg-card rounded-xl shadow-lg p-6 border">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
          <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Two-Factor Authentication</h2>
          <p className="text-sm text-muted-foreground">
            {step === "intro" && "Add an extra layer of security"}
            {step === "qr" && "Scan with your authenticator app"}
            {step === "verify" && "Enter verification code"}
            {step === "backup" && "Save your backup codes"}
            {step === "done" && "Setup complete!"}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Step: Intro */}
      {step === "intro" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Two-factor authentication adds an extra layer of security to your
            account. You'll need an authenticator app like Google Authenticator,
            Authy, or 1Password.
          </p>
          <div className="flex gap-3">
            <Button onClick={startSetup} disabled={loading} className="flex-1">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Get Started
            </Button>
            <Button onClick={onCancel} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Step: QR Code */}
      {step === "qr" && (
        <div className="space-y-4">
          <div className="flex justify-center">
            <img
              src={qrCode}
              alt="QR Code for authenticator app"
              className="w-48 h-48 border rounded-lg"
            />
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">
              Can't scan? Enter this key manually:
            </p>
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono bg-background px-2 py-1 rounded border flex-1 break-all">
                {secret}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(secret, "secret")}
              >
                {copiedSecret ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <Button onClick={() => setStep("verify")} className="w-full">
            I've Scanned the Code
          </Button>
        </div>
      )}

      {/* Step: Verify */}
      {step === "verify" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code from your authenticator app to complete
            setup.
          </p>
          <Input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            className="text-center text-2xl tracking-widest font-mono"
            autoFocus
          />
          <Button
            onClick={verifyCode}
            disabled={loading || code.length < 6}
            className="w-full"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Verify & Enable
          </Button>
        </div>
      )}

      {/* Step: Backup Codes */}
      {step === "backup" && (
        <div className="space-y-4">
          <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800">
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              <p className="font-medium">
                Save these backup codes in a safe place
              </p>
              <p className="text-xs mt-1">
                If you lose access to your authenticator app, you can use these
                codes to sign in. Each code can only be used once.
              </p>
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 gap-2 p-3 bg-muted rounded-lg font-mono text-sm">
            {backupCodes.map((c, i) => (
              <div key={i} className="text-center py-1">
                {c}
              </div>
            ))}
          </div>

          <Button
            onClick={() => copyToClipboard(backupCodes.join("\n"), "codes")}
            variant="outline"
            className="w-full"
          >
            {copiedCodes ? (
              <>
                <Check className="w-4 h-4 mr-2 text-emerald-500" />
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
              setStep("done");
              onComplete();
            }}
            className="w-full"
          >
            I've Saved My Codes
          </Button>
        </div>
      )}

      {/* Step: Done */}
      {step === "done" && (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-muted-foreground">
            Two-factor authentication is now enabled. You'll be asked for a code
            each time you sign in.
          </p>
        </div>
      )}
    </div>
  );
}
