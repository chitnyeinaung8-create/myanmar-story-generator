import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Sparkles, Zap, BookOpen, Share2, Palette, Clock } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-500" />
            <h1 className="text-xl font-bold text-white">Myanmar Story Generator</h1>
          </div>
          <div className="flex gap-3">
            {isAuthenticated ? (
              <>
                <Button
                  onClick={() => setLocation("/generate")}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
                >
                  Create Story
                </Button>
                <Button
                  onClick={() => setLocation("/history")}
                  variant="outline"
                  className="border-slate-700 text-white hover:bg-slate-800"
                >
                  History
                </Button>
              </>
            ) : (
              <Button
                onClick={() => window.location.href = getLoginUrl()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Create Viral Myanmar Stories
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}Instantly
              </span>
            </h2>
            <p className="text-xl text-slate-400 mb-8 leading-relaxed">
              Generate cinematic, emotionally engaging Myanmar Unicode stories optimized for TikTok, Facebook, YouTube Shorts, and Threads. Powered by advanced AI with platform-specific styling and genre-specific writing rules.
            </p>
            <div className="flex gap-4">
              {isAuthenticated ? (
                <Button
                  onClick={() => setLocation("/generate")}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8"
                >
                  Start Creating
                </Button>
              ) : (
                <Button
                  onClick={() => window.location.href = getLoginUrl()}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8"
                >
                  Get Started Free
                </Button>
              )}
              <Button
                onClick={() => setLocation("/history")}
                size="lg"
                variant="outline"
                className="border-slate-700 text-white hover:bg-slate-800 px-8"
              >
                View Examples
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-3xl"></div>
            <div className="relative bg-slate-900/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg opacity-20"></div>
                <div className="h-8 bg-slate-700/50 rounded w-3/4"></div>
                <div className="h-8 bg-slate-700/50 rounded w-5/6"></div>
                <div className="h-8 bg-slate-700/50 rounded w-4/5"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-white mb-4">Powerful Features</h3>
          <p className="text-xl text-slate-400">Everything you need to create viral stories</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm p-6 hover:border-slate-600/50 transition-all duration-200">
            <Sparkles className="h-8 w-8 text-purple-500 mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">AI-Powered Generation</h4>
            <p className="text-slate-400">
              Advanced LLM generates authentic Myanmar Unicode stories with emotional depth and viral potential.
            </p>
          </Card>

          {/* Feature 2 */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm p-6 hover:border-slate-600/50 transition-all duration-200">
            <Zap className="h-8 w-8 text-pink-500 mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">Platform Optimization</h4>
            <p className="text-slate-400">
              Stories automatically styled for TikTok, Facebook, YouTube Shorts, and Threads with genre-specific rules.
            </p>
          </Card>

          {/* Feature 3 */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm p-6 hover:border-slate-600/50 transition-all duration-200">
            <Palette className="h-8 w-8 text-blue-500 mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">Cinematic Cover Images</h4>
            <p className="text-slate-400">
              Automatically generated cover images that capture the mood and genre of your story.
            </p>
          </Card>

          {/* Feature 4 */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm p-6 hover:border-slate-600/50 transition-all duration-200">
            <BookOpen className="h-8 w-8 text-indigo-500 mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">21 Story Types</h4>
            <p className="text-slate-400">
              Horror, Romance, Comedy, Mystery, Thriller, and 16 more genres to match your creative vision.
            </p>
          </Card>

          {/* Feature 5 */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm p-6 hover:border-slate-600/50 transition-all duration-200">
            <Share2 className="h-8 w-8 text-cyan-500 mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">Easy Sharing</h4>
            <p className="text-slate-400">
              Copy individual sections or full stories with one click. Ready to post on any platform.
            </p>
          </Card>

          {/* Feature 6 */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm p-6 hover:border-slate-600/50 transition-all duration-200">
            <Clock className="h-8 w-8 text-orange-500 mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">Story History</h4>
            <p className="text-slate-400">
              Save and revisit all your generated stories. Build your personal story library.
            </p>
          </Card>
        </div>
      </section>

      {/* Story Types Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-white mb-4">21 Story Types</h3>
          <p className="text-xl text-slate-400">Choose from a wide variety of genres</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {[
            "Horror",
            "Ghost Story",
            "Mystery",
            "Thriller",
            "Romance",
            "Breakup",
            "Comedy",
            "Motivation",
            "Sad Story",
            "Fantasy",
            "Action",
            "School Life",
            "Friendship",
            "Crime",
            "Survival",
            "Paranormal",
            "Urban Legend",
          ].map((type) => (
            <div
              key={type}
              className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-3 text-center text-slate-300 hover:text-white hover:border-slate-600/50 transition-all duration-200"
            >
              {type}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-700/50 rounded-2xl p-12 text-center backdrop-blur-sm">
          <h3 className="text-4xl font-bold text-white mb-4">Ready to Create?</h3>
          <p className="text-xl text-slate-300 mb-8">
            Start generating viral Myanmar stories today
          </p>
          {isAuthenticated ? (
            <Button
              onClick={() => setLocation("/generate")}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8"
            >
              Create Your First Story
            </Button>
          ) : (
            <Button
              onClick={() => window.location.href = getLoginUrl()}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8"
            >
              Get Started Free
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 mt-20 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-slate-500">
          <p>© 2026 Myanmar Story Generator. Powered by AI.</p>
        </div>
      </footer>
    </div>
  );
}
