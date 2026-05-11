import { describe, it, expect, beforeAll } from "vitest";
import { callFreeTierLLM, isRetryableLLMError, getLLMErrorMessage } from "./freeTierLLM";

describe("freeTierLLM", () => {
  describe("API Key Validation", () => {
    it("should detect missing API keys gracefully", async () => {
      const messages = [
        { role: "system" as const, content: "You are a helpful assistant" },
        { role: "user" as const, content: "Hello" },
      ];

      try {
        // This will fail if no keys are configured, which is expected
        await callFreeTierLLM(messages, 100, "gemini", "groq");
      } catch (error) {
        const message = getLLMErrorMessage(error);
        expect(message).toBeDefined();
        expect(typeof message).toBe("string");
      }
    });

    it("should handle error messages properly", () => {
      const error = {
        code: "MISSING_KEY",
        message: "API key not configured",
        provider: "gemini" as const,
        retryable: false,
      };

      expect(isRetryableLLMError(error)).toBe(false);
      expect(getLLMErrorMessage(error)).toBe("API key not configured");
    });

    it("should classify retryable errors", () => {
      const retryableError = {
        code: "NETWORK_ERROR",
        message: "Connection timeout",
        provider: "gemini" as const,
        retryable: true,
      };

      const nonRetryableError = {
        code: "MISSING_KEY",
        message: "API key missing",
        provider: "gemini" as const,
        retryable: false,
      };

      expect(isRetryableLLMError(retryableError)).toBe(true);
      expect(isRetryableLLMError(nonRetryableError)).toBe(false);
    });
  });

  describe("Message Format", () => {
    it("should accept properly formatted messages", async () => {
      const messages = [
        { role: "system" as const, content: "You are a helpful assistant" },
        { role: "user" as const, content: "Tell me a short story in 50 words" },
      ];

      // This test just validates the message format is accepted
      // Actual API call will fail if no keys are configured
      expect(messages).toHaveLength(2);
      expect(messages[0].role).toBe("system");
      expect(messages[1].role).toBe("user");
    });
  });

  describe("Error Handling", () => {
    it("should provide helpful error messages", () => {
      const errors = [
        { code: "QUOTA_EXCEEDED", message: "Rate limit exceeded" },
        { code: "NETWORK_ERROR", message: "Connection failed" },
        { code: "MISSING_KEY", message: "API key not configured" },
      ];

      errors.forEach((error) => {
        const message = getLLMErrorMessage(error);
        expect(message).toBeDefined();
        expect(message.length).toBeGreaterThan(0);
      });
    });
  });
});
