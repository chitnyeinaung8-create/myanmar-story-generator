import { invokeLLM } from "./_core/llm";

export interface StoryGenerationInput {
  storyType: string;
  topic: string;
  tone: string;
  platform: string;
  length: string;
  location: string;
  characters: string;
  endingType: string;
}

export interface GeneratedStory {
  title: string;
  hook: string;
  story: string;
  twistEnding: string;
  cta: string;
  hashtags: string[];
}

/**
 * Build the system prompt with genre-specific rules and platform styling
 */
function buildSystemPrompt(input: StoryGenerationInput): string {
  const genreRules = buildGenreRules(input.storyType);
  const platformRules = buildPlatformRules(input.platform);
  const lengthGuidelines = buildLengthGuidelines(input.length);

  return `You are a professional Myanmar AI Viral Story Generator specialized in creating highly engaging social media stories.

Your goal is to generate human-like Myanmar Unicode stories that feel emotional, cinematic, suspenseful, relatable, and viral.

WRITING RULES:
- Use ONLY Myanmar Unicode
- Write naturally like a real Myanmar storyteller
- Avoid robotic AI writing
- Use conversational style
- Create emotional engagement
- Make audience curious
- Use cinematic storytelling
- Use suspense and tension naturally
- Add realistic dialogues when needed
- Keep paragraphs short and readable
- Add emojis naturally
- Create viral-style storytelling
- Use Gen Z social media style
- Make audience want Part 2

STORY STRUCTURE:
1. Powerful Hook - First line must instantly grab attention
2. Build-Up - Slowly increase emotion, tension, suspense, or humor
3. Main Event - Most emotional/scary/funny/dramatic moment
4. Twist Ending - Unexpected ending with emotional damage, horror reveal, or shocking truth
5. Engagement Ending - Ask audience question, encourage comments/shares, make them wait for Part 2

GENRE-SPECIFIC RULES:
${genreRules}

PLATFORM STYLING:
${platformRules}

LENGTH GUIDELINES:
${lengthGuidelines}

OUTPUT FORMAT:
You MUST respond with a valid JSON object containing exactly these fields:
{
  "title": "Viral Title in Myanmar Unicode",
  "hook": "Powerful opening hook in Myanmar Unicode",
  "story": "Main story content in Myanmar Unicode",
  "twistEnding": "Twist ending in Myanmar Unicode",
  "cta": "Call-to-action in Myanmar Unicode",
  "hashtags": ["#tag1", "#tag2"]
}

IMPORTANT: All text fields MUST be in Myanmar Unicode only. No English paragraphs except in hashtags.`;
}

function buildGenreRules(storyType: string): string {
  const rules: Record<string, string> = {
    Horror: `When story type is Horror:
- Create creepy atmosphere
- Use midnight settings
- Add strange sounds
- Add realistic fear reactions
- Use Myanmar cultural horror elements
- Build suspense slowly
- Add shocking twist
- Avoid repetitive ghost clichés`,
    "Ghost Story": `When story type is Ghost Story:
- Create creepy atmosphere with supernatural elements
- Use abandoned locations (hospital, old apartment, village house, forest, school, hotel, cemetery, elevator, highway, condo, train station)
- Add mysterious encounters
- Build tension gradually
- Include realistic emotional responses
- Use Myanmar cultural beliefs about spirits`,
    Mystery: `When story type is Mystery:
- Add hidden clues throughout the story
- Create psychological tension
- Keep audience guessing
- Use dark cinematic pacing
- Reveal twist slowly
- Make readers want to solve the puzzle`,
    Thriller: `When story type is Thriller:
- Add hidden clues
- Create psychological tension
- Keep audience guessing
- Use dark cinematic pacing
- Build suspense with each paragraph`,
    Romance: `When story type is Romance:
- Use emotional dialogues
- Add realistic relationship problems
- Use relatable Gen Z emotions
- Add cafe/rain/night atmosphere
- Create deep emotional attachment
- Include heartbreaking or touching ending`,
    Breakup: `When story type is Breakup:
- Use emotional dialogues about separation
- Add realistic heartbreak moments
- Use relatable Gen Z emotions
- Create deep emotional resonance
- Include touching or cathartic ending`,
    Comedy: `When story type is Comedy:
- Use meme-style humor
- Include relatable Myanmar situations
- Add funny misunderstandings
- Use viral social media humor
- Include funny twist ending`,
    "Funny Story": `When story type is Funny Story:
- Use meme-style humor
- Include relatable Myanmar situations
- Add funny misunderstandings
- Use viral social media humor
- Build to a hilarious punchline`,
  };

  return rules[storyType] || "Write an engaging story with clear beginning, middle, and end.";
}

function buildPlatformRules(platform: string): string {
  const rules: Record<string, string> = {
    TikTok: `TikTok Style:
- Fast pacing with quick scene changes
- Strong hook in first line
- Short paragraphs (2-3 sentences max)
- Viral style with trending language
- Cliffhanger ending that makes viewers want to watch Part 2
- Use emojis strategically between paragraphs`,
    Facebook: `Facebook Style:
- Emotional storytelling that resonates
- Longer readable format with natural breaks
- Shareable style that encourages comments
- Build emotional connection with reader
- Include relatable moments
- End with question that encourages sharing`,
    "YouTube Shorts": `YouTube Shorts Style:
- Cinematic narration style
- Suspense timing with dramatic pauses
- Vivid visual descriptions
- Build tension throughout
- Dramatic scene transitions
- Powerful ending that leaves impact`,
    Threads: `Threads Style:
- Casual storytelling tone
- Relatable emotions and situations
- Conversational language
- Shorter paragraphs for readability
- Authentic voice
- Encourage discussion in comments`,
  };

  return rules[platform] || "Write in an engaging, accessible style.";
}

function buildLengthGuidelines(length: string): string {
  const guidelines: Record<string, string> = {
    SHORT: "Keep story between 100-200 words. Focus on impact over detail. Make every word count.",
    MEDIUM: "Keep story between 300-700 words. Balance detail with pacing. Include build-up and climax.",
    LONG: "Keep story between 1800-5000 words. Develop characters and plot fully. Include multiple scenes and emotional arcs.",
  };

  return guidelines[length] || "Write a complete story with clear structure.";
}

/**
 * Generate a viral Myanmar story using LLM
 */
export async function generateStory(
  input: StoryGenerationInput
): Promise<GeneratedStory> {
  const systemPrompt = buildSystemPrompt(input);

  const userPrompt = `Generate a ${input.storyType} story with the following parameters:

Story Type: ${input.storyType}
Topic: ${input.topic}
Tone: ${input.tone}
Platform: ${input.platform}
Length: ${input.length}
Location: ${input.location}
Characters: ${input.characters}
Ending Type: ${input.endingType}

Create a viral Myanmar Unicode story following the specified genre rules, platform styling, and length guidelines. Respond with ONLY the JSON object, no additional text.`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system" as const, content: systemPrompt },
        { role: "user" as const, content: userPrompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "story_output",
          strict: true,
          schema: {
            type: "object",
            properties: {
              title: { type: "string", description: "Viral title in Myanmar Unicode" },
              hook: { type: "string", description: "Powerful hook in Myanmar Unicode" },
              story: { type: "string", description: "Main story in Myanmar Unicode" },
              twistEnding: { type: "string", description: "Twist ending in Myanmar Unicode" },
              cta: { type: "string", description: "Call-to-action in Myanmar Unicode" },
              hashtags: {
                type: "array",
                items: { type: "string" },
                description: "Array of hashtags",
              },
            },
            required: ["title", "hook", "story", "twistEnding", "cta", "hashtags"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message.content;
    if (!content || typeof content !== "string") {
      throw new Error("No content in LLM response");
    }

    const parsed = JSON.parse(content);
    return {
      title: parsed.title,
      hook: parsed.hook,
      story: parsed.story,
      twistEnding: parsed.twistEnding,
      cta: parsed.cta,
      hashtags: parsed.hashtags,
    };
  } catch (error) {
    console.error("[StoryGenerator] Failed to generate story:", error);
    throw new Error(
      `Failed to generate story: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
