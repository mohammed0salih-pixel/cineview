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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  FolderOpen,
  ListChecks,
  Layout,
  Palette,
  Calendar,
  Users,
  MoreVertical,
  Search,
  Filter,
  Grid3X3,
  List,
  Clock,
  ImageIcon,
  Play,
  Trash2,
  Edit3,
  Copy,
  Share2,
  Download,
  ArrowRight,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const projects = [
  {
    id: 1,
    name: "Saudi Tourism Campaign",
    client: "Ministry of Tourism",
    status: "in-progress",
    progress: 65,
    dueDate: "2026-02-15",
    team: [
      { name: "Ahmed", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Sara", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Omar", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    shotCount: 24,
    completedShots: 16,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    name: "AlUla Documentary",
    client: "Royal Commission for AlUla",
    status: "planning",
    progress: 25,
    dueDate: "2026-03-20",
    team: [
      { name: "Fatima", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Khalid", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    shotCount: 48,
    completedShots: 12,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    name: "Coffee Brand Launch",
    client: "Qahwa Co.",
    status: "completed",
    progress: 100,
    dueDate: "2026-01-10",
    team: [
      { name: "Noura", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    shotCount: 12,
    completedShots: 12,
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
];

const shotList = [
  {
    id: 1,
    scene: "Opening",
    shot: "Wide Establishing",
    description: "Aerial shot of Riyadh skyline at golden hour",
    duration: "8s",
    status: "completed",
    equipment: ["DJI Inspire 3", "ND Filters"],
    location: "Kingdom Tower Area",
    timeOfDay: "golden",
  },
  {
    id: 2,
    scene: "Opening",
    shot: "Close-up",
    description: "Traditional coffee being poured",
    duration: "4s",
    status: "completed",
    equipment: ["Sony A7S III", "90mm Macro"],
    location: "Studio",
    timeOfDay: "any",
  },
  {
    id: 3,
    scene: "Act 1",
    shot: "Medium",
    description: "Artisan at work in traditional souq",
    duration: "6s",
    status: "in-progress",
    equipment: ["Sony FX6", "35mm f/1.4"],
    location: "Souq Al-Zal",
    timeOfDay: "morning",
  },
  {
    id: 4,
    scene: "Act 1",
    shot: "Tracking",
    description: "Follow subject through narrow alley",
    duration: "10s",
    status: "pending",
    equipment: ["Gimbal", "Sony A7S III", "24mm f/1.4"],
    location: "Old Diriyah",
    timeOfDay: "afternoon",
  },
  {
    id: 5,
    scene: "Act 2",
    shot: "Time-lapse",
    description: "Day to night transition over desert",
    duration: "12s",
    status: "pending",
    equipment: ["Sony A1", "16-35mm", "Intervalometer"],
    location: "Empty Quarter",
    timeOfDay: "sunset",
  },
];

const moodboardItems = [
  { id: 1, type: "image", src: "/placeholder.svg?height=300&width=400", label: "Color Reference" },
  { id: 2, type: "image", src: "/placeholder.svg?height=200&width=300", label: "Lighting Style" },
  { id: 3, type: "color", color: "#d4af37", label: "Primary Gold" },
  { id: 4, type: "color", color: "#1a1a2e", label: "Deep Navy" },
  { id: 5, type: "image", src: "/placeholder.svg?height=250&width=350", label: "Composition" },
  { id: 6, type: "image", src: "/placeholder.svg?height=300&width=200", label: "Texture" },
  { id: 7, type: "color", color: "#e8d5b7", label: "Sand Tone" },
  { id: 8, type: "image", src: "/placeholder.svg?height=200&width=400", label: "Mood Reference" },
];

const storyboardFrames = [
  { id: 1, frame: 1, image: "/placeholder.svg?height=180&width=320", notes: "Fade in from black", audio: "Ambient desert wind" },
  { id: 2, frame: 2, image: "/placeholder.svg?height=180&width=320", notes: "Pan left to reveal city", audio: "Traditional oud begins" },
  { id: 3, frame: 3, image: "/placeholder.svg?height=180&width=320", notes: "Cut to close-up", audio: "Music builds" },
  { id: 4, frame: 4, image: "/placeholder.svg?height=180&width=320", notes: "Tracking shot follows subject", audio: "Voiceover begins" },
  { id: 5, frame: 5, image: "/placeholder.svg?height=180&width=320", notes: "Wide shot of landscape", audio: "Music crescendo" },
  { id: 6, frame: 6, image: "/placeholder.svg?height=180&width=320", notes: "Fade to logo", audio: "Tag line" },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <ImageIcon className="h-4 w-4 text-green-500" />;
    case "in-progress":
      return <ImageIcon className="h-4 w-4 text-foreground" />;
    default:
      return <ImageIcon className="h-4 w-4 text-muted-foreground" />;
  }
};

const getTimeIcon = (time: string) => {
  switch (time) {
    case "morning":
      return <ImageIcon className="h-4 w-4 text-yellow-500" />;
    case "afternoon":
      return <ImageIcon className="h-4 w-4 text-orange-400" />;
    case "golden":
    case "sunset":
      return <ImageIcon className="h-4 w-4 text-orange-500" />;
    case "night":
      return <ImageIcon className="h-4 w-4 text-blue-400" />;
    default:
      return <ImageIcon className="h-4 w-4 text-muted-foreground" />;
  }
};

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedProject, setSelectedProject] = useState(projects[0]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          {/* Page Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-foreground/5 px-4 py-1.5 mb-4">
                <FolderOpen className="h-3.5 w-3.5 text-foreground" />
                <span className="text-xs font-medium text-foreground uppercase tracking-wider">Project Hub</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Project <span className="text-foreground">Management</span>
              </h1>
              <p className="mt-2 text-muted-foreground">
                Organize shoots, create shot lists, and collaborate with your team
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-foreground text-foreground-foreground hover:bg-foreground/90 ">
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border/50">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="text-sm font-medium">Project Name</label>
                    <Input placeholder="Enter project name" className="mt-1 bg-secondary/30 border-border/50" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Client</label>
                    <Input placeholder="Client name" className="mt-1 bg-secondary/30 border-border/50" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea placeholder="Project description" className="mt-1 bg-secondary/30 border-border/50" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Start Date</label>
                      <Input type="date" className="mt-1 bg-secondary/30 border-border/50" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Due Date</label>
                      <Input type="date" className="mt-1 bg-secondary/30 border-border/50" />
                    </div>
                  </div>
                  <Button className="w-full bg-foreground text-foreground-foreground hover:bg-foreground/90">
                    Create Project
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <ImageIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search projects..." className="pl-9 bg-secondary/30 border-border/50" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-border/50 bg-transparent">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <div className="flex rounded-lg border border-border/50 overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className={viewMode === "grid" ? "bg-foreground" : ""}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className={viewMode === "list" ? "bg-foreground" : ""}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-secondary/30 border border-border/50">
              <TabsTrigger value="overview" className="data-[state=active]:bg-foreground data-[state=active]:text-foreground-foreground text-card">
                Projects Overview
              </TabsTrigger>
              <TabsTrigger value="shotlist" className="data-[state=active]:bg-foreground data-[state=active]:text-foreground-foreground">
                Shot List
              </TabsTrigger>
              <TabsTrigger value="storyboard" className="data-[state=active]:bg-foreground data-[state=active]:text-foreground-foreground text-white">
                Storyboard
              </TabsTrigger>
              <TabsTrigger value="moodboard" className="data-[state=active]:bg-foreground data-[state=active]:text-foreground-foreground">
                Mood Board
              </TabsTrigger>
            </TabsList>

            {/* Projects Overview */}
            <TabsContent value="overview" className="space-y-6">
              <div className={viewMode === "grid" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className={`border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all cursor-pointer ${
                      viewMode === "list" ? "flex" : ""
                    }`}
                    onClick={() => setSelectedProject(project)}
                  >
                    {viewMode === "grid" ? (
                      <>
                        <div className="relative aspect-video bg-secondary/30 overflow-hidden rounded-t-lg">
                          <Image
                            src={project.thumbnail || "/placeholder.svg"}
                            alt={project.name}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover"
                          />
                          <Badge
                            className={`absolute top-2 right-2 ${
                              project.status === "completed"
                                ? "bg-green-500/90"
                                : project.status === "in-progress"
                                ? "bg-foreground/90"
                                : "bg-secondary/90"
                            }`}
                          >
                            {project.status.replace("-", " ")}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold">{project.name}</h3>
                              <p className="text-sm text-muted-foreground">{project.client}</p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-popover border-border/50">
                                <DropdownMenuItem><Edit3 className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                <DropdownMenuItem><Copy className="mr-2 h-4 w-4" /> Duplicate</DropdownMenuItem>
                                <DropdownMenuItem><Share2 className="mr-2 h-4 w-4" /> Share</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <Progress value={project.progress} className="h-1.5 flex-1" />
                            <span className="text-xs text-muted-foreground">{project.progress}%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                              <span>{project.completedShots}/{project.shotCount} shots</span>
                            </div>
                            <div className="flex -space-x-2">
                              {project.team.slice(0, 3).map((member, i) => (
                                <Avatar key={i} className="h-6 w-6 border-2 border-card">
                                  <AvatarImage src={member.avatar || "/placeholder.svg"} />
                                  <AvatarFallback className="text-xs">{member.name[0]}</AvatarFallback>
                                </Avatar>
                              ))}
                              {project.team.length > 3 && (
                                <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-xs border-2 border-card">
                                  +{project.team.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Due: {new Date(project.dueDate).toLocaleDateString()}
                          </div>
                        </CardContent>
                      </>
                    ) : (
                      <CardContent className="p-4 flex items-center gap-4 w-full">
                        <div className="relative w-24 h-16 rounded bg-secondary/30 overflow-hidden shrink-0">
                          <Image
                            src={project.thumbnail || "/placeholder.svg"}
                            alt=""
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold truncate">{project.name}</h3>
                            <Badge variant="secondary" className={
                              project.status === "completed"
                                ? "bg-green-500/20 text-green-400"
                                : project.status === "in-progress"
                                ? "bg-foreground/20 text-foreground"
                                : "bg-secondary"
                            }>
                              {project.status.replace("-", " ")}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{project.client}</p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-sm font-medium">{project.completedShots}/{project.shotCount}</p>
                            <p className="text-xs text-muted-foreground">Shots</p>
                          </div>
                          <div className="w-24">
                            <Progress value={project.progress} className="h-1.5" />
                          </div>
                          <div className="flex -space-x-2">
                            {project.team.slice(0, 2).map((member, i) => (
                              <Avatar key={i} className="h-8 w-8 border-2 border-card">
                                <AvatarImage src={member.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{member.name[0]}</AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          <Button variant="ghost" size="icon">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Shot List */}
            <TabsContent value="shotlist" className="space-y-6">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <ListChecks className="h-5 w-5 text-foreground" />
                        Shot List - {selectedProject.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {shotList.filter(s => s.status === "completed").length} of {shotList.length} shots completed
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="border-border/50 bg-transparent">
                        <Download className="mr-2 h-4 w-4" />
                        Export PDF
                      </Button>
                      <Button className="bg-foreground text-foreground-foreground hover:bg-foreground/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Shot
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border/50">
                    {shotList.map((shot) => (
                      <div
                        key={shot.id}
                        className="p-4 hover:bg-secondary/20 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <Checkbox
                            checked={shot.status === "completed"}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="border-border/50 text-xs">
                                {shot.scene}
                              </Badge>
                              <span className="font-medium">{shot.shot}</span>
                              {getStatusIcon(shot.status)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{shot.description}</p>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {shot.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <ImageIcon className="h-3 w-3" />
                                {shot.location}
                              </span>
                              <span className="flex items-center gap-1">
                                {getTimeIcon(shot.timeOfDay)}
                                {shot.timeOfDay}
                              </span>
                              <span className="flex items-center gap-1">
                                <ImageIcon className="h-3 w-3" />
                                {shot.equipment.join(", ")}
                              </span>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover border-border/50">
                              <DropdownMenuItem><Edit3 className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                              <DropdownMenuItem><Copy className="mr-2 h-4 w-4" /> Duplicate</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Storyboard */}
            <TabsContent value="storyboard" className="space-y-6">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Layout className="h-5 w-5 text-foreground" />
                      Storyboard - {selectedProject.name}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" className="border-border/50 bg-transparent">
                        <Play className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                      <Button className="bg-foreground text-foreground-foreground hover:bg-foreground/90 text-card">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Frame
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {storyboardFrames.map((frame) => (
                      <div
                        key={frame.id}
                        className="group relative rounded-lg border border-border/50 overflow-hidden hover:border-primary/30 transition-colors"
                      >
                        <div className="aspect-video bg-secondary/30 relative">
                          <Image
                            src={frame.image || "/placeholder.svg"}
                            alt={`Frame ${frame.frame}`}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm rounded px-2 py-0.5 text-xs font-medium">
                            Frame {frame.frame}
                          </div>
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button size="icon" variant="secondary" className="h-8 w-8">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="secondary" className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="p-3 space-y-2">
                          <p className="text-sm font-medium">{frame.notes}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <ImageIcon className="h-3 w-3" />
                            {frame.audio}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div
                      className="aspect-video rounded-lg border-2 border-dashed border-border/50 flex items-center justify-center hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <div className="text-center">
                        <Plus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Add Frame</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Mood Board */}
            <TabsContent value="moodboard" className="space-y-6">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Palette className="h-5 w-5 text-foreground" />
                      Mood Board - {selectedProject.name}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" className="border-border/50 bg-transparent">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share with Client
                      </Button>
                      <Button className="bg-foreground text-foreground-foreground hover:bg-foreground/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Reference
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[150px]">
                    {moodboardItems.map((item, i) => (
                      <div
                        key={item.id}
                        className={`group relative rounded-lg overflow-hidden border border-border/50 hover:border-primary/30 transition-all cursor-pointer ${
                          i === 0 ? "col-span-2 row-span-2" : i === 4 ? "col-span-2" : ""
                        }`}
                      >
                        {item.type === "image" ? (
                          <Image
                            src={item.src || "/placeholder.svg"}
                            alt={item.label}
                            fill
                            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                            className="object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full"
                            style={{ backgroundColor: item.color }}
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <p className="text-sm text-white font-medium">{item.label}</p>
                            {item.type === "color" && (
                              <p className="text-xs text-white/70">{item.color}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div
                      className="rounded-lg border-2 border-dashed border-border/50 flex items-center justify-center hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <div className="text-center p-4">
                        <Plus className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">Add Reference</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
