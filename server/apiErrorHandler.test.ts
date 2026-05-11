import { describe, it, expect } from "vitest";
import {
  parseAPIError,
  isQuotaExhausted,
  isRateLimited,
  isRetryableError,
  getUserFriendlyMessage,
} from "./apiErrorHandler";

describe("apiErrorHandler", () => {
  describe("parseAPIError", () => {
    it("detects 412 quota exhausted error", () => {
      const error = { code: 412, message: "your account has hit a usage exhausted" };
      const result = parseAPIError(error);
      expect(result.code).toBe(412);
      expect(result.retryable).toBe(false);
      expect(result.userMessage).toContain("usage limit");
    });

    it("detects 429 rate limit error", () => {
      const error = { code: 429, message: "Too many requests" };
      const result = parseAPIError(error);
      expect(result.code).toBe(429);
      expect(result.retryable).toBe(true);
      expect(result.userMessage).toContain("wait");
    });

    it("detects 401 authentication error", () => {
      const error = { code: 401, message: "Unauthorized" };
      const result = parseAPIError(error);
      expect(result.code).toBe(401);
      expect(result.retryable).toBe(false);
    });

    it("detects 500 server error", () => {
      const error = { code: 500, message: "Internal Server Error" };
      const result = parseAPIError(error);
      expect(result.code).toBe(500);
      expect(result.retryable).toBe(true);
    });

    it("handles string errors with quota", () => {
      const error = "412 quota exhausted";
      const result = parseAPIError(error);
      expect(result.code).toBe(412);
      expect(result.retryable).toBe(false);
    });

    it("handles Error objects", () => {
      const error = new Error("Something went wrong");
      const result = parseAPIError(error);
      // Error objects default to retryable
      expect(result.retryable).toBe(true);
      expect(result.userMessage).toContain("try again");
    });

    it("handles unknown errors with fallback", () => {
      const error = { unknown: "field" };
      const result = parseAPIError(error);
      expect(result.retryable).toBe(true);
      expect(result.userMessage).toContain("unexpected");
    });
  });

  describe("isQuotaExhausted", () => {
    it("returns true for 412 errors", () => {
      const error = { code: 412, message: "quota exhausted" };
      expect(isQuotaExhausted(error)).toBe(true);
    });

    it("returns false for other errors", () => {
      const error = { code: 429, message: "rate limited" };
      expect(isQuotaExhausted(error)).toBe(false);
    });
  });

  describe("isRateLimited", () => {
    it("returns true for 429 errors", () => {
      const error = { code: 429, message: "rate limited" };
      expect(isRateLimited(error)).toBe(true);
    });

    it("returns false for other errors", () => {
      const error = { code: 412, message: "quota exhausted" };
      expect(isRateLimited(error)).toBe(false);
    });
  });

  describe("isRetryableError", () => {
    it("returns false for quota exhausted", () => {
      const error = { code: 412, message: "quota exhausted" };
      expect(isRetryableError(error)).toBe(false);
    });

    it("returns true for rate limit", () => {
      const error = { code: 429, message: "rate limited" };
      expect(isRetryableError(error)).toBe(true);
    });

    it("returns true for server errors", () => {
      const error = { code: 500, message: "server error" };
      expect(isRetryableError(error)).toBe(true);
    });
  });

  describe("getUserFriendlyMessage", () => {
    it("returns helpful message for quota exhausted", () => {
      const error = { code: 412, message: "quota exhausted" };
      const msg = getUserFriendlyMessage(error);
      expect(msg).toContain("usage limit");
    });

    it("returns helpful message for rate limit", () => {
      const error = { code: 429, message: "rate limited" };
      const msg = getUserFriendlyMessage(error);
      expect(msg).toContain("wait");
    });

    it("includes retry guidance for retryable errors", () => {
      const error = { code: 500, message: "server error" };
      const msg = getUserFriendlyMessage(error);
      expect(msg).toContain("try again");
    });
  });
});
