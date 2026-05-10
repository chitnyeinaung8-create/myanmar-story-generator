import { generateImage } from "./_core/imageGeneration";

export interface CoverImageInput {
  title: string;
  storyType: string;
  tone: string;
}

/**
 * Generate a cinematic cover image for a story based on title, genre, and tone
 */
export async function generateCoverImage(input: CoverImageInput): Promise<string> {
  const prompt = buildImagePrompt(input);

  try {
    const { url } = await generateImage({
      prompt,
    });
    if (!url) {
      throw new Error("No URL returned from image generation");
    }
    return url;
  } catch (error) {
    console.error("[CoverImageGenerator] Failed to generate cover image:", error);
    throw new Error(
      `Failed to generate cover image: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Build an optimized prompt for cinematic cover image generation
 */
function buildImagePrompt(input: CoverImageInput): string {
  const genreContext = getGenreContext(input.storyType);
  const toneContext = getToneContext(input.tone);

  return `Create a cinematic, high-end editorial cover image for a viral social media story with the following specifications:

Title: ${input.title}
Genre: ${input.storyType}
Tone: ${toneContext}

Style Requirements:
- Dark, moody, cinematic aesthetic
- High contrast with dramatic lighting
- Professional editorial quality
- Suitable for social media thumbnail (16:9 aspect ratio)
- Evokes the ${input.storyType} genre: ${genreContext}
- Captures the ${input.tone} tone with visual elements
- Modern, Gen Z aesthetic with refined elegance
- Cinematic color grading (deep shadows, selective highlights)
- Composition that draws the eye to center
- No text or watermarks
- Atmospheric and emotionally engaging

Generate an image that would make viewers stop scrolling and want to read the story.`;
}

function getGenreContext(storyType: string): string {
  const contexts: Record<string, string> = {
    Horror: "dark, eerie, ominous atmosphere with unsettling visual elements",
    "Ghost Story": "supernatural, mysterious, with ethereal or ghostly visual elements",
    Mystery: "mysterious, suspenseful, with hidden clues and intrigue",
    Thriller: "intense, dramatic, with high tension and danger",
    Romance: "intimate, emotional, with warm or cool romantic undertones",
    Breakup: "melancholic, emotional, with bittersweet visual elements",
    "Emotional Drama": "emotionally charged, intense, with dramatic visual impact",
    Comedy: "playful, light-hearted, with humorous or quirky elements",
    "Funny Story": "humorous, entertaining, with witty visual elements",
    Motivation: "inspiring, uplifting, with hopeful and empowering visuals",
    "Sad Story": "melancholic, touching, with emotional depth",
    Fantasy: "magical, fantastical, with otherworldly elements",
    Action: "dynamic, explosive, with high-energy visual elements",
    "School Life": "youthful, relatable, with school or campus setting",
    Friendship: "warm, connected, with bond and camaraderie elements",
    Crime: "dark, intense, with criminal or noir elements",
    Survival: "intense, desperate, with survival and struggle elements",
    "Psychological Horror": "disturbing, mind-bending, with psychological tension",
    "Urban Legend": "mysterious, creepy, with urban and modern horror elements",
    Paranormal: "supernatural, eerie, with paranormal activity elements",
    "TikTok Viral Mini Story": "trendy, engaging, with viral and shareable appeal",
  };

  return contexts[storyType] || "engaging and visually compelling";
}

function getToneContext(tone: string): string {
  const contexts: Record<string, string> = {
    Creepy: "unsettling and spine-chilling",
    Dark: "shadowy and ominous",
    Emotional: "deeply moving and touching",
    Sad: "melancholic and sorrowful",
    Funny: "humorous and entertaining",
    Romantic: "intimate and affectionate",
    Suspenseful: "tense and thrilling",
    Heartbreaking: "devastating and poignant",
    Inspirational: "uplifting and motivating",
    Dramatic: "intense and theatrical",
    Psychological: "mind-bending and introspective",
    Intense: "powerful and gripping",
    Mysterious: "enigmatic and intriguing",
  };

  return contexts[tone] || "compelling and engaging";
}
