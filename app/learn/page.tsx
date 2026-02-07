"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
            <div className="text-xs font-medium text-white/50 uppercase tracking-wider mb-4">
              Learning Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white font-display">
              Learn & <span className="text-white">Grow</span>
            </h1>
            <p className="mt-2 text-white/60">
              Master cinematic techniques with expert-led courses and tutorials
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap gap-8 mb-8 text-sm text-white/60">
            <div>
              <p className="text-2xl font-semibold text-white">{skillAssessment.totalXP}</p>
              <p className="text-xs text-white/50">Total XP</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">{skillAssessment.streak}</p>
              <p className="text-xs text-white/50">Day Streak</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">3</p>
              <p className="text-xs text-white/50">Courses Active</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">{skillAssessment.overallLevel}</p>
              <p className="text-xs text-white/50">Current Level</p>
            </div>
          </div>

          <Tabs defaultValue="courses" className="space-y-6">
            <TabsList className="bg-transparent p-0">
              <TabsTrigger value="courses" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white">
                Courses
              </TabsTrigger>
              <TabsTrigger value="techniques" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white">
                Technique Guides
              </TabsTrigger>
              <TabsTrigger value="beforeafter" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white">
                Before/After
              </TabsTrigger>
              <TabsTrigger value="skills" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white">
                Skill Assessment
              </TabsTrigger>
            </TabsList>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-6">
              {/* Search */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                  <Input
                    placeholder="Search courses..."
                    className="pl-0 bg-transparent border-0 text-white/80 placeholder:text-white/40"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="bg-transparent text-white/70">
                    Filter
                  </Button>
                </div>
              </div>

              {/* Featured Courses */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-white">Featured Courses</h2>
                <div className="space-y-6">
                  {courses.filter(c => c.featured).map((course) => (
                    <div key={course.id} className="space-y-3">
                      <div className="relative aspect-video rounded-3xl bg-gradient-to-br from-white/10 via-black/30 to-black/70" />
                      <div className="space-y-2">
                        <div className="text-xs uppercase tracking-[0.3em] text-white/50">
                          Featured {course.progress === 100 ? "· Completed" : ""}
                        </div>
                        <h3 className="font-semibold text-white line-clamp-1">{course.title}</h3>
                        <p className="text-sm text-white/60">{course.instructor}</p>
                        <p className="text-xs text-white/50">
                          {course.duration} · {course.lessons} lessons · {course.rating} · {course.level}
                        </p>
                        <p className="text-xs text-white/50">{course.tags.join(" · ")}</p>
                        {course.progress > 0 && (
                          <p className="text-xs text-white/50">Progress {course.progress}%</p>
                        )}
                        <Button size="lg" className="bg-white text-black hover:bg-white/80">
                          Continue Learning
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* All Courses */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-white">All Courses</h2>
                <div className="space-y-6">
                  {courses.filter(c => !c.featured).map((course) => (
                    <div key={course.id} className="space-y-3">
                      <div className="relative aspect-video rounded-3xl bg-gradient-to-br from-white/10 via-black/30 to-black/70" />
                      <div className="space-y-2">
                        <h3 className="font-semibold text-white line-clamp-1">{course.title}</h3>
                        <p className="text-sm text-white/60">{course.instructor}</p>
                        <p className="text-xs text-white/50">
                          {course.duration} · {course.rating} · {course.level}
                        </p>
                        {course.progress > 0 && (
                          <p className="text-xs text-white/50">Progress {course.progress}%</p>
                        )}
                        <Button className="bg-white text-black hover:bg-white/80">
                          {course.progress > 0 ? "Continue" : "Start"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Techniques Tab */}
            <TabsContent value="techniques" className="space-y-6">
              <div className="space-y-4">
                {techniques.map((tech) => (
                  <div key={tech.id} className="space-y-2 cursor-pointer">
                      <h3 className="font-semibold text-white">{tech.title}</h3>
                      <p className="text-xs text-white/50">
                        {tech.category} · {tech.duration} · {tech.difficulty}
                      </p>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Before/After Tab */}
            <TabsContent value="beforeafter" className="space-y-6">
              <div className="space-y-8">
                {beforeAfter.map((item) => (
                  <div key={item.id} className="space-y-3">
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
                    <div className="space-y-1">
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <div className="flex items-center justify-between text-sm text-white/50">
                        <span>{item.technique}</span>
                        <span>{item.views.toLocaleString()} views</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-6">
              <div className="space-y-10">
                <section className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">Skill Breakdown</p>
                  <div className="space-y-3">
                    {skillAssessment.skills.map((skill) => (
                      <div key={skill.name} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white">{skill.name}</span>
                          <span className="text-sm text-white/50">{skill.level}%</span>
                        </div>
                        <div className="text-xs text-white/50">Level {skill.level}%</div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">Recommended Next Steps</p>
                  <div className="space-y-3">
                    <div className="space-y-1 cursor-pointer">
                      <p className="font-medium text-white">Improve Color Grading</p>
                      <p className="text-sm text-white/50">Take the advanced color grading course</p>
                    </div>
                    <div className="space-y-1 cursor-pointer">
                      <p className="font-medium text-white">Practice Storytelling</p>
                      <p className="text-sm text-white/50">Complete 3 narrative exercises</p>
                    </div>
                    <div className="space-y-1 cursor-pointer">
                      <p className="font-medium text-white">Master Lighting</p>
                      <p className="text-sm text-white/50">Practice with 5 lighting setups</p>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">Achievements</p>
                  <div className="space-y-2 text-sm text-white/60">
                    {skillAssessment.achievements.map((achievement, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-white">{achievement.name}</span>
                        <span>{achievement.unlocked ? "Unlocked" : "Locked"}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-white/50">
                    {skillAssessment.achievements.filter(a => a.unlocked).length} of {skillAssessment.achievements.length} unlocked
                  </p>
                </section>

                <section className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">Weekly Progress</p>
                  <div className="space-y-2 text-sm text-white/60">
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
                        <span className="text-white">{entry.day}</span>
                        <span>{entry.xp} XP</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
