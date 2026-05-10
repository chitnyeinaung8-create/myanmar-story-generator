import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, ArrowLeft, Trash2, Heart } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { copyToClipboard } from "@/lib/clipboard";

export default function StoryDisplay() {
  const { id } = useParams<{ id?: string }>();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const [isSaved, setIsSaved] = useState(false);

  const storiesQuery = trpc.stories.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const deleteStoryMutation = trpc.stories.delete.useMutation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-lg mb-4">Please log in to view stories</p>
          <Button onClick={() => setLocation("/")}>Back to Home</Button>
        </Card>
      </div>
    );
  }

  const story = storiesQuery.data?.find((s) => s.id === parseInt(id || "0"));

  const safeStory = story && {
    ...story,
    hook: story.hook || "",
    story: story.story || "",
    twistEnding: story.twistEnding || "",
    cta: story.cta || "",
    hashtags: story.hashtags || "",
  };

  if (storiesQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-white">Loading story...</div>
      </div>
    );
  }

  if (!safeStory) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Card className="p-8 text-center">
          <p className="text-lg mb-4">Story not found</p>
          <Button onClick={() => setLocation("/history")}>View History</Button>
        </Card>
      </div>
    );
  }

  const handleCopy = (text: string, section: string) => {
    copyToClipboard(text, section);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this story?")) {
      try {
          await deleteStoryMutation.mutateAsync({ storyId: safeStory.id });
        toast.success("Story deleted");
        setLocation("/history");
      } catch (error) {
        toast.error("Failed to delete story");
      }
    }
  };

  const fullStoryText = `${safeStory.title}\n\n${safeStory.hook}\n\n${safeStory.story}\n\n${safeStory.twistEnding}\n\n${safeStory.cta}\n\n${safeStory.hashtags}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/history")}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to History
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSaved(!isSaved)}
              className="text-slate-400 hover:text-pink-500"
            >
              <Heart
                className={`h-5 w-5 ${isSaved ? "fill-pink-500 text-pink-500" : ""}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={deleteStoryMutation.isPending}
              className="text-slate-400 hover:text-red-500"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Cover Image */}
        {safeStory.coverImageUrl && (
          <div className="mb-8 rounded-lg overflow-hidden border border-slate-700/50">
            <img
              src={safeStory.coverImageUrl}
              alt={safeStory.title}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        {/* Story Content */}
        <div className="space-y-6">
          {/* Title Section */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {safeStory.title}
                </h1>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-purple-900/50 text-purple-200 rounded-full text-sm">
                    {safeStory.storyType}
                  </span>
                  <span className="px-3 py-1 bg-pink-900/50 text-pink-200 rounded-full text-sm">
                    {safeStory.platform}
                  </span>
                  <span className="px-3 py-1 bg-blue-900/50 text-blue-200 rounded-full text-sm">
                    {safeStory.tone}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(safeStory.title, "Title")}
                className="text-slate-400 hover:text-white"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Hook Section */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-300 mb-3">
                  Hook
                </h2>
                <p className="text-white leading-relaxed whitespace-pre-wrap">
                  {safeStory.hook}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(safeStory.hook, "Hook")}
                className="text-slate-400 hover:text-white ml-2"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Story Section */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-300 mb-3">
                  Story
                </h2>
                <p className="text-white leading-relaxed whitespace-pre-wrap">
                  {safeStory.story}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(safeStory.story, "Story")}
                className="text-slate-400 hover:text-white ml-2"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Twist Ending Section */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-300 mb-3">
                  Twist Ending
                </h2>
                <p className="text-white leading-relaxed whitespace-pre-wrap">
                  {safeStory.twistEnding}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(safeStory.twistEnding, "Twist Ending")}
                className="text-slate-400 hover:text-white ml-2"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* CTA Section */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-300 mb-3">
                  Call to Action
                </h2>
                <p className="text-white leading-relaxed whitespace-pre-wrap">
                  {safeStory.cta}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(safeStory.cta, "CTA")}
                className="text-slate-400 hover:text-white ml-2"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Hashtags Section */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-300 mb-3">
                  Hashtags
                </h2>
                <p className="text-white leading-relaxed whitespace-pre-wrap">
                  {safeStory.hashtags}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(safeStory.hashtags, "Hashtags")}
                className="text-slate-400 hover:text-white ml-2"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Full Story Copy */}
          <div className="pt-4">
            <Button
              onClick={() => handleCopy(fullStoryText, "Full Story")}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all duration-200"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Full Story
            </Button>
          </div>

          {/* Generate Another */}
          <Button
            onClick={() => setLocation("/generate")}
            variant="outline"
            className="w-full border-slate-700 text-white hover:bg-slate-800"
          >
            Generate Another Story
          </Button>
        </div>
      </div>
    </div>
  );
}
