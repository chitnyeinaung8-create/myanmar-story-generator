/**
 * API Error Handler for rate limiting and quota exhaustion
 * Provides user-friendly error messages and retry guidance
 */

export interface APIError {
  code: number;
  message: string;
  retryable: boolean;
  userMessage: string;
  retryAfter?: number; // seconds
}

/**
 * Parse API error response and provide user-friendly message
 */
export function parseAPIError(error: unknown): APIError {
  // Handle error object with code and message
  if (typeof error === "object" && error !== null) {
    const err = error as Record<string, unknown>;

    // Check for 412 Precondition Failed (quota exhausted)
    if (err.code === 412 || err.status === 412) {
      return {
        code: 412,
        message: "Account quota exhausted",
        retryable: false,
        userMessage:
          "Your account has reached its usage limit. Please check your account or try again later.",
      };
    }

    // Check for 429 Too Many Requests (rate limited)
    if (err.code === 429 || err.status === 429) {
      const retryAfter = typeof err.retryAfter === "number" ? err.retryAfter : 60;
      return {
        code: 429,
        message: "Rate limit exceeded",
        retryable: true,
        userMessage: `Too many requests. Please wait ${retryAfter} seconds before trying again.`,
        retryAfter,
      };
    }

    // Check for 401/403 (authentication/authorization)
    if (err.code === 401 || err.code === 403 || err.status === 401 || err.status === 403) {
      return {
        code: err.code as number,
        message: "Authentication failed",
        retryable: false,
        userMessage: "Authentication failed. Please check your API credentials.",
      };
    }

    // Check for 500/502/503 (server errors)
    if (
      err.code === 500 ||
      err.code === 502 ||
      err.code === 503 ||
      err.status === 500 ||
      err.status === 502 ||
      err.status === 503
    ) {
      return {
        code: err.code as number,
        message: "Server error",
        retryable: true,
        userMessage: "The service is temporarily unavailable. Please try again in a moment.",
      };
    }

    // Generic error with message
    if (err.message && typeof err.message === "string") {
      return {
        code: (err.code as number) || 500,
        message: err.message,
        retryable: true,
        userMessage: `Error: ${err.message}. Please try again.`,
      };
    }
  }

  // Handle string error
  if (typeof error === "string") {
    if (error.includes("412") || error.includes("quota")) {
      return {
        code: 412,
        message: "Account quota exhausted",
        retryable: false,
        userMessage:
          "Your account has reached its usage limit. Please check your account or try again later.",
      };
    }

    if (error.includes("429") || error.includes("rate limit")) {
      return {
        code: 429,
        message: "Rate limit exceeded",
        retryable: true,
        userMessage: "Too many requests. Please wait a moment before trying again.",
        retryAfter: 60,
      };
    }

    return {
      code: 500,
      message: error,
      retryable: true,
      userMessage: `Error: ${error}. Please try again.`,
    };
  }

  // Handle Error object
  if (error instanceof Error) {
    const message = error.message;

    if (message.includes("412") || message.includes("quota")) {
      return {
        code: 412,
        message: "Account quota exhausted",
        retryable: false,
        userMessage:
          "Your account has reached its usage limit. Please check your account or try again later.",
      };
    }

    if (message.includes("429") || message.includes("rate limit")) {
      return {
        code: 429,
        message: "Rate limit exceeded",
        retryable: true,
        userMessage: "Too many requests. Please wait a moment before trying again.",
        retryAfter: 60,
      };
    }

    return {
      code: 500,
      message,
      retryable: true,
      userMessage: `Error: ${message}. Please try again.`,
    };
  }

  // Fallback
  return {
    code: 500,
    message: "Unknown error",
    retryable: true,
    userMessage: "An unexpected error occurred. Please try again.",
  };
}

/**
 * Check if error is a quota exhaustion error
 */
export function isQuotaExhausted(error: unknown): boolean {
  const apiError = parseAPIError(error);
  return apiError.code === 412;
}

/**
 * Check if error is a rate limit error
 */
export function isRateLimited(error: unknown): boolean {
  const apiError = parseAPIError(error);
  return apiError.code === 429;
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  const apiError = parseAPIError(error);
  return apiError.retryable;
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: unknown): string {
  const apiError = parseAPIError(error);
  return apiError.userMessage;
}
