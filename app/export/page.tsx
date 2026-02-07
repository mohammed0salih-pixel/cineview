"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { supabaseBrowser } from "@/lib/supabase-browser";

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
  connected: true,
  storage: { used: 8.4, total: 15 },
  lastSync: "2 minutes ago",
 },
 {
  id: "dropbox",
  name: "Dropbox",
  connected: true,
  storage: { used: 45.2, total: 100 },
  lastSync: "5 minutes ago",
 },
 {
  id: "icloud",
  name: "iCloud",
  connected: false,
  storage: { used: 0, total: 50 },
  lastSync: null,
 },
 {
  id: "onedrive",
  name: "OneDrive",
  connected: false,
  storage: { used: 0, total: 100 },
  lastSync: null,
 },
];

const socialPlatforms = [
 { id: "instagram", name: "Instagram", connected: true, username: "@cineview_studio" },
 { id: "youtube", name: "YouTube", connected: true, username: "CineView Studio" },
 { id: "tiktok", name: "TikTok", connected: false, username: null },
 { id: "twitter", name: "X (Twitter)", connected: false, username: null },
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
 const [latest, setLatest] = useState<{
  url: string
  type: "image" | "video"
  name?: string
  analyzedAt?: string
  analysis_run_id?: string
  project_id?: string
 } | null>(null)
 const [deckProjectName, setDeckProjectName] = useState("Untitled Project")
 const [deckConfidence, setDeckConfidence] = useState<number | null>(null)
 const [deckInsights, setDeckInsights] = useState<string[]>([])
 const [exportComplete, setExportComplete] = useState(false)
 const [exportStatus, setExportStatus] = useState<"idle" | "generating" | "done" | "error">("idle")
 const [exportError, setExportError] = useState<string | null>(null)
 const [exportUrl, setExportUrl] = useState<string | null>(null)

 useEffect(() => {
  try {
   const raw = sessionStorage.getItem("cineview_latest_upload")
   if (!raw) return
   const parsed = JSON.parse(raw) as {
    url?: string
    type?: "image" | "video"
    name?: string
    analyzedAt?: string
    analysis_run_id?: string
    project_id?: string
    analysis?: {
     mood?: string
     style?: string
     composition?: { score?: number }
     cinematic?: { mood?: string; genre?: string; shotType?: string }
    }
   }
   if (parsed?.url && parsed?.type) {
    setLatest({
     url: parsed.url,
     type: parsed.type,
     name: parsed.name,
     analyzedAt: parsed.analyzedAt,
     analysis_run_id: parsed.analysis_run_id,
     project_id: parsed.project_id,
    })
   }
   if (parsed) {
    const resolvedName = parsed.name ? parsed.name.replace(/\.[^/.]+$/, "") : "Untitled Project"
    const confidence =
     typeof parsed.analysis?.composition?.score === "number" ? parsed.analysis.composition.score : null
    const insights = [
     parsed.analysis?.cinematic?.mood,
     parsed.analysis?.cinematic?.genre,
     parsed.analysis?.cinematic?.shotType,
     parsed.analysis?.mood,
     parsed.analysis?.style,
    ].filter((value): value is string => typeof value === "string" && value.length > 0)
    setDeckProjectName(resolvedName)
    setDeckConfidence(confidence)
    setDeckInsights(Array.from(new Set(insights)).slice(0, 3))
   }
  } catch {
   // ignore storage failures
  }
 }, [])

 const handleExport = async () => {
  setExportError(null)
  setExportStatus("generating")

  let analysisRunId = latest?.analysis_run_id
  if (!analysisRunId) {
   try {
    const raw = sessionStorage.getItem("cineview_latest_upload")
    if (raw) {
     const parsed = JSON.parse(raw)
     analysisRunId = parsed.analysis_run_id
    }
   } catch {
    // ignore
   }
  }

  if (!analysisRunId) {
   setExportStatus("error")
   setExportError("No analysis run found. Please run analysis first.")
   return
  }

  let accessToken: string | null = null
  try {
   const { data } = await supabaseBrowser.auth.getSession()
   accessToken = data?.session?.access_token ?? null
  } catch {
   accessToken = null
  }

  if (!accessToken) {
   setExportStatus("error")
   setExportError("Please sign in to export.")
   return
  }

  const response = await fetch("/api/export", {
   method: "POST",
   headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
   },
   body: JSON.stringify({
    analysis_run_id: analysisRunId,
    export_type: "project_report",
    format: "pdf",
   }),
  })

  let data: { signed_url?: string; error?: string } | null = null
  try {
   data = await response.json()
  } catch {
   data = null
  }

  if (!response.ok) {
   setExportStatus("error")
   setExportError(data?.error || "Export failed.")
   return
  }

  setExportComplete(true)
  setExportStatus("done")
  setExportUrl(data?.signed_url ?? null)
 }

 return (
  <div className="min-h-screen bg-background text-foreground">
   <Header />

   <main className="pt-20">
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 motion-fade">
     {/* Page Header */}
     <div className="mb-10">
      <div className="text-xs font-medium text-white/60 uppercase tracking-[0.3em] mb-4">
       <span className="text-xs font-medium text-white/70 uppercase tracking-[0.3em]">Director&#39;s Deck</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white font-display">
       Export & <span className="text-white">Integrations</span>
      </h1>
      <p className="mt-2 text-white/60">
       Connect your tools, sync to cloud, and export professional-grade LUTs and presets
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
       <Link href="/analysis">
       <Button className="bg-transparent text-white/60 hover:text-white">
        Back to Results
       </Button>
       </Link>
       {!exportComplete ? (
        <Button
         className="bg-white text-black hover:bg-white/80"
         onClick={handleExport}
         disabled={exportStatus === "generating"}
        >
         {exportStatus === "generating" ? "Generating PDF..." : "Complete Export"}
        </Button>
       ) : (
        <Link href="/projects">
         <Button className="bg-white text-black hover:bg-white/80">
          Go to Projects
         </Button>
        </Link>
       )}
      </div>
      {exportComplete && (
       <div className="mt-3 text-xs font-medium text-white/60">
        تم حفظ مشروعك
       </div>
      )}
      {exportStatus === "error" && (
       <div className="mt-3 text-xs font-medium text-white/60">
        {exportError || "Export failed"}
       </div>
      )}
      {exportUrl && (
       <div className="mt-4">
        <Link href={exportUrl} target="_blank" rel="noreferrer">
         <Button className="bg-transparent text-white/60 hover:text-white">
          Download PDF
         </Button>
        </Link>
       </div>
      )}
     </div>

     <div className="mb-12 space-y-10">
      <div className="space-y-4">
       <p className="text-xs uppercase tracking-[0.4em] text-white/50">PDF Output</p>
       <h2 className="mt-3 text-2xl sm:text-3xl font-semibold text-white">{deckProjectName}</h2>
       <p className="mt-2 text-sm text-white/60">
        A cinematic, editorial director&#39;s deck that captures the creative direction, key risks, and decision signals.
       </p>
       <div className="mt-6 space-y-6 text-sm text-white/70">
        <div>
         <p className="text-xs uppercase tracking-[0.3em] text-white/50">Confidence</p>
         <p className="mt-3 text-2xl font-semibold text-white">
          {deckConfidence !== null ? `${Math.round(deckConfidence)}%` : "—"}
         </p>
        </div>
        <div>
         <p className="text-xs uppercase tracking-[0.3em] text-white/50">Insights</p>
         <div className="mt-3 space-y-1">
          {deckInsights.length ? (
           deckInsights.map((insight) => (
            <p key={insight} className="text-white/70">{insight}</p>
           ))
          ) : (
           <p className="text-white/60">Insights unavailable.</p>
          )}
         </div>
        </div>
       </div>
      </div>
      <div className="space-y-3">
       <p className="text-xs uppercase tracking-[0.4em] text-white/50">Preview</p>
       <div className="mt-4 overflow-hidden rounded-2xl">
        {latest ? (
         latest.type === "image" ? (
          <img
           src={latest.url}
           alt="Latest analysis snapshot"
           className="h-48 w-full object-cover"
          />
         ) : (
          <video
           src={latest.url}
           className="h-48 w-full object-cover"
           muted
           playsInline
          />
         )
        ) : (
         <div className="flex h-48 items-center justify-center text-sm text-white/50">
          No preview available
         </div>
        )}
       </div>
       <div className="mt-3 text-xs text-white/50">
        {latest?.analyzedAt
         ? `Analyzed ${new Date(latest.analyzedAt).toLocaleString()}`
         : "Analysis timestamp unavailable"}
       </div>
      </div>
     </div>

     <Tabs defaultValue="software" className="space-y-6">
      <TabsList className="bg-transparent p-0">
       <TabsTrigger value="software" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white">
        Editing Software
       </TabsTrigger>
       <TabsTrigger value="cloud" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white">
        Cloud Storage
       </TabsTrigger>
       <TabsTrigger value="social" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white">
        Social Publishing
       </TabsTrigger>
       <TabsTrigger value="luts" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white">
        LUT Export
       </TabsTrigger>
      </TabsList>

      {/* Editing Software Tab */}
      <TabsContent value="software" className="space-y-6">
       <div className="space-y-6">
        {editingSoftware.map((software) => (
         <div key={software.id} className="space-y-3">
          <div className="flex items-center justify-between gap-4">
           <h3 className="font-semibold text-white">{software.name}</h3>
           {software.connected && (
            <span className="text-xs uppercase tracking-[0.3em] text-white/50">Connected</span>
           )}
          </div>
          <p className="text-sm text-white/60">{software.description}</p>
          <p className="text-xs text-white/50">{software.formats.join(" · ")}</p>
          <div className="flex gap-2 pt-2">
           {software.connected ? (
            <>
             <Button className="flex-1 bg-transparent text-white/60 hover:text-white">
              Configure
             </Button>
             <Button className="flex-1 bg-white text-black hover:bg-white/80">
              Export
             </Button>
            </>
           ) : (
            <Button className="w-full bg-white text-black hover:bg-white/80">
             Connect
            </Button>
           )}
          </div>
         </div>
        ))}
       </div>
      </TabsContent>

      {/* Cloud Storage Tab */}
      <TabsContent value="cloud" className="space-y-6">
       <section className="space-y-4">
        <div className="flex items-center justify-between">
         <p className="text-xs uppercase tracking-[0.3em] text-white/50">Cloud Storage Sync</p>
         <div className="flex items-center gap-3">
          <Label htmlFor="auto-sync" className="text-sm text-white/60">Auto-sync</Label>
          <Switch id="auto-sync" checked={autoSync} onCheckedChange={setAutoSync} />
         </div>
        </div>
        <div className="space-y-4">
         {cloudServices.map((service) => (
          <div key={service.id} className="space-y-2">
           <div className="flex items-center justify-between gap-4">
            <div>
             <span className="font-medium text-white">{service.name}</span>
             {service.connected && (
              <span className="ml-2 text-xs text-white/40 uppercase tracking-[0.2em]">Connected</span>
             )}
             {service.connected && service.lastSync && (
              <p className="text-xs text-white/50">Last sync: {service.lastSync}</p>
             )}
            </div>
            {service.connected ? (
             <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
              Refresh
             </Button>
            ) : (
             <Button size="sm" className="bg-white text-black hover:bg-white/80">
              Connect
             </Button>
            )}
           </div>
           {service.connected && (
            <div className="text-xs text-white/50">
             {service.storage.used} GB used · {service.storage.total} GB total
            </div>
           )}
          </div>
         ))}
        </div>
       </section>

       <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Sync Settings</p>
        <div className="space-y-4">
         <div className="flex items-center justify-between">
          <div>
           <p className="font-medium text-white">Sync Projects</p>
           <p className="text-sm text-white/50">Automatically backup project files</p>
          </div>
          <Switch defaultChecked />
         </div>
         <div className="flex items-center justify-between">
          <div>
           <p className="font-medium text-white">Sync Presets & LUTs</p>
           <p className="text-sm text-white/50">Keep presets synchronized across devices</p>
          </div>
          <Switch defaultChecked />
         </div>
         <div className="flex items-center justify-between">
          <div>
           <p className="font-medium text-white">Sync Analysis Results</p>
           <p className="text-sm text-white/50">Backup AI analysis data</p>
          </div>
          <Switch />
         </div>
         <div className="flex items-center justify-between">
          <div>
           <p className="font-medium text-white">Sync Original Files</p>
           <p className="text-sm text-white/50">Upload original images and videos</p>
          </div>
          <Switch />
         </div>
        </div>
       </section>
      </TabsContent>

      {/* Social Publishing Tab */}
      <TabsContent value="social" className="space-y-6">
       <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Connected Accounts</p>
        <div className="space-y-4">
         {socialPlatforms.map((platform) => (
          <div key={platform.id} className="flex items-center justify-between gap-4">
           <div>
            <p className="font-medium text-white">{platform.name}</p>
            <p className="text-sm text-white/60">{platform.connected ? platform.username : "Not connected"}</p>
           </div>
           {platform.connected ? (
            <div className="flex gap-2">
             <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
              Manage
             </Button>
             <Button size="sm" className="bg-transparent text-white/60 hover:text-white">
              Disconnect
             </Button>
            </div>
           ) : (
            <Button size="sm" className="bg-white text-black hover:bg-white/80">
             Connect
            </Button>
           )}
          </div>
         ))}
        </div>
       </section>

       <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Quick Publish</p>
        <div className="space-y-3">
         <h3 className="font-semibold text-white">Ready to Publish</h3>
         <p className="text-sm text-white/60">
          Select content from your projects to publish directly to connected platforms
         </p>
         <Button className="bg-white text-black hover:bg-white/80">
          Select Content
         </Button>
        </div>
       </section>
      </TabsContent>

      {/* LUT Export Tab */}
      <TabsContent value="luts" className="space-y-6">
       <div className="space-y-12">
        <section className="space-y-6">
         <p className="text-xs uppercase tracking-[0.3em] text-white/50">Export Settings</p>
         <div className="space-y-2">
          <Label className="text-white/60">Export Format</Label>
          <Select value={selectedFormat} onValueChange={setSelectedFormat}>
           <SelectTrigger className="bg-transparent text-white border-0 shadow-none">
            <SelectValue />
           </SelectTrigger>
           <SelectContent className="bg-[#0b0b0c] text-white border-0 shadow-none">
            {exportFormats.map((format) => (
             <SelectItem key={format.id} value={format.id}>
              <div>
               <p>{format.name}</p>
               <p className="text-xs text-white/50">{format.description}</p>
              </div>
             </SelectItem>
            ))}
           </SelectContent>
          </Select>
         </div>

         <div className="space-y-2">
          <Label className="text-white/60">LUT Size</Label>
          <Select value={lutSize} onValueChange={setLutSize}>
           <SelectTrigger className="bg-transparent text-white border-0 shadow-none">
            <SelectValue />
           </SelectTrigger>
           <SelectContent className="bg-[#0b0b0c] text-white border-0 shadow-none">
            <SelectItem value="17">17x17x17 (Small)</SelectItem>
            <SelectItem value="33">33x33x33 (Standard)</SelectItem>
            <SelectItem value="65">65x65x65 (High Quality)</SelectItem>
           </SelectContent>
          </Select>
         </div>

         <div className="space-y-2">
          <Label className="text-white/60">Output Name</Label>
          <Input placeholder="my_custom_lut" className="bg-transparent border-transparent text-white placeholder:text-white/40" />
         </div>

         <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
           <Label className="text-white/60">Include Metadata</Label>
           <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
           <Label className="text-white/60">Embed Copyright</Label>
           <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
           <Label className="text-white/60">Generate Preview</Label>
           <Switch defaultChecked />
          </div>
         </div>

         <Button className="w-full bg-white text-black hover:bg-white/80">
          Export LUT
         </Button>
        </section>

        <section className="space-y-4">
         <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Your LUT Library</p>
          <Button className="bg-transparent text-white/60 hover:text-white">
           Import LUT
          </Button>
         </div>
         <div className="space-y-5">
          {lutPresets.map((preset) => (
           <div key={preset.id} className="space-y-2">
            <div className="flex items-center justify-between gap-4">
             <div>
              <p className="text-sm font-semibold text-white">{preset.name}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">{preset.category}</p>
             </div>
             <span className="text-xs text-white/50">{preset.downloads} downloads</span>
            </div>
            <div className="flex gap-3 pt-2">
             <Button size="sm" className="bg-transparent text-white/60 hover:text-white">
              Preview
             </Button>
             <Button size="sm" className="bg-white text-black hover:bg-white/80">
              Export
             </Button>
            </div>
           </div>
          ))}
         </div>
        </section>
       </div>

       <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">LUT Preview</p>
        <div className="space-y-4 text-sm text-white/70">
         <div className="flex items-center justify-between">
          <span>Original</span>
          <span>Preview ready</span>
         </div>
         <div className="flex items-center justify-between">
          <span>With LUT Applied</span>
          <span>Preview ready</span>
         </div>
         <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
           <span>Exposure</span>
           <span>+0.3</span>
          </div>
          <div className="flex items-center justify-between">
           <span>Contrast</span>
           <span>+15</span>
          </div>
          <div className="flex items-center justify-between">
           <span>Saturation</span>
           <span>-5</span>
          </div>
          <div className="flex items-center justify-between">
           <span>Shadows</span>
           <span>+10</span>
          </div>
         </div>
        </div>
       </section>
      </TabsContent>
     </Tabs>
    </div>
   </main>

   <Footer />
  </div>
 );
}
