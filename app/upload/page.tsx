"use client"

import React, { useCallback, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { analyzeImageFromUrl, analyzeVideoFromUrl } from "@/lib/visual-analysis"
import { supabaseBrowser } from "@/lib/supabase-browser"

const projectTypes = [
 { value: "advertising", label: "Advertising" },
 { value: "real-estate", label: "Real Estate" },
 { value: "fashion", label: "Fashion" },
 { value: "cinema", label: "Cinema" },
 { value: "product", label: "Product" },
 { value: "portrait", label: "Portrait" },
]

const platforms = [
 { value: "social", label: "Social Media" },
 { value: "advertising", label: "Advertising Campaign" },
 { value: "cinema", label: "Cinema / Film" },
 { value: "web", label: "Web / Digital" },
 { value: "print", label: "Print Media" },
]

export default function UploadPage() {
 const [contentType, setContentType] = useState<"image" | "video">("image")
 const [file, setFile] = useState<File | null>(null)
 const [preview, setPreview] = useState<string | null>(null)
 const [projectType, setProjectType] = useState("")
 const [platform, setPlatform] = useState("")
 const [objective, setObjective] = useState("")
 const [isDragging, setIsDragging] = useState(false)
 const storageKey = "cineview_latest_upload"

 const saveAnalysisIfReady = useCallback(async () => {
  let payload: {
   analysis?: Record<string, unknown>
   analysisStatus?: "loading" | "analyzing" | "completed"
   analysisStartedAt?: string
   analyzedAt?: string
   analysisSaved?: boolean
   analysisSaving?: boolean
   url?: string
   mode?: "object" | "data"
   type?: "image" | "video"
   name?: string
   sizeBytes?: number
   mimeType?: string
   projectType?: string
   platform?: string
  } = {}

  try {
   const raw = sessionStorage.getItem(storageKey)
   if (!raw) return
   payload = JSON.parse(raw)
  } catch {
   return
  }

  if (!payload.analysis || payload.analysisSaved || payload.analysisSaving) return

  const resolvedProjectType = projectType || payload.projectType
  const resolvedPlatform = platform || payload.platform
  if (!resolvedProjectType || !resolvedPlatform) return

  const mediaType = payload.type ?? contentType
  const mediaName = payload.name ?? file?.name
  if (!mediaType || !mediaName) return

  const previewUrl =
   payload.mode === "data" && typeof payload.url === "string" && payload.url.startsWith("data:") && payload.url.length <= 1_000_000
    ? payload.url
    : null

  let accessToken: string | null = null
  try {
   const { data } = await supabaseBrowser.auth.getSession()
   accessToken = data?.session?.access_token ?? null
  } catch {
   accessToken = null
  }

  if (!accessToken) return

  try {
   sessionStorage.setItem(
    storageKey,
    JSON.stringify({
     ...payload,
     analysisSaving: true,
     projectType: resolvedProjectType,
     platform: resolvedPlatform,
    })
   )
  } catch {
   // ignore storage failures
  }

  const response = await fetch("/api/analysis", {
   method: "POST",
   headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
   },
   body: JSON.stringify({
    project_type: resolvedProjectType,
    platform: resolvedPlatform,
    media: {
     name: mediaName,
     type: mediaType,
     size_bytes: payload.sizeBytes ?? file?.size ?? null,
     preview_url: previewUrl,
     metadata: {
      objective: objective || null,
      mime_type: payload.mimeType ?? file?.type ?? null,
     },
    },
    analysis: payload.analysis,
    analysis_status: payload.analysisStatus ?? "completed",
    analysis_started_at: payload.analysisStartedAt ?? payload.analyzedAt,
    analysis_completed_at: payload.analyzedAt,
   }),
  })

  let data: {
   project_id?: string
   media_id?: string
   analysis_run_id?: string
   insight_id?: string
   trace_id?: string
   error?: string
  } | null = null

  try {
   data = await response.json()
  } catch {
   data = null
  }

  if (!response.ok) {
   try {
    const raw = sessionStorage.getItem(storageKey)
    const nextPayload = raw ? JSON.parse(raw) : payload
    sessionStorage.setItem(
     storageKey,
     JSON.stringify({
      ...nextPayload,
      analysisSaving: false,
      analysisSaveError: data?.error || "save_failed",
     })
    )
   } catch {
    // ignore storage failures
   }
   return
  }

  try {
   const raw = sessionStorage.getItem(storageKey)
   const nextPayload = raw ? JSON.parse(raw) : payload
   sessionStorage.setItem(
    storageKey,
    JSON.stringify({
     ...nextPayload,
     analysisSaving: false,
     analysisSaved: true,
     project_id: data?.project_id ?? nextPayload.project_id,
     media_id: data?.media_id ?? nextPayload.media_id,
     analysis_run_id: data?.analysis_run_id ?? nextPayload.analysis_run_id,
     insight_id: data?.insight_id ?? nextPayload.insight_id,
     trace_id: data?.trace_id ?? nextPayload.trace_id,
    })
   )
  } catch {
   // ignore storage failures
  }
 }, [contentType, file, objective, platform, projectType])

 const handleFileChange = useCallback((selectedFile: File | null) => {
  if (selectedFile) {
   if (preview && preview.startsWith("blob:")) {
    URL.revokeObjectURL(preview)
   }
   setFile(selectedFile)
   const isVideo = selectedFile.type.startsWith("video/")
   if (isVideo) {
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)
    try {
       sessionStorage.setItem(
        storageKey,
        JSON.stringify({
         url: objectUrl,
         mode: "object",
         type: "video",
         name: selectedFile.name,
         sizeBytes: selectedFile.size,
         mimeType: selectedFile.type,
         analysisStartedAt: new Date().toISOString(),
         analysisStatus: "analyzing",
        })
       )
      } catch {
     // ignore storage failures
    }
    analyzeVideoFromUrl(objectUrl)
     .then((analysis) => {
      try {
       const raw = sessionStorage.getItem(storageKey)
       const payload = raw ? JSON.parse(raw) : {}
       sessionStorage.setItem(
        storageKey,
        JSON.stringify({
         ...payload,
         analysis,
         analyzedAt: new Date().toISOString(),
         analysisStatus: "completed",
        })
       )
       void saveAnalysisIfReady()
      } catch {
       // ignore storage failures
      }
     })
     .catch(() => {
      try {
       const raw = sessionStorage.getItem(storageKey)
       const payload = raw ? JSON.parse(raw) : {}
       sessionStorage.setItem(
        storageKey,
        JSON.stringify({
         ...payload,
         analysisStatus: "completed",
        })
       )
       void saveAnalysisIfReady()
      } catch {
       // ignore storage failures
      }
     })
   } else {
    const reader = new FileReader()
    reader.onload = (e) => {
     const result = e.target?.result as string
     setPreview(result)
     try {
       sessionStorage.setItem(
        storageKey,
        JSON.stringify({
         url: result,
         mode: "data",
         type: "image",
         name: selectedFile.name,
         sizeBytes: selectedFile.size,
         mimeType: selectedFile.type,
         analysisStartedAt: new Date().toISOString(),
         analysisStatus: "analyzing",
        })
       )
      } catch {
      // ignore storage failures
     }
     analyzeImageFromUrl(result)
      .then((analysis) => {
       try {
        const raw = sessionStorage.getItem(storageKey)
        const payload = raw ? JSON.parse(raw) : {}
        sessionStorage.setItem(
         storageKey,
         JSON.stringify({
         ...payload,
         analysis,
         analyzedAt: new Date().toISOString(),
         analysisStatus: "completed",
        })
       )
       void saveAnalysisIfReady()
      } catch {
       // ignore storage failures
      }
     })
     .catch(() => {
       try {
        const raw = sessionStorage.getItem(storageKey)
        const payload = raw ? JSON.parse(raw) : {}
        sessionStorage.setItem(
         storageKey,
        JSON.stringify({
         ...payload,
         analysisStatus: "completed",
        })
       )
       void saveAnalysisIfReady()
      } catch {
       // ignore storage failures
      }
     })
    }
    reader.readAsDataURL(selectedFile)
   }
  }
 }, [preview, saveAnalysisIfReady])

 const handleDrop = useCallback(
  (e: React.DragEvent) => {
   e.preventDefault()
   setIsDragging(false)
   const droppedFile = e.dataTransfer.files[0]
   if (droppedFile) handleFileChange(droppedFile)
  },
  [handleFileChange]
 )

 const handleDragOver = useCallback((e: React.DragEvent) => {
  e.preventDefault()
  setIsDragging(true)
 }, [])

 const handleDragLeave = useCallback((e: React.DragEvent) => {
  e.preventDefault()
  setIsDragging(false)
 }, [])

 const clearFile = () => {
  if (preview && preview.startsWith("blob:")) {
   URL.revokeObjectURL(preview)
  }
  setFile(null)
  setPreview(null)
  try {
   sessionStorage.removeItem(storageKey)
  } catch {
   // ignore storage failures
  }
 }

 const isFormValid = file && projectType && platform

 const markAnalysisStart = () => {
  try {
   const raw = sessionStorage.getItem(storageKey)
   const payload = raw ? JSON.parse(raw) : {}
   sessionStorage.setItem(
    storageKey,
    JSON.stringify({
     ...payload,
     analyzedAt: payload.analyzedAt ?? new Date().toISOString(),
     analysisStatus: payload.analysisStatus ?? "loading",
     analysisStartedAt: payload.analysisStartedAt ?? new Date().toISOString(),
     projectType,
     platform,
    })
   )
  } catch {
   // ignore storage failures
  }
  void saveAnalysisIfReady()
 }

 return (
  <main className="min-h-screen bg-background text-foreground">
   <Header />

   <section className="pt-24 pb-20">
    <div className="mx-auto max-w-5xl px-4 lg:px-8 fade-soft">
     <div className="mb-10 text-center">
      <div className="text-xs font-semibold text-white/60 uppercase tracking-[0.3em]">AI Analysis</div>
      <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white font-display">
       Upload Your Content
      </h1>
      <p className="mt-3 text-base sm:text-lg text-white/60">
       Upload a photograph or video for AI-powered cinematic analysis
      </p>
     </div>

     <section className="mb-10 space-y-4">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Content Type</p>
      <p className="text-sm text-white/60">Select what you want to analyze</p>
      <RadioGroup
       value={contentType}
       onValueChange={(value) => setContentType(value as "image" | "video")}
       className="space-y-4"
      >
       <div>
        <RadioGroupItem value="image" id="image" className="peer sr-only" />
        <Label
         htmlFor="image"
         className="flex cursor-pointer flex-col gap-2 text-white/50 transition-colors hover:text-white peer-data-[state=checked]:text-white"
        >
         <span className="text-lg font-semibold">Photograph</span>
         <span className="text-xs text-white/50">JPG, PNG, WebP</span>
        </Label>
       </div>
       <div>
        <RadioGroupItem value="video" id="video" className="peer sr-only" />
        <Label
         htmlFor="video"
         className="flex cursor-pointer flex-col gap-2 text-white/50 transition-colors hover:text-white peer-data-[state=checked]:text-white"
        >
         <span className="text-lg font-semibold">Video</span>
         <span className="text-xs text-white/50">MP4, MOV, WebM</span>
        </Label>
       </div>
      </RadioGroup>
     </section>

     <section className="mb-10 space-y-4">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Upload File</p>
      <p className="text-sm text-white/60">Drag and drop or click to select</p>
       {!preview ? (
        <div
         onDrop={handleDrop}
         onDragOver={handleDragOver}
         onDragLeave={handleDragLeave}
         className={`relative flex min-h-[220px] flex-col items-center justify-center rounded-2xl bg-black/40 transition-all ${
          isDragging
           ? "bg-black/50"
           : "hover:bg-black/50"
         }`}
        >
         <input
          type="file"
          accept={contentType === "image" ? "image/*" : "video/*"}
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          className="absolute inset-0 cursor-pointer opacity-0"
         />
         <p className="mt-4 text-sm font-semibold text-white">
          Drop your {contentType === "image" ? "image" : "video"} here
         </p>
          <p className="mt-1 text-xs text-white/50">or click to browse files</p>
        </div>
       ) : (
        <div className="relative">
         <button
          type="button"
          onClick={clearFile}
          className="absolute -right-2 -top-2 z-10 rounded-full bg-white px-3 py-1 text-xs font-semibold text-black transition-colors hover:bg-white/80"
         >
          Remove
         </button>
         <div className="overflow-hidden rounded-2xl bg-black/40">
          {contentType === "image" ? (
           <img
            src={preview || "/placeholder.svg"}
            alt="Preview"
            className="h-auto max-h-[380px] w-full object-contain bg-black/50"
           />
          ) : (
           <video src={preview} controls className="h-auto max-h-[380px] w-full bg-black/50" />
         )}
        </div>
        <div className="mt-3 text-sm text-white/60 truncate">{file?.name}</div>
       </div>
      )}
     </section>

     <section className="mb-12 space-y-4">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Project Details</p>
      <p className="text-sm text-white/60">Help us understand your content better</p>
      <div className="space-y-6">
       <div className="space-y-2">
        <Label htmlFor="project-type" className="text-white/70">Project Type</Label>
        <Select value={projectType} onValueChange={setProjectType}>
         <SelectTrigger id="project-type" className="h-12 bg-transparent text-white border-0 shadow-none px-0">
          <SelectValue placeholder="Select project type" />
         </SelectTrigger>
         <SelectContent className="bg-[#0b0b0c] text-white border-0 shadow-none">
          {projectTypes.map((type) => (
           <SelectItem key={type.value} value={type.value} className="text-white">
            {type.label}
           </SelectItem>
          ))}
         </SelectContent>
        </Select>
       </div>

       <div className="space-y-2">
        <Label htmlFor="platform" className="text-white/70">Target Platform</Label>
        <Select value={platform} onValueChange={setPlatform}>
         <SelectTrigger id="platform" className="h-12 bg-transparent text-white border-0 shadow-none px-0">
          <SelectValue placeholder="Select platform" />
         </SelectTrigger>
         <SelectContent className="bg-[#0b0b0c] text-white border-0 shadow-none">
          {platforms.map((p) => (
           <SelectItem key={p.value} value={p.value} className="text-white">
            {p.label}
           </SelectItem>
          ))}
         </SelectContent>
        </Select>
       </div>

       <div className="space-y-2">
        <Label htmlFor="objective" className="text-white/70">
         Shot Objective <span className="text-white/40 font-normal">(Optional)</span>
        </Label>
        <Textarea
         id="objective"
         value={objective}
         onChange={(e) => setObjective(e.target.value)}
         placeholder="Describe what you want to achieve with this shot..."
         className="min-h-[120px] resize-none bg-transparent border-0 px-0 text-white/80 placeholder:text-white/40"
        />
       </div>
      </div>
     </section>

     <div className="flex justify-center">
      <Button
       asChild={isFormValid ? true : false}
       size="lg"
       disabled={!isFormValid}
       className="h-12 rounded-full bg-white px-8 text-black shadow-lg shadow-black/30 hover:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed"
      >
       {isFormValid ? (
        <Link href="/analysis" onClick={markAnalysisStart}>
         Analyze Content
        </Link>
       ) : (
        <>
         Analyze Content
        </>
       )}
      </Button>
     </div>
    </div>
   </section>

   <Footer />
  </main>
 )
}
