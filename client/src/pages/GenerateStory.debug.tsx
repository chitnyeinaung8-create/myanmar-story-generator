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

export default function GenerateStoryDebug() {
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
    console.log("[DEBUG] Form submit event triggered");
    e.preventDefault();

    console.log("[DEBUG] Form data:", formData);

    if (
      !formData.storyType ||
      !formData.topic ||
      !formData.tone ||
      !formData.platform ||
      !formData.endingType
    ) {
      console.log("[DEBUG] Validation failed - missing required fields");
      console.log("[DEBUG] storyType:", formData.storyType);
      console.log("[DEBUG] topic:", formData.topic);
      console.log("[DEBUG] tone:", formData.tone);
      console.log("[DEBUG] platform:", formData.platform);
      console.log("[DEBUG] endingType:", formData.endingType);
      toast.error("Please fill in all required fields");
      return;
    }

    console.log("[DEBUG] Validation passed - calling mutation");
    try {
      console.log("[DEBUG] Calling generateMutation.mutateAsync with:", formData);
      const result = await generateMutation.mutateAsync(formData);
      console.log("[DEBUG] Mutation succeeded, result:", result);
      setLocation(`/story/${result.id}`);
    } catch (error) {
      console.error("[DEBUG] Mutation failed:", error);
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
            Create Your Viral Story [DEBUG]
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
                onValueChange={(value) => {
                  console.log("[DEBUG] Story type changed to:", value);
                  setFormData({ ...formData, storyType: value });
                }}
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
              <Input
                id="topic"
                value={formData.topic}
                onChange={(e) => {
                  console.log("[DEBUG] Topic changed to:", e.target.value);
                  setFormData({ ...formData, topic: e.target.value });
                }}
                placeholder="Enter story topic"
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
              />
            </div>

            <div>
              <Label htmlFor="tone" className="text-white mb-2 block">
                Tone *
              </Label>
              <Select
                value={formData.tone}
                onValueChange={(value) => {
                  console.log("[DEBUG] Tone changed to:", value);
                  setFormData({ ...formData, tone: value });
                }}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t} className="text-white">
                      {t}
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
                onValueChange={(value) => {
                  console.log("[DEBUG] Platform changed to:", value);
                  setFormData({ ...formData, platform: value });
                }}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p} value={p} className="text-white">
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white mb-2 block">Length</Label>
              <RadioGroup
                value={formData.length}
                onValueChange={(value) => {
                  console.log("[DEBUG] Length changed to:", value);
                  setFormData({ ...formData, length: value });
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="SHORT" id="short" />
                  <Label htmlFor="short" className="text-slate-300 cursor-pointer">
                    Short
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="MEDIUM" id="medium" />
                  <Label htmlFor="medium" className="text-slate-300 cursor-pointer">
                    Medium
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="LONG" id="long" />
                  <Label htmlFor="long" className="text-slate-300 cursor-pointer">
                    Long
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
                value={formData.location}
                onChange={(e) => {
                  console.log("[DEBUG] Location changed to:", e.target.value);
                  setFormData({ ...formData, location: e.target.value });
                }}
                placeholder="Enter location (optional)"
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
              />
            </div>

            <div>
              <Label htmlFor="characters" className="text-white mb-2 block">
                Characters
              </Label>
              <Textarea
                id="characters"
                value={formData.characters}
                onChange={(e) => {
                  console.log("[DEBUG] Characters changed to:", e.target.value);
                  setFormData({ ...formData, characters: e.target.value });
                }}
                placeholder="Describe characters (optional)"
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 min-h-24"
              />
            </div>

            <div>
              <Label htmlFor="endingType" className="text-white mb-2 block">
                Ending Type *
              </Label>
              <Select
                value={formData.endingType}
                onValueChange={(value) => {
                  console.log("[DEBUG] Ending type changed to:", value);
                  setFormData({ ...formData, endingType: value });
                }}
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
