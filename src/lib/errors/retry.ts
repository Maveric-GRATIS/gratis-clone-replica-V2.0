/**
 * Retry Logic with Exponential Backoff
 * Smart retry mechanism for transient failures
 */

import { RetryConfig } from '@/types/errors';
import { isAppError } from './app-error';
import { isRetryableError } from './error-codes';

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffMultiplier: 2,
  retryableErrors: [],
};

/**
 * Retry result
 */
interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  attempts: number;
  totalDelay: number;
}

/**
 * Retry statistics
 */
interface RetryStats {
  totalAttempts: number;
  successfulRetries: number;
  failedRetries: number;
  averageAttempts: number;
  averageDelay: number;
}

/**
 * Retry manager class
 */
class RetryManager {
  private stats: RetryStats = {
    totalAttempts: 0,
    successfulRetries: 0,
    failedRetries: 0,
    averageAttempts: 0,
    averageDelay: 0,
  };

  /**
   * Execute operation with retry logic
   */
  async execute<T>(
    operation: () => Promise<T>,
    config: Partial<RetryConfig> = {}
  ): Promise<RetryResult<T>> {
    const retryConfig: RetryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };

    let lastError: Error | undefined;
    let totalDelay = 0;

    for (let attempt = 1; attempt <= retryConfig.maxAttempts; attempt++) {
      try {
        const data = await operation();

        // Success
        this.recordSuccess(attempt, totalDelay);
        return {
          success: true,
          data,
          attempts: attempt,
          totalDelay,
        };
      } catch (error) {
        lastError = error as Error;

        // Check if error is retryable
        if (!this.shouldRetry(error, retryConfig)) {
          this.recordFailure(attempt, totalDelay);
          return {
            success: false,
            error: lastError,
            attempts: attempt,
            totalDelay,
          };
        }

        // Last attempt - don't delay
        if (attempt === retryConfig.maxAttempts) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = this.calculateDelay(attempt, retryConfig);
        totalDelay += delay;

        console.warn(
          `Retry attempt ${attempt}/${retryConfig.maxAttempts} after ${delay}ms`,
          { error: lastError.message }
        );

        // Wait before next attempt
        await this.sleep(delay);
      }
    }

    // All attempts failed
    this.recordFailure(retryConfig.maxAttempts, totalDelay);
    return {
      success: false,
      error: lastError,
      attempts: retryConfig.maxAttempts,
      totalDelay,
    };
  }

  /**
   * Execute with retry and throw on failure
   */
  async executeOrThrow<T>(
    operation: () => Promise<T>,
    config: Partial<RetryConfig> = {}
  ): Promise<T> {
    const result = await this.execute(operation, config);

    if (!result.success) {
      throw result.error;
    }

    return result.data!;
  }

  /**
   * Wrap function with retry logic
   */
  wrap<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    config: Partial<RetryConfig> = {}
  ): T {
    return (async (...args: any[]) => {
      return this.executeOrThrow(() => fn(...args), config);
    }) as T;
  }

  /**
   * Check if error should be retried
   */
  private shouldRetry(error: unknown, config: RetryConfig): boolean {
    // Check if error is in retryable list
    if (config.retryableErrors && config.retryableErrors.length > 0) {
      if (isAppError(error)) {
        return config.retryableErrors.includes(error.code);
      }
      return false;
    }

    // Use error code catalog
    if (isAppError(error)) {
      return isRetryableError(error.code);
    }

    // Network errors are typically retryable
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      return (
        message.includes('network') ||
        message.includes('timeout') ||
        message.includes('econnrefused') ||
        message.includes('enotfound') ||
        message.includes('503') ||
        message.includes('504')
      );
    }

    return false;
  }

  /**
   * Calculate delay with exponential backoff and jitter
   */
  private calculateDelay(attempt: number, config: RetryConfig): number {
    // Exponential backoff: delay = initialDelay * (multiplier ^ (attempt - 1))
    const exponentialDelay = config.initialDelay * Math.pow(config.backoffMultiplier, attempt - 1);

    // Cap at max delay
    const cappedDelay = Math.min(exponentialDelay, config.maxDelay);

    // Add jitter (±25%) to prevent thundering herd
    const jitter = cappedDelay * 0.25 * (Math.random() * 2 - 1);

    return Math.max(0, Math.floor(cappedDelay + jitter));
  }

  /**
   * Sleep for specified duration
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Record successful retry
   */
  private recordSuccess(attempts: number, delay: number): void {
    if (attempts > 1) {
      this.stats.successfulRetries++;
    }
    this.stats.totalAttempts += attempts;
    this.updateAverages(attempts, delay);
  }

  /**
   * Record failed retry
   */
  private recordFailure(attempts: number, delay: number): void {
    this.stats.failedRetries++;
    this.stats.totalAttempts += attempts;
    this.updateAverages(attempts, delay);
  }

  /**
   * Update running averages
   */
  private updateAverages(attempts: number, delay: number): void {
    const totalRetries = this.stats.successfulRetries + this.stats.failedRetries;

    this.stats.averageAttempts =
      (this.stats.averageAttempts * (totalRetries - 1) + attempts) / totalRetries;

    this.stats.averageDelay =
      (this.stats.averageDelay * (totalRetries - 1) + delay) / totalRetries;
  }

  /**
   * Get retry statistics
   */
  getStats(): RetryStats {
    return { ...this.stats };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = {
      totalAttempts: 0,
      successfulRetries: 0,
      failedRetries: 0,
      averageAttempts: 0,
      averageDelay: 0,
    };
  }
}

// Export singleton instance
export const retryManager = new RetryManager();

// Export class for testing
export { RetryManager };

/**
 * Utility: Retry operation with default config
 */
export async function retry<T>(
  operation: () => Promise<T>,
  config?: Partial<RetryConfig>
): Promise<T> {
  return retryManager.executeOrThrow(operation, config);
}

/**
 * Utility: Retry with custom attempts
 */
export async function retryWithAttempts<T>(
  operation: () => Promise<T>,
  maxAttempts: number
): Promise<T> {
  return retry(operation, { maxAttempts });
}

/**
 * Utility: Retry network operations
 */
export async function retryNetwork<T>(operation: () => Promise<T>): Promise<T> {
  return retry(operation, {
    maxAttempts: 3,
    initialDelay: 500,
    maxDelay: 5000,
    backoffMultiplier: 2,
  });
}

/**
 * Utility: Retry database operations
 */
export async function retryDatabase<T>(operation: () => Promise<T>): Promise<T> {
  return retry(operation, {
    maxAttempts: 5,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
  });
}

/**
 * Utility: Retry external API calls
 */
export async function retryExternalAPI<T>(operation: () => Promise<T>): Promise<T> {
  return retry(operation, {
    maxAttempts: 3,
    initialDelay: 2000,
    maxDelay: 30000,
    backoffMultiplier: 3,
  });
}

/**
 * Advanced: Circuit breaker with retry
 */
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private threshold: number = 5,
    private timeout: number = 60000 // 1 minute
  ) {}

  async execute<T>(
    operation: () => Promise<T>,
    retryConfig?: Partial<RetryConfig>
  ): Promise<T> {
    // Check circuit state
    if (this.state === 'open') {
      const timeSinceFailure = Date.now() - this.lastFailureTime;

      if (timeSinceFailure < this.timeout) {
        throw new Error('Circuit breaker is open');
      }

      // Try half-open
      this.state = 'half-open';
    }

    try {
      const result = await retryManager.executeOrThrow(operation, retryConfig);

      // Success - reset or close circuit
      if (this.state === 'half-open') {
        this.state = 'closed';
        this.failures = 0;
      }

      return result;
    } catch (error) {
      this.failures++;
      this.lastFailureTime = Date.now();

      // Open circuit if threshold exceeded
      if (this.failures >= this.threshold) {
        this.state = 'open';
        console.error(`Circuit breaker opened after ${this.failures} failures`);
      }

      throw error;
    }
  }

  reset(): void {
    this.failures = 0;
    this.state = 'closed';
    this.lastFailureTime = 0;
  }

  getState(): 'closed' | 'open' | 'half-open' {
    return this.state;
  }
}

export { CircuitBreaker };
