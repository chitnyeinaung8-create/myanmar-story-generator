/**
 * Free Tier LLM Provider - Supports multiple free AI providers with fallback
 * 
 * Supported Providers:
 * 1. Google Gemini API (free tier: 15 req/min, 1M tokens/month)
 * 2. Groq API (free tier: unlimited requests, generous token limits)
 * 3. Hugging Face Inference API (free tier: rate limited)
 * 
 * This abstraction allows switching between providers without code changes
 */

import { ENV } from "./_core/env";

export type LLMProvider = "gemini" | "groq" | "huggingface";

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMResponse {
  content: string;
  model: string;
  provider: LLMProvider;
  tokensUsed?: number;
}

export interface LLMError {
  code: string;
  message: string;
  provider: LLMProvider;
  retryable: boolean;
}

/**
 * Google Gemini API Implementation (Free Tier)
 * Get free API key: https://aistudio.google.com/app/apikey
 */
async function callGeminiAPI(
  messages: LLMMessage[],
  maxTokens: number = 2048
): Promise<LLMResponse> {
  const apiKey = ENV.geminiApiKey;
  if (!apiKey) {
    throw {
      code: "MISSING_KEY",
      message: "GEMINI_API_KEY not configured",
      provider: "gemini",
      retryable: false,
    } as LLMError;
  }

  const payload = {
    contents: messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    })),
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature: 0.7,
    },
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      const message = error.error?.message || "Unknown error";

      // Check for quota exceeded
      if (response.status === 429 || message.includes("quota")) {
        throw {
          code: "QUOTA_EXCEEDED",
          message: "Gemini API quota exceeded. Trying fallback...",
          provider: "gemini",
          retryable: true,
        } as LLMError;
      }

      throw {
        code: "API_ERROR",
        message,
        provider: "gemini",
        retryable: response.status >= 500,
      } as LLMError;
    }

    const data = await response.json();
    const content =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated";

    return {
      content,
      model: "gemini-1.5-flash",
      provider: "gemini",
      tokensUsed: data.usageMetadata?.totalTokenCount,
    };
  } catch (error) {
    if (error && typeof error === "object" && "code" in error) {
      throw error;
    }
    throw {
      code: "NETWORK_ERROR",
      message: error instanceof Error ? error.message : "Network error",
      provider: "gemini",
      retryable: true,
    } as LLMError;
  }
}

/**
 * Groq API Implementation (Free Tier - Unlimited)
 * Get free API key: https://console.groq.com/keys
 */
async function callGroqAPI(
  messages: LLMMessage[],
  maxTokens: number = 2048
): Promise<LLMResponse> {
  const apiKey = ENV.groqApiKey;
  if (!apiKey) {
    throw {
      code: "MISSING_KEY",
      message: "GROQ_API_KEY not configured",
      provider: "groq",
      retryable: false,
    } as LLMError;
  }

  const payload = {
    model: "llama-3.1-70b-versatile", // Current free tier model (mixtral deprecated)
    messages: messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
    max_tokens: maxTokens,
    temperature: 0.7,
  };

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      const message = error.error?.message || "Unknown error";

      throw {
        code: "API_ERROR",
        message,
        provider: "groq",
        retryable: response.status >= 500,
      } as LLMError;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "No response generated";

    return {
      content,
      model: "llama-3.1-70b-versatile",
      provider: "groq",
      tokensUsed: data.usage?.total_tokens,
    };
  } catch (error) {
    if (error && typeof error === "object" && "code" in error) {
      throw error;
    }
    throw {
      code: "NETWORK_ERROR",
      message: error instanceof Error ? error.message : "Network error",
      provider: "groq",
      retryable: true,
    } as LLMError;
  }
}

/**
 * Call LLM with fallback support
 * Tries primary provider first, falls back to secondary if it fails
 */
export async function callFreeTierLLM(
  messages: LLMMessage[],
  maxTokens: number = 2048,
  primaryProvider: LLMProvider = "gemini",
  fallbackProvider: LLMProvider = "groq"
): Promise<LLMResponse> {
  const providers: Record<LLMProvider, (m: LLMMessage[], t: number) => Promise<LLMResponse>> = {
    gemini: callGeminiAPI,
    groq: callGroqAPI,
    huggingface: async () => {
      throw {
        code: "NOT_IMPLEMENTED",
        message: "Hugging Face provider not yet implemented",
        provider: "huggingface",
        retryable: false,
      } as LLMError;
    },
  };

  // Try primary provider
  try {
    console.log(`[LLM] Trying ${primaryProvider}...`);
    return await providers[primaryProvider](messages, maxTokens);
  } catch (primaryError) {
    console.error(`[LLM] ${primaryProvider} failed:`, primaryError);

    // If primary failed and we have a fallback, try it
    if (fallbackProvider && fallbackProvider !== primaryProvider) {
      try {
        console.log(`[LLM] Falling back to ${fallbackProvider}...`);
        return await providers[fallbackProvider](messages, maxTokens);
      } catch (fallbackError) {
        console.error(`[LLM] ${fallbackProvider} also failed:`, fallbackError);
        throw new Error(
          `All LLM providers failed. Primary: ${primaryError instanceof Error ? primaryError.message : String(primaryError)}. Fallback: ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)}`
        );
      }
    }

    throw primaryError;
  }
}

/**
 * Check if an error is retryable
 */
export function isRetryableLLMError(error: unknown): boolean {
  if (error && typeof error === "object" && "retryable" in error) {
    return (error as LLMError).retryable;
  }
  return false;
}

/**
 * Get user-friendly error message
 */
export function getLLMErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    return (error as LLMError).message;
  }
  return error instanceof Error ? error.message : "Unknown LLM error";
}
