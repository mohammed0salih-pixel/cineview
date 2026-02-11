"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  Instagram,
  Youtube,
  Twitter,
  Hash,
  Clock,
  TrendingUp,
  Eye,
  ThumbsUp,
  Share2,
  Copy,
  Check,
  Sparkles,
  ImageIcon,
  Video,
  Scissors,
  Download,
  RefreshCw,
  Zap,
  Globe,
  BarChart3,
  Calendar,
  Users,
  Heart,
  MessageCircle,
  Bookmark,
  Play,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const platforms = [
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "from-purple-500 to-pink-500",
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
    icon: Youtube,
    color: "from-red-500 to-red-600",
    sizes: {
      thumbnail: { width: 1280, height: 720, label: "Thumbnail" },
      short: { width: 1080, height: 1920, label: "Short" },
      banner: { width: 2560, height: 1440, label: "Banner" },
    },
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: Play,
    color: "from-black to-gray-800",
    sizes: {
      video: { width: 1080, height: 1920, label: "Video" },
      profile: { width: 200, height: 200, label: "Profile" },
    },
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    icon: Twitter,
    color: "from-gray-800 to-black",
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
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-foreground/5 px-4 py-1.5 mb-4">
                  <Zap className="h-3.5 w-3.5 text-foreground" />
                  <span className="text-xs font-medium text-foreground uppercase tracking-wider">Social Optimizer</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                  Social Media <span className="text-foreground">Optimizer</span>
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Optimize your content for maximum engagement across all platforms
                </p>
              </div>
              <Button className="bg-foreground text-foreground-foreground hover:bg-foreground/90 ">
                <Share2 className="mr-2 h-4 w-4" />
                Publish Now
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Platform Selection */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="border-b border-border/50 pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Globe className="h-5 w-5 text-foreground" />
                    Select Platform
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {platforms.map((platform) => {
                      const Icon = platform.icon;
                      return (
                        <Button
                          key={platform.id}
                          variant={selectedPlatform === platform.id ? "default" : "outline"}
                          className={`h-auto py-4 flex-col gap-2 ${
                            selectedPlatform === platform.id
                              ? `bg-gradient-to-r ${platform.color} text-white border-0`
                              : "border-border/50 bg-transparent hover:bg-secondary"
                          }`}
                          onClick={() => {
                            setSelectedPlatform(platform.id);
                            setSelectedSize(Object.keys(platform.sizes)[0]);
                          }}
                        >
                          <Icon className="h-6 w-6" />
                          <span className="text-sm font-medium">{platform.name}</span>
                        </Button>
                      );
                    })}
                  </div>

                  {currentPlatform && (
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <p className="text-sm text-muted-foreground mb-3">Export Size</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(currentPlatform.sizes).map(([key, size]) => (
                          <Button
                            key={key}
                            variant={selectedSize === key ? "default" : "outline"}
                            size="sm"
                            className={selectedSize === key ? "bg-foreground text-foreground-foreground" : "border-border/50 bg-transparent"}
                            onClick={() => setSelectedSize(key)}
                          >
                            {size.label} ({size.width}x{size.height})
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Preview & Export */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="border-b border-border/50 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-foreground" />
                      Preview & Export
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-border/50 bg-transparent">
                        <Scissors className="mr-2 h-4 w-4" />
                        Smart Crop
                      </Button>
                      <Button size="sm" className="bg-foreground text-foreground-foreground hover:bg-foreground/90">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="aspect-square max-w-md mx-auto bg-secondary/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border/50">
                    <div className="text-center p-8">
                      <ImageIcon className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground">Upload content to preview</p>
                      <p className="text-sm text-muted-foreground/70 mt-1">
                        Will be resized to {currentPlatform?.sizes[selectedSize as keyof typeof currentPlatform.sizes]?.width}x
                        {currentPlatform?.sizes[selectedSize as keyof typeof currentPlatform.sizes]?.height}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Caption & Hashtags */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="border-b border-border/50 pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Hash className="h-5 w-5 text-foreground" />
                    Caption & Hashtags
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Caption</Label>
                      <Button variant="ghost" size="sm" className="h-8 text-foreground">
                        <Sparkles className="mr-2 h-3 w-3" />
                        AI Generate
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Write your caption here..."
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      className="min-h-[100px] bg-secondary/30 border-border/50"
                    />
                    <p className="text-xs text-muted-foreground mt-1 text-right">
                      {caption.length}/2200 characters
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Suggested Hashtags</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        onClick={copyHashtags}
                        disabled={selectedHashtags.length === 0}
                      >
                        {copiedHashtags ? (
                          <>
                            <Check className="mr-2 h-3 w-3 text-green-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-3 w-3" />
                            Copy Selected
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {hashtagSuggestions.map((hashtag) => (
                        <Button
                          key={hashtag.tag}
                          variant={selectedHashtags.includes(hashtag.tag) ? "default" : "outline"}
                          size="sm"
                          className={`h-auto py-1.5 ${
                            selectedHashtags.includes(hashtag.tag)
                              ? "bg-foreground text-foreground-foreground"
                              : "border-border/50 bg-transparent"
                          }`}
                          onClick={() => toggleHashtag(hashtag.tag)}
                        >
                          {hashtag.tag}
                          <span className="ml-1 text-xs opacity-70">{hashtag.posts}</span>
                          {hashtag.trending && (
                            <TrendingUp className="ml-1 h-3 w-3 text-green-400" />
                          )}
                        </Button>
                      ))}
                    </div>
                    {selectedHashtags.length > 0 && (
                      <div className="mt-3 p-3 rounded-lg bg-secondary/30">
                        <p className="text-sm text-muted-foreground mb-2">Selected ({selectedHashtags.length}/30):</p>
                        <p className="text-sm">{selectedHashtags.join(" ")}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Thumbnail Analysis */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="border-b border-border/50 pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Eye className="h-5 w-5 text-foreground" />
                    Thumbnail Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="text-center">
                    <div className="relative inline-flex">
                      <div className="w-24 h-24 rounded-full bg-foreground/10 flex items-center justify-center">
                        <span className="text-3xl font-bold text-foreground">{thumbnailAnalysis.score}</span>
                      </div>
                      <Badge className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-green-500 text-white">
                        {thumbnailAnalysis.clickPotential} CTR
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(thumbnailAnalysis.metrics).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <span className="font-medium">{value}%</span>
                        </div>
                        <Progress value={value} className="h-1.5" />
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-2">Suggestions</p>
                    <ul className="space-y-2">
                      {thumbnailAnalysis.suggestions.map((suggestion, i) => (
                        <li key={i} className="text-xs flex items-start gap-2">
                          <Sparkles className="h-3 w-3 text-foreground mt-0.5 shrink-0" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Best Posting Times */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="border-b border-border/50 pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-foreground" />
                    Best Posting Times
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {bestPostingTimes.map((day) => (
                      <div
                        key={day.day}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/30 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium">{day.day}</p>
                          <p className="text-xs text-muted-foreground">
                            {day.times.join(", ")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                            <div
                              className="h-full bg-foreground rounded-full"
                              style={{ width: `${day.engagement}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-8">
                            {day.engagement}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-schedule">Auto-Schedule</Label>
                        <p className="text-xs text-muted-foreground">Post at optimal times</p>
                      </div>
                      <Switch
                        id="auto-schedule"
                        checked={autoSchedule}
                        onCheckedChange={setAutoSchedule}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Engagement Prediction */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="border-b border-border/50 pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-foreground" />
                    Engagement Prediction
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-secondary/30 text-center">
                      <Heart className="h-5 w-5 text-red-400 mx-auto mb-1" />
                      <p className="text-lg font-bold">2.4K</p>
                      <p className="text-xs text-muted-foreground">Est. Likes</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/30 text-center">
                      <MessageCircle className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                      <p className="text-lg font-bold">156</p>
                      <p className="text-xs text-muted-foreground">Est. Comments</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/30 text-center">
                      <Share2 className="h-5 w-5 text-green-400 mx-auto mb-1" />
                      <p className="text-lg font-bold">89</p>
                      <p className="text-xs text-muted-foreground">Est. Shares</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/30 text-center">
                      <Bookmark className="h-5 w-5 text-foreground mx-auto mb-1" />
                      <p className="text-lg font-bold">342</p>
                      <p className="text-xs text-muted-foreground">Est. Saves</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    Based on your account analytics and content type
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
