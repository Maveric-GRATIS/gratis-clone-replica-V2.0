/**
 * Environment Configuration
 *
 * Centralized environment variable management with type safety.
 * All environment variables must be prefixed with VITE_ to be exposed to the client.
 */

interface EnvironmentConfig {
  // Firebase
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
  };

  // Stripe
  stripe: {
    publishableKey: string;
  };

  // App
  app: {
    url: string;
    apiUrl: string;
  };

  // Features
  features: {
    analytics: boolean;
    sentry: boolean;
    serviceWorker: boolean;
  };

  // Development
  dev: {
    debugMode: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  };
}

/**
 * Get environment variable with fallback
 */
function getEnv(key: string, fallback = ''): string {
  return import.meta.env[key] || fallback;
}

/**
 * Get boolean environment variable
 */
function getBoolEnv(key: string, fallback = false): boolean {
  const value = import.meta.env[key];
  if (value === undefined) return fallback;
  return value === 'true' || value === '1';
}

/**
 * Validate required environment variables
 */
function validateEnv(): void {
  const required = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ];

  const missing = required.filter(key => !import.meta.env[key]);

  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Validate on load (only in development)
if (import.meta.env.DEV) {
  try {
    validateEnv();
  } catch (error) {
    console.warn('Environment validation failed:', error);
  }
}

/**
 * Environment configuration object
 */
export const env: EnvironmentConfig = {
  firebase: {
    apiKey: getEnv('VITE_FIREBASE_API_KEY'),
    authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnv('VITE_FIREBASE_APP_ID'),
    measurementId: getEnv('VITE_FIREBASE_MEASUREMENT_ID'),
  },

  stripe: {
    publishableKey: getEnv('VITE_STRIPE_PUBLISHABLE_KEY'),
  },

  app: {
    url: getEnv('VITE_APP_URL', 'http://localhost:8081'),
    apiUrl: getEnv('VITE_API_URL', '/api'),
  },

  features: {
    analytics: getBoolEnv('VITE_ENABLE_ANALYTICS', true),
    sentry: getBoolEnv('VITE_ENABLE_SENTRY', false),
    serviceWorker: getBoolEnv('VITE_ENABLE_SERVICE_WORKER', false),
  },

  dev: {
    debugMode: getBoolEnv('VITE_DEBUG_MODE', false),
    logLevel: (getEnv('VITE_LOG_LEVEL', 'info') as any) || 'info',
  },
};

/**
 * Check if running in production
 */
export const isProduction = import.meta.env.PROD;

/**
 * Check if running in development
 */
export const isDevelopment = import.meta.env.DEV;

/**
 * Get current mode
 */
export const mode = import.meta.env.MODE;

/**
 * Helper to check if feature is enabled
 */
export function isFeatureEnabled(feature: keyof EnvironmentConfig['features']): boolean {
  return env.features[feature];
}

/**
 * Helper to get API endpoint URL
 */
export function getApiUrl(path: string): string {
  const baseUrl = env.app.apiUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Helper to get full URL
 */
export function getFullUrl(path: string): string {
  const baseUrl = env.app.url;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Debug logger (only logs in debug mode)
 */
export function debugLog(...args: any[]): void {
  if (env.dev.debugMode) {
    console.log('[DEBUG]', ...args);
  }
}

/**
 * Export individual configs for convenience
 */
export const firebaseConfig = env.firebase;
export const stripeConfig = env.stripe;
export const appConfig = env.app;
export const featureFlags = env.features;
export const devConfig = env.dev;

export default env;
