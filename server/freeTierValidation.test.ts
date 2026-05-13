import { describe, it, expect } from "vitest";
import { ENV } from "./_core/env";
import { callFreeTierLLM } from "./freeTierLLM";

describe("Free Tier API Key Validation", () => {
  it("should validate Gemini API key is configured", () => {
    expect(ENV.geminiApiKey).toBeDefined();
    expect(ENV.geminiApiKey).not.toBe("");
    expect(ENV.geminiApiKey?.length).toBeGreaterThan(10);
    console.log("[✓] GEMINI_API_KEY is configured and valid format");
  });

  it("should validate Groq API key is configured", () => {
    expect(ENV.groqApiKey).toBeDefined();
    expect(ENV.groqApiKey).not.toBe("");
    expect(ENV.groqApiKey?.length).toBeGreaterThan(10);
    console.log("[✓] GROQ_API_KEY is configured and valid format");
  });

  it("should test Gemini API with simple request", async () => {
    if (!ENV.geminiApiKey) {
      console.log("[SKIP] GEMINI_API_KEY not configured");
      expect(true).toBe(true);
      return;
    }

    try {
      const response = await callFreeTierLLM(
        [{ role: "user" as const, content: "Say 'test' in one word" }],
        20,
        "gemini",
        "groq"
      );

      expect(response).toBeDefined();
      expect(response.content).toBeDefined();
      expect(response.content.length).toBeGreaterThan(0);
      expect(response.provider).toBe("gemini");

      console.log(`[✓] Gemini API working! Response: "${response.content}"`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`[✗] Gemini API failed: ${msg}`);
      throw error;
    }
  }, { timeout: 30000 });

  it("should test Groq API with simple request", async () => {
    if (!ENV.groqApiKey) {
      console.log("[SKIP] GROQ_API_KEY not configured");
      expect(true).toBe(true);
      return;
    }

    try {
      const response = await callFreeTierLLM(
        [{ role: "user" as const, content: "Say 'test' in one word" }],
        20,
        "groq",
        "gemini"
      );

      expect(response).toBeDefined();
      expect(response.content).toBeDefined();
      expect(response.content.length).toBeGreaterThan(0);
      expect(response.provider).toBe("groq");

      console.log(`[✓] Groq API working! Response: "${response.content}"`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`[✗] Groq API failed: ${msg}`);
      throw error;
    }
  }, { timeout: 30000 });

  it("should test fallback mechanism", async () => {
    if (!ENV.geminiApiKey && !ENV.groqApiKey) {
      console.log("[SKIP] No API keys configured");
      expect(true).toBe(true);
      return;
    }

    try {
      const response = await callFreeTierLLM(
        [{ role: "user" as const, content: "Say 'fallback' in one word" }],
        20,
        "gemini",
        "groq"
      );

      expect(response).toBeDefined();
      expect(response.content).toBeDefined();
      expect(response.content.length).toBeGreaterThan(0);

      console.log(`[✓] Fallback mechanism working! Provider: ${response.provider}`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`[✗] Fallback failed: ${msg}`);
      throw error;
    }
  }, { timeout: 30000 });
});
