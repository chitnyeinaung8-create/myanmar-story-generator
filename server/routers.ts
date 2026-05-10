import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { deleteStory, getUserStories, saveStory } from "./db";
import { generateCoverImage } from "./coverImageGenerator";
import { generateStoryProduction } from "./storyGeneratorProduction";
import { validateStoryResponse, extractErrorMessage } from "./responseValidator";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  stories: router({
    generate: protectedProcedure
      .input(
        z.object({
          storyType: z.string(),
          topic: z.string(),
          tone: z.string(),
          platform: z.string(),
          length: z.string(),
          location: z.string(),
          characters: z.string(),
          endingType: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          // Generate story using LLM (with retry and timeout)
          const generatedStory = await generateStoryProduction(input);

          // Generate cover image
          let coverImageUrl = "";
          try {
            coverImageUrl = await generateCoverImage({
              title: generatedStory.title,
              storyType: input.storyType,
              tone: input.tone,
            });
          } catch (error) {
            console.warn("[Stories] Failed to generate cover image:", error);
            // Continue without cover image
          }

          // Save story to database
          const storyId = await saveStory({
            userId: ctx.user.id,
            title: generatedStory.title,
            content: `${generatedStory.hook}\n\n${generatedStory.story}\n\n${generatedStory.twistEnding}\n\n${generatedStory.cta}`,
            hook: generatedStory.hook,
            story: generatedStory.story,
            twistEnding: generatedStory.twistEnding,
            cta: generatedStory.cta,
            hashtags: generatedStory.hashtags.join(", "),
            storyType: input.storyType,
            tone: input.tone,
            platform: input.platform,
            length: input.length,
            topic: input.topic,
            location: input.location,
            characters: input.characters,
            endingType: input.endingType,
            coverImageUrl,
          });

          return {
            id: storyId,
            ...generatedStory,
            coverImageUrl,
          };
        } catch (error) {
          const errorMsg = extractErrorMessage(error);
          console.error("[Stories] Failed to generate story:", errorMsg);
          throw new Error(`Failed to generate story: ${errorMsg}`);
        }
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      try {
        const stories = await getUserStories(ctx.user.id);
        return stories;
      } catch (error) {
        console.error("[Stories] Failed to list stories:", error);
        throw new Error("Failed to retrieve stories");
      }
    }),

    delete: protectedProcedure
      .input(z.object({ storyId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        try {
          const success = await deleteStory(input.storyId, ctx.user.id);
          return { success };
        } catch (error) {
          console.error("[Stories] Failed to delete story:", error);
          throw new Error("Failed to delete story");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
