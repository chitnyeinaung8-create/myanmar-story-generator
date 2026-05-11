/**
 * Story Generation using Free Tier LLM Providers
 * This replaces the Manus Forge API with Google Gemini + Groq fallback
 */

import { callFreeTierLLM, LLMMessage, LLMProvider } from "./freeTierLLM";
import { StoryGenerationInput, GeneratedStory } from "./storyGenerator";

/**
 * System prompt for story generation
 * Optimized for token efficiency on free tier
 */
function getSystemPrompt(input: StoryGenerationInput): string {
  const platformRules: Record<string, string> = {
    tiktok: "Fast-paced, hook in first 2 sentences, emotional climax, viral potential",
    facebook: "Emotional engagement, relatable characters, shareable moment",
    youtube_shorts: "Cinematic pacing, visual descriptions, suspenseful build-up",
    threads: "Casual tone, conversational, authentic voice, thread-friendly",
  };

  const genreRules: Record<string, string> = {
    horror: "Build tension gradually, unexpected scares, psychological elements",
    romance: "Emotional connection, romantic tension, satisfying resolution",
    comedy: "Unexpected humor, witty dialogue, comedic timing",
    mystery: "Clues throughout, surprising twist, logical resolution",
  };

  const platformGuide = platformRules[input.platform] || platformRules.tiktok;
  const genreGuide = genreRules[input.storyType.toLowerCase()] || "";

  return `You are a viral story writer for social media. Create Myanmar Unicode stories.

Platform: ${input.platform} - ${platformGuide}
Genre: ${input.storyType} - ${genreGuide}
Tone: ${input.tone}
Length: ${input.length}

Generate a story with these exact sections (use | as separator):
1. Viral Title (2-5 words, catchy)
2. Hook (1-2 sentences, grab attention)
3. Story (main narrative)
4. Twist Ending (unexpected conclusion)
5. CTA (call to action)
6. Viral Hashtags (5-7 hashtags)

Format: Title|Hook|Story|Twist|CTA|Hashtags

Keep Myanmar Unicode throughout. Be concise on free tier.`;
}

/**
 * Generate story using free tier LLM
 */
export async function generateStoryFree(
  input: StoryGenerationInput,
  primaryProvider: LLMProvider = "gemini",
  fallbackProvider: LLMProvider = "groq"
): Promise<GeneratedStory> {
  const systemPrompt = getSystemPrompt(input);

  const userPrompt = `Create a ${input.length} ${input.storyType} story.
Topic: ${input.topic}
Location: ${input.location}
Characters: ${input.characters}
Ending: ${input.endingType}`;

  const messages: LLMMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  try {
    const response = await callFreeTierLLM(messages, 1024, primaryProvider, fallbackProvider);

    // Parse the pipe-separated response
    const parts = response.content.split("|").map((p) => p.trim());

    if (parts.length < 6) {
      throw new Error(`Invalid response format. Expected 6 sections, got ${parts.length}`);
    }

    const [title, hook, story, twist, cta, hashtags] = parts;

    return {
      title: title || "Untitled Story",
      hook: hook || "",
      story: story || "",
      twistEnding: twist || "",
      cta: cta || "",
      hashtags: hashtags ? hashtags.split(/\s+/).filter(Boolean) : [],
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to generate story: ${errorMsg}`);
  }
}

/**
 * Batch generate multiple story variations
 */
export async function generateStoryVariations(
  input: StoryGenerationInput,
  count: number = 3,
  primaryProvider: LLMProvider = "gemini"
): Promise<GeneratedStory[]> {
  const variations: GeneratedStory[] = [];

  for (let i = 0; i < count; i++) {
    try {
      const story = await generateStoryFree(input, primaryProvider, "groq");
      variations.push(story);
    } catch (error) {
      console.error(`Failed to generate variation ${i + 1}:`, error);
      // Continue with next variation
    }
  }

  if (variations.length === 0) {
    throw new Error("Failed to generate any story variations");
  }

  return variations;
}
