/**
 * Production-grade response validation and normalization
 * Ensures all API responses follow consistent structure
 */

export interface ValidatedResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

/**
 * Validate and normalize story generation response
 */
export function validateStoryResponse(response: unknown): {
  id: number;
  title: string;
  hook: string;
  story: string;
  twistEnding: string;
  cta: string;
  hashtags: string[];
  coverImageUrl?: string;
} {
  if (!response || typeof response !== "object") {
    throw new Error("Response is not an object");
  }

  const resp = response as Record<string, unknown>;

  // Validate ID
  if (typeof resp.id !== "number" || resp.id <= 0) {
    throw new Error("Response missing valid story ID");
  }

  // Validate story fields
  const requiredStringFields = ["title", "hook", "story", "twistEnding", "cta"];
  for (const field of requiredStringFields) {
    if (typeof resp[field] !== "string" || (resp[field] as string).trim().length === 0) {
      throw new Error(`Response missing or invalid '${field}' field`);
    }
  }

  // Validate hashtags
  if (!Array.isArray(resp.hashtags) || resp.hashtags.length === 0) {
    throw new Error("Response missing valid hashtags array");
  }

  if (!resp.hashtags.every((tag) => typeof tag === "string" && tag.trim().length > 0)) {
    throw new Error("Response contains invalid hashtags");
  }

  // Optional cover image URL
  const coverImageUrl = typeof resp.coverImageUrl === "string" ? resp.coverImageUrl : undefined;

  return {
    id: resp.id,
    title: (resp.title as string).trim(),
    hook: (resp.hook as string).trim(),
    story: (resp.story as string).trim(),
    twistEnding: (resp.twistEnding as string).trim(),
    cta: (resp.cta as string).trim(),
    hashtags: (resp.hashtags as string[]).map((tag) => tag.trim()),
    coverImageUrl,
  };
}

/**
 * Wrap response with metadata
 */
export function createSuccessResponse<T>(data: T): ValidatedResponse<T> {
  return {
    success: true,
    data,
    timestamp: Date.now(),
  };
}

/**
 * Create error response
 */
export function createErrorResponse(error: Error | string): ValidatedResponse<null> {
  const message = error instanceof Error ? error.message : String(error);
  return {
    success: false,
    error: message,
    timestamp: Date.now(),
  };
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(jsonString: string, fallback?: T): T | null {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("[ResponseValidator] JSON parse failed:", error);
    return fallback ?? null;
  }
}

/**
 * Validate error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  // Network errors
  if (
    message.includes("econnrefused") ||
    message.includes("enotfound") ||
    message.includes("timeout") ||
    message.includes("network")
  ) {
    return true;
  }

  // API rate limiting
  if (message.includes("rate limit") || message.includes("429")) {
    return true;
  }

  // Temporary service errors
  if (
    message.includes("temporarily") ||
    message.includes("unavailable") ||
    message.includes("503") ||
    message.includes("502") ||
    message.includes("500")
  ) {
    return true;
  }

  return false;
}

/**
 * Extract meaningful error message from various error types
 */
export function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object" && error !== null) {
    const err = error as Record<string, unknown>;

    if (err.message && typeof err.message === "string") {
      return err.message;
    }

    if (err.error && typeof err.error === "string") {
      return err.error;
    }

    if (err.code && typeof err.code === "string") {
      return `Error: ${err.code}`;
    }
  }

  return "Unknown error occurred";
}
