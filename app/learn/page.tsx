"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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
    difficulty: "Intermediate",
    duration: "15 min read",
    preview: "/placeholder.svg?height=150&width=250",
  },
  {
    id: 2,
    title: "Rule of Thirds Mastery",
    category: "Composition",
    difficulty: "Beginner",
    duration: "10 min read",
    preview: "/placeholder.svg?height=150&width=250",
  },
  {
    id: 3,
    title: "Cinematic Aspect Ratios",
    category: "Framing",
    difficulty: "Intermediate",
    duration: "12 min read",
    preview: "/placeholder.svg?height=150&width=250",
  },
  {
    id: 4,
    title: "Color Theory for Film",
    category: "Color",
    difficulty: "Advanced",
    duration: "20 min read",
    preview: "/placeholder.svg?height=150&width=250",
  },
  {
    id: 5,
    title: "Depth of Field Control",
    category: "Camera",
    difficulty: "Intermediate",
    duration: "15 min read",
    preview: "/placeholder.svg?height=150&width=250",
  },
  {
    id: 6,
    title: "Low Light Photography",
    category: "Lighting",
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
    { name: "First Upload", unlocked: true },
    { name: "Color Master", unlocked: true },
    { name: "7-Day Streak", unlocked: true },
    { name: "Community Helper", unlocked: false },
    { name: "Pro Analyzer", unlocked: false },
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
            <div className="text-xs font-medium text-foreground/60 uppercase tracking-wider mb-4">
              Learning Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground font-display">
              Learn & <span className="text-foreground">Grow</span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              Master cinematic techniques with expert-led courses and tutorials
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap gap-8 mb-8 text-sm text-muted-foreground">
            <div>
              <p className="text-2xl font-semibold text-foreground">{skillAssessment.totalXP}</p>
              <p className="text-xs">Total XP</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">{skillAssessment.streak}</p>
              <p className="text-xs">Day Streak</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">3</p>
              <p className="text-xs">Courses Active</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">{skillAssessment.overallLevel}</p>
              <p className="text-xs">Current Level</p>
            </div>
          </div>

          <Tabs defaultValue="courses" className="space-y-6">
            <TabsList className="bg-transparent p-0">
              <TabsTrigger value="courses" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground data-[state=active]:text-foreground">
                Courses
              </TabsTrigger>
              <TabsTrigger value="techniques" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground data-[state=active]:text-foreground">
                Technique Guides
              </TabsTrigger>
              <TabsTrigger value="beforeafter" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground data-[state=active]:text-foreground">
                Before/After
              </TabsTrigger>
              <TabsTrigger value="skills" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground data-[state=active]:text-foreground">
                Skill Assessment
              </TabsTrigger>
            </TabsList>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-6">
              {/* Search */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                  <Input placeholder="Search courses..." className="pl-4 bg-transparent border-border/50" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="bg-transparent text-foreground/70">
                    Filter
                  </Button>
                </div>
              </div>

              {/* Featured Courses */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Featured Courses</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {courses.filter(c => c.featured).map((course) => (
                    <Card key={course.id} className="bg-transparent">
                      <div className="relative aspect-video rounded-3xl bg-gradient-to-br from-white/10 via-black/30 to-black/70" />
                      <CardContent className="p-0 pt-4 space-y-2">
                        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                          Featured {course.progress === 100 ? "· Completed" : ""}
                        </div>
                        <h3 className="font-semibold line-clamp-1">{course.title}</h3>
                        <p className="text-sm text-muted-foreground">{course.instructor}</p>
                        <p className="text-xs text-muted-foreground">
                          {course.duration} · {course.lessons} lessons · {course.rating} · {course.level}
                        </p>
                        <p className="text-xs text-muted-foreground">{course.tags.join(" · ")}</p>
                        {course.progress > 0 && (
                          <p className="text-xs text-muted-foreground">Progress {course.progress}%</p>
                        )}
                        <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                          Continue Learning
                        </Button>
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
                    <Card key={course.id} className="bg-transparent">
                      <div className="relative aspect-video rounded-3xl bg-gradient-to-br from-white/10 via-black/30 to-black/70" />
                      <CardContent className="p-0 pt-4 space-y-2">
                        <h3 className="font-semibold line-clamp-1">{course.title}</h3>
                        <p className="text-sm text-muted-foreground">{course.instructor}</p>
                        <p className="text-xs text-muted-foreground">
                          {course.duration} · {course.rating} · {course.level}
                        </p>
                        {course.progress > 0 && (
                          <p className="text-xs text-muted-foreground">Progress {course.progress}%</p>
                        )}
                        <Button className="bg-foreground text-background hover:bg-foreground/90">
                          {course.progress > 0 ? "Continue" : "Start"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Techniques Tab */}
            <TabsContent value="techniques" className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {techniques.map((tech) => (
                  <Card key={tech.id} className="bg-transparent cursor-pointer">
                    <CardContent className="p-0 space-y-2">
                      <h3 className="font-semibold">{tech.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {tech.category} · {tech.duration} · {tech.difficulty}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Before/After Tab */}
            <TabsContent value="beforeafter" className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {beforeAfter.map((item) => (
                  <Card key={item.id} className="bg-transparent overflow-hidden">
                    <div className="relative aspect-video overflow-hidden">
                      <div className="absolute inset-0">
                        <div className="w-full h-full bg-gradient-to-br from-white/10 via-black/30 to-black/70" />
                      </div>
                      <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ width: `${sliderPosition[item.id] || 50}%` }}
                      >
                        <div className="w-full h-full bg-gradient-to-br from-white/15 via-black/20 to-black/80" style={{ width: `${100 / ((sliderPosition[item.id] || 50) / 100)}%` }} />
                      </div>
                      <div
                        className="absolute top-0 bottom-0 w-px bg-white/60 cursor-ew-resize"
                        style={{ left: `${sliderPosition[item.id] || 50}%` }}
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderPosition[item.id] || 50}
                        onChange={(e) => handleSliderChange(item.id, Number(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                      />
                      <div className="absolute top-2 left-2 text-white/70 text-xs uppercase tracking-[0.3em]">Before</div>
                      <div className="absolute top-2 right-2 text-white/70 text-xs uppercase tracking-[0.3em]">After</div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{item.technique}</span>
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
                  <Card className="bg-transparent">
                    <CardHeader className="">
                      <CardTitle className="text-lg font-semibold">
                        Skill Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-4">
                      {skillAssessment.skills.map((skill) => (
                        <div key={skill.name}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-sm text-muted-foreground">{skill.level}%</span>
                          </div>
                          <div className="text-xs text-muted-foreground">Level {skill.level}%</div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="bg-transparent">
                    <CardHeader className="">
                      <CardTitle className="text-lg font-semibold">
                        Recommended Next Steps
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 py-2 cursor-pointer">
                          <div className="flex-1">
                            <p className="font-medium">Improve Color Grading</p>
                            <p className="text-sm text-muted-foreground">Take the advanced color grading course</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 py-2 cursor-pointer">
                          <div className="flex-1">
                            <p className="font-medium">Practice Storytelling</p>
                            <p className="text-sm text-muted-foreground">Complete 3 narrative exercises</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 py-2 cursor-pointer">
                          <div className="flex-1">
                            <p className="font-medium">Master Lighting</p>
                            <p className="text-sm text-muted-foreground">Practice with 5 lighting setups</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="bg-transparent">
                    <CardHeader className="">
                      <CardTitle className="text-lg font-semibold">
                        Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-2 text-sm text-muted-foreground">
                        {skillAssessment.achievements.map((achievement, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-foreground">{achievement.name}</span>
                            <span>{achievement.unlocked ? "Unlocked" : "Locked"}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        {skillAssessment.achievements.filter(a => a.unlocked).length} of {skillAssessment.achievements.length} unlocked
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-transparent">
                    <CardHeader className="">
                      <CardTitle className="text-lg font-semibold">
                        Weekly Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-2 text-sm text-muted-foreground">
                        {[
                          { day: "Mon", xp: 40 },
                          { day: "Tue", xp: 65 },
                          { day: "Wed", xp: 45 },
                          { day: "Thu", xp: 80 },
                          { day: "Fri", xp: 55 },
                          { day: "Sat", xp: 90 },
                          { day: "Sun", xp: 70 },
                        ].map((entry) => (
                          <div key={entry.day} className="flex items-center justify-between">
                            <span className="text-foreground">{entry.day}</span>
                            <span>{entry.xp} XP</span>
                          </div>
                        ))}
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
