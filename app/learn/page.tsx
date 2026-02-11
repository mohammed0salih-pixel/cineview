"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  GraduationCap,
  Play,
  Clock,
  Star,
  Users,
  BookOpen,
  Trophy,
  Target,
  TrendingUp,
  Search,
  Filter,
  ChevronRight,
  Lock,
  CheckCircle2,
  Camera,
  Video,
  Palette,
  Sun,
  Aperture,
  Sparkles,
  Award,
  Flame,
  Zap,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const courses = [
  {
    id: 1,
    title: "Cinematic Color Grading Masterclass",
    instructor: "Ahmed Al-Rashid",
    instructorAvatar: "/placeholder.svg?height=40&width=40",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "4h 30m",
    lessons: 24,
    level: "Advanced",
    rating: 4.9,
    students: 2847,
    progress: 65,
    tags: ["Color Grading", "DaVinci Resolve", "Film Look"],
    featured: true,
  },
  {
    id: 2,
    title: "Lighting for Cinematic Portraits",
    instructor: "Sara Al-Fahad",
    instructorAvatar: "/placeholder.svg?height=40&width=40",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "3h 15m",
    lessons: 18,
    level: "Intermediate",
    rating: 4.8,
    students: 1932,
    progress: 100,
    tags: ["Lighting", "Portraits", "Natural Light"],
    featured: true,
  },
  {
    id: 3,
    title: "Composition Rules in Photography",
    instructor: "Omar Hassan",
    instructorAvatar: "/placeholder.svg?height=40&width=40",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "2h 45m",
    lessons: 15,
    level: "Beginner",
    rating: 4.7,
    students: 4521,
    progress: 0,
    tags: ["Composition", "Fundamentals", "Framing"],
    featured: false,
  },
  {
    id: 4,
    title: "Desert Landscape Videography",
    instructor: "Fatima Al-Saud",
    instructorAvatar: "/placeholder.svg?height=40&width=40",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "5h 20m",
    lessons: 32,
    level: "Intermediate",
    rating: 4.9,
    students: 1256,
    progress: 30,
    tags: ["Landscape", "Desert", "Saudi Arabia"],
    featured: false,
  },
  {
    id: 5,
    title: "Social Media Content Strategy",
    instructor: "Khalid Al-Mutairi",
    instructorAvatar: "/placeholder.svg?height=40&width=40",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "2h 10m",
    lessons: 12,
    level: "Beginner",
    rating: 4.6,
    students: 3845,
    progress: 0,
    tags: ["Social Media", "Marketing", "Content"],
    featured: false,
  },
];

const techniques = [
  {
    id: 1,
    title: "Golden Hour Techniques",
    category: "Lighting",
    icon: Sun,
    difficulty: "Intermediate",
    duration: "15 min read",
    preview: "/placeholder.svg?height=150&width=250",
  },
  {
    id: 2,
    title: "Rule of Thirds Mastery",
    category: "Composition",
    icon: Target,
    difficulty: "Beginner",
    duration: "10 min read",
    preview: "/placeholder.svg?height=150&width=250",
  },
  {
    id: 3,
    title: "Cinematic Aspect Ratios",
    category: "Framing",
    icon: Video,
    difficulty: "Intermediate",
    duration: "12 min read",
    preview: "/placeholder.svg?height=150&width=250",
  },
  {
    id: 4,
    title: "Color Theory for Film",
    category: "Color",
    icon: Palette,
    difficulty: "Advanced",
    duration: "20 min read",
    preview: "/placeholder.svg?height=150&width=250",
  },
  {
    id: 5,
    title: "Depth of Field Control",
    category: "Camera",
    icon: Aperture,
    difficulty: "Intermediate",
    duration: "15 min read",
    preview: "/placeholder.svg?height=150&width=250",
  },
  {
    id: 6,
    title: "Low Light Photography",
    category: "Lighting",
    icon: Camera,
    difficulty: "Advanced",
    duration: "18 min read",
    preview: "/placeholder.svg?height=150&width=250",
  },
];

const skillAssessment = {
  overallLevel: "Intermediate",
  totalXP: 2450,
  streak: 7,
  skills: [
    { name: "Composition", level: 75, maxLevel: 100 },
    { name: "Lighting", level: 60, maxLevel: 100 },
    { name: "Color Grading", level: 45, maxLevel: 100 },
    { name: "Camera Settings", level: 80, maxLevel: 100 },
    { name: "Post-Processing", level: 55, maxLevel: 100 },
    { name: "Storytelling", level: 40, maxLevel: 100 },
  ],
  achievements: [
    { name: "First Upload", icon: Trophy, unlocked: true },
    { name: "Color Master", icon: Palette, unlocked: true },
    { name: "7-Day Streak", icon: Flame, unlocked: true },
    { name: "Community Helper", icon: Users, unlocked: false },
    { name: "Pro Analyzer", icon: BarChart3, unlocked: false },
  ],
};

const beforeAfter = [
  {
    id: 1,
    title: "Desert Sunset Enhancement",
    before: "/placeholder.svg?height=200&width=350",
    after: "/placeholder.svg?height=200&width=350",
    technique: "Color Grading",
    views: 1243,
  },
  {
    id: 2,
    title: "Portrait Retouching",
    before: "/placeholder.svg?height=200&width=350",
    after: "/placeholder.svg?height=200&width=350",
    technique: "Skin Tones",
    views: 892,
  },
  {
    id: 3,
    title: "Cinematic Look Creation",
    before: "/placeholder.svg?height=200&width=350",
    after: "/placeholder.svg?height=200&width=350",
    technique: "Film Emulation",
    views: 2156,
  },
];

export default function LearnPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sliderPosition, setSliderPosition] = useState<Record<number, number>>({});

  const handleSliderChange = (id: number, value: number) => {
    setSliderPosition(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 mb-4">
              <GraduationCap className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">Learning Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Learn & <span className="text-gradient-gold">Grow</span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              Master cinematic techniques with expert-led courses and tutorials
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{skillAssessment.totalXP}</p>
                  <p className="text-xs text-muted-foreground">Total XP</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <Flame className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{skillAssessment.streak}</p>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <BookOpen className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-muted-foreground">Courses Active</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Award className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{skillAssessment.overallLevel}</p>
                  <p className="text-xs text-muted-foreground">Current Level</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="courses" className="space-y-6">
            <TabsList className="bg-secondary/30 border border-border/50">
              <TabsTrigger value="courses" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Courses
              </TabsTrigger>
              <TabsTrigger value="techniques" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Technique Guides
              </TabsTrigger>
              <TabsTrigger value="beforeafter" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Before/After
              </TabsTrigger>
              <TabsTrigger value="skills" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Skill Assessment
              </TabsTrigger>
            </TabsList>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-6">
              {/* Search */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search courses..." className="pl-9 bg-secondary/30 border-border/50" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-border/50 bg-transparent">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>

              {/* Featured Courses */}
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Featured Courses
                </h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {courses.filter(c => c.featured).map((course) => (
                    <Card key={course.id} className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden hover:border-primary/30 transition-all group">
                      <div className="relative aspect-video bg-secondary/30">
                        <Image
                          src={course.thumbnail || "/placeholder.svg"}
                          alt={course.title}
                          fill
                          sizes="(min-width: 640px) 50vw, 100vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="lg" className="bg-primary text-primary-foreground glow-gold">
                            <Play className="mr-2 h-5 w-5" />
                            Continue Learning
                          </Button>
                        </div>
                        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">Featured</Badge>
                        {course.progress > 0 && course.progress < 100 && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                            <div className="h-full bg-primary" style={{ width: `${course.progress}%` }} />
                          </div>
                        )}
                        {course.progress === 100 && (
                          <Badge className="absolute top-3 right-3 bg-green-500">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Completed
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold line-clamp-1">{course.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={course.instructorAvatar || "/placeholder.svg"} />
                                <AvatarFallback>{course.instructor[0]}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-muted-foreground">{course.instructor}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className="border-border/50">{course.level}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {course.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3.5 w-3.5" />
                            {course.lessons} lessons
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                            {course.rating}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {course.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="bg-secondary/50 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* All Courses */}
              <div>
                <h2 className="text-xl font-semibold mb-4">All Courses</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {courses.filter(c => !c.featured).map((course) => (
                    <Card key={course.id} className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden hover:border-primary/30 transition-all group">
                      <div className="relative aspect-video bg-secondary/30">
                        <Image
                          src={course.thumbnail || "/placeholder.svg"}
                          alt={course.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button className="bg-primary text-primary-foreground">
                            <Play className="mr-2 h-4 w-4" />
                            {course.progress > 0 ? "Continue" : "Start"}
                          </Button>
                        </div>
                        {course.progress > 0 && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                            <div className="h-full bg-primary" style={{ width: `${course.progress}%` }} />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold line-clamp-1 mb-1">{course.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{course.instructor}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {course.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-primary text-primary" />
                            {course.rating}
                          </span>
                          <Badge variant="outline" className="border-border/50 text-xs">{course.level}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Techniques Tab */}
            <TabsContent value="techniques" className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {techniques.map((tech) => {
                  const Icon = tech.icon;
                  return (
                    <Card key={tech.id} className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all cursor-pointer group">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-primary/10 shrink-0">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{tech.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <Badge variant="secondary" className="bg-secondary/50 text-xs">{tech.category}</Badge>
                              <span>{tech.duration}</span>
                            </div>
                            <Badge variant="outline" className={`text-xs border-border/50 ${
                              tech.difficulty === "Beginner" ? "text-green-400 border-green-400/30" :
                              tech.difficulty === "Intermediate" ? "text-primary border-primary/30" :
                              "text-red-400 border-red-400/30"
                            }`}>
                              {tech.difficulty}
                            </Badge>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Before/After Tab */}
            <TabsContent value="beforeafter" className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {beforeAfter.map((item) => (
                  <Card key={item.id} className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                    <div className="relative aspect-video overflow-hidden">
                      <div className="absolute inset-0 relative">
                        <Image
                          src={item.after || "/placeholder.svg"}
                          alt="After"
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                      <div
                        className="absolute inset-0 overflow-hidden relative"
                        style={{ width: `${sliderPosition[item.id] || 50}%` }}
                      >
                        <Image
                          src={item.before || "/placeholder.svg"}
                          alt="Before"
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover"
                          style={{ width: `${100 / ((sliderPosition[item.id] || 50) / 100)}%` }}
                        />
                      </div>
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
                        style={{ left: `${sliderPosition[item.id] || 50}%` }}
                      >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                          <ArrowRight className="h-4 w-4 text-background -rotate-180" />
                          <ArrowRight className="h-4 w-4 text-background" />
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderPosition[item.id] || 50}
                        onChange={(e) => handleSliderChange(item.id, Number(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                      />
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">Before</div>
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">After</div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <Badge variant="secondary" className="bg-secondary/50">{item.technique}</Badge>
                        <span>{item.views.toLocaleString()} views</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="border-b border-border/50">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        Skill Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      {skillAssessment.skills.map((skill) => (
                        <div key={skill.name}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-sm text-muted-foreground">{skill.level}%</span>
                          </div>
                          <Progress value={skill.level} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="border-b border-border/50">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        Recommended Next Steps
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Palette className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Improve Color Grading</p>
                            <p className="text-sm text-muted-foreground">Take the advanced color grading course</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Video className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Practice Storytelling</p>
                            <p className="text-sm text-muted-foreground">Complete 3 narrative exercises</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Sun className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Master Lighting</p>
                            <p className="text-sm text-muted-foreground">Practice with 5 lighting setups</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="border-b border-border/50">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-5 gap-2">
                        {skillAssessment.achievements.map((achievement, i) => {
                          const Icon = achievement.icon;
                          return (
                            <div
                              key={i}
                              className={`aspect-square rounded-lg flex items-center justify-center relative ${
                                achievement.unlocked
                                  ? "bg-primary/10 text-primary"
                                  : "bg-secondary/30 text-muted-foreground"
                              }`}
                              title={achievement.name}
                            >
                              <Icon className="h-6 w-6" />
                              {!achievement.unlocked && (
                                <Lock className="h-3 w-3 absolute bottom-1 right-1" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground text-center mt-3">
                        {skillAssessment.achievements.filter(a => a.unlocked).length} of {skillAssessment.achievements.length} unlocked
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="border-b border-border/50">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Weekly Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="h-32 flex items-end justify-between gap-1">
                        {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-primary/20 rounded-t hover:bg-primary/40 transition-colors cursor-pointer relative group"
                            style={{ height: `${height}%` }}
                          >
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {height} XP
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
