"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const platforms = [
  {
    id: "instagram",
    name: "Instagram",
    sizes: {
      feed: { width: 1080, height: 1080, label: "Feed Post" },
      story: { width: 1080, height: 1920, label: "Story" },
      reel: { width: 1080, height: 1920, label: "Reel" },
      carousel: { width: 1080, height: 1350, label: "Carousel" },
    },
  },
  {
    id: "youtube",
    name: "YouTube",
    sizes: {
      thumbnail: { width: 1280, height: 720, label: "Thumbnail" },
      short: { width: 1080, height: 1920, label: "Short" },
      banner: { width: 2560, height: 1440, label: "Banner" },
    },
  },
  {
    id: "tiktok",
    name: "TikTok",
    sizes: {
      video: { width: 1080, height: 1920, label: "Video" },
      profile: { width: 200, height: 200, label: "Profile" },
    },
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    sizes: {
      post: { width: 1200, height: 675, label: "Post Image" },
      header: { width: 1500, height: 500, label: "Header" },
    },
  },
];

const hashtagSuggestions = [
  { tag: "#cinematicphotography", posts: "2.4M", trending: true },
  { tag: "#filmmaking", posts: "18.5M", trending: true },
  { tag: "#saudiarabia", posts: "12.3M", trending: false },
  { tag: "#contentcreator", posts: "45.2M", trending: true },
  { tag: "#visualstorytelling", posts: "1.8M", trending: false },
  { tag: "#cinematic", posts: "8.9M", trending: true },
  { tag: "#photography", posts: "987M", trending: false },
  { tag: "#videography", posts: "15.6M", trending: false },
  { tag: "#goldenhour", posts: "32.1M", trending: true },
  { tag: "#behindthescenes", posts: "28.4M", trending: false },
];

const bestPostingTimes = [
  { day: "Monday", times: ["7:00 AM", "12:00 PM", "7:00 PM"], engagement: 78 },
  { day: "Tuesday", times: ["6:00 AM", "1:00 PM", "8:00 PM"], engagement: 82 },
  { day: "Wednesday", times: ["7:00 AM", "11:00 AM", "7:00 PM"], engagement: 85 },
  { day: "Thursday", times: ["6:00 AM", "12:00 PM", "9:00 PM"], engagement: 88 },
  { day: "Friday", times: ["5:00 AM", "1:00 PM", "3:00 PM"], engagement: 92 },
  { day: "Saturday", times: ["9:00 AM", "11:00 AM", "8:00 PM"], engagement: 95 },
  { day: "Sunday", times: ["10:00 AM", "2:00 PM", "7:00 PM"], engagement: 90 },
];

const thumbnailAnalysis = {
  score: 87,
  clickPotential: "High",
  metrics: {
    faceVisibility: 92,
    textReadability: 85,
    colorContrast: 88,
    emotionalImpact: 82,
    brandConsistency: 90,
  },
  suggestions: [
    "Add more contrast to the text for better readability",
    "Consider adding an expressive face for higher CTR",
    "The color scheme works well with your brand",
    "Try adding a subtle border or glow effect",
  ],
};

export default function SocialPage() {
  const [selectedPlatform, setSelectedPlatform] = useState("instagram");
  const [selectedSize, setSelectedSize] = useState("feed");
  const [caption, setCaption] = useState("");
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [autoSchedule, setAutoSchedule] = useState(false);

  const currentPlatform = platforms.find((p) => p.id === selectedPlatform);

  const copyHashtags = () => {
    navigator.clipboard.writeText(selectedHashtags.join(" "));
    setCopiedHashtags(true);
    setTimeout(() => setCopiedHashtags(false), 2000);
  };

  const toggleHashtag = (tag: string) => {
    setSelectedHashtags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-4"
            >
              Back to Home
            </Link>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-xs font-medium text-white/50 uppercase tracking-wider mb-4">
                  Social Optimizer
                </div>
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white font-display">
                  Social Media <span className="text-white">Optimizer</span>
                </h1>
                <p className="mt-2 text-white/60">
                  Optimize your content for maximum engagement across all platforms
                </p>
              </div>
              <Button className="bg-white text-black hover:bg-white/80">
                Publish Now
              </Button>
            </div>
          </div>

          <div className="space-y-12">
            <section className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Select Platform</p>
              <div className="flex flex-wrap gap-3">
                {platforms.map((platform) => (
                  <Button
                    key={platform.id}
                    variant="outline"
                    className={selectedPlatform === platform.id ? "bg-white text-black" : "bg-transparent text-white/60 hover:text-white"}
                    onClick={() => {
                      setSelectedPlatform(platform.id);
                      setSelectedSize(Object.keys(platform.sizes)[0]);
                    }}
                  >
                    {platform.name}
                  </Button>
                ))}
              </div>

              {currentPlatform && (
                <div className="space-y-3">
                  <p className="text-sm text-white/50">Export Size</p>
                  <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-white/50">
                    {Object.entries(currentPlatform.sizes).map(([key, size]) => (
                      <button
                        key={key}
                        className={selectedSize === key ? "text-white" : "text-white/50 hover:text-white"}
                        onClick={() => setSelectedSize(key)}
                      >
                        {size.label} ({size.width}x{size.height})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Preview & Export</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="bg-transparent text-white/70">
                    Smart Crop
                  </Button>
                  <Button size="sm" className="bg-white text-black hover:bg-white/80">
                    Export
                  </Button>
                </div>
              </div>
              <div className="aspect-square max-w-md bg-black/40 rounded-lg flex items-center justify-center">
                <div className="text-center p-8">
                  <p className="text-white/60">Upload content to preview</p>
                  <p className="text-sm text-white/40 mt-1">
                    Will be resized to {currentPlatform?.sizes[selectedSize as keyof typeof currentPlatform.sizes]?.width}x
                    {currentPlatform?.sizes[selectedSize as keyof typeof currentPlatform.sizes]?.height}
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Caption & Hashtags</p>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-white/70">Caption</Label>
                  <Button variant="ghost" size="sm" className="h-8 text-white/60 hover:text-white">
                    AI Generate
                  </Button>
                </div>
                <Textarea
                  placeholder="Write your caption here..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="min-h-[100px] bg-transparent border-0 text-white/80 placeholder:text-white/40"
                />
                <p className="text-xs text-white/40 mt-1 text-right">
                  {caption.length}/2200 characters
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-white/70">Suggested Hashtags</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-white/60 hover:text-white"
                    onClick={copyHashtags}
                    disabled={selectedHashtags.length === 0}
                  >
                    {copiedHashtags ? "Copied!" : "Copy Selected"}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em]">
                  {hashtagSuggestions.map((hashtag) => (
                    <button
                      key={hashtag.tag}
                      className={selectedHashtags.includes(hashtag.tag) ? "text-white" : "text-white/50 hover:text-white"}
                      onClick={() => toggleHashtag(hashtag.tag)}
                    >
                      {hashtag.tag} <span className="text-white/40">{hashtag.posts}</span>
                    </button>
                  ))}
                </div>
                {selectedHashtags.length > 0 && (
                  <p className="text-sm text-white/60">
                    Selected ({selectedHashtags.length}/30): {selectedHashtags.join(" ")}
                  </p>
                )}
              </div>
            </section>

            <section className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Thumbnail Analysis</p>
              <div className="space-y-2">
                <p className="text-4xl font-semibold text-white">{thumbnailAnalysis.score}</p>
                <p className="text-sm text-white/50">{thumbnailAnalysis.clickPotential} CTR</p>
              </div>
              <div className="space-y-2 text-sm text-white/70">
                {Object.entries(thumbnailAnalysis.metrics).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                    <span className="text-white">{value}%</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Suggestions</p>
                <div className="space-y-2 text-xs text-white/50">
                  {thumbnailAnalysis.suggestions.map((suggestion, i) => (
                    <p key={i}>{suggestion}</p>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Best Posting Times</p>
              <div className="space-y-3">
                {bestPostingTimes.map((day) => (
                  <div key={day.day} className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm text-white">{day.day}</p>
                      <p className="text-xs text-white/50">{day.times.join(", ")}</p>
                    </div>
                    <div className="text-xs text-white/50">{day.engagement}% engagement</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <Label htmlFor="auto-schedule" className="text-white/70">Auto-Schedule</Label>
                  <p className="text-xs text-white/50">Post at optimal times</p>
                </div>
                <Switch id="auto-schedule" checked={autoSchedule} onCheckedChange={setAutoSchedule} />
              </div>
            </section>

            <section className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Engagement Prediction</p>
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex items-center justify-between">
                  <span>Est. Likes</span>
                  <span className="text-white">2.4K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Est. Comments</span>
                  <span className="text-white">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Est. Shares</span>
                  <span className="text-white">89</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Est. Saves</span>
                  <span className="text-white">342</span>
                </div>
              </div>
              <p className="text-xs text-white/50">
                Based on your account analytics and content type
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
