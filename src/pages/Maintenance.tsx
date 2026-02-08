// src/pages/Maintenance.tsx
// Maintenance Mode Page

import { useEffect, useState } from "react";
import { AlertTriangle, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Maintenance() {
  const [isChecking, setIsChecking] = useState(false);

  const checkStatus = async () => {
    setIsChecking(true);
    try {
      const response = await fetch("/api/admin/config/maintenance");
      const data = await response.json();

      if (!data.maintenanceMode) {
        // Maintenance is over, reload the page
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Failed to check maintenance status:", error);
    } finally {
      setIsChecking(false);
    }
  };

  // Auto-check every 30 seconds
  useEffect(() => {
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
              <AlertTriangle className="w-12 h-12 text-yellow-600 dark:text-yellow-500" />
            </div>
          </div>
          <CardTitle className="text-3xl">Platform Under Maintenance</CardTitle>
          <CardDescription className="text-lg mt-2">
            We're currently performing system maintenance to improve your
            experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-6 rounded-lg space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Expected Duration</p>
                <p className="text-sm text-muted-foreground">
                  We expect to be back online shortly. Please check back in a
                  few minutes.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm">
              <strong>Note:</strong> Your data is safe and secure. No action is
              required from your side.
            </p>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={checkStatus}
              disabled={isChecking}
              className="gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${isChecking ? "animate-spin" : ""}`}
              />
              {isChecking ? "Checking..." : "Check Status"}
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground pt-4 border-t">
            <p>For urgent matters, please contact:</p>
            <a
              href="mailto:support@gratis.ngo"
              className="text-primary hover:underline font-medium"
            >
              support@gratis.ngo
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
