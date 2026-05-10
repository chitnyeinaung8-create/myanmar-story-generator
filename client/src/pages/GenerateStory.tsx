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

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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

  const validateForm = (): boolean => {
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

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      const errorMessages = Object.values(validationErrors);
      if (errorMessages.length > 0) {
        toast.error(errorMessages[0]);
      } else {
        toast.error("Please fill in all required fields");
      }
      return;
    }

    try {
      const result = await generateMutation.mutateAsync(formData);
      
      // Validate response structure
      if (!result) {
        console.error("[GenerateStory] Empty response from server");
        toast.error("Failed to generate story: Empty response from server");
        return;
      }

      if (!result.id) {
        console.error("[GenerateStory] Response missing story ID:", result);
        toast.error("Failed to generate story: Server did not return story ID");
        return;
      }

      // Success
      toast.success("Story generated successfully!");
      setLocation(`/story/${result.id}`);
    } catch (error) {
      console.error("[GenerateStory] Mutation error:", error);
      
      // Extract meaningful error message
      let errorMessage = "Failed to generate story. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null) {
        const err = error as Record<string, unknown>;
        if (err.message) {
          errorMessage = String(err.message);
        } else if (err.data && typeof err.data === "object") {
          const data = err.data as Record<string, unknown>;
          if (data.code) {
            errorMessage = `Error: ${data.code}`;
          }
        }
      }
      
      toast.error(errorMessage);
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
                Story Type * {validationErrors.storyType && <span className="text-red-400 text-sm">({validationErrors.storyType})</span>}
              </Label>
              <Select
                value={formData.storyType}
                onValueChange={(value) =>
                  setFormData({ ...formData, storyType: value })
                }
              >
                <SelectTrigger className={`bg-slate-800 border-slate-700 text-white ${validationErrors.storyType ? "border-red-500" : ""}`}>
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
                Topic * {validationErrors.topic && <span className="text-red-400 text-sm">({validationErrors.topic})</span>}
              </Label>
              <Input
                id="topic"
                value={formData.topic}
                onChange={(e) =>
                  setFormData({ ...formData, topic: e.target.value })
                }
                placeholder="Enter story topic"
                className={`bg-slate-800 border-slate-700 text-white placeholder-slate-500 ${validationErrors.topic ? "border-red-500" : ""}`}
              />
            </div>

            <div>
              <Label htmlFor="tone" className="text-white mb-2 block">
                Tone * {validationErrors.tone && <span className="text-red-400 text-sm">({validationErrors.tone})</span>}
              </Label>
              <Select
                value={formData.tone}
                onValueChange={(value) =>
                  setFormData({ ...formData, tone: value })
                }
              >
                <SelectTrigger className={`bg-slate-800 border-slate-700 text-white ${validationErrors.tone ? "border-red-500" : ""}`}>
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
                Platform * {validationErrors.platform && <span className="text-red-400 text-sm">({validationErrors.platform})</span>}
              </Label>
              <Select
                value={formData.platform}
                onValueChange={(value) =>
                  setFormData({ ...formData, platform: value })
                }
              >
                <SelectTrigger className={`bg-slate-800 border-slate-700 text-white ${validationErrors.platform ? "border-red-500" : ""}`}>
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
                onValueChange={(value) =>
                  setFormData({ ...formData, length: value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, characters: e.target.value })
                }
                placeholder="Describe characters (optional)"
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 min-h-24"
              />
            </div>

            <div>
              <Label htmlFor="endingType" className="text-white mb-2 block">
                Ending Type * {validationErrors.endingType && <span className="text-red-400 text-sm">({validationErrors.endingType})</span>}
              </Label>
              <Select
                value={formData.endingType}
                onValueChange={(value) =>
                  setFormData({ ...formData, endingType: value })
                }
              >
                <SelectTrigger className={`bg-slate-800 border-slate-700 text-white ${validationErrors.endingType ? "border-red-500" : ""}`}>
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
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
