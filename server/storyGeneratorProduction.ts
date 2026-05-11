import { generateStory as baseGenerateStory, StoryGenerationInput, GeneratedStory } from "./storyGenerator";
import { isQuotaExhausted, isRateLimited, getUserFriendlyMessage } from "./apiErrorHandler";

/**
 * Production-hardened story generation with retry logic and timeout handling
 */

// Configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1000;
const TIMEOUT_MS = 60000; // 60 seconds

/**
 * Exponential backoff retry logic
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
  initialDelayMs: number = INITIAL_RETRY_DELAY_MS
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on validation errors
      if (lastError.message.includes("Missing or invalid") || lastError.message.includes("parse")) {
        throw lastError;
      }

      // Don't retry on quota exhaustion
      if (isQuotaExhausted(error)) {
        throw new Error(`Story generation failed: ${getUserFriendlyMessage(error)}`);
      }

      // Don't retry on authentication errors
      if (lastError.message.includes("401") || lastError.message.includes("403") || lastError.message.includes("Authentication")) {
        throw lastError;
      }

      // If this is the last attempt, throw
      if (attempt === maxRetries) {
        throw new Error(
          `Failed after ${maxRetries + 1} attempts: ${lastError.message}`
        );
      }

      // Calculate delay with exponential backoff
      const delayMs = initialDelayMs * Math.pow(2, attempt);
      console.warn(
        `[StoryGenerator] Attempt ${attempt + 1} failed, retrying in ${delayMs}ms: ${lastError.message}`
      );

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  // Should never reach here, but just in case
  throw lastError || new Error("Unknown error in retry logic");
}

/**
 * Timeout wrapper for async operations
 */
async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = TIMEOUT_MS
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Operation timed out after ${timeoutMs}ms`)),
        timeoutMs
      )
    ),
  ]);
}

/**
 * Validate story response has all required fields with non-empty values
 */
function validateStoryResponse(story: GeneratedStory): void {
  const requiredFields: (keyof GeneratedStory)[] = [
    "title",
    "hook",
    "story",
    "twistEnding",
    "cta",
    "hashtags",
  ];

  for (const field of requiredFields) {
    const value = story[field];

    if (field === "hashtags") {
      if (!Array.isArray(value) || value.length === 0) {
        throw new Error(`Field '${field}' must be a non-empty array`);
      }
      // Validate each hashtag is a string
      if (!value.every((tag) => typeof tag === "string" && tag.trim().length > 0)) {
        throw new Error(`All hashtags must be non-empty strings`);
      }
    } else {
      if (typeof value !== "string" || value.trim().length === 0) {
        throw new Error(`Field '${field}' must be a non-empty string`);
      }
    }
  }
}

/**
 * Production-ready story generation with retry, timeout, and validation
 */
export async function generateStoryProduction(
  input: StoryGenerationInput
): Promise<GeneratedStory> {
  console.log("[StoryGeneratorProduction] Starting story generation for:", {
    storyType: input.storyType,
    platform: input.platform,
    length: input.length,
  });

  try {
    // Wrap in retry and timeout logic
    const story = await withTimeout(
      withRetry(async () => {
        const result = await baseGenerateStory(input);
        
        // Validate response
        validateStoryResponse(result);
        
        return result;
      }),
      TIMEOUT_MS
    );

    console.log("[StoryGeneratorProduction] Story generated successfully");
    return story;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("[StoryGeneratorProduction] Failed to generate story:", errorMsg);
    throw new Error(`Story generation failed: ${errorMsg}`);
  }
}

/**
 * Get retry configuration for monitoring/logging
 */
export function getRetryConfig() {
  return {
    maxRetries: MAX_RETRIES,
    initialRetryDelayMs: INITIAL_RETRY_DELAY_MS,
    timeoutMs: TIMEOUT_MS,
  };
}
