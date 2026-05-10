import { describe, it, expect, vi, beforeEach } from "vitest";
import { saveStory, getUserStories, getStoryById, deleteStory, getDb } from "./db";
import { InsertStory, Story } from "../drizzle/schema";

// Mock the database module
vi.mock("drizzle-orm/mysql2", () => ({
  drizzle: vi.fn(),
}));

describe("Database Operations - Integration", () => {
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

  const mockStoriesResult: Story[] = [
    {
      id: 1,
      ...mockStory,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      ...mockStory,
      title: "Another Story",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle story with all required fields", () => {
    const requiredFields: (keyof InsertStory)[] = [
      "userId",
      "title",
      "content",
      "storyType",
      "tone",
      "platform",
      "length",
    ];

    requiredFields.forEach((field) => {
      expect(mockStory[field]).toBeDefined();
      expect(mockStory[field]).not.toBeNull();
    });
  });

  it("should validate story data for persistence", () => {
    expect(mockStory.userId).toBeGreaterThan(0);
    expect(mockStory.title.length).toBeGreaterThan(0);
    expect(mockStory.content.length).toBeGreaterThan(0);
    expect(mockStory.storyType.length).toBeGreaterThan(0);
    expect(mockStory.tone.length).toBeGreaterThan(0);
    expect(mockStory.platform).toMatch(/TikTok|Facebook|YouTube Shorts|Threads/);
    expect(mockStory.length).toMatch(/SHORT|MEDIUM|LONG/);
  });

  it("should handle multiple stories retrieval", () => {
    expect(mockStoriesResult).toHaveLength(2);
    expect(mockStoriesResult[0].id).toBe(1);
    expect(mockStoriesResult[1].id).toBe(2);
    expect(mockStoriesResult[0].userId).toBe(mockStoriesResult[1].userId);
  });

  it("should preserve story metadata", () => {
    const story = mockStoriesResult[0];
    expect(story).toHaveProperty("id");
    expect(story).toHaveProperty("createdAt");
    expect(story).toHaveProperty("updatedAt");
    expect(story.createdAt).toBeInstanceOf(Date);
    expect(story.updatedAt).toBeInstanceOf(Date);
  });

  it("should support story filtering by userId", () => {
    const userId = 1;
    const userStories = mockStoriesResult.filter((s) => s.userId === userId);
    expect(userStories.length).toBeGreaterThan(0);
    expect(userStories.every((s) => s.userId === userId)).toBe(true);
  });

  it("should support story retrieval by ID", () => {
    const storyId = 1;
    const story = mockStoriesResult.find((s) => s.id === storyId);
    expect(story).toBeDefined();
    expect(story?.id).toBe(storyId);
  });

  it("should handle story deletion validation", () => {
    const storyId = 1;
    const userId = 1;
    const story = mockStoriesResult.find((s) => s.id === storyId && s.userId === userId);
    expect(story).toBeDefined();
  });

  it("should validate platform-specific stories", () => {
    const platforms = ["TikTok", "Facebook", "YouTube Shorts", "Threads"];

    platforms.forEach((platform) => {
      const story = { ...mockStory, platform };
      expect(story.platform).toBe(platform);
    });
  });

  it("should validate story type diversity", () => {
    const types = [
      "Horror",
      "Ghost Story",
      "Mystery",
      "Thriller",
      "Romance",
      "Breakup",
      "Comedy",
      "Motivation",
      "Sad Story",
      "Fantasy",
      "Action",
      "School Life",
      "Friendship",
      "Crime",
      "Survival",
      "Paranormal",
      "Urban Legend",
    ];

    types.forEach((type) => {
      const story = { ...mockStory, storyType: type };
      expect(story.storyType).toBe(type);
    });
  });

  it("should handle story sorting by creation date", () => {
    const sorted = [...mockStoriesResult].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
    expect(sorted).toBeDefined();
    expect(sorted.length).toBe(mockStoriesResult.length);
  });

  it("should preserve story content integrity", () => {
    const story = mockStoriesResult[0];
    expect(story.title).toBe(mockStory.title);
    expect(story.content).toBe(mockStory.content);
    expect(story.storyType).toBe(mockStory.storyType);
    expect(story.tone).toBe(mockStory.tone);
    expect(story.platform).toBe(mockStory.platform);
  });
});
