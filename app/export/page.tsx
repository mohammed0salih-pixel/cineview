"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Upload,
  Cloud,
  Link as LinkIcon,
  Palette,
  FileText,
  ImageIcon,
  Video,
  Settings,
  Check,
  RefreshCw,
  ExternalLink,
  Folder,
  HardDrive,
  Zap,
  Sparkles,
  Share2,
  Copy,
  Instagram,
  Youtube,
  Twitter,
  Play,
  Camera,
  Film,
  Sliders,
  Droplet,
  Sun,
  Moon,
  Contrast,
  Eye,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const editingSoftware = [
  {
    id: "lightroom",
    name: "Adobe Lightroom",
    icon: "/placeholder.svg?height=48&width=48",
    formats: [".xmp", ".lrtemplate", ".dng"],
    connected: true,
    description: "Export presets, profiles, and color grades",
  },
  {
    id: "davinci",
    name: "DaVinci Resolve",
    icon: "/placeholder.svg?height=48&width=48",
    formats: [".cube", ".drx", ".dpx"],
    connected: true,
    description: "Export LUTs and color nodes",
  },
  {
    id: "premiere",
    name: "Adobe Premiere Pro",
    icon: "/placeholder.svg?height=48&width=48",
    formats: [".cube", ".look", ".mogrt"],
    connected: false,
    description: "Export LUTs and Lumetri presets",
  },
  {
    id: "finalcut",
    name: "Final Cut Pro",
    icon: "/placeholder.svg?height=48&width=48",
    formats: [".cube", ".fcpxml"],
    connected: false,
    description: "Export LUTs and color effects",
  },
  {
    id: "capture",
    name: "Capture One",
    icon: "/placeholder.svg?height=48&width=48",
    formats: [".costyle", ".icc"],
    connected: true,
    description: "Export styles and ICC profiles",
  },
  {
    id: "photoshop",
    name: "Adobe Photoshop",
    icon: "/placeholder.svg?height=48&width=48",
    formats: [".atn", ".cube", ".3dl"],
    connected: false,
    description: "Export actions and LUTs",
  },
];

const cloudServices = [
  {
    id: "gdrive",
    name: "Google Drive",
    icon: Cloud,
    connected: true,
    storage: { used: 8.4, total: 15 },
    lastSync: "2 minutes ago",
  },
  {
    id: "dropbox",
    name: "Dropbox",
    icon: Folder,
    connected: true,
    storage: { used: 45.2, total: 100 },
    lastSync: "5 minutes ago",
  },
  {
    id: "icloud",
    name: "iCloud",
    icon: Cloud,
    connected: false,
    storage: { used: 0, total: 50 },
    lastSync: null,
  },
  {
    id: "onedrive",
    name: "OneDrive",
    icon: Cloud,
    connected: false,
    storage: { used: 0, total: 100 },
    lastSync: null,
  },
];

const socialPlatforms = [
  { id: "instagram", name: "Instagram", icon: Instagram, connected: true, username: "@cineview_studio" },
  { id: "youtube", name: "YouTube", icon: Youtube, connected: true, username: "CineView Studio" },
  { id: "tiktok", name: "TikTok", icon: Play, connected: false, username: null },
  { id: "twitter", name: "X (Twitter)", icon: Twitter, connected: false, username: null },
];

const lutPresets = [
  {
    id: 1,
    name: "Desert Gold",
    category: "Cinematic",
    preview: "/placeholder.svg?height=100&width=160",
    downloads: 1243,
    rating: 4.9,
  },
  {
    id: 2,
    name: "Teal & Orange",
    category: "Film",
    preview: "/placeholder.svg?height=100&width=160",
    downloads: 2891,
    rating: 4.8,
  },
  {
    id: 3,
    name: "Vintage Film",
    category: "Retro",
    preview: "/placeholder.svg?height=100&width=160",
    downloads: 1567,
    rating: 4.7,
  },
  {
    id: 4,
    name: "Clean Portrait",
    category: "Portrait",
    preview: "/placeholder.svg?height=100&width=160",
    downloads: 3421,
    rating: 4.9,
  },
];

const exportFormats = [
  { id: "cube", name: ".cube LUT", description: "Universal 3D LUT format" },
  { id: "xmp", name: ".xmp Preset", description: "Adobe Lightroom/Camera Raw" },
  { id: "drx", name: ".drx Grade", description: "DaVinci Resolve color grade" },
  { id: "look", name: ".look File", description: "Adobe SpeedGrade/Premiere" },
  { id: "icc", name: ".icc Profile", description: "ICC color profile" },
];

export default function ExportPage() {
  const [autoSync, setAutoSync] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState("cube");
  const [lutSize, setLutSize] = useState("33");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 mb-4">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">Integration Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Export & <span className="text-gradient-gold">Integrations</span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              Connect your tools, sync to cloud, and export professional-grade LUTs and presets
            </p>
          </div>

          <Tabs defaultValue="software" className="space-y-6">
            <TabsList className="bg-secondary/30 border border-border/50">
              <TabsTrigger value="software" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Sliders className="mr-2 h-4 w-4" />
                Editing Software
              </TabsTrigger>
              <TabsTrigger value="cloud" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Cloud className="mr-2 h-4 w-4" />
                Cloud Storage
              </TabsTrigger>
              <TabsTrigger value="social" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Share2 className="mr-2 h-4 w-4" />
                Social Publishing
              </TabsTrigger>
              <TabsTrigger value="luts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Palette className="mr-2 h-4 w-4" />
                LUT Export
              </TabsTrigger>
            </TabsList>

            {/* Editing Software Tab */}
            <TabsContent value="software" className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {editingSoftware.map((software) => (
                  <Card
                    key={software.id}
                    className={`border-border/50 bg-card/50 backdrop-blur-sm transition-all ${
                      software.connected ? "border-primary/30" : "hover:border-border"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center overflow-hidden">
                          <Image
                            src={software.icon || "/placeholder.svg"}
                            alt={software.name}
                            width={32}
                            height={32}
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{software.name}</h3>
                            {software.connected && (
                              <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{software.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {software.formats.map((format) => (
                              <Badge key={format} variant="secondary" className="bg-secondary/50 text-xs">
                                {format}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border/50 flex gap-2">
                        {software.connected ? (
                          <>
                            <Button variant="outline" className="flex-1 border-border/50 bg-transparent">
                              <Settings className="mr-2 h-4 w-4" />
                              Configure
                            </Button>
                            <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                              <Download className="mr-2 h-4 w-4" />
                              Export
                            </Button>
                          </>
                        ) : (
                          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                            <LinkIcon className="mr-2 h-4 w-4" />
                            Connect
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Cloud Storage Tab */}
            <TabsContent value="cloud" className="space-y-6">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Cloud className="h-5 w-5 text-primary" />
                      Cloud Storage Sync
                    </CardTitle>
                    <div className="flex items-center gap-3">
                      <Label htmlFor="auto-sync" className="text-sm text-muted-foreground">Auto-sync</Label>
                      <Switch id="auto-sync" checked={autoSync} onCheckedChange={setAutoSync} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {cloudServices.map((service) => {
                      const Icon = service.icon;
                      const storagePercent = service.connected
                        ? (service.storage.used / service.storage.total) * 100
                        : 0;

                      return (
                        <div
                          key={service.id}
                          className={`p-4 rounded-lg border transition-all ${
                            service.connected
                              ? "border-primary/30 bg-primary/5"
                              : "border-border/50 hover:border-border"
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 rounded-lg ${
                              service.connected ? "bg-primary/10" : "bg-secondary/50"
                            }`}>
                              <Icon className={`h-5 w-5 ${
                                service.connected ? "text-primary" : "text-muted-foreground"
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{service.name}</span>
                                {service.connected && (
                                  <Check className="h-4 w-4 text-green-500" />
                                )}
                              </div>
                              {service.connected && service.lastSync && (
                                <p className="text-xs text-muted-foreground">
                                  Last sync: {service.lastSync}
                                </p>
                              )}
                            </div>
                            {service.connected ? (
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                Connect
                              </Button>
                            )}
                          </div>

                          {service.connected && (
                            <div>
                              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>{service.storage.used} GB used</span>
                                <span>{service.storage.total} GB total</span>
                              </div>
                              <Progress value={storagePercent} className="h-1.5" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Sync Settings */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="border-b border-border/50">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Sync Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Sync Projects</p>
                        <p className="text-sm text-muted-foreground">Automatically backup project files</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Sync Presets & LUTs</p>
                        <p className="text-sm text-muted-foreground">Keep presets synchronized across devices</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Sync Analysis Results</p>
                        <p className="text-sm text-muted-foreground">Backup AI analysis data</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Sync Original Files</p>
                        <p className="text-sm text-muted-foreground">Upload original images and videos</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Social Publishing Tab */}
            <TabsContent value="social" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="border-b border-border/50">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Share2 className="h-5 w-5 text-primary" />
                      Connected Accounts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {socialPlatforms.map((platform) => {
                      const Icon = platform.icon;
                      return (
                        <div
                          key={platform.id}
                          className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                            platform.connected
                              ? "border-primary/30 bg-primary/5"
                              : "border-border/50 hover:border-border"
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${
                            platform.connected ? "bg-primary/10" : "bg-secondary/50"
                          }`}>
                            <Icon className={`h-5 w-5 ${
                              platform.connected ? "text-primary" : "text-muted-foreground"
                            }`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{platform.name}</p>
                            {platform.connected ? (
                              <p className="text-sm text-muted-foreground">{platform.username}</p>
                            ) : (
                              <p className="text-sm text-muted-foreground">Not connected</p>
                            )}
                          </div>
                          {platform.connected ? (
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="border-border/50 bg-transparent">
                                Disconnect
                              </Button>
                            </div>
                          ) : (
                            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                              Connect
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="border-b border-border/50">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Quick Publish
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Upload className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">Ready to Publish</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Select content from your projects to publish directly to connected platforms
                      </p>
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-gold">
                        <Upload className="mr-2 h-4 w-4" />
                        Select Content
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* LUT Export Tab */}
            <TabsContent value="luts" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Export Settings */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm lg:col-span-1">
                  <CardHeader className="border-b border-border/50">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      Export Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                      <Label>Export Format</Label>
                      <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                        <SelectTrigger className="bg-secondary/30 border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border/50">
                          {exportFormats.map((format) => (
                            <SelectItem key={format.id} value={format.id}>
                              <div>
                                <p>{format.name}</p>
                                <p className="text-xs text-muted-foreground">{format.description}</p>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>LUT Size</Label>
                      <Select value={lutSize} onValueChange={setLutSize}>
                        <SelectTrigger className="bg-secondary/30 border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border/50">
                          <SelectItem value="17">17x17x17 (Small)</SelectItem>
                          <SelectItem value="33">33x33x33 (Standard)</SelectItem>
                          <SelectItem value="65">65x65x65 (High Quality)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Output Name</Label>
                      <Input placeholder="my_custom_lut" className="bg-secondary/30 border-border/50" />
                    </div>

                    <div className="space-y-3 pt-4 border-t border-border/50">
                      <div className="flex items-center justify-between">
                        <Label>Include Metadata</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Embed Copyright</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Generate Preview</Label>
                        <Switch defaultChecked />
                      </div>
                    </div>

                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-gold">
                      <Download className="mr-2 h-4 w-4" />
                      Export LUT
                    </Button>
                  </CardContent>
                </Card>

                {/* Preset Library */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm lg:col-span-2">
                  <CardHeader className="border-b border-border/50">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Palette className="h-5 w-5 text-primary" />
                        Your LUT Library
                      </CardTitle>
                      <Button variant="outline" className="border-border/50 bg-transparent">
                        <Upload className="mr-2 h-4 w-4" />
                        Import LUT
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {lutPresets.map((preset) => (
                        <div
                          key={preset.id}
                          className="group rounded-lg border border-border/50 overflow-hidden hover:border-primary/30 transition-all"
                        >
                          <div className="relative aspect-video bg-secondary/30">
                            <Image
                              src={preset.preview || "/placeholder.svg"}
                              alt={preset.name}
                              fill
                              sizes="(min-width: 640px) 50vw, 100vw"
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button size="sm" variant="secondary">
                                <Eye className="mr-2 h-3 w-3" />
                                Preview
                              </Button>
                              <Button size="sm" className="bg-primary text-primary-foreground">
                                <Download className="mr-2 h-3 w-3" />
                                Export
                              </Button>
                            </div>
                            <Badge className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm">
                              {preset.category}
                            </Badge>
                          </div>
                          <div className="p-3">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-sm">{preset.name}</h3>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Download className="h-3 w-3" />
                                {preset.downloads}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* LUT Preview Comparison */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="border-b border-border/50">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Contrast className="h-5 w-5 text-primary" />
                    LUT Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <div className="aspect-video rounded-lg bg-secondary/30 flex items-center justify-center">
                        <span className="text-sm text-muted-foreground">Original</span>
                      </div>
                      <p className="text-center text-sm font-medium">Before</p>
                    </div>
                    <div className="space-y-2">
                      <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-primary/30">
                        <span className="text-sm text-primary">With LUT Applied</span>
                      </div>
                      <p className="text-center text-sm font-medium text-primary">Preview</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Sun className="h-4 w-4 text-yellow-500" />
                          Exposure
                        </span>
                        <span>+0.3</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Contrast className="h-4 w-4 text-blue-500" />
                          Contrast
                        </span>
                        <span>+15</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Droplet className="h-4 w-4 text-cyan-500" />
                          Saturation
                        </span>
                        <span>-5</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Moon className="h-4 w-4 text-purple-500" />
                          Shadows
                        </span>
                        <span>+10</span>
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
