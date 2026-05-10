import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function StoryHistory() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const storiesQuery = trpc.stories.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const deleteStoryMutation = trpc.stories.delete.useMutation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-lg mb-4">Please log in to view your story history</p>
          <Button onClick={() => setLocation("/")}>Back to Home</Button>
        </Card>
      </div>
    );
  }

  const filteredStories =
    storiesQuery.data?.filter(
      (story) =>
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.storyType.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleDelete = async (storyId: number) => {
    if (confirm("Are you sure you want to delete this story?")) {
      try {
        await deleteStoryMutation.mutateAsync({ storyId });
        toast.success("Story deleted");
        storiesQuery.refetch();
      } catch (error) {
        toast.error("Failed to delete story");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Your Story History
              </h1>
              <p className="text-slate-400">
                {filteredStories.length} story{filteredStories.length !== 1 ? "ies" : ""}
              </p>
            </div>
            <Button
              onClick={() => setLocation("/generate")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
            >
              Create New Story
            </Button>
          </div>

          {/* Search */}
          <Input
            placeholder="Search stories by title or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
        </div>

        {/* Stories Grid */}
        {storiesQuery.isLoading ? (
          <div className="text-center text-slate-400">Loading stories...</div>
        ) : filteredStories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">
              {searchTerm ? "No stories found matching your search" : "No stories yet"}
            </p>
            <Button
              onClick={() => setLocation("/generate")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
            >
              Create Your First Story
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <Card
                key={story.id}
                className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden hover:border-slate-600/50 transition-all duration-200 group cursor-pointer"
              >
                {/* Cover Image */}
                {story.coverImageUrl && (
                  <div className="relative h-40 overflow-hidden bg-slate-800">
                    <img
                      src={story.coverImageUrl}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                    {story.title}
                  </h3>

                  {/* Tags */}
                  <div className="flex gap-2 flex-wrap mb-4">
                    <span className="px-2 py-1 bg-purple-900/50 text-purple-200 rounded text-xs">
                      {story.storyType}
                    </span>
                    <span className="px-2 py-1 bg-pink-900/50 text-pink-200 rounded text-xs">
                      {story.platform}
                    </span>
                  </div>

                  {/* Preview */}
                  <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                    {story.story || story.hook}
                  </p>

                  {/* Date */}
                  <p className="text-slate-500 text-xs mb-4">
                    {new Date(story.createdAt).toLocaleDateString()}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setLocation(`/story/${story.id}`)}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-white"
                      size="sm"
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      View
                    </Button>
                    <Button
                      onClick={() => handleDelete(story.id)}
                      disabled={deleteStoryMutation.isPending}
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
