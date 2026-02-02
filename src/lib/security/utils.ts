// =============================================================================
// SECURITY UTILITIES
// =============================================================================

/**
 * Rate limiter for client-side API calls
 */
class RateLimiter {
  private attempts = new Map<string, number[]>();

  /**
   * Check if action is rate limited
   * @param key Unique identifier (e.g., userId, IP)
   * @param maxAttempts Maximum attempts allowed
   * @param windowMs Time window in milliseconds
   * @returns true if rate limit exceeded
   */
  isRateLimited(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get existing attempts for this key
    let attempts = this.attempts.get(key) || [];

    // Filter out attempts outside the time window
    attempts = attempts.filter(timestamp => timestamp > windowStart);

    // Update attempts
    this.attempts.set(key, attempts);

    // Check if limit exceeded
    if (attempts.length >= maxAttempts) {
      return true;
    }

    // Add new attempt
    attempts.push(now);
    this.attempts.set(key, attempts);

    return false;
  }

  /**
   * Reset rate limit for a key
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }

  /**
   * Clear all rate limits
   */
  clearAll(): void {
    this.attempts.clear();
  }

  /**
   * Get remaining attempts
   */
  getRemainingAttempts(key: string, maxAttempts: number, windowMs: number): number {
    const now = Date.now();
    const windowStart = now - windowMs;

    let attempts = this.attempts.get(key) || [];
    attempts = attempts.filter(timestamp => timestamp > windowStart);

    return Math.max(0, maxAttempts - attempts.length);
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Input sanitization utilities
 */
export const sanitize = {
  /**
   * Remove HTML tags and dangerous characters
   */
  html(input: string): string {
    return input
      .replace(/<[^>]*>/g, '')
      .replace(/[<>'"&]/g, char => {
        const entities: Record<string, string> = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
          '&': '&amp;',
        };
        return entities[char] || char;
      });
  },

  /**
   * Sanitize email address
   */
  email(input: string): string {
    return input.toLowerCase().trim();
  },

  /**
   * Sanitize username (alphanumeric, dash, underscore only)
   */
  username(input: string): string {
    return input.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
  },

  /**
   * Sanitize phone number (digits only)
   */
  phone(input: string): string {
    return input.replace(/\D/g, '');
  },

  /**
   * Sanitize URL
   */
  url(input: string): string {
    try {
      const url = new URL(input);
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(url.protocol)) {
        return '';
      }
      return url.toString();
    } catch {
      return '';
    }
  },
};

/**
 * Input validation utilities
 */
export const validate = {
  /**
   * Validate email format
   */
  email(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate password strength
   */
  password(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate phone number (international format)
   */
  phone(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  },

  /**
   * Validate URL
   */
  url(url: string): boolean {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  },

  /**
   * Validate credit card number (Luhn algorithm)
   */
  creditCard(cardNumber: string): boolean {
    const digits = cardNumber.replace(/\D/g, '');

    if (digits.length < 13 || digits.length > 19) {
      return false;
    }

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  },

  /**
   * Validate postal code (various formats)
   */
  postalCode(code: string, country: string = 'US'): boolean {
    const patterns: Record<string, RegExp> = {
      US: /^\d{5}(-\d{4})?$/,
      CA: /^[A-Z]\d[A-Z] \d[A-Z]\d$/,
      UK: /^[A-Z]{1,2}\d{1,2}[A-Z]? \d[A-Z]{2}$/,
      NL: /^\d{4}\s?[A-Z]{2}$/,
      DE: /^\d{5}$/,
      FR: /^\d{5}$/,
    };

    const pattern = patterns[country];
    return pattern ? pattern.test(code) : true; // Default to true for unknown countries
  },
};

/**
 * Content Security Policy helpers
 */
export const csp = {
  /**
   * Generate nonce for inline scripts
   */
  generateNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  },
};

/**
 * XSS Prevention helpers
 */
export const xss = {
  /**
   * Escape HTML entities
   */
  escape(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    };
    return text.replace(/[&<>"'/]/g, char => map[char]);
  },

  /**
   * Sanitize user-generated content
   */
  sanitizeContent(content: string): string {
    // Remove script tags
    content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove event handlers
    content = content.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

    // Remove javascript: protocol
    content = content.replace(/javascript:/gi, '');

    return content;
  },
};

/**
 * CSRF Protection helpers
 */
export const csrf = {
  /**
   * Generate CSRF token
   */
  generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  },

  /**
   * Store CSRF token
   */
  storeToken(token: string): void {
    sessionStorage.setItem('csrf_token', token);
  },

  /**
   * Get stored CSRF token
   */
  getToken(): string | null {
    return sessionStorage.getItem('csrf_token');
  },

  /**
   * Clear CSRF token
   */
  clearToken(): void {
    sessionStorage.removeItem('csrf_token');
  },
};

/**
 * Secure storage utilities
 */
export const secureStorage = {
  /**
   * Store sensitive data with encryption (basic obfuscation)
   */
  setItem(key: string, value: string): void {
    const encoded = btoa(value);
    sessionStorage.setItem(`sec_${key}`, encoded);
  },

  /**
   * Retrieve sensitive data
   */
  getItem(key: string): string | null {
    const encoded = sessionStorage.getItem(`sec_${key}`);
    if (!encoded) return null;

    try {
      return atob(encoded);
    } catch {
      return null;
    }
  },

  /**
   * Remove sensitive data
   */
  removeItem(key: string): void {
    sessionStorage.removeItem(`sec_${key}`);
  },

  /**
   * Clear all secure storage
   */
  clear(): void {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith('sec_')) {
        sessionStorage.removeItem(key);
      }
    });
  },
};
