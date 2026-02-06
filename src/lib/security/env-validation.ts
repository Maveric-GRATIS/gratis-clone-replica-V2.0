/**
 * Environment Variable Validation
 * Ensures all required configuration is present at startup
 */

interface EnvSchema {
  // Firebase Configuration
  VITE_FIREBASE_API_KEY: string;
  VITE_FIREBASE_AUTH_DOMAIN: string;
  VITE_FIREBASE_PROJECT_ID: string;
  VITE_FIREBASE_STORAGE_BUCKET: string;
  VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  VITE_FIREBASE_APP_ID: string;

  // Stripe Configuration
  VITE_STRIPE_PUBLIC_KEY: string;

  // Optional: Redis (for rate limiting)
  VITE_REDIS_URL?: string;

  // Optional: Mux (for video streaming)
  VITE_MUX_TOKEN_ID?: string;
  VITE_MUX_TOKEN_SECRET?: string;

  // Application
  VITE_APP_URL?: string;
  VITE_API_URL?: string;
}

export class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validates that a value is a non-empty string
 */
function validateRequired(value: any, field: string): string {
  if (!value || typeof value !== 'string' || value.trim() === '') {
    throw new ValidationError(field, `${field} is required but not provided or empty`);
  }
  return value.trim();
}

/**
 * Validates that a URL is properly formatted (optional field)
 */
function validateUrl(value: any, field: string): string | undefined {
  if (!value) return undefined;

  try {
    new URL(value);
    return value;
  } catch {
    throw new ValidationError(field, `${field} must be a valid URL`);
  }
}

/**
 * Validates Firebase configuration
 */
function validateFirebaseConfig(env: any): void {
  const requiredFields = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ];

  for (const field of requiredFields) {
    validateRequired(env[field], field);
  }

  // Validate auth domain format
  const authDomain = env.VITE_FIREBASE_AUTH_DOMAIN;
  if (!authDomain.includes('.firebaseapp.com') && !authDomain.includes('.web.app')) {
    throw new ValidationError(
      'VITE_FIREBASE_AUTH_DOMAIN',
      'Firebase auth domain must end with .firebaseapp.com or .web.app'
    );
  }
}

/**
 * Validates Stripe configuration
 */
function validateStripeConfig(env: any): void {
  const publicKey = validateRequired(env.VITE_STRIPE_PUBLIC_KEY, 'VITE_STRIPE_PUBLIC_KEY');

  // Validate Stripe key format
  if (!publicKey.startsWith('pk_test_') && !publicKey.startsWith('pk_live_')) {
    throw new ValidationError(
      'VITE_STRIPE_PUBLIC_KEY',
      'Stripe public key must start with pk_test_ or pk_live_'
    );
  }
}

/**
 * Validates all environment variables
 * Throws ValidationError if any required variable is missing or invalid
 */
export function validateEnvironment(): EnvSchema {
  const errors: ValidationError[] = [];

  try {
    // Validate Firebase
    validateFirebaseConfig(import.meta.env);
  } catch (error) {
    if (error instanceof ValidationError) errors.push(error);
  }

  try {
    // Validate Stripe
    validateStripeConfig(import.meta.env);
  } catch (error) {
    if (error instanceof ValidationError) errors.push(error);
  }

  // Validate optional URLs
  try {
    if (import.meta.env.VITE_APP_URL) {
      validateUrl(import.meta.env.VITE_APP_URL, 'VITE_APP_URL');
    }
    if (import.meta.env.VITE_API_URL) {
      validateUrl(import.meta.env.VITE_API_URL, 'VITE_API_URL');
    }
  } catch (error) {
    if (error instanceof ValidationError) errors.push(error);
  }

  // If there are any errors, throw them all together
  if (errors.length > 0) {
    const errorMessage = errors.map(e => `  - ${e.message}`).join('\n');
    throw new Error(
      `Environment validation failed:\n${errorMessage}\n\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }

  // Return validated environment (cast through unknown to bypass type checking)
  return import.meta.env as unknown as EnvSchema;
}

/**
 * Gets a validated environment variable
 * Throws if the variable is missing or invalid
 */
export function getRequiredEnv(key: keyof EnvSchema): string {
  const value = import.meta.env[key];
  return validateRequired(value, key);
}

/**
 * Gets an optional environment variable
 */
export function getOptionalEnv(key: keyof EnvSchema): string | undefined {
  const value = import.meta.env[key];
  return value && typeof value === 'string' ? value.trim() : undefined;
}

/**
 * Checks if the app is running in production
 */
export function isProduction(): boolean {
  return import.meta.env.MODE === 'production';
}

/**
 * Checks if the app is running in development
 */
export function isDevelopment(): boolean {
  return import.meta.env.MODE === 'development';
}

/**
 * Gets the current environment name
 */
export function getEnvironment(): string {
  return import.meta.env.MODE || 'development';
}

/**
 * Validates and returns Firebase configuration
 */
export function getFirebaseConfig() {
  return {
    apiKey: getRequiredEnv('VITE_FIREBASE_API_KEY'),
    authDomain: getRequiredEnv('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: getRequiredEnv('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: getRequiredEnv('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getRequiredEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getRequiredEnv('VITE_FIREBASE_APP_ID'),
  };
}

/**
 * Validates and returns Stripe configuration
 */
export function getStripeConfig() {
  return {
    publicKey: getRequiredEnv('VITE_STRIPE_PUBLIC_KEY'),
  };
}
