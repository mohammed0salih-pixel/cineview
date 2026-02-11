"use client"

import React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload, ImageIcon, Video, ArrowRight, X, FileImage, FileVideo, Sparkles } from "lucide-react"
import { useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"

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

  const handleFileChange = useCallback((selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileChange(droppedFile)
    }
  }, [handleFileChange])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const clearFile = () => {
    setFile(null)
    setPreview(null)
  }

  const isFormValid = file && projectType && platform

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 mb-6">
              <Sparkles className="h-3.5 w-3.5 text-foreground" />
              <span className="text-xs font-medium text-foreground uppercase tracking-wider">AI Analysis</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Upload Your <span className="text-gradient-gold">Content</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              Upload a photograph or video for AI-powered cinematic analysis
            </p>
          </div>

          {/* Content Type Selection */}
          <Card className="mb-6 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground">Content Type</CardTitle>
              <CardDescription>Select what you want to analyze</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={contentType}
                onValueChange={(value) => setContentType(value as "image" | "video")}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="image" id="image" className="peer sr-only" />
                  <Label
                    htmlFor="image"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-border/50 bg-secondary/30 p-6 transition-all hover:border-primary/50 hover:bg-secondary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                  >
                    <ImageIcon className="mb-3 h-8 w-8 text-foreground" />
                    <span className="text-sm font-semibold text-foreground">Photograph</span>
                    <span className="mt-1 text-xs text-muted-foreground">JPG, PNG, WebP</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="video" id="video" className="peer sr-only" />
                  <Label
                    htmlFor="video"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-border/50 bg-secondary/30 p-6 transition-all hover:border-primary/50 hover:bg-secondary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                  >
                    <Video className="mb-3 h-8 w-8 text-foreground" />
                    <span className="text-sm font-semibold text-foreground">Video</span>
                    <span className="mt-1 text-xs text-muted-foreground">MP4, MOV, WebM</span>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card className="mb-6 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground">Upload File</CardTitle>
              <CardDescription>Drag and drop or click to select</CardDescription>
            </CardHeader>
            <CardContent>
              {!preview ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`relative flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all ${
                    isDragging
                      ? "border-primary bg-primary/10"
                      : "border-border/50 bg-secondary/20 hover:border-primary/50 hover:bg-secondary/30"
                  }`}
                >
                  <input
                    type="file"
                    accept={contentType === "image" ? "image/*" : "video/*"}
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-4">
                    <Upload className="h-8 w-8 text-foreground" />
                  </div>
                  <p className="text-base font-semibold text-foreground">
                    Drop your {contentType === "image" ? "image" : "video"} here
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    or click to browse files
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <button
                    type="button"
                    onClick={clearFile}
                    className="absolute -right-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground transition-colors hover:bg-destructive/80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="overflow-hidden rounded-xl border border-border/50">
                    {contentType === "image" ? (
                      <Image
                        src={preview || "/placeholder.svg"}
                        alt="Preview"
                        width={1200}
                        height={800}
                        className="h-auto max-h-[400px] w-full object-contain bg-secondary/20"
                      />
                    ) : (
                      <video
                        src={preview}
                        controls
                        className="h-auto max-h-[400px] w-full bg-secondary/20"
                      />
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50">
                    {contentType === "image" ? (
                      <FileImage className="h-5 w-5 text-foreground" />
                    ) : (
                      <FileVideo className="h-5 w-5 text-foreground" />
                    )}
                    <span className="text-sm text-foreground font-medium truncate">{file?.name}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card className="mb-8 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground">Project Details</CardTitle>
              <CardDescription>Help us understand your content better</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Project Type */}
              <div className="space-y-2">
                <Label htmlFor="project-type" className="text-foreground font-medium">Project Type</Label>
                <Select value={projectType} onValueChange={setProjectType}>
                  <SelectTrigger id="project-type" className="border-border/50 bg-secondary/30 text-foreground h-12">
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-card">
                    {projectTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="text-foreground">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Platform */}
              <div className="space-y-2">
                <Label htmlFor="platform" className="text-foreground font-medium">Target Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger id="platform" className="border-border/50 bg-secondary/30 text-foreground h-12">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-card">
                    {platforms.map((p) => (
                      <SelectItem key={p.value} value={p.value} className="text-foreground">
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Objective */}
              <div className="space-y-2">
                <Label htmlFor="objective" className="text-foreground font-medium">Shot Objective <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                <Textarea
                  id="objective"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="Describe what you want to achieve with this shot..."
                  className="min-h-[120px] border-border/50 bg-secondary/30 text-foreground placeholder:text-muted-foreground resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center text-card">
            <Button
              asChild={isFormValid ? true : false}
              size="lg"
              disabled={!isFormValid}
              className="bg-primary text-foreground-foreground hover:bg-primary/90  font-semibold h-14 px-10 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFormValid ? (
                <Link href="/analysis">
                  Analyze Content
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  Analyze Content
                  <ArrowRight className="ml-2 h-5 w-5" />
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
