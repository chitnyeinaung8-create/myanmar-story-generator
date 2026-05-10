import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateStory, StoryGenerationInput } from "./storyGenerator";

// Mock the LLM function
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(),
}));

import { invokeLLM } from "./_core/llm";

describe("Story Generator", () => {
  const mockInput: StoryGenerationInput = {
    storyType: "Horror",
    topic: "A haunted house",
    tone: "Creepy",
    platform: "TikTok",
    length: "SHORT",
    location: "Abandoned mansion",
    characters: "A young girl exploring",
    endingType: "Twist Ending",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should generate a story with all required fields", async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              title: "အကြောက်တရား၏ အိမ်",
              hook: "ည ၁၂ နာရီ၊ သူမ သုံးအိမ်သို့ ဝင်လည်း...",
              story: "အိမ်အတွင်း ကြည်လင်သည့် အလင်း မရှိ။",
              twistEnding: "သူမ နောက်ကျောကို ကြည့်လျှင် အဖြူ အင်္ကျီ ဝတ်ထားသူ တစ်ဦး ရှိနေ၏။",
              cta: "Part 2 လိုချင်ရင် comment ပေးခဲ့ 😨",
              hashtags: ["#horror", "#myanmar", "#viral"],
            }),
          },
        },
      ],
    };

    vi.mocked(invokeLLM).mockResolvedValueOnce(mockResponse as any);

    const result = await generateStory(mockInput);

    expect(result).toHaveProperty("title");
    expect(result).toHaveProperty("hook");
    expect(result).toHaveProperty("story");
    expect(result).toHaveProperty("twistEnding");
    expect(result).toHaveProperty("cta");
    expect(result).toHaveProperty("hashtags");
    expect(result.hashtags).toBeInstanceOf(Array);
  });

  it("should throw error when LLM returns no content", async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: null,
          },
        },
      ],
    };

    vi.mocked(invokeLLM).mockResolvedValueOnce(mockResponse as any);

    await expect(generateStory(mockInput)).rejects.toThrow();
  });

  it("should throw error when LLM call fails", async () => {
    vi.mocked(invokeLLM).mockRejectedValueOnce(new Error("LLM API error"));

    await expect(generateStory(mockInput)).rejects.toThrow();
  });

  it("should include platform-specific styling in the prompt", async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              title: "Test Title",
              hook: "Test hook",
              story: "Test story",
              twistEnding: "Test twist",
              cta: "Test CTA",
              hashtags: ["#test"],
            }),
          },
        },
      ],
    };

    vi.mocked(invokeLLM).mockResolvedValueOnce(mockResponse as any);

    await generateStory(mockInput);

    const callArgs = vi.mocked(invokeLLM).mock.calls[0][0];
    const systemPrompt = callArgs.messages[0].content;

    expect(systemPrompt).toContain("TikTok");
    expect(systemPrompt).toContain("Fast pacing");
  });

  it("should include genre-specific rules in the prompt", async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              title: "Test Title",
              hook: "Test hook",
              story: "Test story",
              twistEnding: "Test twist",
              cta: "Test CTA",
              hashtags: ["#test"],
            }),
          },
        },
      ],
    };

    vi.mocked(invokeLLM).mockResolvedValueOnce(mockResponse as any);

    await generateStory(mockInput);

    const callArgs = vi.mocked(invokeLLM).mock.calls[0][0];
    const systemPrompt = callArgs.messages[0].content;

    expect(systemPrompt).toContain("Horror");
    expect(systemPrompt).toContain("creepy atmosphere");
  });

  it("should handle different story types", async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              title: "Test Title",
              hook: "Test hook",
              story: "Test story",
              twistEnding: "Test twist",
              cta: "Test CTA",
              hashtags: ["#test"],
            }),
          },
        },
      ],
    };

    const romanceInput: StoryGenerationInput = {
      ...mockInput,
      storyType: "Romance",
      tone: "Romantic",
    };

    vi.mocked(invokeLLM).mockResolvedValueOnce(mockResponse as any);

    const result = await generateStory(romanceInput);

    expect(result).toBeDefined();
    expect(result.title).toBe("Test Title");
  });
});
