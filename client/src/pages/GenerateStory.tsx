import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

const STORY_TYPES = [
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

const TONES = [
  "Creepy",
  "Dark",
  "Emotional",
  "Sad",
  "Funny",
  "Romantic",
  "Suspenseful",
  "Heartbreaking",
  "Inspirational",
  "Dramatic",
  "Psychological",
  "Intense",
  "Mysterious",
];

const PLATFORMS = ["TikTok", "Facebook", "YouTube Shorts", "Threads"];

const ENDING_TYPES = [
  "Happy Ending",
  "Sad Ending",
  "Cliffhanger",
  "Twist Ending",
  "Open Ending",
  "Bittersweet",
];

export default function GenerateStory() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const generateMutation = trpc.stories.generate.useMutation();

  const [formData, setFormData] = useState({
    storyType: "",
    topic: "",
    tone: "",
    platform: "",
    length: "MEDIUM",
    location: "",
    characters: "",
    endingType: "",
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-lg mb-4">Please log in to generate stories</p>
          <Button onClick={() => setLocation("/")}>Back to Home</Button>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.storyType ||
      !formData.topic ||
      !formData.tone ||
      !formData.platform ||
      !formData.endingType
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const result = await generateMutation.mutateAsync(formData);
      setLocation(`/story/${result.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to generate story"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Create Your Viral Story
          </h1>
          <p className="text-slate-400">
            Generate cinematic, engaging Myanmar stories optimized for social media
          </p>
        </div>

        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="storyType" className="text-white mb-2 block">
                Story Type *
              </Label>
              <Select
                value={formData.storyType}
                onValueChange={(value) =>
                  setFormData({ ...formData, storyType: value })
                }
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Select story type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {STORY_TYPES.map((type) => (
                    <SelectItem key={type} value={type} className="text-white">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="topic" className="text-white mb-2 block">
                Topic *
              </Label>
              <Textarea
                id="topic"
                placeholder="Describe your story topic or main idea..."
                value={formData.topic}
                onChange={(e) =>
                  setFormData({ ...formData, topic: e.target.value })
                }
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-h-24"
              />
            </div>

            <div>
              <Label htmlFor="tone" className="text-white mb-2 block">
                Tone *
              </Label>
              <Select
                value={formData.tone}
                onValueChange={(value) =>
                  setFormData({ ...formData, tone: value })
                }
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {TONES.map((tone) => (
                    <SelectItem key={tone} value={tone} className="text-white">
                      {tone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="platform" className="text-white mb-2 block">
                Platform *
              </Label>
              <Select
                value={formData.platform}
                onValueChange={(value) =>
                  setFormData({ ...formData, platform: value })
                }
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {PLATFORMS.map((platform) => (
                    <SelectItem
                      key={platform}
                      value={platform}
                      className="text-white"
                    >
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white mb-3 block">Length</Label>
              <RadioGroup
                value={formData.length}
                onValueChange={(value) =>
                  setFormData({ ...formData, length: value })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="SHORT" id="short" />
                  <Label htmlFor="short" className="text-slate-300 cursor-pointer">
                    Short (100-200 words)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="MEDIUM" id="medium" />
                  <Label htmlFor="medium" className="text-slate-300 cursor-pointer">
                    Medium (300-700 words)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="LONG" id="long" />
                  <Label htmlFor="long" className="text-slate-300 cursor-pointer">
                    Long (1800-5000 words)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="location" className="text-white mb-2 block">
                Location
              </Label>
              <Input
                id="location"
                placeholder="Where does the story take place?"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <Label htmlFor="characters" className="text-white mb-2 block">
                Characters
              </Label>
              <Textarea
                id="characters"
                placeholder="Describe the main characters..."
                value={formData.characters}
                onChange={(e) =>
                  setFormData({ ...formData, characters: e.target.value })
                }
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-h-20"
              />
            </div>

            <div>
              <Label htmlFor="endingType" className="text-white mb-2 block">
                Ending Type *
              </Label>
              <Select
                value={formData.endingType}
                onValueChange={(value) =>
                  setFormData({ ...formData, endingType: value })
                }
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Select ending type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {ENDING_TYPES.map((type) => (
                    <SelectItem key={type} value={type} className="text-white">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={generateMutation.isPending}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all duration-200"
              >
                {generateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Story...
                  </>
                ) : (
                  "Generate Story"
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
