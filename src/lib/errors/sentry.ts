/**
 * Sentry Error Tracking Configuration
 * Real-time error monitoring and alerting
 * 
 * Setup Instructions:
 * 1. Install: npm install @sentry/react
 * 2. Create project at sentry.io
 * 3. Add VITE_SENTRY_DSN to .env
 * 4. Uncomment the init code below
 */

// import * as Sentry from "@sentry/react";

export const initSentry = () => {
  // Uncomment when Sentry is installed
  /*
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        new Sentry.BrowserTracing({
          // Set 'tracePropagationTargets' to control distributed tracing
          tracePropagationTargets: ["localhost", /^https:\/\/gratis\.ngo/],
        }),
        new Sentry.Replay({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      
      // Performance Monitoring
      tracesSampleRate: 1.0, // Capture 100% of transactions in dev, adjust in prod
      
      // Session Replay
      replaysSessionSampleRate: 0.1, // 10% of sessions
      replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
      
      // Environment
      environment: import.meta.env.MODE,
      
      // Release tracking
      release: `gratis-ngo@${import.meta.env.VITE_APP_VERSION || "1.0.0"}`,
      
      // Before send hook - filter sensitive data
      beforeSend(event, hint) {
        // Don't send events in development (optional)
        if (import.meta.env.DEV) {
          console.warn("Sentry event (not sent in dev):", event);
          return null;
        }
        
        // Filter out sensitive data
        if (event.request?.cookies) {
          delete event.request.cookies;
        }
        
        return event;
      },
    });
  }
  */
};

/**
 * Capture exception manually
 */
export const captureException = (error: Error, context?: Record<string, any>) => {
  console.error("Error:", error, context);
  
  // Uncomment when Sentry is installed
  /*
  Sentry.captureException(error, {
    contexts: context ? { custom: context } : undefined,
  });
  */
};

/**
 * Capture custom message
 */
export const captureMessage = (
  message: string,
  level: "fatal" | "error" | "warning" | "info" | "debug" = "info"
) => {
  console.log(`[${level}] ${message}`);
  
  // Uncomment when Sentry is installed
  /*
  Sentry.captureMessage(message, level);
  */
};

/**
 * Set user context
 */
export const setUserContext = (user: { id: string; email?: string; username?: string }) => {
  // Uncomment when Sentry is installed
  /*
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
  });
  */
};

/**
 * Clear user context (on logout)
 */
export const clearUserContext = () => {
  // Uncomment when Sentry is installed
  /*
  Sentry.setUser(null);
  */
};

/**
 * Add breadcrumb for debugging
 */
export const addBreadcrumb = (
  message: string,
  category: string,
  level: "fatal" | "error" | "warning" | "info" | "debug" = "info",
  data?: Record<string, any>
) => {
  // Uncomment when Sentry is installed
  /*
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000,
  });
  */
};

/**
 * Monitor Web Vitals
 */
export const reportWebVitals = () => {
  // Uncomment when Sentry is installed
  /*
  import("web-vitals").then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
    onCLS((metric) => Sentry.captureMessage(`CLS: ${metric.value}`, "info"));
    onFID((metric) => Sentry.captureMessage(`FID: ${metric.value}`, "info"));
    onFCP((metric) => Sentry.captureMessage(`FCP: ${metric.value}`, "info"));
    onLCP((metric) => Sentry.captureMessage(`LCP: ${metric.value}`, "info"));
    onTTFB((metric) => Sentry.captureMessage(`TTFB: ${metric.value}`, "info"));
  });
  */
};

// Export Sentry (when installed)
// export { Sentry };

// Placeholder for now
export const Sentry = {
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => children,
};
