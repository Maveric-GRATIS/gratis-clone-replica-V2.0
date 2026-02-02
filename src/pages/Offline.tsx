/**
 * Offline Page
 *
 * Part 7 - Section 35: PWA & Mobile Optimization
 * Displayed when user is offline and tries to access unavailable content
 */

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WifiOff, RefreshCw, Home } from "lucide-react";

export default function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-12 h-12 text-gray-400" />
        </div>

        <h1 className="text-3xl font-bold mb-3 dark:text-white">
          You're Offline
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          It looks like you've lost your internet connection. Please check your
          network settings and try again.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={handleRefresh} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>

          <Link to="/">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-left">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            While you're offline:
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <li>• Some features may be limited</li>
            <li>• Cached content will still be available</li>
            <li>• Your data will sync when you're back online</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
