"use client"

import React, { useEffect, useState } from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { defaultVisualAnalysis } from "@/lib/visual-analysis"

const defaultAnalysisData = defaultVisualAnalysis

export default function AnalysisPage() {
  const [uploadedMedia, setUploadedMedia] = useState<{
    url: string
    type: "image" | "video"
    name?: string
    mode?: "data" | "object"
    analyzedAt?: string
    analysisStatus?: "loading" | "analyzing" | "completed"
    analysis?: typeof defaultAnalysisData
  } | null>(null)
  const [analysis, setAnalysis] = useState(defaultAnalysisData)
  const [status, setStatus] = useState<"loading" | "analyzing" | "completed">("loading")
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [showData, setShowData] = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("cineview_latest_upload")
      if (!raw) return
      const parsed = JSON.parse(raw) as {
        url?: string
        type?: "image" | "video"
        name?: string
        mode?: "data" | "object"
        analyzedAt?: string
        analysisStatus?: "loading" | "analyzing" | "completed"
        analysis?: typeof defaultAnalysisData
        analysisSaving?: boolean
        analysisSaved?: boolean
        analysisSaveError?: string
      }
      if (parsed?.url && parsed?.type) {
        setUploadedMedia({
          url: parsed.url,
          type: parsed.type,
          name: parsed.name,
          mode: parsed.mode,
          analyzedAt: parsed.analyzedAt,
          analysisStatus: parsed.analysisStatus,
          analysis: parsed.analysis,
        })
        if (parsed.analysis) {
          setAnalysis(parsed.analysis)
        }
        if (parsed.analysisStatus) {
          setStatus(parsed.analysisStatus)
        }
        if (parsed.analysisSaving) {
          setSaveState("saving")
        } else if (parsed.analysisSaved) {
          setSaveState("saved")
        } else if (parsed.analysisSaveError) {
          setSaveState("error")
        }
      }
    } catch {
      // ignore storage failures
    }
  }, [])

  useEffect(() => {
    if (uploadedMedia?.analysisStatus) return
    if (status === "completed") return
    const t1 = setTimeout(() => setStatus("analyzing"), 400)
    const t2 = setTimeout(() => setStatus("completed"), 1400)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [status, uploadedMedia?.analysisStatus])

  useEffect(() => {
    if (status === "completed") return
    const interval = window.setInterval(() => {
      try {
        const raw = sessionStorage.getItem("cineview_latest_upload")
        if (!raw) return
        const parsed = JSON.parse(raw) as {
          analysisStatus?: "loading" | "analyzing" | "completed"
          analysis?: typeof defaultAnalysisData
          analysisSaving?: boolean
          analysisSaved?: boolean
          analysisSaveError?: string
        }
        if (parsed.analysis && !uploadedMedia?.analysis) {
          setAnalysis(parsed.analysis)
        }
        if (parsed.analysisStatus && parsed.analysisStatus !== status) {
          setStatus(parsed.analysisStatus)
        }
        if (parsed.analysisSaving) {
          setSaveState("saving")
        } else if (parsed.analysisSaved) {
          setSaveState("saved")
        } else if (parsed.analysisSaveError) {
          setSaveState("error")
        }
      } catch {
        // ignore storage failures
      }
    }, 600)
    return () => window.clearInterval(interval)
  }, [status, uploadedMedia?.analysis])

  const statusConfig = {
    loading: {
      label: "Loading",
      className: "text-white/70",
    },
    analyzing: {
      label: "Analyzing",
      className: "text-white/70",
    },
    completed: {
      label: "Completed",
      className: "text-white/70",
    },
  } as const

  const saveConfig = {
    saving: {
      label: "Saving to Projects",
      className: "text-white/70",
    },
    saved: {
      label: "Saved to Projects",
      className: "text-white/70",
    },
    error: {
      label: "Save failed",
      className: "text-white/70",
    },
  } as const

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      
      <section className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 fade-soft">
          {/* Page Header */}
          <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <div
                  className={`inline-flex items-center gap-2 px-2 ${statusConfig[status].className}`}
                >
                  <span className="text-xs font-medium uppercase tracking-wider">{statusConfig[status].label}</span>
                </div>
                {saveState !== "idle" && (
                  <div
                    className={`inline-flex items-center gap-2 px-2 text-xs font-medium uppercase tracking-wider ${saveConfig[saveState].className}`}
                  >
                    {saveConfig[saveState].label}
                  </div>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white font-display">
                Visual Analysis <span className="text-white">Results</span>
              </h1>
              <p className="mt-3 text-lg text-white/60">
                AI-powered breakdown of your visual content
              </p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-transparent text-white/60 hover:text-white">
                Share
              </Button>
              <Link href="/export">
                <Button className="bg-white text-black hover:bg-white/80">
                  Export Options
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-14">
            <div className="space-y-8">
              <section className="space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Latest Upload</p>
                <div className="aspect-video bg-black/40 flex items-center justify-center">
                  {uploadedMedia ? (
                    <div className="relative w-full h-full">
                      {uploadedMedia.type === "image" ? (
                        <img
                          src={uploadedMedia.url}
                          alt="Uploaded preview"
                          className="absolute inset-0 h-full w-full object-contain bg-black/60"
                        />
                      ) : (
                        <video
                          src={uploadedMedia.url}
                          controls
                          className="absolute inset-0 h-full w-full object-contain bg-black/60"
                        />
                      )}
                      <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white/70">
                        Latest upload{uploadedMedia.name ? ` • ${uploadedMedia.name}` : ""}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-white/60">No recent upload found</p>
                      <Link href="/upload" className="mt-3 inline-flex items-center text-sm font-medium text-white/70 hover:text-white">
                        Upload content to analyze
                      </Link>
                    </div>
                  )}
                </div>
                {uploadedMedia && (
                  <div className="flex items-center justify-between gap-4 px-4 py-3 text-xs text-white/50">
                    <span className="truncate">
                      {uploadedMedia.name || "Untitled file"}
                    </span>
                    <span className="whitespace-nowrap">
                      {uploadedMedia.analyzedAt
                        ? `Analyzed ${new Date(uploadedMedia.analyzedAt).toLocaleString()}`
                        : "Analysis timestamp unavailable"}
                    </span>
                  </div>
                )}
              </section>

              {/* Analysis Tabs */}
              <Tabs defaultValue="lighting" className="w-full">
              <TabsList className="flex flex-wrap gap-4 bg-transparent p-0">
                <TabsTrigger value="lighting" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white">
                  Lighting
                </TabsTrigger>
                <TabsTrigger value="color" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white">
                  Color
                </TabsTrigger>
                <TabsTrigger value="technical" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white">
                  Technical
                </TabsTrigger>
              </TabsList>

                {/* Lighting Tab */}
                <TabsContent value="lighting" className="mt-6 space-y-6">
                  <div className="space-y-3 text-sm text-white/70">
                    <p>Lighting reads as {analysis.lighting.type} with {analysis.lighting.quality} quality from {analysis.lighting.source}.</p>
                    <p className="text-white/60">Direction signals align with a {analysis.lighting.direction} source. Quantitative intensity is available under “Show Data.”</p>
                  </div>
                  <Button
                    className="bg-transparent text-white/60 rounded-full hover:text-white"
                    onClick={() => setShowData((value) => !value)}
                  >
                    {showData ? "Hide Data" : "Show Data"}
                  </Button>
                  {showData && (
                    <div className="space-y-6 text-sm text-white/70">
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Lighting Type</p>
                        <p className="text-2xl font-semibold text-white">{analysis.lighting.type}</p>
                        <p className="text-sm text-white/60">
                          {analysis.lighting.quality} quality from {analysis.lighting.source}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Light Direction</p>
                        <p className="text-2xl font-semibold text-white">{analysis.lighting.direction}</p>
                        <p className="text-sm text-white/60">Primary light source</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Light Intensity</p>
                        <p className="text-2xl font-semibold text-white">{analysis.lighting.intensity}%</p>
                        <p className="text-sm text-white/60">Intensity score</p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Color Tab */}
                <TabsContent value="color" className="mt-6 space-y-6">
                  <div className="space-y-3 text-sm text-white/70">
                    <p>Color temperature reads as {analysis.color.temperature}, anchoring the tonal direction.</p>
                    <p className="text-white/60">Palette distribution and percentages are available under “Show Data.”</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">Dominant Palette</p>
                    <p>{analysis.color.dominantColors.map((color) => color.name).join(" · ")}</p>
                  </div>
                  <Button
                    className="bg-transparent text-white/60 rounded-full hover:text-white"
                    onClick={() => setShowData((value) => !value)}
                  >
                    {showData ? "Hide Data" : "Show Data"}
                  </Button>
                  {showData && (
                    <div className="space-y-6 text-sm text-white/70">
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Color Temperature</p>
                        <p className="text-2xl font-semibold text-white">{analysis.color.temperature}</p>
                        <p className="text-sm text-white/60">~{analysis.color.temperatureKelvin}K</p>
                      </div>
                      <div className="space-y-3">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Color Palette</p>
                        <div className="space-y-2">
                          {analysis.color.dominantColors.map((color) => (
                            <div key={color.hex} className="flex items-center justify-between text-sm text-white/70">
                              <span className="text-white">{color.name}</span>
                              <span className="text-white/50">{color.percentage}% · {color.hex}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Color Distribution</p>
                        <div className="space-y-2">
                          {analysis.color.dominantColors.map((color) => (
                            <div key={color.hex} className="flex items-center justify-between text-sm text-white/70">
                              <span className="text-white">{color.name}</span>
                              <span className="text-white/50">{color.percentage}% · {color.hex}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Technical Tab */}
                <TabsContent value="technical" className="mt-6 space-y-6">
                  <div className="space-y-3 text-sm text-white/70">
                    <p>Contrast and saturation define the dramatic range of the frame.</p>
                    <p className="text-white/60">Brightness and sharpness metrics are available under “Show Data.”</p>
                    <div className="space-y-1 text-sm text-white/60">
                      <p>High contrast for dramatic effect.</p>
                      <p>Balanced saturation levels.</p>
                    </div>
                  </div>
                  <Button
                    className="bg-transparent text-white/60 rounded-full hover:text-white"
                    onClick={() => setShowData((value) => !value)}
                  >
                    {showData ? "Hide Data" : "Show Data"}
                  </Button>
                  {showData && (
                    <div className="space-y-6 text-sm text-white/70">
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Contrast</p>
                        <p className="text-2xl font-semibold text-white">{analysis.technical.contrast}%</p>
                        <p className="text-sm text-white/60">High contrast for dramatic effect</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Saturation</p>
                        <p className="text-2xl font-semibold text-white">{analysis.technical.saturation}%</p>
                        <p className="text-sm text-white/60">Balanced saturation levels</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Brightness</p>
                        <p className="text-2xl font-semibold text-white">{analysis.technical.brightness}%</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Sharpness</p>
                        <p className="text-2xl font-semibold text-white">{analysis.technical.sharpness}%</p>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-10">
              <section className="space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Overall Assessment</p>
                <h3 className="text-xl font-semibold text-white">AI-detected style and mood</h3>
                <div className="space-y-4 text-sm text-white/70">
                  <div>
                    <p className="text-white/50">Detected Mood</p>
                    <p className="text-white">{analysis.mood}</p>
                  </div>
                  <div>
                    <p className="text-white/50">Visual Style</p>
                    <p className="text-white">{analysis.style}</p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Next Steps</p>
                <h3 className="text-xl font-semibold text-white">Continue with your content</h3>
                <div className="space-y-3">
                  <Button asChild className="bg-white/10 text-white hover:bg-white/20 justify-start px-0">
                    <Link href="/export">
                      Export Results
                    </Link>
                  </Button>
                  <Button asChild className="bg-transparent text-white/60 hover:text-white justify-start px-0">
                    <Link href="/presets">
                      Get Preset Suggestions
                    </Link>
                  </Button>
                  <Button asChild className="bg-transparent text-white/60 hover:text-white justify-start px-0">
                    <Link href="/assistant">
                      Plan Pre-Production
                    </Link>
                  </Button>
                  <Button asChild className="bg-transparent text-white/60 hover:text-white justify-start px-0">
                    <Link href="/upload">
                      Analyze Another
                    </Link>
                  </Button>
                </div>
              </section>

              <section className="space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Save Analysis</p>
                <h3 className="text-xl font-semibold text-white">Add to your project library</h3>
                <Button className="bg-transparent text-white/60 hover:text-white justify-start px-0">
                  Save to Project
                </Button>
              </section>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
