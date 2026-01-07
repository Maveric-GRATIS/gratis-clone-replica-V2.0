import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Home, MessageCircle } from 'lucide-react';

const GlobalErrorFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <div className="text-center max-w-lg space-y-6">
      <h1 className="text-4xl font-bold text-foreground">GRATIS</h1>
      <h2 className="text-xl font-semibold text-muted-foreground">
        Something unexpected happened
      </h2>
      <p className="text-muted-foreground">
        We're experiencing technical difficulties. Our team has been notified and we're working to fix this.
      </p>
      <div className="flex gap-4 justify-center">
        <Button onClick={() => window.location.href = '/'} className="gap-2">
          <Home className="h-4 w-4" />
          Go Home
        </Button>
        <Button variant="outline" onClick={() => window.location.reload()} className="gap-2">
          <MessageCircle className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  </div>
);

export const GlobalErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary fallback={<GlobalErrorFallback />}>
    {children}
  </ErrorBoundary>
);