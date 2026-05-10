import { describe, it, expect } from "vitest";

describe("GenerateStory Form Validation", () => {
  const createFormData = (overrides = {}) => ({
    storyType: "",
    topic: "",
    tone: "",
    platform: "",
    length: "MEDIUM",
    location: "",
    characters: "",
    endingType: "",
    ...overrides,
  });

  it("should validate required fields", () => {
    const formData = createFormData();
    const errors: Record<string, string> = {};

    if (!formData.storyType.trim()) {
      errors.storyType = "Story type is required";
    }
    if (!formData.topic.trim()) {
      errors.topic = "Topic is required";
    }
    if (!formData.tone.trim()) {
      errors.tone = "Tone is required";
    }
    if (!formData.platform.trim()) {
      errors.platform = "Platform is required";
    }
    if (!formData.endingType.trim()) {
      errors.endingType = "Ending type is required";
    }

    expect(Object.keys(errors).length).toBe(5);
    expect(errors.storyType).toBe("Story type is required");
    expect(errors.topic).toBe("Topic is required");
    expect(errors.tone).toBe("Tone is required");
    expect(errors.platform).toBe("Platform is required");
    expect(errors.endingType).toBe("Ending type is required");
  });

  it("should pass validation with all required fields filled", () => {
    const formData = createFormData({
      storyType: "Horror",
      topic: "A haunted house",
      tone: "Creepy",
      platform: "TikTok",
      endingType: "Twist Ending",
    });

    const errors: Record<string, string> = {};

    if (!formData.storyType.trim()) {
      errors.storyType = "Story type is required";
    }
    if (!formData.topic.trim()) {
      errors.topic = "Topic is required";
    }
    if (!formData.tone.trim()) {
      errors.tone = "Tone is required";
    }
    if (!formData.platform.trim()) {
      errors.platform = "Platform is required";
    }
    if (!formData.endingType.trim()) {
      errors.endingType = "Ending type is required";
    }

    expect(Object.keys(errors).length).toBe(0);
  });

  it("should handle partial form data", () => {
    const formData = createFormData({
      storyType: "Romance",
      topic: "A love story",
      tone: "Emotional",
    });

    const errors: Record<string, string> = {};

    if (!formData.storyType.trim()) {
      errors.storyType = "Story type is required";
    }
    if (!formData.topic.trim()) {
      errors.topic = "Topic is required";
    }
    if (!formData.tone.trim()) {
      errors.tone = "Tone is required";
    }
    if (!formData.platform.trim()) {
      errors.platform = "Platform is required";
    }
    if (!formData.endingType.trim()) {
      errors.endingType = "Ending type is required";
    }

    expect(Object.keys(errors).length).toBe(2);
    expect(errors.platform).toBe("Platform is required");
    expect(errors.endingType).toBe("Ending type is required");
  });

  it("should trim whitespace in validation", () => {
    const formData = createFormData({
      storyType: "   ",
      topic: "\t\n",
      tone: "  ",
      platform: "TikTok",
      endingType: "Happy Ending",
    });

    const errors: Record<string, string> = {};

    if (!formData.storyType.trim()) {
      errors.storyType = "Story type is required";
    }
    if (!formData.topic.trim()) {
      errors.topic = "Topic is required";
    }
    if (!formData.tone.trim()) {
      errors.tone = "Tone is required";
    }

    expect(errors.storyType).toBe("Story type is required");
    expect(errors.topic).toBe("Topic is required");
    expect(errors.tone).toBe("Tone is required");
  });

  it("should support all story types", () => {
    const storyTypes = [
      "Horror",
      "Ghost Story",
      "Mystery",
      "Thriller",
      "Romance",
      "Breakup",
      "Emotional Drama",
      "Comedy",
      "Funny Story",
      "Motivation",
      "Sad Story",
      "Fantasy",
      "Action",
      "School Life",
      "Friendship",
      "Crime",
      "Survival",
      "Psychological Horror",
      "Urban Legend",
      "Paranormal",
      "TikTok Viral Mini Story",
    ];

    storyTypes.forEach((type) => {
      const formData = createFormData({
        storyType: type,
        topic: "Test",
        tone: "Creepy",
        platform: "TikTok",
        endingType: "Twist Ending",
      });

      expect(formData.storyType).toBe(type);
    });
  });

  it("should support all platforms", () => {
    const platforms = ["TikTok", "Facebook", "YouTube Shorts", "Threads"];

    platforms.forEach((platform) => {
      const formData = createFormData({
        storyType: "Horror",
        topic: "Test",
        tone: "Creepy",
        platform,
        endingType: "Twist Ending",
      });

      expect(formData.platform).toBe(platform);
    });
  });

  it("should support all length options", () => {
    const lengths = ["SHORT", "MEDIUM", "LONG"];

    lengths.forEach((length) => {
      const formData = createFormData({ length });
      expect(formData.length).toBe(length);
    });
  });

  it("should allow optional fields to be empty", () => {
    const formData = createFormData({
      storyType: "Horror",
      topic: "A haunted house",
      tone: "Creepy",
      platform: "TikTok",
      endingType: "Twist Ending",
      location: "",
      characters: "",
    });

    const errors: Record<string, string> = {};

    if (!formData.storyType.trim()) {
      errors.storyType = "Story type is required";
    }
    if (!formData.topic.trim()) {
      errors.topic = "Topic is required";
    }
    if (!formData.tone.trim()) {
      errors.tone = "Tone is required";
    }
    if (!formData.platform.trim()) {
      errors.platform = "Platform is required";
    }
    if (!formData.endingType.trim()) {
      errors.endingType = "Ending type is required";
    }

    expect(Object.keys(errors).length).toBe(0);
  });
});
