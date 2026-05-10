import { describe, it, expect, vi } from "vitest";
import { generateStory } from "./storyGenerator";

// Mock the LLM invocation
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(),
}));

import { invokeLLM } from "./_core/llm";

describe("StoryGenerator - Fixed Response Parsing", () => {
  const mockInput = {
    storyType: "Horror",
    topic: "A haunted house",
    tone: "Creepy",
    platform: "TikTok",
    length: "MEDIUM",
    location: "Myanmar",
    characters: "A young girl",
    endingType: "Twist Ending",
  };

  const validStoryJSON = {
    title: "ကြောက်လန့်ဖွယ် အိမ်",
    hook: "မြန်မာ ကြောက်လန့်ဖွယ် အိမ်",
    story: "အဲဒီ အိမ်ရဲ့ အတွင်းမှာ",
    twistEnding: "အဆုံးမှာ အံ့သြဖွယ်",
    cta: "ကဲ့သို့ အခြား ဝတ္ထုများ ကြည့်ရှုပါ",
    hashtags: ["#horror", "#myanmar", "#viral"],
  };

  it("should parse LLM response with string content", async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify(validStoryJSON),
            role: "assistant",
          },
        },
      ],
    };

    vi.mocked(invokeLLM).mockResolvedValueOnce(mockResponse as any);

    const result = await generateStory(mockInput);

    expect(result.title).toBe(validStoryJSON.title);
    expect(result.hook).toBe(validStoryJSON.hook);
    expect(result.story).toBe(validStoryJSON.story);
    expect(result.twistEnding).toBe(validStoryJSON.twistEnding);
    expect(result.cta).toBe(validStoryJSON.cta);
    expect(result.hashtags).toEqual(validStoryJSON.hashtags);
  });

  it("should parse LLM response with array content (json_schema format)", async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: [
              {
                type: "text",
                text: JSON.stringify(validStoryJSON),
              },
            ],
            role: "assistant",
          },
        },
      ],
    };

    vi.mocked(invokeLLM).mockResolvedValueOnce(mockResponse as any);

    const result = await generateStory(mockInput);

    expect(result.title).toBe(validStoryJSON.title);
    expect(result.hook).toBe(validStoryJSON.hook);
  });

  it("should handle multiple text items in array content", async () => {
    const jsonPart1 = '{"title":"ကြောက်လန့်ဖွယ် အိမ်","hook":"မြန်မာ ကြောက်လန့်ဖွယ် အိမ်",';
    const jsonPart2 = '"story":"အဲဒီ အိမ်ရဲ့ အတွင်းမှာ","twistEnding":"အဆုံးမှာ အံ့သြဖွယ်","cta":"ကဲ့သို့ အခြား ဝတ္ထုများ ကြည့်ရှုပါ","hashtags":["#horror","#myanmar","#viral"]}';

    const mockResponse = {
      choices: [
        {
          message: {
            content: [
              { type: "text", text: jsonPart1 },
              { type: "text", text: jsonPart2 },
            ],
            role: "assistant",
          },
        },
      ],
    };

    vi.mocked(invokeLLM).mockResolvedValueOnce(mockResponse as any);

    const result = await generateStory(mockInput);

    expect(result.title).toBe(validStoryJSON.title);
    expect(result.hashtags).toEqual(validStoryJSON.hashtags);
  });

  it("should throw error for missing title field", async () => {
    const invalidJSON = {
      hook: "Hook",
      story: "Story",
      twistEnding: "Ending",
      cta: "CTA",
      hashtags: ["#tag"],
    };

    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify(invalidJSON),
            role: "assistant",
          },
        },
      ],
    };

    vi.mocked(invokeLLM).mockResolvedValueOnce(mockResponse as any);

    await expect(generateStory(mockInput)).rejects.toThrow(
      "Missing or invalid 'title' field"
    );
  });

  it("should throw error for missing hashtags array", async () => {
    const invalidJSON = {
      title: "Title",
      hook: "Hook",
      story: "Story",
      twistEnding: "Ending",
      cta: "CTA",
    };

    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify(invalidJSON),
            role: "assistant",
          },
        },
      ],
    };

    vi.mocked(invokeLLM).mockResolvedValueOnce(mockResponse as any);

    await expect(generateStory(mockInput)).rejects.toThrow(
      "Missing or invalid 'hashtags' field"
    );
  });

  it("should throw error for empty response", async () => {
    const mockResponse = {
      choices: [],
    };

    vi.mocked(invokeLLM).mockResolvedValueOnce(mockResponse as any);

    await expect(generateStory(mockInput)).rejects.toThrow(
      "LLM response has no choices"
    );
  });

  it("should throw error for empty content", async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: "",
            role: "assistant",
          },
        },
      ],
    };

    vi.mocked(invokeLLM).mockResolvedValueOnce(mockResponse as any);

    await expect(generateStory(mockInput)).rejects.toThrow(
      "LLM response message has no content"
    );
  });

  it("should throw error for malformed JSON", async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: "{ invalid json }",
            role: "assistant",
          },
        },
      ],
    };

    vi.mocked(invokeLLM).mockResolvedValueOnce(mockResponse as any);

    await expect(generateStory(mockInput)).rejects.toThrow(
      "Failed to parse story JSON"
    );
  });

  it("should throw error for invalid content type", async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: [
              {
                type: "image_url",
                image_url: { url: "http://example.com/image.jpg" },
              },
            ],
            role: "assistant",
          },
        },
      ],
    };

    vi.mocked(invokeLLM).mockResolvedValueOnce(mockResponse as any);

    await expect(generateStory(mockInput)).rejects.toThrow();
  });

  it("should handle non-string field values gracefully", async () => {
    const invalidJSON = {
      title: 123, // Should be string
      hook: "Hook",
      story: "Story",
      twistEnding: "Ending",
      cta: "CTA",
      hashtags: ["#tag"],
    };

    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify(invalidJSON),
            role: "assistant",
          },
        },
      ],
    };

    vi.mocked(invokeLLM).mockResolvedValueOnce(mockResponse as any);

    await expect(generateStory(mockInput)).rejects.toThrow(
      "Missing or invalid 'title' field"
    );
  });
});
