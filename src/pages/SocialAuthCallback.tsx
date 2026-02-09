// ============================================================================
// GRATIS.NGO — Social Auth Redirect Callback Page
// ============================================================================

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { handleRedirectResult } from "@/lib/auth/social-auth-service";

export default function SocialAuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing",
  );
  const [message, setMessage] = useState("Processing authentication...");

  useEffect(() => {
    processAuth();
  }, []);

  async function processAuth() {
    try {
      const result = await handleRedirectResult();

      if (!result) {
        setStatus("error");
        setMessage("No authentication result found");
        setTimeout(() => navigate("/auth"), 3000);
        return;
      }

      if (result.success) {
        setStatus("success");
        setMessage(
          result.isNewUser
            ? "Account created successfully!"
            : "Signed in successfully!",
        );
        setTimeout(() => navigate("/"), 2000);
      } else {
        setStatus("error");
        setMessage(result.error || "Authentication failed");
        setTimeout(() => navigate("/auth"), 3000);
      }
    } catch (error: any) {
      setStatus("error");
      setMessage(error.message || "An unexpected error occurred");
      setTimeout(() => navigate("/auth"), 3000);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-6 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          {status === "processing" && (
            <Loader2 className="w-16 h-16 text-emerald-400 animate-spin" />
          )}
          {status === "success" && (
            <CheckCircle2 className="w-16 h-16 text-emerald-400" />
          )}
          {status === "error" && <XCircle className="w-16 h-16 text-red-400" />}
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">
            {status === "processing" && "Authenticating..."}
            {status === "success" && "Success!"}
            {status === "error" && "Authentication Failed"}
          </h1>
          <p className="text-gray-400">{message}</p>
        </div>

        {/* Progress Dots */}
        {status === "processing" && (
          <div className="flex justify-center gap-2">
            <div
              className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        )}

        {/* Redirect Notice */}
        {status !== "processing" && (
          <p className="text-sm text-gray-500">
            Redirecting {status === "success" ? "to dashboard" : "to sign in"}
            ...
          </p>
        )}
      </div>
    </div>
  );
}
