"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Users,
  MessageSquare,
  FileText,
  CheckSquare,
  Plus,
  Search,
  Send,
  Paperclip,
  ImageIcon,
  Video,
  MoreVertical,
  Bell,
  Settings,
  UserPlus,
  Crown,
  Shield,
  Eye,
  Edit3,
  Trash2,
  Download,
  ExternalLink,
  Clock,
  Check,
  X,
  Sparkles,
  FolderOpen,
  LinkIcon,
  AtSign,
  Smile,
  ThumbsUp,
  Heart,
  Reply,
} from "lucide-react";
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
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 mb-4">
                <Users className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-primary uppercase tracking-wider">Team Hub</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Team <span className="text-gradient-gold">Collaboration</span>
              </h1>
              <p className="mt-2 text-muted-foreground">
                Communicate, share files, and manage approvals with your team
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-border/50 bg-transparent">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
                <Badge className="ml-2 bg-primary text-primary-foreground">3</Badge>
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-gold">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border/50">
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <label className="text-sm font-medium">Email Address</label>
                      <Input placeholder="colleague@email.com" className="mt-1 bg-secondary/30 border-border/50" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Role</label>
                      <Input placeholder="e.g., Editor, Cinematographer" className="mt-1 bg-secondary/30 border-border/50" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Personal Message (Optional)</label>
                      <Textarea placeholder="Add a welcome message..." className="mt-1 bg-secondary/30 border-border/50" />
                    </div>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
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
                    <Badge variant="secondary" className="bg-secondary/50">{teamMembers.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="space-y-1">
                    {teamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer"
                      >
                        <div className="relative">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                          </Avatar>
                          <span
                            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card ${
                              member.status === "online"
                                ? "bg-green-500"
                                : member.status === "away"
                                ? "bg-yellow-500"
                                : "bg-gray-500"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{member.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                        </div>
                        {member.id === 1 && <Crown className="h-4 w-4 text-primary" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Client Portal Card */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="border-b border-border/50 pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-primary" />
                    Client Portal
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12 rounded-lg">
                      <AvatarImage src={clientPortal.client.logo || "/placeholder.svg"} />
                      <AvatarFallback className="rounded-lg">MT</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{clientPortal.client.name}</p>
                      <p className="text-xs text-muted-foreground">{clientPortal.project}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shared Items</span>
                      <span>{clientPortal.sharedItems}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pending Feedback</span>
                      <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">{clientPortal.pendingFeedback}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Activity</span>
                      <span>{clientPortal.lastActivity}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4 border-border/50 bg-transparent">
                    Open Client Portal
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="chat" className="space-y-6">
                <TabsList className="bg-secondary/30 border border-border/50">
                  <TabsTrigger value="chat" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="files" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <FileText className="mr-2 h-4 w-4" />
                    Files
                  </TabsTrigger>
                  <TabsTrigger value="approvals" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Approvals
                    <Badge className="ml-2 bg-orange-500/20 text-orange-400">2</Badge>
                  </TabsTrigger>
                </TabsList>

                {/* Chat Tab */}
                <TabsContent value="chat" className="space-y-0">
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="border-b border-border/50 py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold"># general</span>
                          <Badge variant="secondary" className="bg-secondary/50">{teamMembers.length} members</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Search className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <ScrollArea className="h-[400px]">
                      <div className="p-4 space-y-6">
                        {messages.map((message) => (
                          <div key={message.id} className="group flex gap-3">
                            <Avatar className="h-9 w-9 shrink-0">
                              <AvatarImage src={message.user.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{message.user.name[0]}</AvatarFallback>
                            </Avatar>
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
                                      className="inline-flex items-center gap-2 p-2 rounded-lg bg-secondary/30 border border-border/50"
                                    >
                                      {attachment.type === "image" ? (
                                        <ImageIcon className="h-4 w-4 text-blue-400" />
                                      ) : (
                                        <Video className="h-4 w-4 text-purple-400" />
                                      )}
                                      <span className="text-sm">{attachment.name}</span>
                                      <span className="text-xs text-muted-foreground">{attachment.size}</span>
                                      <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <Download className="h-3 w-3" />
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
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/50 text-xs hover:bg-secondary transition-colors"
                                    >
                                      {reaction.emoji} {reaction.count}
                                    </button>
                                  ))}
                                </div>
                              )}

                              <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <Smile className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <Reply className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="p-4 border-t border-border/50">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="shrink-0">
                          <Plus className="h-5 w-5" />
                        </Button>
                        <div className="flex-1 relative">
                          <Input
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="pr-20 bg-secondary/30 border-border/50"
                          />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <AtSign className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Paperclip className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0">
                          <Send className="h-4 w-4" />
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
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                          <FolderOpen className="h-5 w-5 text-primary" />
                          Shared Files
                        </CardTitle>
                        <div className="flex gap-2">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder="Search files..." className="pl-9 w-48 bg-secondary/30 border-border/50" />
                          </div>
                          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                            <Plus className="mr-2 h-4 w-4" />
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
                            <div className={`p-2 rounded-lg ${
                              file.type === "pdf" ? "bg-red-500/10" :
                              file.type === "image" ? "bg-blue-500/10" :
                              file.type === "video" ? "bg-purple-500/10" :
                              file.type === "audio" ? "bg-green-500/10" :
                              "bg-primary/10"
                            }`}>
                              <ImageIcon className={`h-5 w-5 ${
                                file.type === "pdf" ? "text-red-400" :
                                file.type === "image" ? "text-blue-400" :
                                file.type === "video" ? "text-purple-400" :
                                file.type === "audio" ? "text-green-400" :
                                "text-primary"
                              }`} />
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
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-popover border-border/50">
                                <DropdownMenuItem><Download className="mr-2 h-4 w-4" /> Download</DropdownMenuItem>
                                <DropdownMenuItem><LinkIcon className="mr-2 h-4 w-4" /> Copy Link</DropdownMenuItem>
                                <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> Preview</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
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
                            <div className="relative w-40 h-24 rounded-lg bg-secondary/30 overflow-hidden shrink-0">
                              <Image
                                src={request.thumbnail || "/placeholder.svg"}
                                alt=""
                                fill
                                sizes="160px"
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold">{request.title}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Avatar className="h-5 w-5">
                                      <AvatarImage src={request.requester.avatar || "/placeholder.svg"} />
                                      <AvatarFallback>{request.requester.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-muted-foreground">
                                      Submitted by {request.requester.name} • {request.submitted}
                                    </span>
                                  </div>
                                </div>
                                <Badge className={
                                  request.status === "approved" ? "bg-green-500/20 text-green-400" :
                                  request.status === "rejected" ? "bg-red-500/20 text-red-400" :
                                  "bg-orange-500/20 text-orange-400"
                                }>
                                  {request.status}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-4 mb-3">
                                <span className="text-sm text-muted-foreground">Approvers:</span>
                                <div className="flex items-center gap-2">
                                  {request.approvers.map((approver, i) => (
                                    <div key={i} className="flex items-center gap-1">
                                      <Avatar className="h-6 w-6">
                                        <AvatarImage src={approver.user.avatar || "/placeholder.svg"} />
                                        <AvatarFallback>{approver.user.name[0]}</AvatarFallback>
                                      </Avatar>
                                      {approver.status === "approved" ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                      ) : approver.status === "rejected" ? (
                                        <X className="h-4 w-4 text-red-500" />
                                      ) : (
                                        <Clock className="h-4 w-4 text-orange-500" />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {request.status === "pending" && (
                                <div className="flex gap-2">
                                  <Button variant="outline" className="border-border/50 bg-transparent">
                                    <Eye className="mr-2 h-4 w-4" />
                                    Review
                                  </Button>
                                  <Button variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/10 bg-transparent">
                                    <Check className="mr-2 h-4 w-4" />
                                    Approve
                                  </Button>
                                  <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent">
                                    <X className="mr-2 h-4 w-4" />
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
