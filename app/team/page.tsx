"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const teamMembers = [
  { id: 1, name: "Ahmed Al-Rashid", role: "Project Lead", avatar: "/placeholder.svg?height=40&width=40", status: "online", email: "ahmed@cineview.ai" },
  { id: 2, name: "Sara Al-Fahad", role: "Cinematographer", avatar: "/placeholder.svg?height=40&width=40", status: "online", email: "sara@cineview.ai" },
  { id: 3, name: "Omar Hassan", role: "Editor", avatar: "/placeholder.svg?height=40&width=40", status: "away", email: "omar@cineview.ai" },
  { id: 4, name: "Fatima Al-Saud", role: "Color Grader", avatar: "/placeholder.svg?height=40&width=40", status: "offline", email: "fatima@cineview.ai" },
  { id: 5, name: "Khalid Al-Mutairi", role: "Sound Designer", avatar: "/placeholder.svg?height=40&width=40", status: "online", email: "khalid@cineview.ai" },
];

const messages = [
  {
    id: 1,
    user: teamMembers[0],
    content: "Just uploaded the new color grading analysis for the desert sequence. Check it out and let me know your thoughts!",
    timestamp: "10:30 AM",
    reactions: [{ emoji: "👍", count: 3 }, { emoji: "🔥", count: 2 }],
    attachments: [{ type: "image", name: "desert_grade_v2.jpg", size: "2.4 MB" }],
  },
  {
    id: 2,
    user: teamMembers[1],
    content: "Looks great! The golden tones really pop in this version. I think we should apply similar grading to shots 12-18.",
    timestamp: "10:45 AM",
    reactions: [{ emoji: "❤️", count: 1 }],
    attachments: [],
  },
  {
    id: 3,
    user: teamMembers[2],
    content: "I've finished the rough cut for scene 3. The pacing feels much better now. Ready for review.",
    timestamp: "11:15 AM",
    reactions: [],
    attachments: [{ type: "video", name: "scene3_roughcut_v1.mp4", size: "156 MB" }],
  },
  {
    id: 4,
    user: teamMembers[0],
    content: "@Sara can you capture some additional B-roll of the souq tomorrow morning? We need more coverage for the transition.",
    timestamp: "11:30 AM",
    reactions: [{ emoji: "👍", count: 1 }],
    attachments: [],
  },
  {
    id: 5,
    user: teamMembers[1],
    content: "Sure! I'll head there around 7 AM for the best light. Should I bring the gimbal setup?",
    timestamp: "11:32 AM",
    reactions: [],
    attachments: [],
  },
];

const approvalRequests = [
  {
    id: 1,
    title: "Final Color Grade - Desert Sequence",
    requester: teamMembers[3],
    status: "pending",
    submitted: "2 hours ago",
    thumbnail: "/placeholder.svg?height=100&width=160",
    approvers: [
      { user: teamMembers[0], status: "approved" },
      { user: teamMembers[1], status: "pending" },
    ],
  },
  {
    id: 2,
    title: "Scene 3 Edit - Client Review",
    requester: teamMembers[2],
    status: "pending",
    submitted: "4 hours ago",
    thumbnail: "/placeholder.svg?height=100&width=160",
    approvers: [
      { user: teamMembers[0], status: "approved" },
      { user: teamMembers[1], status: "approved" },
    ],
  },
  {
    id: 3,
    title: "Thumbnail Design - Episode 1",
    requester: teamMembers[1],
    status: "approved",
    submitted: "1 day ago",
    thumbnail: "/placeholder.svg?height=100&width=160",
    approvers: [
      { user: teamMembers[0], status: "approved" },
    ],
  },
];

const sharedFiles = [
  { id: 1, name: "Project_Brief_v2.pdf", type: "pdf", size: "2.4 MB", uploadedBy: teamMembers[0], uploadedAt: "Today", downloads: 12 },
  { id: 2, name: "Color_Palette_Final.png", type: "image", size: "856 KB", uploadedBy: teamMembers[3], uploadedAt: "Yesterday", downloads: 8 },
  { id: 3, name: "Shot_List_Updated.xlsx", type: "spreadsheet", size: "124 KB", uploadedBy: teamMembers[0], uploadedAt: "2 days ago", downloads: 15 },
  { id: 4, name: "Reference_Video.mp4", type: "video", size: "245 MB", uploadedBy: teamMembers[1], uploadedAt: "3 days ago", downloads: 6 },
  { id: 5, name: "Audio_Mix_v3.wav", type: "audio", size: "89 MB", uploadedBy: teamMembers[4], uploadedAt: "4 days ago", downloads: 4 },
];

const clientPortal = {
  client: { name: "Ministry of Tourism", logo: "/placeholder.svg?height=60&width=60" },
  project: "Saudi Tourism Campaign",
  sharedItems: 24,
  pendingFeedback: 3,
  lastActivity: "2 hours ago",
};

export default function TeamPage() {
  const [newMessage, setNewMessage] = useState("");
  const [activeChannel, setActiveChannel] = useState("general");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          {/* Page Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-medium text-foreground/60 uppercase tracking-wider mb-4">
                Team Hub
              </div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground font-display">
                Team <span className="text-foreground">Collaboration</span>
              </h1>
              <p className="mt-2 text-muted-foreground">
                Communicate, share files, and manage approvals with your team
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-transparent text-foreground/70">
                Notifications <span className="ml-2 text-xs uppercase tracking-[0.3em]">3</span>
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-foreground text-background hover:bg-foreground/90">
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0b0b0c] border-0 shadow-none">
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <label className="text-sm font-medium">Email Address</label>
                      <Input placeholder="colleague@email.com" className="mt-1 bg-transparent border-border/50" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Role</label>
                      <Input placeholder="e.g., Editor, Cinematographer" className="mt-1 bg-transparent border-border/50" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Personal Message (Optional)</label>
                      <Textarea placeholder="Add a welcome message..." className="mt-1 bg-transparent border-border/50" />
                    </div>
                    <Button className="w-full bg-foreground text-background hover:bg-foreground/90">
                      Send Invitation
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            {/* Sidebar - Team Members */}
            <div className="space-y-6">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="border-b border-border/50 pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center justify-between">
                    Team Members
                    <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{teamMembers.length}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="space-y-1">
                    {teamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{member.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Client Portal Card */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="border-b border-border/50 pb-3">
                  <CardTitle className="text-sm font-semibold">
                    Client Portal
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="mb-4">
                    <p className="font-medium text-sm">{clientPortal.client.name}</p>
                    <p className="text-xs text-muted-foreground">{clientPortal.project}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shared Items</span>
                      <span>{clientPortal.sharedItems}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pending Feedback</span>
                      <span>{clientPortal.pendingFeedback}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Activity</span>
                      <span>{clientPortal.lastActivity}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4 bg-transparent text-foreground/70">
                    Open Client Portal
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="chat" className="space-y-6">
                <TabsList className="bg-transparent p-0">
                  <TabsTrigger value="chat" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground data-[state=active]:text-foreground">
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="files" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground data-[state=active]:text-foreground">
                    Files
                  </TabsTrigger>
                  <TabsTrigger value="approvals" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground data-[state=active]:text-foreground">
                    Approvals <span className="ml-2 text-xs uppercase tracking-[0.3em]">2</span>
                  </TabsTrigger>
                </TabsList>

                {/* Chat Tab */}
                <TabsContent value="chat" className="space-y-0">
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="border-b border-border/50 py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold"># general</span>
                          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{teamMembers.length} members</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="text-[10px] uppercase tracking-[0.2em] text-foreground/60 hover:text-foreground">
                            Search
                          </Button>
                          <Button variant="ghost" size="sm" className="text-[10px] uppercase tracking-[0.2em] text-foreground/60 hover:text-foreground">
                            Settings
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <ScrollArea className="h-[400px]">
                      <div className="p-4 space-y-6">
                        {messages.map((message) => (
                          <div key={message.id} className="group flex gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">{message.user.name}</span>
                                <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                              </div>
                              <p className="text-sm text-foreground/90 leading-relaxed">{message.content}</p>
                              
                              {message.attachments.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {message.attachments.map((attachment, i) => (
                                    <div
                                      key={i}
                                      className="inline-flex items-center gap-2 p-2"
                                    >
                                      <span className="text-sm">{attachment.name}</span>
                                      <span className="text-xs text-muted-foreground">{attachment.size}</span>
                                      <Button variant="ghost" size="sm" className="text-[9px] uppercase tracking-[0.2em] text-foreground/60 hover:text-foreground">
                                        Download
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {message.reactions.length > 0 && (
                                <div className="flex gap-1 mt-2">
                                  {message.reactions.map((reaction, i) => (
                                    <button
                                      key={i}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-foreground/70 hover:text-foreground transition-colors"
                                    >
                                      {reaction.emoji} {reaction.count}
                                    </button>
                                  ))}
                                </div>
                              )}

                              <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="sm" className="text-[9px] uppercase tracking-[0.2em] text-foreground/60 hover:text-foreground">
                                  React
                                </Button>
                                <Button variant="ghost" size="sm" className="text-[9px] uppercase tracking-[0.2em] text-foreground/60 hover:text-foreground">
                                  Reply
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-[9px] uppercase tracking-[0.2em]">
                                  More
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="p-4 border-t border-border/50">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="shrink-0 text-[10px] uppercase tracking-[0.2em]">
                          Add
                        </Button>
                        <div className="flex-1 relative">
                          <Input
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="pr-20 bg-secondary/30 border-border/50"
                          />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-[9px] uppercase tracking-[0.2em]">
                              @
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-[9px] uppercase tracking-[0.2em]">
                              Attach
                            </Button>
                          </div>
                        </div>
                        <Button className="bg-white text-black hover:bg-white/80 shrink-0">
                          Send
                        </Button>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                {/* Files Tab */}
                <TabsContent value="files" className="space-y-6">
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="border-b border-border/50">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold">
                          Shared Files
                        </CardTitle>
                        <div className="flex gap-2">
                          <div className="relative">
                            <Input placeholder="Search files..." className="pl-4 w-48 bg-secondary/30 border-border/50" />
                          </div>
                          <Button className="bg-white text-black hover:bg-white/80">
                            Upload
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-border/50">
                        {sharedFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center gap-4 p-4 hover:bg-secondary/20 transition-colors"
                          >
                            <div className="p-2 rounded-lg bg-secondary/30">
                              <span className="h-2 w-2 rounded-full bg-foreground/40 block" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {file.size} • Uploaded by {file.uploadedBy.name}
                              </p>
                            </div>
                            <div className="text-right text-sm text-muted-foreground hidden sm:block">
                              <p>{file.uploadedAt}</p>
                              <p className="text-xs">{file.downloads} downloads</p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-[10px] uppercase tracking-[0.2em]">
                                  More
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-popover border-border/50">
                                <DropdownMenuItem>Download</DropdownMenuItem>
                                <DropdownMenuItem>Copy Link</DropdownMenuItem>
                                <DropdownMenuItem>Preview</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Approvals Tab */}
                <TabsContent value="approvals" className="space-y-6">
                  <div className="grid gap-4">
                    {approvalRequests.map((request) => (
                      <Card key={request.id} className="border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="w-40 h-24 rounded-lg bg-gradient-to-br from-white/10 via-black/30 to-black/70 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold">{request.title}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm text-muted-foreground">
                                      Submitted by {request.requester.name} • {request.submitted}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                  {request.status}
                                </span>
                              </div>

                              <div className="flex items-center gap-4 mb-3">
                                <span className="text-sm text-muted-foreground">Approvers:</span>
                                <span className="text-sm text-muted-foreground">
                                  {request.approvers.map((approver) => approver.user.name).join(" · ")}
                                </span>
                              </div>

                              {request.status === "pending" && (
                                <div className="flex gap-2">
                                  <Button variant="outline" className="bg-transparent text-foreground/70">
                                    Review
                                  </Button>
                                  <Button variant="outline" className="bg-transparent text-foreground/70">
                                    Approve
                                  </Button>
                                  <Button variant="outline" className="bg-transparent text-foreground/70">
                                    Request Changes
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
