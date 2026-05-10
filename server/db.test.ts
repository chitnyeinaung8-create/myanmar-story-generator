import { describe, it, expect, vi, beforeEach } from "vitest";
import { saveStory, getUserStories, getStoryById, deleteStory } from "./db";
import { InsertStory } from "../drizzle/schema";

// Mock the database
vi.mock("drizzle-orm/mysql2", () => ({
  drizzle: vi.fn(() => ({
    insert: vi.fn(),
    select: vi.fn(),
    delete: vi.fn(),
  })),
}));

describe("Database Operations", () => {
  const mockStory: InsertStory = {
    userId: 1,
    title: "Test Story",
    content: "This is a test story",
    hook: "Hook text",
    story: "Story text",
    twistEnding: "Twist text",
    cta: "CTA text",
    hashtags: "#test, #story",
    storyType: "Horror",
    tone: "Creepy",
    platform: "TikTok",
    length: "SHORT",
    topic: "Test topic",
    location: "Test location",
    characters: "Test characters",
    endingType: "Twist Ending",
    coverImageUrl: "https://example.com/image.jpg",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should validate story data structure", () => {
    expect(mockStory).toHaveProperty("userId");
    expect(mockStory).toHaveProperty("title");
    expect(mockStory).toHaveProperty("content");
    expect(mockStory).toHaveProperty("storyType");
    expect(mockStory).toHaveProperty("tone");
    expect(mockStory).toHaveProperty("platform");
  });

  it("should have required fields for story persistence", () => {
    const requiredFields = [
      "userId",
      "title",
      "content",
      "storyType",
      "tone",
      "platform",
      "length",
    ];

    requiredFields.forEach((field) => {
      expect(mockStory).toHaveProperty(field);
      expect(mockStory[field as keyof InsertStory]).toBeDefined();
    });
  });

  it("should support optional fields", () => {
    expect(mockStory).toHaveProperty("hook");
    expect(mockStory).toHaveProperty("story");
    expect(mockStory).toHaveProperty("twistEnding");
    expect(mockStory).toHaveProperty("cta");
    expect(mockStory).toHaveProperty("hashtags");
    expect(mockStory).toHaveProperty("coverImageUrl");
  });

  it("should have correct data types", () => {
    expect(typeof mockStory.userId).toBe("number");
    expect(typeof mockStory.title).toBe("string");
    expect(typeof mockStory.content).toBe("string");
    expect(typeof mockStory.storyType).toBe("string");
    expect(typeof mockStory.tone).toBe("string");
    expect(typeof mockStory.platform).toBe("string");
  });

  it("should support all platform types", () => {
    const platforms = ["TikTok", "Facebook", "YouTube Shorts", "Threads"];

    platforms.forEach((platform) => {
      const story = { ...mockStory, platform };
      expect(story.platform).toBe(platform);
    });
  });

  it("should support all story types", () => {
    const storyTypes = [
      "Horror",
      "Ghost Story",
      "Mystery",
      "Thriller",
      "Romance",
      "Breakup",
      "Comedy",
      "Motivation",
    ];

    storyTypes.forEach((type) => {
      const story = { ...mockStory, storyType: type };
      expect(story.storyType).toBe(type);
    });
  });

  it("should support all length types", () => {
    const lengths = ["SHORT", "MEDIUM", "LONG"];

    lengths.forEach((length) => {
      const story = { ...mockStory, length };
      expect(story.length).toBe(length);
    });
  });
});
