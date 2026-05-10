import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateCoverImage, CoverImageInput } from "./coverImageGenerator";

// Mock the image generation function
vi.mock("./_core/imageGeneration", () => ({
  generateImage: vi.fn(),
}));

import { generateImage } from "./_core/imageGeneration";

describe("Cover Image Generator", () => {
  const mockInput: CoverImageInput = {
    title: "The Haunted House",
    storyType: "Horror",
    tone: "Creepy",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should generate a cover image URL", async () => {
    const mockUrl = "https://example.com/generated-image-12345.jpg";
    vi.mocked(generateImage).mockResolvedValueOnce({ url: mockUrl });

    const result = await generateCoverImage(mockInput);

    expect(result).toBe(mockUrl);
    expect(result).toMatch(/^https?:\/\//);
  });

  it("should include story title in the prompt", async () => {
    const mockUrl = "https://example.com/image.jpg";
    vi.mocked(generateImage).mockResolvedValueOnce({ url: mockUrl });

    await generateCoverImage(mockInput);

    const callArgs = vi.mocked(generateImage).mock.calls[0][0];
    expect(callArgs.prompt).toContain(mockInput.title);
  });

  it("should include story type in the prompt", async () => {
    const mockUrl = "https://example.com/image.jpg";
    vi.mocked(generateImage).mockResolvedValueOnce({ url: mockUrl });

    await generateCoverImage(mockInput);

    const callArgs = vi.mocked(generateImage).mock.calls[0][0];
    expect(callArgs.prompt).toContain(mockInput.storyType);
  });

  it("should include tone in the prompt", async () => {
    const mockUrl = "https://example.com/image.jpg";
    vi.mocked(generateImage).mockResolvedValueOnce({ url: mockUrl });

    await generateCoverImage(mockInput);

    const callArgs = vi.mocked(generateImage).mock.calls[0][0];
    expect(callArgs.prompt).toContain(mockInput.tone);
  });

  it("should request cinematic style", async () => {
    const mockUrl = "https://example.com/image.jpg";
    vi.mocked(generateImage).mockResolvedValueOnce({ url: mockUrl });

    await generateCoverImage(mockInput);

    const callArgs = vi.mocked(generateImage).mock.calls[0][0];
    expect(callArgs.prompt).toContain("cinematic");
  });

  it("should request dark aesthetic", async () => {
    const mockUrl = "https://example.com/image.jpg";
    vi.mocked(generateImage).mockResolvedValueOnce({ url: mockUrl });

    await generateCoverImage(mockInput);

    const callArgs = vi.mocked(generateImage).mock.calls[0][0];
    expect(callArgs.prompt).toContain("dark");
  });

  it("should throw error when image generation fails", async () => {
    vi.mocked(generateImage).mockRejectedValueOnce(new Error("Image generation failed"));

    await expect(generateCoverImage(mockInput)).rejects.toThrow();
  });

  it("should throw error when URL is not returned", async () => {
    vi.mocked(generateImage).mockResolvedValueOnce({ url: undefined });

    await expect(generateCoverImage(mockInput)).rejects.toThrow();
  });

  it("should handle different story types", async () => {
    const mockUrl = "https://example.com/image.jpg";
    const storyTypes = ["Horror", "Romance", "Comedy", "Mystery", "Thriller"];

    for (const type of storyTypes) {
      vi.mocked(generateImage).mockResolvedValueOnce({ url: mockUrl });

      const result = await generateCoverImage({
        ...mockInput,
        storyType: type,
      });

      expect(result).toBe(mockUrl);
    }
  });

  it("should handle different tones", async () => {
    const mockUrl = "https://example.com/image.jpg";
    const tones = ["Creepy", "Emotional", "Funny", "Romantic", "Suspenseful"];

    for (const tone of tones) {
      vi.mocked(generateImage).mockResolvedValueOnce({ url: mockUrl });

      const result = await generateCoverImage({
        ...mockInput,
        tone,
      });

      expect(result).toBe(mockUrl);
    }
  });

  it("should request 16:9 aspect ratio", async () => {
    const mockUrl = "https://example.com/image.jpg";
    vi.mocked(generateImage).mockResolvedValueOnce({ url: mockUrl });

    await generateCoverImage(mockInput);

    const callArgs = vi.mocked(generateImage).mock.calls[0][0];
    expect(callArgs.prompt).toContain("16:9");
  });

  it("should request no text or watermarks", async () => {
    const mockUrl = "https://example.com/image.jpg";
    vi.mocked(generateImage).mockResolvedValueOnce({ url: mockUrl });

    await generateCoverImage(mockInput);

    const callArgs = vi.mocked(generateImage).mock.calls[0][0];
    expect(callArgs.prompt).toContain("No text");
  });
});
